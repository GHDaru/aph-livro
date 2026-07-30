# 02 — Transporte e sessão

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

> **Nota de fase**: este capítulo está na fase 1 (**estrutura**) do [`GUIA-CAPITULO.md`](../GUIA-CAPITULO.md). "O problema", as fichas de fontes e o Apêndice estão completos; os H3 do estado da arte trazem a tese em 2–4 frases cada e serão expandidos em prosa integral na fase 2 (spec 006).

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** por que Server-Sent Events (SSE) sobre POST venceu WebSocket e polling como transporte do protocolo aplicação↔harness nas duas bases-laboratório e na prática dominante da indústria.
2. **Distinguir** as duas metades de uma sessão robusta — entrega confiável (sequenciamento + replay) e cancelamento cooperativo — e identificar qual metade cada laboratório implementou.
3. **Implementar** o esquema de reentrega sem perda nem duplicação: `seq` monotônico por sessão no servidor + deduplicação por `seq` no cliente + replay via `GET .../events?after=N`.
4. **Analisar** o envelope de erro como parte do contrato de transporte (códigos estáveis, degradação controlada), e não como detalhe de implementação.
5. **Decidir**, diante de uma aplicação nova, quando SSE sobre POST basta e quando as restrições (bidirecionalidade real, ambiente sem HTTP) justificam WebSocket ou stdio.

## O problema

Antes de qualquer vocabulário de eventos, o protocolo precisa de um canal — e o canal está submetido a quatro restrições que puxam em direções diferentes.

**Tempo-real**: a resposta de um modelo de linguagem chega em fragmentos ao longo de segundos; entregar tudo no fim (REST clássico, requisição-resposta) destrói a experiência de resposta progressiva. O nexxussai-monorepo registrou isso como decisão formal: "REST sem streaming: rejeitado porque perderia a experiência atual de resposta progressiva" (`specs/014-chat-lateral-contexto/research.md`, repositório nexxussai-monorepo).

**Simplicidade**: WebSocket dá bidirecionalidade plena, mas cobra um protocolo próprio de handshake, estado de conexão a gerenciar dos dois lados e um modelo de autenticação à parte. O fluxo do chat embutido é assimétrico — o cliente envia uma mensagem e recebe um stream de eventos —, e um canal unidirecional sobre a semântica HTTP que a aplicação já tem (rotas, middlewares, autenticação por request) atende esse fluxo com uma fração da complexidade.

**Resiliência de rede**: conexões longas caem — proxies, load balancers e redes móveis derrubam qualquer transporte persistente. A pesquisa de infraestrutura do ghdaru registrou exatamente essa restrição ao avaliar provedores: limitações de conexões persistentes referem-se a WebSocket, "nosso chat usa SSE, e qualquer proxy pode derrubar conexões longas — cliente SSE robusto reconecta de qualquer forma" (`docs/research/resultado-pesquisa-infra-avaliacao.md`, repositório ghdaru). A consequência de desenho: a robustez não pode morar na conexão; precisa morar na **sessão** — um estado no servidor que sobrevive à queda do canal e permite retomar sem perder nem duplicar eventos.

**Infraestrutura HTTP existente**: SSE é HTTP comum (`Content-Type: text/event-stream`) — passa por CDNs, proxies reversos e a stack de observabilidade sem configuração especial, e reusa a autenticação da aplicação. Mas a infraestrutura cobra um preço na outra ponta: a API `EventSource` do navegador só faz GET, e o protocolo precisa enviar corpo (mensagem + contexto) — por isso as duas bases fazem SSE **sobre POST** e pagam com um parser manual no cliente (`apps/web/src/features/conversation/adapters/http-chat.ts`, repositório ghdaru).

O capítulo mostra como as duas bases resolveram essas tensões com a mesma decisão de transporte e mecanismos de sessão **complementares**: o ghdaru implementou a entrega confiável (`seq` + replay); o nexxussai, o cancelamento cooperativo (`ActiveStreams` + `AbortSignal`). Uma sessão robusta precisa das duas metades.

## Fundamentos científicos

Este capítulo **ainda não tem ciência validada**: em 2026-07 não há entrada com status ✓ em [`bibliografia.md`](../bibliografia.md) sobre transporte ou protocolos de eventos para agentes embutidos — a curadoria registrou explicitamente que a literatura científica sobre protocolos de eventos e generative UI é incipiente e que a evidência forte é da indústria (`estudos/candidatos-bibliografia.md`). Trabalhos de HCI (CHI/UIST) sobre mixed-initiative interfaces são candidatos a rodada futura — ⏳. Nenhuma afirmação deste capítulo se apoia em citação científica.

## Fontes da indústria

