# 02 — Transporte e sessão

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-31 · [histórico e registro de expiração](../HISTORICO.md)

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** por que Server-Sent Events (SSE) sobre POST venceu WebSocket e polling como transporte do protocolo aplicação↔harness nas duas bases-laboratório e na prática dominante da indústria.
2. **Distinguir** as duas metades de uma sessão robusta — entrega confiável (sequenciamento + replay) e cancelamento cooperativo — e identificar qual metade cada laboratório implementou.
3. **Implementar** o esquema de reentrega sem perda nem duplicação: `seq` monotônico por sessão no servidor + deduplicação por `seq` no cliente + replay via `GET .../events?after=N`.
4. **Analisar** o envelope de erro como parte do contrato de transporte (códigos estáveis, degradação controlada), e não como detalhe de implementação.
5. **Decidir**, diante de uma aplicação nova, quando SSE sobre POST basta e quando as restrições (bidirecionalidade real, ambiente sem HTTP — Hypertext Transfer Protocol) justificam WebSocket ou stdio.

## O problema

Antes de qualquer vocabulário de eventos, o protocolo precisa de um canal — e o canal está submetido a quatro restrições que puxam em direções diferentes.

**Tempo-real**: a resposta de um modelo de linguagem chega em fragmentos ao longo de segundos; entregar tudo no fim (REST — Representational State Transfer — clássico, requisição-resposta) destrói a experiência de resposta progressiva. O nexxussai-monorepo registrou isso como decisão formal: "REST sem streaming: rejeitado porque perderia a experiência atual de resposta progressiva" (`specs/014-chat-lateral-contexto/research.md`, repositório nexxussai-monorepo).

**Simplicidade**: WebSocket dá bidirecionalidade plena, mas cobra um protocolo próprio de handshake, estado de conexão a gerenciar dos dois lados e um modelo de autenticação à parte. O fluxo do chat embutido é assimétrico — o cliente envia uma mensagem e recebe um stream de eventos —, e um canal unidirecional sobre a semântica HTTP que a aplicação já tem (rotas, middlewares, autenticação por request) atende esse fluxo com uma fração da complexidade.

**Resiliência de rede**: conexões longas caem — proxies, load balancers e redes móveis derrubam qualquer transporte persistente. A pesquisa de infraestrutura do ghdaru registrou exatamente essa restrição ao avaliar provedores: limitações de conexões persistentes referem-se a WebSocket, "nosso chat usa SSE, e qualquer proxy pode derrubar conexões longas — cliente SSE robusto reconecta de qualquer forma" (`docs/research/resultado-pesquisa-infra-avaliacao.md`, repositório ghdaru). A consequência de desenho: a robustez não pode morar na conexão; precisa morar na **sessão** — um estado no servidor que sobrevive à queda do canal e permite retomar sem perder nem duplicar eventos.

**Infraestrutura HTTP existente**: SSE é HTTP comum (`Content-Type: text/event-stream`) — passa por CDNs (Content Delivery Networks), proxies reversos e a stack de observabilidade sem configuração especial, e reusa a autenticação da aplicação. Mas a infraestrutura cobra um preço na outra ponta: a API `EventSource` do navegador só faz GET, e o protocolo precisa enviar corpo (mensagem + contexto) — por isso as duas bases fazem SSE **sobre POST** e pagam com um parser manual no cliente (`apps/web/src/features/conversation/adapters/http-chat.ts`, repositório ghdaru).

O capítulo mostra como as duas bases resolveram essas tensões com a mesma decisão de transporte e mecanismos de sessão **complementares**: o ghdaru implementou a entrega confiável (`seq` + replay); o nexxussai, o cancelamento cooperativo (`ActiveStreams` + `AbortSignal`). Uma sessão robusta precisa das duas metades.

## Fundamentos científicos

Este capítulo **ainda não tem ciência validada**: em 2026-07 não há entrada com status ✓ em [`bibliografia.md`](../bibliografia.md) sobre transporte ou protocolos de eventos para agentes embutidos — a curadoria registrou explicitamente que a literatura científica sobre protocolos de eventos e generative UI é incipiente e que a evidência forte é da indústria (`estudos/candidatos-bibliografia.md`). Trabalhos de HCI (Human-Computer Interaction; venues CHI/UIST) sobre mixed-initiative interfaces são candidatos a rodada futura — ⏳. Nenhuma afirmação deste capítulo se apoia em citação científica.

## Fontes da indústria

