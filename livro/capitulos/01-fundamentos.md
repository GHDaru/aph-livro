# 01 — Fundamentos e vocabulário

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** a assimetria das duas direções do protocolo — aplicação→IA (inteligência artificial) como *descrição* (snapshot de contexto + catálogo de ações) e IA→aplicação como *ação mediada* (eventos tipados em streaming) — e por que a aplicação permanece soberana sobre execução e autorização.
2. **Distinguir** os sete conceitos fundamentais — snapshot de contexto, catálogo de ações, evento tipado, proposta de ação, comando de UI (interface de usuário), classe de risco e traço de execução — reconhecendo o nome de cada um nos dois laboratórios e seu equivalente na indústria.
3. **Analisar** o fluxo completo de uma interação — do pedido do usuário ao traço de execução — identificando qual conceito atua em cada etapa.
4. **Avaliar** por que a manipulação direta da interface (leitura de DOM — Document Object Model — e cliques simulados) foi rejeitada nas duas bases em favor do desenho declarativo.

## O problema

Toda aplicação que embute um agente de IA enfrenta duas perguntas que parecem independentes, mas são as duas metades de um mesmo protocolo: como a aplicação conta ao agente o que está acontecendo — em que tela o usuário está, com que dados, com que permissões — e como o agente devolve à aplicação não apenas texto, mas *intenções*: navegar, preencher, executar. As duas implementações-laboratório deste livro responderam a essas perguntas de forma independente e convergente. O `ghdaru` batizou os termos "Snapshot de Contexto", "Catálogo de Ações", "Proposta de Ação", "Comando de UI", "Classe de Risco" e "Traço de Execução" em `docs/linguagem-ubiqua.md` (repositório `ghdaru`); o `nexxussai-monorepo` chegou aos mesmos conceitos com outros nomes — `ScreenContextSnapshot` (`apps/api/app/ai_chat/domain/entities/screen_context_snapshot.py`), `ScreenRegistry` (`apps/api/app/ai_chat/infrastructure/persistence/screen_registry_seed.py`), `ActionProposal` (`apps/api/app/ai_chat/domain/entities/action_proposal.py`), todos no repositório `nexxussai-monorepo`. Vocabulários distintos, topologia idêntica: é essa convergência que este capítulo transforma em vocabulário comum do livro.

A resposta ingênua à fronteira seria deixar o modelo "ver" a tela — por pixels ou pelo DOM — e agir simulando cliques. As duas bases rejeitaram esse caminho formalmente, não por omissão: o `ghdaru` o proíbe em contrato normativo (`.specify/memory/constitution.md`, Princípio IV, repositório `ghdaru`); o `nexxussai-monorepo` registra a decisão "introspecção do DOM rejeitada" em `specs/014-chat-lateral-contexto/research.md` (repositório `nexxussai-monorepo`). A indústria oferece o contraexemplo em produção: no *computer use* da Anthropic, o modelo age por screenshot e clique, e a própria documentação registra latência alta e erros frequentes ([docs — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)). Pixels e cliques são a fronteira menos governável.

A alternativa para a qual os dois laboratórios convergiram é um protocolo de **duas direções assimétricas**. Na direção aplicação→IA trafega *descrição*: a aplicação se descreve por um snapshot de contexto estruturado e sanitizado e por um catálogo de ações declarado — a IA nunca infere a interface, e só existe para ela o que foi declarado ("o que não está declarado, a IA não faz" — `docs/integration/instrucoes-construcao.md` e `docs/integration/guia-integracao.md`, repositório `ghdaru`; implementação do catálogo em `apps/api/src/ghdaru_api/conversation/domain/catalog.py`). Na direção IA→aplicação trafega *ação mediada*: um fluxo de eventos tipados em streaming que carrega conteúdo (texto, raciocínio) e intenções (propostas de ação, comandos de UI) — e é a aplicação, nunca o modelo, quem decide, autoriza e executa. A assimetria é o ponto: o modelo propõe; a aplicação dispõe.