- **[AG-UI — Agent-User Interaction Protocol](https://github.com/ag-ui-protocol/ag-ui)**: declara transporte agnóstico ("Works with any event transport (SSE, WebSockets, webhooks, etc.)"), mas a prática de referência (CopilotKit) é HTTP POST com input/estado + stream SSE de eventos tipados ([CopilotKit — AG-UI Protocol](https://www.copilotkit.ai/blog/ag-ui-protocol-bridging-agents-to-any-front-end)). Tradução para decisão: o protocolo de eventos deve ser definido **acima** do transporte, mas SSE sobre POST é o default sensato — a mesma conclusão das duas bases.
- **[Vercel AI SDK — UI Message Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)**: o formato de streaming mais adotado do ecossistema web usa SSE, com header de versão (`x-vercel-ai-ui-message-stream: v1`) e marcador de término `[DONE]`. Tradução para decisão: versionar o canal no handshake e sinalizar término explícito são partes do contrato de transporte, não firulas.
- **[ACP — Agent Client Protocol (Zed)](https://kiro.dev/docs/cli/acp/)**: comunicação editor↔agente por JSON-RPC 2.0 sobre stdin/stdout, com o cliente spawnando o agente como subprocesso. Tradução para decisão: o contraexemplo que prova a regra — quando não há navegador nem HTTP no meio, o transporte muda (stdio), mas o desenho "sessão + notificações tipadas + permissão fora do agente" permanece.
- **[Anthropic — streaming da Messages API](https://platform.claude.com/docs/en/build-with-claude/streaming)**: o streaming provider↔harness também é SSE (`message_start`, `content_block_delta`, …, `ping`, `error`). Tradução para decisão: com SSE nas duas pontas (modelo→harness e harness→app), o harness re-emite semanticamente um stream no outro sem trocar de paradigma de transporte.

## O estado da arte

### SSE × WebSocket × polling: por que SSE sobre POST venceu

Tese: para o fluxo assimétrico do chat embutido (um POST sobe, um stream desce), SSE sobre POST domina as alternativas — polling sacrifica o tempo-real, WebSocket paga bidirecionalidade que o fluxo não usa e perde a integração com a semântica HTTP da aplicação. As duas bases chegaram aí de forma independente e registrada: o ghdaru fixou "resposta `text/event-stream` de POST" no plano da fundação (`specs/001-fundacao-shell-chat/plan.md`, repositório ghdaru) e o nexxussai rejeitou formalmente REST sem streaming (`specs/014-chat-lateral-contexto/research.md`, repositório nexxussai-monorepo). A indústria confirma a fotografia de 2026-07: AG-UI é transporte-agnóstico com SSE como default de referência, o UI Message Stream da Vercel roda sobre SSE, e o ACP mostra o caso legítimo de outro transporte (stdio JSON-RPC) quando não há HTTP no meio. A tabela comparativa (fase 2) enumerará os três candidatos contra as quatro tensões de "O problema".

### O preço do POST: parser SSE manual no cliente

Tese: a decisão "SSE sobre POST" tem um custo concreto e localizado — `EventSource` não faz POST, então o cliente lê o corpo da resposta com `fetch` + `getReader()` e fatia os frames `data: {json}\n\n` à mão (`apps/web/src/features/conversation/adapters/http-chat.ts`, repositório ghdaru; mesmo desenho em `apps/web/src/features/conversation/api/lateralChatService.ts`, repositório nexxussai-monorepo). É um custo pago uma vez, atrás de uma porta (`ChatPort`/serviço), e invisível para o resto da aplicação. A fase 2 detalha o parser e suas armadilhas (frames partidos entre chunks, flush, término).

### Entrega confiável: `seq` monotônico e replay

Tese: a primeira metade da sessão robusta é garantir que nenhum evento se perde nem se duplica quando a conexão cai — e o ghdaru a implementou com três peças: `seq` monotônico por sessão atribuído no servidor (`ChatSession.record()`), replay por marca d'água via `GET /chat/sessions/{id}/events?after=N` (`events_after(seq)`) e deduplicação por `seq` no cliente (`apps/api/src/ghdaru_api/http/chat_router.py` e `apps/api/src/ghdaru_api/conversation/domain/models.py`, repositório ghdaru). O contrato está fixado em teste — content-type, `seq` contínuo, replay sem perda/duplicação (`apps/api/tests/http/test_chat_routes.py`, repositório ghdaru). O conteúdo do envelope (`kind`, `payload`) pertence ao capítulo 03; aqui importa só que cada evento tem uma posição total na sessão e que qualquer cliente consegue perguntar "o que veio depois de N?".

### Cancelamento cooperativo: encerrar o stream sem quebrar a sessão

Tese: a segunda metade é o cliente poder interromper uma geração em curso sem matar a sessão — e o nexxussai a implementou com um registro em memória de streams ativos (`ActiveStreams`), um endpoint de cancelamento (`DELETE /api/chat/stream/{stream_id}` em `apps/api/app/ai_chat/infrastructure/http/chat_completions_router.py`) e o encerramento cooperativo do lado do emissor, que finaliza o stream com o código `STREAM_CANCELLED` (`apps/api/app/ai_chat/infrastructure/stream/active_streams.py` e `sse_emitter.py`, repositório nexxussai-monorepo). No cliente, o espelho é o `AbortSignal` do `fetch` (`apps/web/src/features/conversation/api/lateralChatService.ts`, repositório nexxussai-monorepo). "Cooperativo" é a palavra-chave: ninguém derruba a conexão à força — o servidor é avisado, encerra limpo e a sessão continua utilizável. Cancelar uma *ação proposta* é outra coisa, governada pela máquina de estados do capítulo 05.

### O envelope de erro como parte do protocolo

Tese: erro de transporte e de provedor não é exceção interna — é vocabulário do contrato. O nexxussai fixa um envelope estável `{error: {code, message, details}}` com códigos fixos (`MODEL_UNAVAILABLE`, `PROVIDER_FAILURE`, `STREAM_CANCELLED`, …) em `specs/005-backend-ai-chat/contracts/api-contract.md` (repositório nexxussai-monorepo); o ghdaru exige por requisito que erros de autenticação, autorização e indisponibilidade de IA produzam "mensagens claras ao usuário e registro para diagnóstico" — degradação controlada, FR-015 de `specs/001-fundacao-shell-chat/spec.md` (repositório ghdaru) — e emite o erro como evento tipado dentro do próprio stream. A lição composta: o erro chega pelo mesmo canal dos demais eventos, com código estável que o cliente pode discriminar. A semântica do evento `error` no vocabulário é assunto do capítulo 03.

### Sessão e reconexão: compondo as duas metades

Tese: a sessão — não a conexão — é a unidade durável do protocolo; a conexão é descartável por desenho. Com as duas metades compostas, o ciclo de vida fecha: conexão cai → cliente reconecta e faz replay `?after=N` (metade ghdaru); usuário desiste → cliente cancela cooperativamente e a sessão segue viva (metade nexxussai). Nenhum dos dois laboratórios implementou as duas metades — a lacuna espelhada que confirma serem metades do mesmo todo (síntese de `estudos/fonte-base-codigo.md`). A fase 2 desenha o ciclo de vida completo da sessão com um exemplo fictício de reconexão.

### Leitura executiva

*(rascunho — consolidar na fase 2)* O que roubar deste capítulo: (1) **SSE sobre POST como default** — pague o parser manual uma vez e ganhe tempo-real sobre a infraestrutura HTTP que você já tem; WebSocket só quando houver bidirecionalidade real contínua, stdio quando não houver HTTP (ACP). (2) **Sessão durável, conexão descartável**: `seq` monotônico atribuído no servidor + replay por marca d'água (`?after=N`) + dedup no cliente é o esquema mínimo de entrega confiável — e é barato. (3) **Cancelamento é do protocolo, não da UI**: registro de streams ativos + endpoint de cancelamento + código estável (`STREAM_CANCELLED`) + `AbortSignal` no cliente. (4) **Envelope de erro com códigos fixos dentro do stream** — o cliente degrada por código, não por parse de mensagem. Contrato de frescor: se a indústria consolidar um transporte diferente de SSE para a fronteira app↔agente (por exemplo, WebTransport ou generalização do padrão bidirecional do AG-UI), este capítulo exige revisão extraordinária.

## Verificação

1. Sua equipe propõe WebSocket "porque é mais moderno" para o chat embutido. Quais das quatro tensões de "O problema" o WebSocket alivia e quais ele agrava — e que pergunta sobre o *fluxo* decide a escolha? (Dica: o fluxo é assimétrico? Objetivos 1 e 5.)
2. Por que o cliente das duas bases não usa `EventSource`, e onde esse custo fica confinado? (Dica: qual verbo HTTP o `EventSource` suporta — e o que o protocolo precisa enviar no corpo? Objetivo 1.)
3. A conexão caiu no meio de uma resposta. Descreva, com os três mecanismos do ghdaru, como o cliente retoma sem perder nem duplicar eventos. (Dica: quem atribui o `seq`, o que o cliente guarda, e o que `?after=N` devolve. Objetivo 3.)
4. O usuário clicou em "parar" durante uma geração. Explique a diferença entre cancelar o *stream* (este capítulo) e cancelar uma *ação proposta* (capítulo 05), e por que o cancelamento de stream precisa ser cooperativo e ter um código estável no envelope de erro. (Dica: a sessão sobrevive? O que o cliente discrimina — mensagem ou código? Objetivos 2 e 4.)

---

## Apêndice — evidência por laboratório

### ghdaru

**A metade da entrega confiável** (implementada) — e a decisão de transporte:

- `specs/001-fundacao-shell-chat/plan.md` — decisão registrada: "Eventos do chat (SSE): resposta `text/event-stream` de POST".
- `docs/research/resultado-pesquisa-infra-avaliacao.md` — restrição de infraestrutura que motiva a sessão durável: limitações de conexões persistentes referem-se a WebSocket; "nosso chat usa SSE, e qualquer proxy pode derrubar conexões longas — cliente SSE robusto reconecta de qualquer forma (isso vira requisito da [aplicação])".
- `apps/api/src/ghdaru_api/http/chat_router.py` — o transporte: `POST /chat/sessions/{id}/messages` → `text/event-stream` com frames `data: {json}\n\n`; replay em `GET /chat/sessions/{session_id}/events?after=N` (`replay_events`, delega a `session.events_after(after)`).
- `apps/api/src/ghdaru_api/conversation/domain/models.py` — `ChatSession.record()` atribui o `seq` monotônico por sessão; `events_after(seq)` é a consulta de replay.
- `apps/api/tests/http/test_chat_routes.py` — o contrato fixado em teste: content-type `text/event-stream`, `seq` contínuo, replay sem perda/duplicação.
- `apps/web/src/features/conversation/adapters/http-chat.ts` — parser SSE manual no cliente (`fetch` + `getReader()`, split por `\n\n`), necessário porque `EventSource` não faz POST; dedup por `seq` no consumidor (`apps/web/src/features/conversation/ui/ChatPanel.tsx`).
- `specs/001-fundacao-shell-chat/spec.md` — FR-015: erros de autenticação, autorização e indisponibilidade de IA devem produzir mensagens claras ao usuário e registro para diagnóstico (degradação controlada; o erro vira evento tipado no stream — semântica no cap. 03).
- **Ausência (a lacuna que confirma a categoria)**: não há cancelamento de stream — nenhum registro de streams ativos, nenhum endpoint de cancelamento, nenhum `AbortSignal` no adapter HTTP.

### nexxussai-monorepo

**A metade do cancelamento cooperativo** (implementada) — e a decisão de transporte:

- `specs/014-chat-lateral-contexto/research.md` — decisão formal: "REST sem streaming: rejeitado porque perderia a experiência atual de resposta progressiva"; também rejeita novo protocolo SSE exclusivo (reusa o vocabulário existente — cap. 03).
- `apps/api/app/ai_chat/infrastructure/stream/active_streams.py` — registro em memória dos streams ativos; o cancelamento finaliza cooperativamente com `stream.finish("cancelled", "STREAM_CANCELLED")`.
- `apps/api/app/ai_chat/infrastructure/http/chat_completions_router.py` — o endpoint de cancelamento: `DELETE /api/chat/stream/{stream_id}`.
- `apps/api/app/ai_chat/infrastructure/stream/sse_emitter.py` — serialização SSE e encerramento limpo do stream.
- `apps/web/src/features/conversation/api/lateralChatService.ts` — cliente do protocolo: `fetch` + `getReader()` com parâmetro `signal?: AbortSignal` para abortar do lado do cliente.
- `specs/005-backend-ai-chat/contracts/api-contract.md` — envelope de erro estável `{error: {code, message, details}}` com códigos fixos: `AUTH_REQUIRED`, `FORBIDDEN`, `MODEL_UNAVAILABLE`, `STREAM_CANCELLED`, `PROVIDER_FAILURE`, `INTERNAL_ERROR`, entre outros.
- **Ausência (a lacuna que confirma a categoria)**: não há `seq` monotônico por sessão nem endpoint de replay — se a conexão cai no meio de uma resposta, não existe reentrega sem perda/duplicação.

### Divergências

| Dimensão | ghdaru | nexxussai-monorepo |
|---|---|---|
| Transporte | SSE sobre POST (`chat_router.py`) | SSE sobre POST (routers de `ai_chat`) |
| Entrega confiável | ✅ `seq` + `events_after` + replay `?after=N`, fixado em teste | ❌ ausente |
| Cancelamento de stream | ❌ ausente | ✅ `ActiveStreams` + `DELETE /api/chat/stream/{stream_id}` + `AbortSignal` |
| Erro no contrato | Evento `error` no stream + FR-015 (degradação controlada) | Envelope `{error:{code,message,details}}` com códigos fixos |

As implementações são complementares, não conflitantes: cada base construiu uma metade da sessão robusta e nenhuma construiu a outra — a composição das duas é a recomendação normativa deste capítulo (fase 2).
