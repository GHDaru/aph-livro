# 01 — Fundamentos e vocabulário

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

> *Fase: estrutura (spec 005) — "O problema" redigido; estado da arte em esqueleto de H3; texto completo na fase 2.*

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** a assimetria das duas direções do protocolo — aplicação→IA (inteligência artificial) como *descrição* (snapshot de contexto + catálogo de ações) e IA→aplicação como *ação mediada* (eventos tipados em streaming) — e por que a aplicação permanece soberana sobre execução e autorização.
2. **Distinguir** os sete conceitos fundamentais — snapshot de contexto, catálogo de ações, evento tipado, proposta de ação, comando de UI (interface de usuário), classe de risco e traço de execução — reconhecendo o nome de cada um nos dois laboratórios e seu equivalente na indústria.
3. **Analisar** o fluxo completo de uma interação — do pedido do usuário ao traço de execução — identificando qual conceito atua em cada etapa.
4. **Avaliar** por que a manipulação direta da interface (leitura de DOM — Document Object Model — e cliques simulados) foi rejeitada nas duas bases em favor do desenho declarativo.

## O problema

Toda aplicação que embute um agente de IA enfrenta duas perguntas que parecem independentes, mas são as duas metades de um mesmo protocolo: como a aplicação conta ao agente o que está acontecendo — em que tela o usuário está, com que dados, com que permissões — e como o agente devolve à aplicação não apenas texto, mas *intenções*: navegar, preencher, executar. As duas implementações-laboratório deste livro responderam a essas perguntas de forma independente e convergente. O `ghdaru` batizou os termos "Snapshot de Contexto", "Catálogo de Ações", "Proposta de Ação", "Comando de UI", "Classe de Risco" e "Traço de Execução" em `docs/linguagem-ubiqua.md` (repositório `ghdaru`); o `nexxussai-monorepo` chegou aos mesmos conceitos com outros nomes — `ScreenContextSnapshot` (`apps/api/app/ai_chat/domain/entities/screen_context_snapshot.py`), `ScreenRegistry` (`apps/api/app/ai_chat/infrastructure/persistence/screen_registry_seed.py`), `ActionProposal` (`apps/api/app/ai_chat/domain/entities/action_proposal.py`), todos no repositório `nexxussai-monorepo`. Vocabulários distintos, topologia idêntica: é essa convergência que este capítulo transforma em vocabulário comum do livro.

A resposta ingênua à fronteira seria deixar o modelo "ver" a tela — por pixels ou pelo DOM — e agir simulando cliques. As duas bases rejeitaram esse caminho formalmente, não por omissão: o `ghdaru` o proíbe em contrato normativo (`.specify/memory/constitution.md`, Princípio IV, repositório `ghdaru`); o `nexxussai-monorepo` registra a decisão "introspecção do DOM rejeitada" em `specs/014-chat-lateral-contexto/research.md` (repositório `nexxussai-monorepo`). A indústria oferece o contraexemplo em produção: no *computer use* da Anthropic, o modelo age por screenshot e clique, e a própria documentação registra latência alta e erros frequentes ([docs — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)). Pixels e cliques são a fronteira menos governável.

A alternativa para a qual os dois laboratórios convergiram é um protocolo de **duas direções assimétricas**. Na direção aplicação→IA trafega *descrição*: a aplicação se descreve por um snapshot de contexto estruturado e sanitizado e por um catálogo de ações declarado — a IA nunca infere a interface, e só existe para ela o que foi declarado ("o que não está declarado, a IA não faz", `apps/api/src/ghdaru_api/conversation/domain/catalog.py`, repositório `ghdaru`). Na direção IA→aplicação trafega *ação mediada*: um fluxo de eventos tipados em streaming que carrega conteúdo (texto, raciocínio) e intenções (propostas de ação, comandos de UI) — e é a aplicação, nunca o modelo, quem decide, autoriza e executa. A assimetria é o ponto: o modelo propõe; a aplicação dispõe.