Sete conceitos compõem todo o resto do livro: **snapshot de contexto**, **catálogo de ações**, **evento tipado**, **proposta de ação**, **comando de UI**, **classe de risco** e **traço de execução**. Sem esse mapa fixado, cada capítulo — e cada equipe que implementar o protocolo — renegociaria os termos do zero, exatamente o problema de "contratos primeiro" que o próprio protocolo resolve nas aplicações. Este capítulo entrega o mapa e o vocabulário; o *canal* por onde os eventos trafegam é assunto do capítulo 02, a *semântica* de cada tipo de evento é do capítulo 03, e a *máquina de estados* que governa as ações é do capítulo 05.

Como todo vocabulário, este vive sob restrições em tensão: riqueza do vocabulário × carga cognitiva de quem o adota (sete conceitos, não dezessete); catálogo fechado e declarado × flexibilidade do modelo para agir; mediação com confirmação humana × latência e fricção da experiência; nomes locais expressivos × alinhamento com os equivalentes da indústria (tools, elicitation, events) para não isolar o protocolo do ecossistema.

## Fundamentos científicos

Este capítulo **não tem paper ✓ atribuído**: na rodada de validação de 2026-07-30, nenhuma entrada de [`bibliografia.md`](../bibliografia.md) lista o capítulo 01 na coluna de capítulos — e, portanto, **nenhuma afirmação do corpo deste capítulo se apoia em ciência**. A evidência aqui é de outra natureza: o código dos dois laboratórios (Apêndice) e as fontes da indústria (seção seguinte). Não é omissão: o capítulo é de *vocabulário e síntese*, e a ciência pertinente a cada conceito vive no capítulo que o aprofunda, onde já está validada:

- **Toolformer** ([arXiv 2302.04761](https://arxiv.org/abs/2302.04761)) ✓ — ancestral científico do *tool calling* (o modelo decide quando/qual/como chamar; a aplicação executa); atribuído ao cap. 08.
- **ToolEmu** ([arXiv 2309.15817](https://arxiv.org/abs/2309.15817)) ✓ — risco residual de agentes que executam ações; atribuído aos caps. 05 e 07.
- **τ-bench** ([arXiv 2406.12045](https://arxiv.org/abs/2406.12045)) ✓ — inconsistência de agentes com tools sob política de domínio; atribuído ao cap. 08.
- **GUI Agents: A Survey** ([arXiv 2412.13501](https://arxiv.org/abs/2412.13501)) ✓ — o paradigma "pixels + cliques" que este capítulo contrasta com o desenho declarativo; atribuído ao cap. 00.

Candidatos ainda não validados (⏳, em [`estudos/candidatos-bibliografia.md`](../../estudos/candidatos-bibliografia.md)) **não sustentam afirmação alguma do corpo**. Se uma rodada futura validar ciência específica de vocabulário de protocolo app↔agente — lacuna registrada nas observações de curadoria daquele documento —, esta seção deve ser reescrita e o paper atribuído ao capítulo em [`bibliografia.md`](../bibliografia.md).

## Fontes da indústria

- **[AG-UI — Agent-User Interaction Protocol, vocabulário de eventos](https://docs.ag-ui.com/concepts/events)**: protocolo aberto agente↔frontend organizado em eventos tipados (`TextMessage*`, `ToolCall*`, `StateSnapshot`/`StateDelta`) sobre streaming — a indústria confirma as categorias "evento tipado" e "snapshot de estado" como forma canônica da fronteira; um vocabulário próprio deve mapear para essas categorias.
- **[MCP — Model Context Protocol, elicitation (spec 2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)**: *tools* e *resources* do MCP são os equivalentes de mercado de catálogo de ações e snapshot; *elicitation* ("pergunte ao humano com schema") é o parente direto da proposta de ação — a decisão fica no cliente, fora do LLM (Large Language Model).
- **[ACP — Agent Client Protocol](https://kiro.dev/docs/cli/acp/)**: o par `session/update` (fluxo agente→editor) + `session/request_permission` (aprovação no cliente) é o blueprint de mercado para "eventos tipados + proposta de ação com decisão fora do modelo" — validação independente da assimetria que este capítulo nomeia.
- **[Vercel AI SDK — UI Message Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)**: partes tipadas com padrão start/delta/end sobre SSE (Server-Sent Events), com aprovação de tool como estado do protocolo ([Tool Approvals](https://ai-sdk.dev/docs/agents/tool-approvals)) — o formato de eventos tipados mais adotado no ecossistema web; evidência de que "evento tipado" e "proposta como estado de primeira classe" são consenso, não idiossincrasia.
- **[Anthropic — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)**: o anti-padrão de referência — agir por screenshot + clique é lento, falível e difícil de autorizar; justifica por que as duas direções do protocolo são declarativas e mediadas.

## O estado da arte

### Duas direções, um protocolo assimétrico

À primeira vista, a fronteira aplicação↔harness parece um canal bidirecional comum: mensagens vão, mensagens voltam. A leitura das duas bases mostra outra coisa: **as duas direções carregam cargas de natureza diferente**, e essa diferença é o fundamento de todo o desenho.

Na direção aplicação→IA trafega *descrição*. A aplicação não pergunta "o que você vê?" — ela afirma "isto é o que existe": um snapshot de contexto estruturado e sanitizado descrevendo o estado corrente, e um catálogo de ações declarando as capacidades disponíveis. No ghdaru, essa direção é literal no código: o caso de uso central recebe a mensagem já acompanhada do snapshot e da lista de módulos do tenant, sanitiza o snapshot e constrói o catálogo **antes de qualquer contato com o modelo** (`apps/api/src/ghdaru_api/conversation/application/handle_message.py`, repositório `ghdaru`). No nexxussai-monorepo, o snapshot da tela corrente é montado pela própria aplicação no cliente e validado por JSON Schema no contrato (`apps/web/src/features/conversation/model/useScreenContext.ts` e `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json`, repositório `nexxussai-monorepo`).

Na direção IA→aplicação trafega *ação mediada*. O modelo não devolve efeitos — devolve **eventos tipados em streaming**, que carregam conteúdo (texto, raciocínio) e intenções (propostas de ação, comandos de UI). A palavra decisiva é *mediada*: entre a intenção do modelo e o efeito na aplicação há sempre um interpretador da aplicação. No ghdaru, é `applyUiCommand()` quem traduz o evento `ui.navigate` em navegação real (`apps/web/src/features/conversation/ui/ChatPanel.tsx`, repositório `ghdaru`); no nexxussai, a proposta — quando emitida, o que o backend ainda não faz — chega como evento `action_proposal` e vira um `ActionCard` renderizado para decisão do usuário (`apps/web/src/components/chat/lateral/ActionCard.tsx`, repositório `nexxussai-monorepo`). Em nenhuma das duas bases existe um caminho de código pelo qual o modelo toque o DOM, simule um clique ou chame um endpoint da aplicação diretamente — a ausência é o argumento.

A assimetria, portanto, não é acidente de implementação: é distribuição deliberada de soberania. O modelo detém a *interpretação* — entender o pedido, escolher a ação, justificá-la; a aplicação detém todo o resto — validação, autorização, execução, auditoria. A indústria confirma o desenho pelo avesso: no *computer use*, em que o modelo age por screenshot e clique, a própria documentação registra latência alta e erros frequentes ([docs — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)) — o custo de dissolver a mediação que as duas bases tornaram obrigatória.

### O fluxo completo: do pedido ao traço

Com as direções nomeadas, uma única interação pode ser percorrida de ponta a ponta — e percorre os sete conceitos, nesta ordem:

```text
usuário    ─(1) mensagem ────────────────────────────────────▶ aplicação
aplicação  ─(2) mensagem + snapshot de contexto
             + catálogo de ações ────────────────────────────▶ harness
harness    ─(3) eventos tipados em streaming
             (conteúdo, raciocínio, propostas de ação,
              comandos de UI) ───────────────────────────────▶ aplicação
aplicação  ─(4) apresenta a proposta de ação ────────────────▶ usuário
             [quando a classe de risco exige confirmação]
usuário    ─(5) confirma ou cancela ─────────────────────────▶ aplicação
aplicação  ─(6) executa a ação
             (autorização e execução fora do modelo)
aplicação  ─(7) traço de execução ───────────────────────────▶ usuário e harness
```

O diagrama é o mapa que o resto do livro detalha, e cada etapa tem dono conceitual. Na etapa 2, a aplicação compõe a descrição: no ghdaru, o snapshot montado no cliente (`ChatPanel.tsx`) viaja com a mensagem e, no servidor, entra no prompt como mensagem `system` **separada e rotulada** ("Contexto de tela (sanitizado)"), nunca misturada à fala do usuário (`handle_message.py`, repositório `ghdaru`). Na etapa 3, o harness responde com o stream de eventos tipados — a única voz que ele tem. As etapas 4–5 são condicionais: é a **classe de risco** quem decide se elas existem. No ghdaru, uma ação `read` colapsa o gate — a proposta transita direto para execução e o mesmo stream da etapa 3 já emite o comando de UI e o resultado; só uma ação `confirm` para em `awaiting_approval` esperando a etapa 5 (`handle_message.py`). E há o caso degenerado que o diagrama não mostra: se nenhuma ação do catálogo corresponde à intenção, o fluxo se reduz às etapas 1–3 com eventos de conteúdo apenas — o chat que "apenas responde".

A etapa 7 fecha o ciclo nas duas pontas: o traço de execução volta ao usuário (renderizado na conversa) e ao harness (que passa a saber o que de fato aconteceu). O canal físico das etapas 2–3 (HTTP, SSE, sessão, reconexão) é assunto do capítulo 02; o significado de cada tipo de evento da etapa 3, do capítulo 03; os estados por que passa a proposta entre as etapas 3 e 7, do capítulo 05. Aqui interessa reconhecer o percurso e nomear cada peça.

### Os sete conceitos, seus nomes e seus equivalentes

A tabela é a espinha do livro: cada conceito com sua definição, o nome que recebeu em cada laboratório e o equivalente na indústria (fonte: [`glossario.md`](../glossario.md), derivado de `estudos/fonte-base-codigo.md` §4). A divergência de nomes com convergência de topologia é a evidência de desenho independente.

| Conceito | Definição | ghdaru | nexxussai-monorepo | Indústria |
|---|---|---|---|---|
| **Snapshot de contexto** | Descrição estruturada e sanitizada do estado da aplicação enviada à IA a cada mensagem; a IA nunca infere a UI. | Snapshot de Contexto (3 níveis: domínio/interface/conversa) | `ScreenContextSnapshot` (com `context_hash`) | state/context (AG-UI); resources (MCP) |
| **Catálogo de ações** | Inventário declarado do que a IA pode fazer; única superfície executável. | Catálogo de Ações (`ActionSpec`, com `input_schema`) | `ScreenRegistry` + `ActionKind` | tools (MCP / function calling) |
| **Evento tipado** | Unidade do fluxo IA→app: `kind` de um vocabulário fechado e versionado + payload. | `EventKind` com envelope `{seq, kind, payload}` | vocabulário SSE canônico (`text_delta`, `artifact_*`, …) | data stream parts (Vercel AI SDK); events (AG-UI); session/update (ACP) |
| **Proposta de ação** | Intenção de ação da IA que aguarda decisão (humana ou de política) antes de executar; tem máquina de estados própria. | Proposta de Ação (FSM — máquina de estados finitos — com `awaiting_approval`) | `ActionProposal` (FSM + `idempotency_key`) | elicitation (MCP); permission request (ACP); human-in-the-loop |
| **Comando de UI** | Instrução declarativa da IA para a interface (`navigate`, `form.patch`…); nunca clique simulado ou DOM. | Comando de UI (`ui.navigate`, `session.logout`) | ações `navigate/fill_fields/focus_field` | frontend tools / generative UI |
| **Classe de risco** | Gravidade declarada de uma ação, que determina o gate (executa direto / confirma / bloqueia). | Classe de Risco (taxonomia ampliada; `read\|confirm` implementadas) | `RiskLevel` + `requires_confirmation` | — (não padronizado) |
| **Traço de execução** | Registro auditável e visível de toda ação executada; sem traço, a ação é não-governada. | Traço de Execução (`action_result` obrigatório) | `ExecutionTrace` / tool-results | — (não padronizado) |

Três leituras da tabela importam. A primeira é a da **convergência**: coluna a coluna, os nomes divergem — evidência de que ninguém copiou ninguém — mas cada linha descreve o mesmo objeto, com as mesmas responsabilidades. É o padrão que se repete no livro inteiro: dois times, sem se ver, desenharam o mesmo protocolo. A segunda é a do **mapa do livro**: cada linha tem o capítulo que a aprofunda — o snapshot no 04, o evento no 03, catálogo, proposta, risco e traço no 05, o comando de UI no 06 —; este capítulo fixa a definição e os demais não renegociam o termo (a fonte canônica é o glossário, que esta tabela espelha). A terceira é a das **duas últimas linhas**: classe de risco e traço de execução não têm equivalente padronizado — nenhum dos ecossistemas mapeados em `estudos/panorama-industria.md` os carrega como primitiva de protocolo. É a fronteira entre o que o mercado já validou (eventos, tools, gate humano) e o que ainda é diferencial de quem constrói; o capítulo 10 mede essa lacuna e o capítulo 11 a transforma em proposta.

### Aplicação→IA: descrever, nunca deixar inferir

As duas peças desta direção são complementares e têm ritmos diferentes: o **snapshot de contexto** descreve o *estado* — perecível, recalculado a cada mensagem —; o **catálogo de ações** declara as *capacidades* — estável, derivado das permissões vigentes. Juntas, elas substituem qualquer forma de inferência: a IA não "olha" a tela; ela recebe a descrição que a aplicação decidiu dar.

O snapshot nasce na aplicação e é fechado por contrato. No nexxussai-monorepo, `registerScreen()` monta o snapshot no próprio cliente, com `contextHash` calculado e `capturedAt` (`apps/web/src/features/conversation/model/useScreenContext.ts`), e o JSON Schema do contrato proíbe campos fora do declarado (`additionalProperties: false` em `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json`). E ele é **sanitizado no servidor** antes de chegar ao modelo: o ghdaru remove recursivamente toda chave que contenha um marcador sensível (`password`, `senha`, `secret`, `token`, `credential` — `sanitize_snapshot()` em `apps/api/src/ghdaru_api/conversation/domain/sanitize.py`); o nexxussai aplica denylist equivalente e descarta campos marcados `sensitive` no registry (`apps/api/app/ai_chat/domain/services/screen_context_sanitizer.py`). Um snapshot típico (valores fictícios):

```json
{
  "screen_id": "pedidos.detalhe",
  "route": "/pedidos/123",
  "fields": { "status": "aberto", "cliente": "Exemplo Ltda." },
  "context_hash": "a1b2c3d4e5f60718",
  "captured_at": "2026-07-30T12:00:00Z"
}
```

O catálogo é o outro lado da descrição: um contrato positivo ("isto existe, com este `input_schema`") e, sobretudo, negativo — o que não está no catálogo **não existe** para a IA (`apps/api/src/ghdaru_api/conversation/domain/catalog.py`, repositório `ghdaru`). E ele é derivado, não estático: no ghdaru, o `enum` de rotas do `ui.navigate` nasce dos módulos habilitados do tenant — "a IA nunca enxerga rota desabilitada" é comentário literal do código (`catalog.py`). A governança começa na composição do inventário, antes de qualquer conversa. O detalhe do snapshot em níveis e da sanitização é do capítulo 04; a anatomia do catálogo e sua regra negativa, do capítulo 05.

### IA→aplicação: agir por eventos, nunca pela interface

Na direção de volta existe uma única unidade: o **evento tipado** — um `kind` de um vocabulário fechado mais um payload. No ghdaru, o envelope é `{seq, kind, payload}` e o vocabulário tem oito membros: `thought`, `content`, `action_proposal`, `action_result`, `citation`, `ui_command`, `finished`, `error` (`apps/api/src/ghdaru_api/conversation/domain/models.py`); o contrato é espelhado em TypeScript no frontend (`apps/web/src/features/conversation/domain/events.ts`), de modo que backend e interface leem a mesma definição. No nexxussai, o vocabulário SSE canônico (`text_delta`, `thinking_delta`, `artifact_*`, `execution_*`, `tool_call`, `tool_result`, `action_proposal`, `done`, `error` — `apps/api/app/ai_chat/domain/value_objects/stream_event.py`) está documentado como contrato com regra de evolução explícita (`specs/005-backend-ai-chat/contracts/stream-events.md`).

O vocabulário se divide em duas famílias. Os eventos de *conteúdo* carregam o que o usuário lê: texto, raciocínio, artefatos, citações. Os eventos de *intenção* — a **proposta de ação** e o **comando de UI** — carregam o que a aplicação decide. A distinção resolve a aparente contradição de "a IA age": agir, aqui, é apenas emitir um evento de intenção; o efeito acontece quando (e se) a aplicação o interpreta — `applyUiCommand()` no ghdaru, `ActionCard` com botões de confirmar/cancelar no nexxussai (paths na seção da assimetria e no Apêndice). A semântica completa de cada tipo é do capítulo 03; a entrega confiável do stream — incluindo o `seq` monotônico que permite replay sem perda (`events_after(seq)` em `models.py`, repositório `ghdaru`) — é do capítulo 02; a governança das intenções, dos capítulos 05–06.

### Governança transversal: classe de risco e traço de execução

Os dois últimos conceitos não pertencem a uma direção: atravessam o ciclo inteiro. A **classe de risco** é decidida antes da conversa e fora do modelo. No ghdaru, ela é declarada por ação, no catálogo (`ActionSpec.risk`, hoje `read|confirm`, da taxonomia ampliada prevista na pesquisa de origem do produto (`docs/research/resultado-pesquisa-chat-ai-first-avaliacao.md`) — a lacuna que o Apêndice registra); no nexxussai, é derivada por política de domínio a partir do tipo da ação (`apps/api/app/ai_chat/domain/services/action_proposal_policy_service.py`). Declarado num laboratório, derivado no outro — em ambos, o modelo escolhe *qual* ação propor, nunca *quanta* governança ela recebe.

O **traço de execução** fecha o ciclo do outro lado: no ghdaru, todo desfecho — executado ou cancelado — emite `action_result` com um campo `trace` legível na conversa (`handle_message.py`, repositório `ghdaru`); no nexxussai, os resultados são persistidos por endpoint próprio (`POST /api/chat/tool-results` em `apps/api/app/ai_chat/infrastructure/http/lateral_chat_router.py`). Sem traço, a ação é não-governada; com traço, a governança vira política ajustável por evidência — argumento que o capítulo 05 desenvolve. Nas duas bases, risco e traço são parte do *protocolo*, não da UI: viajam nos contratos e são verificados no servidor. O modelo de ameaça que justifica tudo isso é do capítulo 07.

### Leitura executiva

A fronteira aplicação↔harness é um protocolo de **duas direções assimétricas**: para lá vai *descrição* — snapshot de contexto sanitizado e catálogo de ações declarado —; para cá vem *ação mediada* — eventos tipados carregando conteúdo e intenções. A soberania fica inteira com a aplicação: o modelo interpreta e propõe; a aplicação valida, autoriza, executa e audita. Sete conceitos compõem todo o resto — snapshot, catálogo, evento, proposta, comando de UI, risco, traço — e a convergência independente de dois produtos (`ghdaru`, `nexxussai-monorepo`) somada ao alinhamento com quatro ecossistemas de mercado (AG-UI, MCP, ACP, Vercel AI SDK) indica que esse mapa é reutilizável, não idiossincrático. **O que roubar**: (1) fixe o vocabulário antes do código — os sete conceitos são a linguagem ubíqua mínima da fronteira; (2) trate as direções como assimétricas por desenho: nunca dê ao modelo um caminho direto para a interface ou para endpoints — todo efeito passa por um interpretador da aplicação; (3) use o diagrama do fluxo completo como teste de arquitetura: se uma interação do seu produto não puder ser contada com as sete peças, falta conceito ou sobra acoplamento; (4) mapeie seus nomes locais para os equivalentes da indústria (coluna final da tabela) para não isolar seu protocolo — e saiba que classe de risco e traço de execução você terá de desenhar sozinho, porque ninguém os padronizou.

*Contrato de frescor: esta leitura expira se (a) um protocolo de mercado padronizar o **contexto de tela** aplicação→agente como vocabulário próprio — lacuna aberta registrada em `estudos/panorama-industria.md` — ou (b) classe de risco ou traço de execução ganharem equivalente padronizado na indústria, invalidando a coluna "Indústria" da tabela dos sete conceitos. Em qualquer dos casos, o capítulo deve ser revisto em rodada extraordinária.*

## Verificação

1. Por que o protocolo aplicação↔harness é *assimétrico*, se há tráfego nas duas direções? (Dica: compare a natureza do que trafega em cada direção — descrição × ação mediada — e responda quem executa e autoriza; testa o objetivo 1.)
2. Um colega diz "o `ScreenRegistry` do nexxussai é o snapshot de contexto deles". Corrija-o usando a tabela dos sete conceitos: a que conceito o `ScreenRegistry` corresponde, qual é o nome no ghdaru e qual é o equivalente na indústria? (Dica: estado × capacidades; testa o objetivo 2.)
3. Ordene as etapas de uma interação em que o usuário pede "cancele o pedido 123" e a ação exige confirmação, nomeando o conceito que atua em cada etapa. (Dica: siga o diagrama do fluxo completo — do snapshot+catálogo ao traço; testa o objetivo 3.)
4. Avalie o argumento: "deixar o modelo ler o DOM elimina o custo de manter snapshot e catálogo — é mais simples". (Dica: use as decisões formais das duas bases e o registro de latência/erros do computer use; considere também quem autoriza uma ação inferida; testa o objetivo 4.)

---

## Apêndice — evidência por laboratório

### ghdaru

- `docs/linguagem-ubiqua.md` — os termos canônicos que batizam cinco dos sete conceitos do livro: *Comando de UI*, *Catálogo de Ações*, *Snapshot de Contexto*, *Proposta de Ação*, *Traço de Execução*, *Classe de Risco*.
- `.specify/memory/constitution.md` — Princípio IV (não-negociável): eventos tipados SSE, FSM de ação, catálogo obrigatório, contexto em 3 níveis, classes de risco, separação de camadas; a rejeição normativa da manipulação direta da UI.
- `apps/api/src/ghdaru_api/conversation/domain/models.py` — quatro dos sete conceitos como tipos num único arquivo: `EventKind` (evento tipado, 8 membros), `RiskClass` (`read|confirm`), `ProposalStatus` com a tabela `_TRANSITIONS` (proposta de ação), `ActionSpec` (item do catálogo); `ChatSession.events_after(seq)` (replay).
- `apps/api/src/ghdaru_api/conversation/domain/catalog.py` — Catálogo v1: `ui.navigate` (risk=read, `enum` de rotas derivado dos módulos habilitados do tenant — "a IA nunca enxerga rota desabilitada") e `session.logout` (risk=confirm). A regra "o que não está declarado, a IA não faz": `docs/integration/instrucoes-construcao.md` e `docs/integration/guia-integracao.md`.
- `apps/api/src/ghdaru_api/conversation/domain/sanitize.py` — `sanitize_snapshot()` recursivo com `SENSITIVE_MARKERS` (`password`, `senha`, `secret`, `token`, `credential`): o snapshot é sanitizado antes do modelo (detalhe no cap. 04).
- `apps/api/src/ghdaru_api/conversation/application/handle_message.py` — o fluxo completo num use case: mensagem → sanitize → catálogo → intenção → risco → eventos; o snapshot sanitizado entra como mensagem `system` separada e rotulada ("Contexto de tela (sanitizado)"); ação `read` executa direto (`action_proposal` → `ui_command` → `action_result`), ação `confirm` para em `awaiting_approval`; `confirm_action()` fecha o ciclo com `action_result` mesmo no cancelamento.
- `apps/web/src/features/conversation/ports/chat-port.ts` — a fronteira como interface de porta: `ChatPort.sendMessage(...): AsyncIterable<ChatEvent>`, `replay(afterSeq)` e `confirm(proposalId, approved)` — as duas direções e o gate num único contrato.
- `apps/web/src/features/conversation/domain/events.ts` — espelho TypeScript do contrato (`ChatEvent {seq, kind, payload}`, `Snapshot`): o vocabulário é compartilhado entre backend e frontend.
- `apps/web/src/features/conversation/ui/ChatPanel.tsx` — `applyUiCommand()` traduz `ui.navigate`/`session.logout` em efeitos reais: o comando de UI é interpretado pela aplicação, nunca executado pelo modelo.
- **A lacuna que confirma a categoria**: da taxonomia ampliada de classes de risco prevista na pesquisa de origem (`docs/research/resultado-pesquisa-chat-ai-first-avaliacao.md`), só `read|confirm` estão implementadas em código; e a própria Constituição usa nomes (`ToolCallRequest/Confirmation/Response`) divergentes do código (`action_proposal`/`action_result`) — o vocabulário precisava ser fixado, que é o papel deste capítulo.

### nexxussai-monorepo

- `apps/api/app/ai_chat/domain/value_objects/stream_event.py` — fonte da verdade dos eventos tipados, incluindo `ActionProposalEvent` (`proposal_id, action_kind, rationale, risk_level, requires_confirmation, target_screen_id, field_values`): proposta de ação como evento do vocabulário.
- `apps/api/app/ai_chat/domain/entities/action_proposal.py`, `screen_definition.py`, `screen_context_snapshot.py` — três dos sete conceitos como entidades de domínio; a FSM da proposta (`proposed → confirmed → executed` …) fica para o cap. 05.
- `apps/api/app/ai_chat/domain/value_objects/action_kind.py` — taxonomia `navigate, fill_fields, focus_field, submit, open_resource, clarify`: os comandos de UI como espécie declarada de ação.
- `apps/api/app/ai_chat/domain/services/action_proposal_policy_service.py` — `RiskLevel` inferido por `ActionKind`; risco high/critical sempre exige confirmação: classe de risco como política server-side, fora do modelo.
- `apps/api/app/ai_chat/domain/services/screen_context_sanitizer.py` — remoção de `token/access_token/refresh_token/password/secret/cookie/jwt/csrf`, campos desconhecidos e campos `sensitive` do snapshot antes do modelo.
- `apps/api/app/ai_chat/infrastructure/http/lateral_chat_router.py` — endpoints do protocolo lateral, incluindo `POST /tool-results` (o traço persistido).
- `apps/web/src/features/conversation/model/useScreenContext.ts` — `registerScreen()` monta o snapshot no cliente com `contextHash` calculado e `capturedAt`: a aplicação se descreve; nada é inferido.
- `specs/005-backend-ai-chat/contracts/stream-events.md` — o vocabulário SSE canônico documentado como contrato (`text_delta, thinking_delta, artifact_*, …, done, error`), com regra de evolução explícita.
- `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json` — o snapshot com JSON Schema (`additionalProperties: false`, `context_hash`): descrição declarada, nunca inferida.
- `apps/web/src/features/conversation/model/screenRegistry.ts` + `apps/web/src/components/chat/lateral/ActionCard.tsx` — registry espelhado no cliente; a proposta renderizada por `actionKind` com cor por `riskLevel` e botões confirmar/cancelar.
- **A lacuna que confirma a categoria**: `ActionProposalEvent` existe como value object, com persistência e endpoints, mas o backend nunca o emite (falta o use case `ProposeAction`) — o conceito precede a implementação completa, evidência de que é categoria de desenho, não acidente de código.

### Divergências

- **Escopo do snapshot**: o ghdaru descreve a aplicação em 3 níveis (domínio/interface/conversa); o nexxussai descreve *a tela corrente* (`ScreenContextSnapshot` com `context_hash`, que detecta se a tela mudou entre proposta e confirmação).
- **Forma do catálogo**: catálogo por tenant com `ActionSpec`/`input_schema` (`ghdaru`) × registry por tela com `ActionKind` fechado (`nexxussai-monorepo`) — mesmo conceito, granularidades diferentes.
- **Modelo de risco**: taxonomia ampliada com 2 classes implementadas (`ghdaru`) × `RiskLevel` contínuo + booleano `requires_confirmation` (`nexxussai-monorepo`).
- **Manifesto de aplicação**: só o ghdaru o formalizou (`docs/integration/manifest.schema.json`); no nexxussai é roadmap (`docs/proposta-chat-lateral.md`, fase 6) — por isso o manifesto não integra os sete conceitos fundamentais e aparece apenas no cap. 09.