- **[AG-UI — Agent-User Interaction Protocol](https://github.com/ag-ui-protocol/ag-ui)**: declara transporte agnóstico ("Works with any event transport (SSE, WebSockets, webhooks, etc.)"), mas a prática de referência (CopilotKit) é HTTP POST com input/estado + stream SSE de eventos tipados ([CopilotKit — AG-UI Protocol](https://www.copilotkit.ai/blog/ag-ui-protocol-bridging-agents-to-any-front-end)). Tradução para decisão: o protocolo de eventos deve ser definido **acima** do transporte, mas SSE sobre POST é o default sensato — a mesma conclusão das duas bases.
- **[Vercel AI SDK — UI Message Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)**: o formato de streaming mais adotado do ecossistema web usa SSE, com header de versão (`x-vercel-ai-ui-message-stream: v1`) e marcador de término `[DONE]`. Tradução para decisão: versionar o canal no handshake e sinalizar término explícito são partes do contrato de transporte, não firulas.
- **[ACP — Agent Client Protocol (Zed)](https://kiro.dev/docs/cli/acp/)**: comunicação editor↔agente por JSON-RPC 2.0 sobre stdin/stdout, com o cliente spawnando o agente como subprocesso. Tradução para decisão: o contraexemplo que prova a regra — quando não há navegador nem HTTP no meio, o transporte muda (stdio), mas o desenho "sessão + notificações tipadas + permissão fora do agente" permanece.
- **[Anthropic — streaming da Messages API](https://platform.claude.com/docs/en/build-with-claude/streaming)**: o streaming provider↔harness também é SSE (`message_start`, `content_block_delta`, …, `ping`, `error`). Tradução para decisão: com SSE nas duas pontas (modelo→harness e harness→app), o harness re-emite semanticamente um stream no outro sem trocar de paradigma de transporte.

## O estado da arte

### SSE × WebSocket × polling: por que SSE sobre POST venceu

A escolha de transporte parece uma preferência de engenharia; é, na verdade, uma consequência quase mecânica do *formato do fluxo*. O fluxo do chat embutido é assimétrico e em rajadas: o cliente envia **uma** requisição rica (mensagem + contexto de tela) e recebe de volta **muitos** eventos ao longo de segundos; depois, silêncio até a próxima mensagem. Não há tráfego contínuo nos dois sentidos, não há necessidade de o servidor iniciar conversas, e cada troca já nasce dentro de uma requisição HTTP autenticada. Confrontando os três candidatos com as quatro tensões de "O problema":

| Tensão | Polling | WebSocket | SSE sobre POST |
|---|---|---|---|
| Tempo-real | perde: latência = intervalo de polling; ou paga com rajada de requests | atende | atende: eventos fluem no mesmo response |
| Simplicidade | atende (mas multiplica endpoints/estado de cursor) | paga handshake próprio, gestão de conexão dos dois lados, autenticação à parte | atende: um POST comum com response que não termina |
| Resiliência de rede | atende por acidente (cada request é curto) | conexão persistente que proxies derrubam; reconectar = refazer handshake e reautenticar | conexão também cai — mas a retomada é *outro request HTTP* barato |
| Infraestrutura HTTP existente | atende | túnel à parte: bypass de middlewares, autenticação e observabilidade por request | atende: rotas, middlewares e auth da aplicação, sem configuração especial |

Polling é eliminado pela primeira linha: a experiência de resposta progressiva foi exatamente o que o nexxussai se recusou a perder ao rejeitar REST sem streaming (`specs/014-chat-lateral-contexto/research.md`, repositório nexxussai-monorepo). WebSocket é eliminado pelo custo sem contrapartida: paga bidirecionalidade plena que o fluxo assimétrico não usa — e o pouco de "cliente fala no meio do stream" que o protocolo precisa (cancelar, confirmar uma proposta) cabe em requests HTTP paralelos comuns, como os dois laboratórios demonstram adiante. Sobra SSE sobre POST, e as duas bases chegaram aí de forma independente e registrada: o ghdaru fixou "Eventos do chat (SSE): resposta `text/event-stream` de POST" no plano da fundação (`specs/001-fundacao-shell-chat/plan.md`, repositório ghdaru); no nexxussai, os dois routers de chat devolvem `StreamingResponse(..., media_type="text/event-stream")` a partir de um POST (`apps/api/app/ai_chat/infrastructure/http/chat_completions_router.py` e `lateral_chat_router.py`, repositório nexxussai-monorepo).

A indústria confirma a fotografia de 2026-07 — e delimita as exceções legítimas. O AG-UI se declara transporte-agnóstico, mas sua prática de referência é POST + stream SSE ([CopilotKit](https://www.copilotkit.ai/blog/ag-ui-protocol-bridging-agents-to-any-front-end)); o UI Message Stream da Vercel roda sobre SSE ([docs](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)); e o próprio streaming provider→harness da Anthropic é SSE ([docs](https://platform.claude.com/docs/en/build-with-claude/streaming)) — o que significa que o harness recebe SSE do modelo e re-emite SSE para a aplicação sem trocar de paradigma. O contraexemplo que prova a regra é o ACP ([Kiro docs](https://kiro.dev/docs/cli/acp/)): editor↔agente não tem navegador nem HTTP no meio, então o transporte vira JSON-RPC sobre stdio — mas o desenho de sessão, notificações tipadas e permissão fora do agente permanece. A lição de decisão: escolha WebSocket quando houver tráfego bidirecional *contínuo* (áudio em tempo real, colaboração), stdio quando não houver HTTP; para o chat embutido em aplicação web, SSE sobre POST é o default que as quatro tensões apontam.

### O preço do POST: parser SSE manual no cliente

A decisão tem um custo concreto, e é honesto olhá-lo de frente antes de recomendá-la. A API `EventSource` do navegador — o cliente SSE nativo, com parsing e reconexão automáticos — só emite GET, sem corpo. O protocolo precisa de corpo: a mensagem do usuário e o snapshot de contexto sobem juntos. As duas bases pagaram o mesmo preço da mesma forma: o cliente faz `fetch` com POST, lê o corpo da resposta com `response.body.getReader()` e fatia os frames `data: {json}\n\n` à mão (`apps/web/src/features/conversation/adapters/http-chat.ts`, repositório ghdaru; `apps/web/src/features/conversation/api/lateralChatService.ts`, repositório nexxussai-monorepo).

O parser manual tem três armadilhas, e o código dos laboratórios mostra a defesa contra cada uma:

1. **Frames partidos entre chunks.** A rede entrega bytes, não frames: um `data: {...}` pode chegar cortado ao meio. A defesa é um buffer acumulador — o ghdaru fatia o buffer por `\n\n` (o separador de frames SSE) e devolve o último pedaço, possivelmente incompleto, ao buffer (`parts.pop()`) para completá-lo com o próximo chunk (`http-chat.ts`, repositório ghdaru). O nexxussai usa a variação por linha: fatia por `\n`, guarda a última linha parcial e processa só as que começam com `data: ` (`lateralChatService.ts`, repositório nexxussai-monorepo).
2. **Bytes multibyte cortados.** Pelo mesmo motivo, um caractere UTF-8 pode chegar dividido entre dois chunks. Os dois clientes decodificam com `TextDecoder` em modo streaming (`decoder.decode(value, { stream: true })`) — que retém bytes incompletos até o chunk seguinte — em vez de decodificar cada chunk isoladamente (paths acima, ambos os repositórios).
3. **Término e lixo no canal.** O stream precisa acabar de forma reconhecível e sobreviver a frames inesperados. O nexxussai descarta o marcador `[DONE]` (o mesmo convencionado pelo protocolo da Vercel — [docs](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)) e ignora frames com JSON malformado em vez de abortar o stream inteiro (`lateralChatService.ts`, repositório nexxussai-monorepo); no ghdaru, o fim é sinalizado dentro do próprio vocabulário de eventos (o evento `finished` — semântica no capítulo 03) e pelo encerramento do response.

O ponto arquitetural é onde esse custo mora: **atrás de uma porta, pago uma vez**. No ghdaru, o parser vive no adapter que implementa `ChatPort` — o resto da aplicação consome um `AsyncIterable<ChatEvent>` e não sabe que SSE existe (`apps/web/src/features/conversation/ports/chat-port.ts` e `adapters/http-chat.ts`, repositório ghdaru). No nexxussai, o serviço `streamLateralMessage` expõe um `AsyncGenerator` de eventos tipados com a mesma propriedade (`lateralChatService.ts`, repositório nexxussai-monorepo). Trocar o transporte amanhã — WebTransport, WebSocket, o que for — é trocar um adapter.

### Entrega confiável: `seq` monotônico e replay

A primeira metade da sessão robusta responde à pergunta: *se a conexão cair no meio de uma resposta, como o cliente retoma sem perder nem duplicar eventos?* A resposta do ghdaru é um esquema de três peças, pequeno o bastante para caber em uma classe de domínio e um endpoint.

**Peça 1 — o servidor atribui a posição.** Todo evento emitido passa antes por `ChatSession.record()`, que lhe atribui um `seq` monotônico por sessão (`len(events) + 1` — contíguo, começando em 1) e o anexa à lista de eventos da sessão (`apps/api/src/ghdaru_api/conversation/domain/models.py`, repositório ghdaru). O detalhe decisivo é a ordem: o pipeline de mensagens faz `yield session.record(...)` — **grava antes de emitir** (`apps/api/src/ghdaru_api/conversation/application/handle_message.py`, repositório ghdaru). O stream SSE é apenas uma *vista* da sessão; a sessão é o registro. Se a conexão morrer depois do evento 5, os eventos 6 e 7 continuam existindo no servidor, esperando serem lidos.

**Peça 2 — replay por marca d'água.** O cliente que reconecta pergunta "o que veio depois de N?": `GET /chat/sessions/{session_id}/events?after=N`, que delega a `session.events_after(seq)` — um filtro por `e.seq > seq` (`apps/api/src/ghdaru_api/http/chat_router.py` e `conversation/domain/models.py`, repositório ghdaru). Repare que o replay **não é outro stream**: é um GET que devolve uma lista JSON simples. A assimetria é deliberada — o tempo-real precisa de SSE; a recuperação, não.

**Peça 3 — deduplicação no cliente.** O consumidor guarda o maior `seq` visto e descarta qualquer evento com `seq` menor ou igual (`incoming.filter((e) => e.seq > lastSeqRef.current)` em `apps/web/src/features/conversation/ui/ChatPanel.tsx`, repositório ghdaru). Com isso, a sobreposição entre o fim do stream interrompido e o início do replay é inofensiva: eventos repetidos são filtrados por posição, não por heurística de conteúdo.

O contrato inteiro está fixado em teste, não em documentação: content-type `text/event-stream`, `seq` contíguo de 1 a N (`test_message_streams_typed_events_with_sequence`), replay que devolve exatamente os eventos após a marca d'água (`test_reconnection_replays_events_after_seq`) e sessão inacessível a outro usuário — 404 via `_owned_session` (`test_users_cannot_access_other_users_sessions`), tudo em `apps/api/tests/http/test_chat_routes.py` (repositório ghdaru). O que o envelope carrega (`kind`, `payload`) pertence ao capítulo 03; para este capítulo importa só que **cada evento tem uma posição total na sessão** e que qualquer cliente, a qualquer momento, consegue perguntar "o que veio depois de N?".

### Cancelamento cooperativo: encerrar o stream sem quebrar a sessão

A segunda metade responde à pergunta oposta: *se o usuário desistir no meio de uma resposta, como parar a geração sem corromper nada?* O botão "parar" é obrigatório em qualquer chat sério — modelos são prolixos, usuários mudam de ideia — e a implementação ingênua (fechar a conexão e pronto) deixa o servidor gerando tokens para ninguém, sem registro do que aconteceu. O nexxussai implementou a versão correta, e a palavra que a define é **cooperativo**: ninguém derruba nada à força; o emissor é *avisado* e encerra por conta própria, limpo.

A mecânica tem quatro peças (todas no repositório nexxussai-monorepo):

1. **Todo stream tem identidade e dono.** Ao iniciar uma geração, o use case registra um `StreamSession` (id, sessão de chat, `user_id`, modelo, status `running`) num registro em memória protegido por lock — `ActiveStreams` (`apps/api/app/ai_chat/infrastructure/stream/active_streams.py`). Um stream que não está registrado não pode ser cancelado; um que está, pode ser encontrado pelo id.
2. **Cancelar é um endpoint, com política.** O cliente cancela com `DELETE /api/chat/stream/{stream_id}` (`apps/api/app/ai_chat/infrastructure/http/chat_completions_router.py`). O use case `CancelStream` aplica uma política de domínio antes de agir: só o **dono** do stream pode cancelá-lo, e só se ele ainda estiver `running` (`StreamPolicyService.assert_can_cancel`, em `apps/api/app/ai_chat/domain/services/stream_policy_service.py`; use case em `application/use_cases/cancel_stream.py`). Cancelamento é operação do protocolo — autenticada, autorizada, auditável — não um fechamento de socket.
3. **O emissor coopera.** O cancelamento não interrompe o gerador no meio de um passo: ele marca o stream como cancelado (`stream.finish("cancelled", "STREAM_CANCELLED")` em `ActiveStreams.cancel`), e o loop de emissão **checa a marca entre um chunk e outro** — ao vê-la, emite um último evento de erro tipado com o código `STREAM_CANCELLED` e finaliza (`if self._active_streams.is_cancelled(stream_id): yield ErrorEvent(code="STREAM_CANCELLED", ...)` em `apps/api/app/ai_chat/application/use_cases/send_completion.py`; serialização em `infrastructure/stream/sse_emitter.py`). O `StreamSession` transita para um estado terminal explícito — `completed | cancelled | failed | timed_out` — e transições repetidas são ignoradas (o `finish` retorna cedo se o stream já não está `running`).
4. **O cliente espelha com `AbortSignal`.** Do lado do navegador, o `fetch` do stream recebe um `signal?: AbortSignal` (`apps/web/src/features/conversation/api/lateralChatService.ts`): abortar libera o leitor local imediatamente, enquanto o `DELETE` avisa o servidor. São complementares — o abort resolve o cliente; o endpoint resolve o servidor e o registro.

O resultado é a propriedade que dá título à seção: **a sessão sobrevive ao cancelamento**. O stream morreu com um código estável e um estado terminal; a conversa continua utilizável na mensagem seguinte. Note a fronteira: cancelar um *stream* (esta seção) é interromper a geração de uma resposta; cancelar uma *ação proposta* é uma transição na máquina de estados de governança — assunto do capítulo 05.

### O envelope de erro como parte do protocolo

Há um padrão escondido no mecanismo de cancelamento que merece ser promovido a princípio: o cancelamento chegou ao cliente como um **evento de erro tipado, dentro do próprio stream, com um código estável**. Erro de transporte e de provedor não é exceção interna que vaza como HTTP 500 opaco — é vocabulário do contrato, com duas propriedades verificáveis nos laboratórios.

**Códigos estáveis, não mensagens.** O nexxussai fixa em contrato um envelope de erro único — `{"error": {"code": "...", "message": "...", "details": {...}}}` — com uma lista fechada de códigos: `AUTH_REQUIRED`, `FORBIDDEN`, `CHAT_NOT_FOUND`, `MODEL_UNAVAILABLE`, `INVALID_CONTEXT`, `FILE_NOT_READY`, `STREAM_CANCELLED`, `PROVIDER_FAILURE`, `EXECUTION_DENIED`, `EXECUTION_FAILED`, `VALIDATION_ERROR`, `INTERNAL_ERROR` (`specs/005-backend-ai-chat/contracts/api-contract.md`, repositório nexxussai-monorepo). A consequência prática: o cliente **discrimina por código** — `MODEL_UNAVAILABLE` sugere trocar de modelo; `STREAM_CANCELLED` não é erro do ponto de vista do usuário; `PROVIDER_FAILURE` pede retry — em vez de fazer parse de mensagens humanas que mudam a cada refactor. A mensagem é para o humano; o código é para o programa.

**O erro viaja no mesmo canal.** Depois que o stream começou, o status HTTP já foi enviado — não há como devolver um 502 no meio de um `text/event-stream`. Por isso os dois laboratórios emitem o erro como **evento do stream**: o nexxussai com o `ErrorEvent` de código estável visto acima (`send_completion.py`, repositório nexxussai-monorepo); o ghdaru com o evento `error` do seu vocabulário tipado, sob o requisito FR-015 — erros de autenticação, autorização e indisponibilidade de IA "DEVEM produzir mensagens claras ao usuário e registro para diagnóstico" (`specs/001-fundacao-shell-chat/spec.md`, repositório ghdaru). É a degradação controlada como requisito: o pior caso do protocolo não é silêncio nem stack trace — é um evento bem formado que a UI sabe renderizar.

A lição composta dos dois laboratórios: **defina o envelope de erro junto com o transporte, não depois**. A lista de códigos é parte do contrato do canal tanto quanto o content-type; a semântica do evento `error` dentro do vocabulário — quando emiti-lo, o que o segue — é assunto do capítulo 03.

### Sessão e reconexão: compondo as duas metades

As peças anteriores compõem a tese central do capítulo: **a sessão — não a conexão — é a unidade durável do protocolo; a conexão é descartável por desenho**. A sessão é criada explicitamente (`POST /chat/sessions` devolve o id — `chat_router.py`, repositório ghdaru), acumula o registro ordenado de eventos e sobrevive a qualquer número de conexões abertas e fechadas sobre ela. Cada uma das quatro restrições de "O problema" empurrou para cá: se qualquer proxy pode derrubar a conexão, então nada de valioso pode morar *só* nela.

O ciclo de vida completo, num exemplo fictício de reconexão (payloads ilustrativos):

```text
POST /chat/sessions                        → {"id": "sessao-exemplo-ficticio"}
POST /chat/sessions/sessao-exemplo-ficticio/messages   {"text": "…", "snapshot": {…}}
  ← stream SSE: data: {"seq": 1, …}\n\n … data: {"seq": 5, …}\n\n
  ✗ conexão cai (proxy, rede móvel) — o servidor segue gravando: seq 6, 7

GET /chat/sessions/sessao-exemplo-ficticio/events?after=5
  ← [{"seq": 6, …}, {"seq": 7, …}]        (JSON simples, sem stream)
  → cliente deduplica por seq e continua como se nada houvesse caído
```

O cliente só precisou lembrar de duas coisas: o id da sessão e o último `seq` visto. É a metade ghdaru do ciclo. A metade nexxussai cobre o outro desfecho: o usuário desiste no meio da geração → `AbortSignal` libera o cliente, `DELETE /api/chat/stream/{stream_id}` avisa o servidor, o stream fecha com `STREAM_CANCELLED` e estado terminal — **e a sessão segue viva** para a próxima mensagem (paths na seção de cancelamento).

O dado empírico mais interessante do capítulo é a lacuna espelhada: **nenhum dos dois laboratórios implementou as duas metades**. O ghdaru tem `seq` + replay e nenhum cancelamento (nenhum registro de streams ativos, nenhum endpoint, nenhum `AbortSignal` no adapter); o nexxussai tem o cancelamento completo e nenhum `seq` por sessão nem endpoint de replay — se a conexão cair no meio de uma resposta, não há reentrega (síntese nº 2 de [`estudos/fonte-base-codigo.md`](../../estudos/fonte-base-codigo.md); ausências detalhadas no Apêndice). Cada base construiu a metade que seu produto exigiu primeiro — e a existência independente das duas metades, encaixando sem sobreposição, é o melhor argumento de que ambas pertencem ao mesmo todo. A recomendação normativa deste capítulo é a composição: uma sessão robusta oferece **retomada** (para a conexão que cai) e **desistência limpa** (para o usuário que muda de ideia), sobre o mesmo transporte.

**Contraste datado (evento de 2026-07-28).** A spec final do MCP tomou a decisão *oposta* à dos laboratórios: aboliu a resumabilidade do stream — sem `Last-Event-ID`, sem reentrega; stream quebrado significa re-emitir a requisição inteira, porque o núcleo virou stateless para escalar atrás de load balancers ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)). Não é contradição com este capítulo — é a mesma pergunta com outra resposta certa: no MCP, o que trafega é RPC recomputável (repetir a chamada custa pouco); no chat embutido, o que trafega é a *conversa*, que é o produto — perder eventos é perder história, e por isso `seq`+replay. A escolha de robustez segue o que flui no canal, não a moda do transporte.

### Leitura executiva

O transporte do protocolo app↔harness em 2026-07 tem um default claro e duas metades de sessão a compor. SSE sobre POST venceu nas duas bases-laboratório e na prática dominante da indústria (AG-UI/CopilotKit, Vercel, Anthropic) porque o fluxo do chat embutido é assimétrico — um request rico sobe, um stream de eventos desce — e porque SSE herda de graça a infraestrutura HTTP que a aplicação já tem; WebSocket fica para bidirecionalidade contínua real, stdio para onde não há HTTP (ACP). O preço — parser manual porque `EventSource` não faz POST — se paga uma vez, atrás de uma porta. Sobre o canal, a sessão é a unidade durável: entrega confiável de um lado (ghdaru), cancelamento cooperativo do outro (nexxussai), e o envelope de erro com códigos estáveis viajando no próprio stream. **O que roubar**: (1) SSE sobre POST como default, com o parser confinado num adapter trocável (buffer + `TextDecoder` streaming + término explícito); (2) `seq` monotônico atribuído no servidor *antes* de emitir + replay por marca d'água (`?after=N`, um GET simples) + dedup por `seq` no cliente — o esquema mínimo de entrega confiável, barato o bastante para não ter desculpa; (3) cancelamento como operação do protocolo — registro de streams ativos com dono, endpoint autenticado com política (`assert_can_cancel`), encerramento cooperativo com código estável (`STREAM_CANCELLED`) e `AbortSignal` no cliente; (4) envelope de erro com lista fechada de códigos definida junto com o transporte — o cliente degrada por código, não por parse de mensagem.

*Contrato de frescor: esta leitura expira se a indústria consolidar um transporte diferente de SSE para a fronteira app↔agente (por exemplo, WebTransport, ou a generalização de um padrão bidirecional pelo AG-UI), ou se `EventSource`/plataforma web ganhar suporte nativo a streaming sobre POST — em qualquer dos casos, a seção de transporte e o parser manual exigem revisão extraordinária.*

## Verificação

1. Sua equipe propõe WebSocket "porque é mais moderno" para o chat embutido. Quais das quatro tensões de "O problema" o WebSocket alivia e quais ele agrava — e que pergunta sobre o *fluxo* decide a escolha? (Dica: o fluxo é assimétrico? Objetivo 5.)
2. Por que o cliente das duas bases não usa `EventSource`, e onde esse custo fica confinado? (Dica: qual verbo HTTP o `EventSource` suporta — e o que o protocolo precisa enviar no corpo? Objetivo 1, o custo do transporte escolhido.)
3. A conexão caiu no meio de uma resposta. Descreva, com os três mecanismos do ghdaru, como o cliente retoma sem perder nem duplicar eventos. (Dica: quem atribui o `seq`, o que o cliente guarda, e o que `?after=N` devolve. Objetivo 3.)
4. O usuário clicou em "parar" durante uma geração. Explique a diferença entre cancelar o *stream* (este capítulo) e cancelar uma *ação proposta* (capítulo 05), e por que o cancelamento de stream precisa ser cooperativo e ter um código estável no envelope de erro. (Dica: a sessão sobrevive? O que o cliente discrimina — mensagem ou código? Objetivos 2 e 4.)

---

## Apêndice — evidência por laboratório

### ghdaru

**A metade da entrega confiável** (implementada) — e a decisão de transporte:

- `specs/001-fundacao-shell-chat/plan.md` — decisão registrada: "Eventos do chat (SSE): resposta `text/event-stream` de POST".
- `docs/research/resultado-pesquisa-infra-avaliacao.md` — restrição de infraestrutura que motiva a sessão durável: limitações de conexões persistentes referem-se a WebSocket; "nosso chat usa SSE, e qualquer proxy pode derrubar conexões longas — cliente SSE robusto reconecta de qualquer forma (isso vira requisito da [aplicação])".
- `apps/api/src/ghdaru_api/http/chat_router.py` — o transporte: `POST /chat/sessions` cria a sessão; `POST /chat/sessions/{session_id}/messages` → `StreamingResponse` `text/event-stream` com frames `data: {json}\n\n`; replay em `GET /chat/sessions/{session_id}/events?after=N` (`replay_events`, delega a `session.events_after(after)`, devolve lista JSON — não stream); `_owned_session` devolve 404 para sessão de outro usuário.
- `apps/api/src/ghdaru_api/conversation/domain/models.py` — `ChatSession.record()` atribui o `seq` monotônico por sessão (`next_seq() = len(events) + 1`, contíguo desde 1); `events_after(seq)` filtra `e.seq > seq`.
- `apps/api/src/ghdaru_api/conversation/application/handle_message.py` — a ordem "grava antes de emitir": todo evento do stream é `yield session.record(...)`.
- `apps/api/tests/http/test_chat_routes.py` — o contrato fixado em teste: content-type `text/event-stream` e `seq` contíguo 1..N (`test_message_streams_typed_events_with_sequence`); replay sem perda/duplicação (`test_reconnection_replays_events_after_seq`: `after=1` devolve a partir de `seq` 2); isolamento entre usuários (`test_users_cannot_access_other_users_sessions`, 404).
- `apps/web/src/features/conversation/adapters/http-chat.ts` — parser SSE manual no cliente (`fetch` POST + `getReader()`, `TextDecoder` com `{stream: true}`, split por `\n\n` com devolução do frame parcial ao buffer via `parts.pop()`), necessário porque `EventSource` não faz POST; o custo confinado atrás de `ports/chat-port.ts` (`ChatPort`, `AsyncIterable<ChatEvent>`); dedup por `seq` no consumidor (`incoming.filter((e) => e.seq > lastSeqRef.current)` em `apps/web/src/features/conversation/ui/ChatPanel.tsx`).
- `specs/001-fundacao-shell-chat/spec.md` — FR-015: erros de autenticação, autorização e indisponibilidade de IA devem produzir mensagens claras ao usuário e registro para diagnóstico (degradação controlada; o erro vira evento tipado no stream — semântica no cap. 03).
- **Ausência (a lacuna que confirma a categoria)**: não há cancelamento de stream — nenhum registro de streams ativos, nenhum endpoint de cancelamento, nenhum `AbortSignal` no adapter HTTP.

### nexxussai-monorepo

**A metade do cancelamento cooperativo** (implementada) — e a decisão de transporte:

- `specs/014-chat-lateral-contexto/research.md` — decisão formal: "REST sem streaming: rejeitado porque perderia a experiência atual de resposta progressiva"; também rejeita novo protocolo SSE exclusivo (reusa o vocabulário existente — cap. 03).
- `apps/api/app/ai_chat/infrastructure/http/chat_completions_router.py` — o transporte (`POST /api/chat/completions` → `StreamingResponse` `text/event-stream`) e o endpoint de cancelamento: `DELETE /api/chat/stream/{stream_id}`.
- `apps/api/app/ai_chat/infrastructure/stream/active_streams.py` — registro em memória dos streams ativos (dict + `Lock`); `cancel()` finaliza cooperativamente com `stream.finish("cancelled", "STREAM_CANCELLED")` e marca o id em `_cancelled`; `is_cancelled()` é a consulta do emissor.
- `apps/api/app/ai_chat/domain/services/stream_policy_service.py` — `StreamSession` (id, `chat_session_id`, `user_id`, status) com terminais `completed | cancelled | failed | timed_out` e `finish` idempotente (retorna cedo se não está `running`); `StreamPolicyService.assert_can_cancel` — só o dono cancela, e só stream `running`.
- `apps/api/app/ai_chat/application/use_cases/cancel_stream.py` — use case `CancelStream`: aplica a política e cancela; stream inexistente devolve `status: "not_found"` sem erro.
- `apps/api/app/ai_chat/application/use_cases/send_completion.py` — a cooperação no emissor: o loop checa `is_cancelled(stream_id)` entre chunks e emite `ErrorEvent(code="STREAM_CANCELLED")` antes de finalizar; falha de provedor finaliza com `PROVIDER_FAILURE`.
- `apps/api/app/ai_chat/infrastructure/stream/sse_emitter.py` — serialização SSE (`to_sse` → `data: {json}\n\n`).
- `apps/web/src/features/conversation/api/lateralChatService.ts` — cliente do protocolo: `fetch` + `getReader()` com parâmetro `signal?: AbortSignal` para abortar do lado do cliente; parser por linha (`split('\n')` + linha parcial devolvida ao buffer), descarte do marcador `[DONE]` e de frames com JSON malformado.
- `specs/005-backend-ai-chat/contracts/api-contract.md` — envelope de erro estável `{error: {code, message, details}}` com códigos fixos: `AUTH_REQUIRED`, `FORBIDDEN`, `CHAT_NOT_FOUND`, `MODEL_UNAVAILABLE`, `INVALID_CONTEXT`, `FILE_NOT_READY`, `STREAM_CANCELLED`, `PROVIDER_FAILURE`, `EXECUTION_DENIED`, `EXECUTION_FAILED`, `VALIDATION_ERROR`, `INTERNAL_ERROR`.
- **Ausência (a lacuna que confirma a categoria)**: não há `seq` monotônico por sessão nem endpoint de replay — se a conexão cai no meio de uma resposta, não existe reentrega sem perda/duplicação.

### Divergências

| Dimensão | ghdaru | nexxussai-monorepo |
|---|---|---|
| Transporte | SSE sobre POST (`chat_router.py`) | SSE sobre POST (routers de `ai_chat`) |
| Entrega confiável | ✅ `seq` + `events_after` + replay `?after=N`, fixado em teste | ❌ ausente |
| Cancelamento de stream | ❌ ausente | ✅ `ActiveStreams` + `DELETE /api/chat/stream/{stream_id}` + política de dono + `AbortSignal` |
| Erro no contrato | Evento `error` no stream + FR-015 (degradação controlada) | Envelope `{error:{code,message,details}}` com códigos fixos |
| Parser no cliente | split por `\n\n` (frame SSE), sem marcador de término no canal | split por `\n` (linha), descarta `[DONE]` e frames malformados |

As implementações são complementares, não conflitantes: cada base construiu uma metade da sessão robusta e nenhuma construiu a outra — a composição das duas (retomada por replay + desistência limpa por cancelamento cooperativo) é a recomendação normativa deste capítulo.