Sete conceitos compõem todo o resto do livro: **snapshot de contexto**, **catálogo de ações**, **evento tipado**, **proposta de ação**, **comando de UI**, **classe de risco** e **traço de execução**. Sem esse mapa fixado, cada capítulo — e cada equipe que implementar o protocolo — renegociaria os termos do zero, exatamente o problema de "contratos primeiro" que o próprio protocolo resolve nas aplicações. Este capítulo entrega o mapa e o vocabulário; o *canal* por onde os eventos trafegam é assunto do capítulo 02, a *semântica* de cada tipo de evento é do capítulo 03, e a *máquina de estados* que governa as ações é do capítulo 05.

Como todo vocabulário, este vive sob restrições em tensão: riqueza do vocabulário × carga cognitiva de quem o adota (sete conceitos, não dezessete); catálogo fechado e declarado × flexibilidade do modelo para agir; mediação com confirmação humana × latência e fricção da experiência; nomes locais expressivos × alinhamento com os equivalentes da indústria (tools, elicitation, events) para não isolar o protocolo do ecossistema.

## Fundamentos científicos

Este capítulo ainda **não tem ciência validada**: nenhuma entrada com status ✓ existe em [`bibliografia.md`](../bibliografia.md) até 2026-07-30, e portanto nenhum paper sustenta afirmação do corpo. Os candidatos pertinentes abaixo (todos **⏳**, de [`estudos/candidatos-bibliografia.md`](../../estudos/candidatos-bibliografia.md)) serão validados na fase 2:

- **Toolformer** ([arXiv 2302.04761](https://arxiv.org/abs/2302.04761)) ⏳ — ancestral científico do *tool calling*: o modelo decide *quando/qual/como* chamar, a aplicação executa; base candidata para o conceito de catálogo de ações.
- **ToolEmu** ([arXiv 2309.15817](https://arxiv.org/abs/2309.15817)) ⏳ — quantifica o risco residual de agentes executando ações; base candidata para proposta de ação + classe de risco.
- **τ-bench** ([arXiv 2406.12045](https://arxiv.org/abs/2406.12045)) ⏳ — inconsistência de agentes com tools sob política de domínio; base candidata para o argumento de distribuir controle entre aplicação e humano.
- **GUI Agents: A Survey** ([arXiv 2412.13501](https://arxiv.org/abs/2412.13501)) ⏳ — mapeia o paradigma "pixels + cliques" que este capítulo contrasta com o desenho declarativo.

## Fontes da indústria

- **[AG-UI — Agent-User Interaction Protocol, vocabulário de eventos](https://docs.ag-ui.com/concepts/events)**: protocolo aberto agente↔frontend organizado em eventos tipados (`TextMessage*`, `ToolCall*`, `StateSnapshot`/`StateDelta`) sobre streaming — a indústria confirma as categorias "evento tipado" e "snapshot de estado" como forma canônica da fronteira; um vocabulário próprio deve mapear para essas categorias.
- **[MCP — Model Context Protocol, elicitation (spec 2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)**: *tools* e *resources* do MCP são os equivalentes de mercado de catálogo de ações e snapshot; *elicitation* ("pergunte ao humano com schema") é o parente direto da proposta de ação — a decisão fica no cliente, fora do LLM (Large Language Model).
- **[ACP — Agent Client Protocol](https://kiro.dev/docs/cli/acp/)**: o par `session/update` (fluxo agente→editor) + `session/request_permission` (aprovação no cliente) é o blueprint de mercado para "eventos tipados + proposta de ação com decisão fora do modelo" — validação independente da assimetria que este capítulo nomeia.
- **[Vercel AI SDK — UI Message Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)**: partes tipadas com padrão start/delta/end sobre SSE (Server-Sent Events), com aprovação de tool como estado do protocolo ([Tool Approvals](https://ai-sdk.dev/docs/agents/tool-approvals)) — o formato de eventos tipados mais adotado no ecossistema web; evidência de que "evento tipado" e "proposta como estado de primeira classe" são consenso, não idiossincrasia.
- **[Anthropic — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)**: o anti-padrão de referência — agir por screenshot + clique é lento, falível e difícil de autorizar; justifica por que as duas direções do protocolo são declarativas e mediadas.

## O estado da arte

### Duas direções, um protocolo assimétrico

A fronteira aplicação↔harness tem duas direções de natureza distinta: aplicação→IA transporta *descrição* (estado da tela + capacidades declaradas), IA→aplicação transporta *ação mediada* (eventos tipados carregando conteúdo e intenções). A assimetria é deliberada: a aplicação é soberana — só ela executa, autoriza e audita; o modelo apenas propõe. Nas duas bases não existe caminho pelo qual a IA toque a interface diretamente (evidência no Apêndice).

### O fluxo completo: do pedido ao traço

Uma única interação percorre os sete conceitos, nesta ordem:

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

O canal físico das etapas 2–3 (HTTP, SSE, sessão, reconexão) é assunto do capítulo 02; o significado de cada tipo de evento da etapa 3, do capítulo 03; os estados por que passa a proposta entre as etapas 3 e 7, do capítulo 05. Aqui interessa apenas reconhecer o percurso e nomear cada peça.

### Os sete conceitos, seus nomes e seus equivalentes

A tabela é a espinha do livro: cada conceito com sua definição, o nome que recebeu em cada laboratório e o equivalente na indústria (fonte: [`glossario.md`](../glossario.md), derivado de `estudos/fonte-base-codigo.md` §4). A divergência de nomes com convergência de topologia é a evidência de desenho independente.

| Conceito | Definição | ghdaru | nexxussai-monorepo | Indústria |
|---|---|---|---|---|
| **Snapshot de contexto** | Descrição estruturada e sanitizada do estado da aplicação enviada à IA a cada mensagem; a IA nunca infere a UI. | Snapshot de Contexto (3 níveis: domínio/interface/conversa) | `ScreenContextSnapshot` (com `context_hash`) | state/context (AG-UI); resources (MCP) |
| **Catálogo de ações** | Inventário declarado do que a IA pode fazer; única superfície executável. | Catálogo de Ações (`ActionSpec`, com `input_schema`) | `ScreenRegistry` + `ActionKind` | tools (MCP / function calling) |
| **Evento tipado** | Unidade do fluxo IA→app: `kind` de um vocabulário fechado e versionado + payload. | `EventKind` com envelope `{seq, kind, payload}` | vocabulário SSE canônico (`text_delta`, `artifact_*`, …) | data stream parts (Vercel AI SDK); events (AG-UI); session/update (ACP) |
| **Proposta de ação** | Intenção de ação da IA que aguarda decisão (humana ou de política) antes de executar; tem máquina de estados própria. | Proposta de Ação (FSM — máquina de estados finitos — com `awaiting_approval`) | `ActionProposal` (FSM + `idempotency_key`) | elicitation (MCP); permission request (ACP); human-in-the-loop |
| **Comando de UI** | Instrução declarativa da IA para a interface (`navigate`, `form.patch`…); nunca clique simulado ou DOM. | Comando de UI (`ui.navigate`, `session.logout`) | ações `navigate/fill_fields/focus_field` | frontend tools / generative UI |
| **Classe de risco** | Gravidade declarada de uma ação, que determina o gate (executa direto / confirma / bloqueia). | Classe de Risco (8 níveis; `read\|confirm` implementadas) | `RiskLevel` + `requires_confirmation` | — (não padronizado) |
| **Traço de execução** | Registro auditável e visível de toda ação executada; sem traço, a ação é não-governada. | Traço de Execução (`action_result` obrigatório) | `ExecutionTrace` / tool-results | — (não padronizado) |

### Aplicação→IA: descrever, nunca deixar inferir

Os dois conceitos desta direção são complementares: o snapshot de contexto descreve o *estado* (sanitizado antes de chegar ao modelo) e o catálogo de ações declara as *capacidades*. O contrato é negativo além de positivo: o que não está no catálogo não existe para a IA (`apps/api/src/ghdaru_api/conversation/domain/catalog.py`, repositório `ghdaru`). O detalhe do snapshot em níveis e da sanitização é do capítulo 04; a anatomia do catálogo, do capítulo 05.

### IA→aplicação: agir por eventos, nunca pela interface

O evento tipado é a unidade universal desta direção; proposta de ação e comando de UI são membros especiais desse vocabulário — eventos que carregam *intenção* em vez de conteúdo. A IA não tem acesso à interface: ela emite eventos, e a aplicação os traduz em efeitos. A semântica completa do vocabulário é do capítulo 03; a governança das intenções, dos capítulos 05–06.

### Governança transversal: classe de risco e traço de execução

Dois conceitos atravessam as duas direções e fecham o ciclo: a classe de risco, declarada no catálogo, decide o gate de cada ação (executa direto, exige confirmação, bloqueia); o traço de execução registra de forma auditável o que de fato aconteceu — sem traço, a ação é não-governada. Nas duas bases o risco e o traço são parte do *protocolo*, não da UI (evidência no Apêndice). O modelo de ameaça completo é do capítulo 07.

### Leitura executiva

*Rascunho (fase estrutura).* O que roubar deste capítulo: (1) trate a fronteira aplicação↔IA como **duas direções assimétricas** — descrição para lá, ação mediada para cá — e nunca deixe o modelo tocar a interface; (2) fixe os **sete conceitos** como vocabulário antes de escrever código: snapshot, catálogo, evento, proposta, comando de UI, risco, traço; (3) a convergência independente de dois produtos (`ghdaru`, `nexxussai-monorepo`) e o alinhamento com quatro ecossistemas de mercado (AG-UI, MCP, ACP, Vercel AI SDK) indicam que esse mapa é reutilizável, não idiossincrático. Contrato de frescor: se um protocolo de mercado padronizar o **contexto de tela** aplicação→agente como vocabulário próprio — lacuna aberta registrada em `estudos/panorama-industria.md` —, esta leitura expira e o capítulo deve ser revisto.

## Verificação

1. Por que o protocolo aplicação↔harness é *assimétrico*, se há tráfego nas duas direções? (Dica: compare a natureza do que trafega em cada direção — descrição × ação mediada — e responda quem executa e autoriza; testa o objetivo 1.)
2. Um colega diz "o `ScreenRegistry` do nexxussai é o snapshot de contexto deles". Corrija-o usando a tabela dos sete conceitos: a que conceito o `ScreenRegistry` corresponde, qual é o nome no ghdaru e qual é o equivalente na indústria? (Dica: estado × capacidades; testa o objetivo 2.)
3. Ordene as etapas de uma interação em que o usuário pede "cancele o pedido 123" e a ação exige confirmação, nomeando o conceito que atua em cada etapa. (Dica: siga o diagrama do fluxo completo — do snapshot+catálogo ao traço; testa o objetivo 3.)
4. Avalie o argumento: "deixar o modelo ler o DOM elimina o custo de manter snapshot e catálogo — é mais simples". (Dica: use as decisões formais das duas bases e o registro de latência/erros do computer use; considere também quem autoriza uma ação inferida; testa o objetivo 4.)

---

## Apêndice — evidência por laboratório

### ghdaru

- `docs/linguagem-ubiqua.md` — os termos canônicos que batizam cinco dos sete conceitos do livro: *Comando de UI*, *Catálogo de Ações*, *Snapshot de Contexto*, *Proposta de Ação*, *Traço de Execução*, *Classe de Risco*.
- `.specify/memory/constitution.md` — Princípio IV (não-negociável): eventos tipados SSE, FSM de ação, catálogo obrigatório, contexto em 3 níveis, 8 classes de risco, separação de camadas; a rejeição normativa da manipulação direta da UI.
- `apps/api/src/ghdaru_api/conversation/domain/models.py` — quatro dos sete conceitos como tipos num único arquivo: `EventKind` (evento tipado), `RiskClass` (`read|confirm`), `ProposalStatus` com a tabela `_TRANSITIONS` (proposta de ação), `ActionSpec` (item do catálogo).
- `apps/api/src/ghdaru_api/conversation/domain/catalog.py` — Catálogo v1: `ui.navigate` (risk=read) e `session.logout` (risk=confirm); "o que não está declarado, a IA não faz".
- `apps/api/src/ghdaru_api/conversation/domain/sanitize.py` — `sanitize_snapshot()` com `SENSITIVE_MARKERS`: o snapshot é sanitizado antes do modelo (detalhe no cap. 04).
- `apps/api/src/ghdaru_api/conversation/application/handle_message.py` — o fluxo completo num use case: mensagem → sanitize → catálogo → intenção → risco → eventos; `confirm_action()` fecha o ciclo proposta→execução.
- `apps/web/src/features/conversation/domain/events.ts` — espelho TypeScript do contrato (`ChatEvent {seq, kind, payload}`, `Snapshot`): o vocabulário é compartilhado entre backend e frontend.
- `apps/web/src/features/conversation/ui/ChatPanel.tsx` — `applyUiCommand()` traduz `ui.navigate`/`session.logout` em efeitos reais: o comando de UI é interpretado pela aplicação, nunca executado pelo modelo.
- **A lacuna que confirma a categoria**: das 8 classes de risco declaradas na Constituição, só `read|confirm` estão implementadas em código; e a própria Constituição usa nomes (`ToolCallRequest/Confirmation/Response`) divergentes do código (`action_proposal`/`action_result`) — o vocabulário precisava ser fixado, que é o papel deste capítulo.

### nexxussai-monorepo

- `apps/api/app/ai_chat/domain/value_objects/stream_event.py` — fonte da verdade dos eventos tipados, incluindo `ActionProposalEvent` (`proposal_id, action_kind, rationale, risk_level, requires_confirmation, target_screen_id, field_values`): proposta de ação como evento do vocabulário.
- `apps/api/app/ai_chat/domain/entities/action_proposal.py`, `screen_definition.py`, `screen_context_snapshot.py` — três dos sete conceitos como entidades de domínio; a FSM da proposta (`proposed → confirmed → executed` …) fica para o cap. 05.
- `apps/api/app/ai_chat/domain/value_objects/action_kind.py` — taxonomia `navigate, fill_fields, focus_field, submit, open_resource, clarify`: os comandos de UI como espécie declarada de ação.
- `apps/api/app/ai_chat/domain/services/action_proposal_policy_service.py` — `RiskLevel` inferido por `ActionKind`; risco high/critical sempre exige confirmação: classe de risco como política server-side, fora do modelo.
- `apps/api/app/ai_chat/domain/services/screen_context_sanitizer.py` — remoção de `token/password/secret/…` e campos `sensitive` do snapshot antes do modelo.
- `specs/005-backend-ai-chat/contracts/stream-events.md` — o vocabulário SSE canônico documentado como contrato (`text_delta, thinking_delta, artifact_*, …, done, error`), com regra de evolução explícita.
- `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json` — o snapshot com JSON Schema (`additionalProperties: false`, `context_hash`): descrição declarada, nunca inferida.
- `apps/web/src/features/conversation/model/screenRegistry.ts` + `apps/web/src/components/chat/lateral/ActionCard.tsx` — registry espelhado no cliente; a proposta renderizada por `actionKind` com cor por `riskLevel` e botões confirmar/cancelar.
- **A lacuna que confirma a categoria**: `ActionProposalEvent` existe como value object, com persistência e endpoints, mas o backend nunca o emite (falta o use case `ProposeAction`) — o conceito precede a implementação completa, evidência de que é categoria de desenho, não acidente de código.

### Divergências

- **Escopo do snapshot**: o ghdaru descreve a aplicação em 3 níveis (domínio/interface/conversa); o nexxussai descreve *a tela corrente* (`ScreenContextSnapshot` com `context_hash`, que detecta se a tela mudou entre proposta e confirmação).
- **Forma do catálogo**: catálogo por tenant com `ActionSpec`/`input_schema` (`ghdaru`) × registry por tela com `ActionKind` fechado (`nexxussai-monorepo`) — mesmo conceito, granularidades diferentes.
- **Modelo de risco**: 8 classes declaradas com 2 implementadas (`ghdaru`) × `RiskLevel` contínuo + booleano `requires_confirmation` (`nexxussai-monorepo`).
- **Manifesto de aplicação**: só o ghdaru o formalizou (`docs/integration/manifest.schema.json`); no nexxussai é roadmap (`docs/proposta-chat-lateral.md`, fase 6) — por isso o manifesto não integra os sete conceitos fundamentais e aparece apenas no cap. 09.
