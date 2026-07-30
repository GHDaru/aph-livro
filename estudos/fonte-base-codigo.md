# Fonte-base em código: as duas implementações-laboratório

> **Estado capturado em 2026-07-30** · pesquisa da spec 002 · repositórios lidos: `GHDaru/ghdaru` e `GHDaru/nexxussai-monorepo` (somente leitura)

Este documento consolida a evidência em código que sustenta o livro (Constituição, Princípios I e II). Todo path abaixo é verificável no repositório indicado. É o insumo primário das specs de capítulo.

## 1. A tese empírica

Dois produtos distintos, desenvolvidos de forma independente, convergiram para o **mesmo desenho de protocolo** na fronteira aplicação↔IA:

| Conceito | ghdaru | nexxussai-monorepo |
|---|---|---|
| Transporte | SSE sobre POST (`StreamingResponse`), `seq` monotônico + replay | SSE sobre POST, cancelamento cooperativo (`ActiveStreams`) |
| IA → app | eventos tipados `thought, content, action_proposal, action_result, citation, ui_command, finished, error` | eventos tipados `text_delta, thinking_delta, artifact_*, execution_*, tool_call, tool_result, action_proposal, done, error` |
| App → IA | Snapshot de Contexto em 3 níveis + Catálogo de Ações | `ScreenContextSnapshot` + `ScreenRegistry` compartilhado front/back |
| Governança de ação | FSM de proposta, classes de risco, traço obrigatório | FSM de proposta, `risk_level`, `requires_confirmation`, `idempotency_key`, `context_hash` |
| Segurança | sanitização de snapshot, separação de camadas, autorização fora do LLM | sanitizador de contexto, "nunca DOM scraping", permissão server-side |
| Porta do modelo | `LlmProviderPort`, chunks `reasoning|content|finish`, usage no finish | `LLMPort` multi-provider + normalizador de chunks provider-agnóstico |
| Federação | Manifesto de Aplicação + handshake `postMessage ghd.*` (3 níveis) | roadmap "expor telas como MCP tools" |
| Lacunas espelhadas | tool calling real, MCP, slot filling | tool calling real, MCP, execução de ações no frontend |

A convergência **não** é coincidência de copy-paste: os vocabulários diferem (evidência de desenho independente), mas a topologia é idêntica — duas direções, eventos tipados, contexto declarado (nunca inferido do DOM), ações governadas por proposta+confirmação, autorização fora do modelo.

## 2. Laboratório A — `ghdaru`

Fundação multi-tenant onde o chat é interface transversal que **age sobre a aplicação** com governança. DDD + hexagonal (`apps/api` FastAPI, `apps/web` React 19).

### 2.1 Contrato normativo

- `.specify/memory/constitution.md` — **Princípio IV (não-negociável)**: eventos tipados SSE, FSM de ação, catálogo obrigatório, contexto em 3 níveis, 8 classes de risco, slot filling, separação de camadas contra prompt injection, autorização fora do LLM. Princípio VI: API + MCP. Princípio VII: Camada Semântica de Interface.
- `docs/linguagem-ubiqua.md` — termos canônicos: *Comando de UI*, *Catálogo de Ações*, *Snapshot de Contexto*, *Proposta de Ação*, *Traço de Execução*, *Classe de Risco*, *Coleta por Schema*, *Manifesto de Aplicação*.
- `docs/adr/0003-modelos-integracao-aplicacoes.md` — três níveis de integração (interno/federado/headless); **decisão negativa estruturante**: "protocolo de integração novo, separado do snapshot/catálogo — duplicaria conceitos que a IA já usa" (descartado).
- `docs/research/resultado-pesquisa-chat-ai-first-avaliacao.md` — fonte teórica: catálogo, 3 níveis, 8 classes de risco, slot filling, roadmap fase 2 (Capability Registry + Action Gateway + Policy Service).

### 2.2 Protocolo em código — backend

- `apps/api/src/ghdaru_api/conversation/domain/models.py` — o coração: `EventKind`, `RiskClass (read|confirm)`, `ProposalStatus` + tabela `_TRANSITIONS` (FSM `proposed → awaiting_approval → confirmed → executing → executed|failed|cancelled`), `ActionSpec`, `ChatSession.record()/events_after(seq)`.
- `apps/api/src/ghdaru_api/conversation/domain/catalog.py` — Catálogo v1: `ui.navigate` (risk=read, `enum` de rotas derivado dos módulos habilitados do tenant), `session.logout` (risk=confirm). "O que não está declarado, a IA não faz."
- `apps/api/src/ghdaru_api/conversation/domain/sanitize.py` — `sanitize_snapshot()` recursivo; `SENSITIVE_MARKERS = ("password","senha","secret","token","credential")`.
- `apps/api/src/ghdaru_api/conversation/application/handle_message.py` — pipeline `mensagem → sanitize → catálogo → intenção → risco → eventos`; snapshot entra como mensagem `system` separada rotulada; `confirm_action()` fecha o ciclo.
- `apps/api/src/ghdaru_api/http/chat_router.py` — transporte: `POST /chat/sessions/{id}/messages` → `text/event-stream` com `data: {json}\n\n`; `GET .../events?after=N` (replay sem perda/duplicação); `POST .../proposals/{id}` (confirmação).
- `apps/api/src/ghdaru_api/conversation/ports/ports.py` + `adapters/rule_intent.py` — `IntentRouterPort`: roteador determinístico por keywords; adaptador LLM é evolução prevista.
- `apps/api/src/ghdaru_api/ai_gateway/domain/models.py` + `ports/llm_provider.py` — porta única de LLM: `LlmChunk(kind: reasoning|content|finish, usage)`, erros traduzidos em categorias de domínio, `TokenUsage` no chunk `finish` (base do metering, spec 004 do ghdaru).
- `apps/api/src/ghdaru_api/ai_gateway/adapters/nemotron.py` — adapter OpenAI-compatível; mapeia `delta.reasoning_content` → chunk `reasoning`; **não usa tools/function calling**.
- `apps/api/src/ghdaru_api/http/auth_router.py` — `/auth/introspect` devolve o `Principal` (contrato legível por máquina do nível headless).
- Testes que **fixam o contrato**: `apps/api/tests/http/test_chat_routes.py` (content-type, `seq` contínuo, replay), `tests/conversation/test_conversation.py` (FSM, sanitização), `tests/adapters/test_usage_flow.py`.

### 2.3 Protocolo em código — frontend

- `apps/web/src/features/conversation/domain/events.ts` — espelho TypeScript do contrato (`ChatEvent {seq, kind, payload}`, `Snapshot`).
- `apps/web/src/features/conversation/ports/chat-port.ts` — `ChatPort`: `sendMessage(...): AsyncIterable<ChatEvent>`, `replay(afterSeq)`, `confirm(proposalId, approved)`.
- `apps/web/src/features/conversation/adapters/http-chat.ts` — parser SSE manual (`getReader()`, split `\n\n`) — porque o stream vem de um POST, `EventSource` não serve.
- `apps/web/src/features/conversation/ui/ChatPanel.tsx` — montagem do snapshot no cliente, dedup por `seq`, `applyUiCommand()` traduz `ui.navigate`/`session.logout` em efeitos reais.
- `apps/web/src/shared/semantic/registry.ts` + `types.ts` — Camada Semântica: `SemanticObject.aiActions: NAVIGATE|FILL_FIELDS|SUBMIT|READ` (`[]` = sensível); 16 objetos registrados.
- `apps/web/src/features/conversation/adapters/fake-chat.ts` — adaptador demo que espelha o contrato (spec executável do protocolo).

### 2.4 Federação (especificada, sem código)

- `docs/integration/manifesto-aplicacao.md` — contrato de 5 elementos + handshake `postMessage`: `ghd.handshake / ghd.ready / ghd.theme / ghd.snapshot / ghd.ui_command / ghd.action_result`; `event.origin` verificado nos dois lados; token validado via `/auth/introspect`.
- `docs/integration/manifest.schema.json` — JSON Schema (draft 2020-12) validável do manifesto (`actions[]` com `risk` e `input_schema`, `endpoints.mcp_card`, `capabilities_required`).
- `docs/integration/snapshot.md`, `instrucoes-construcao.md` (DEVE/NÃO DEVE + checklist de conformidade), `guia-integracao.md`, `README.md` — o insight: "o contrato do Nível 2 é o mesmo que a IA já usa — snapshot + catálogo; não há um segundo protocolo a inventar".

### 2.5 Lacunas declaradas (ghdaru)

Roteador de intenção por LLM/function calling (o `input_schema` do catálogo ainda não vira tools) · MCP server (previsto no Princípio VI, catálogo "desenhado para virar tools MCP" em `specs/001-fundacao-shell-chat/plan.md`, zero código) · slot filling (`ui.form.patch`, `user.input.required` definidos, não implementados) · evento `Artifact` e `citation` com fonte real · handshake `ghd.*` sem código · classes de risco 3–8 (só `read|confirm` implementadas) · snapshot nível interface completo (hoje só `screen.id`/`route`) · divergência de nomenclatura Constituição (`ToolCallRequest/Confirmation/Response`) × código (`action_proposal`/`action_result`).

## 3. Laboratório B — `nexxussai-monorepo`

Plataforma multi-tenant (chat com RAG, knowledge base, admin, education). BCs DDD + hexagonal em FastAPI; frontend React 18. Duas gerações de chat: o principal (`/api/chat/completions`) e o **chat lateral com contexto de tela** (spec 014).

### 3.1 Contratos documentados

- `specs/005-backend-ai-chat/contracts/stream-events.md` — **vocabulário SSE canônico**: `text_delta, thinking_delta, artifact_start/delta/end, execution_start/output/done, tool_call, tool_result, done, error`; regra de evolução: "o frontend ignora tipos desconhecidos, mas adições devem ser documentadas antes do uso".
- `specs/005-backend-ai-chat/contracts/api-contract.md` — superfície HTTP + envelope de erro estável `{error:{code,message,details}}` com códigos fixos (`MODEL_UNAVAILABLE`, `PROVIDER_FAILURE`, `STREAM_CANCELLED`…).
- `specs/014-chat-lateral-contexto/contracts/chat-lateral-api.yaml` — OpenAPI do protocolo com contexto de tela: `/api/chat/screens`, `/api/chat/lateral/messages` (SSE), `/api/chat/actions/{id}/confirm|cancel`, `/api/chat/tool-results`.
- `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json` — JSON Schema do snapshot (`additionalProperties: false`, `context_hash`).
- `specs/014-chat-lateral-contexto/data-model.md` + `research.md` — modelo de domínio e 6 decisões formais (REST sem streaming rejeitado; prompt hardcoded rejeitado; introspecção do DOM rejeitada; execução automática de tool calls rejeitada).
- `docs/backend-ai-chat-interface.md` (2134 linhas) — a porta `ILLMCompletion` com `CompletionRequest.tools` (especificada, não implementada), thinking multi-provider, sistema de tags.
- `docs/proposta-chat-lateral.md` — roadmap de maturidade em 6 fases (Fase 4 = tool calling real; Fase 6 = telas como MCP tools) + "o que não fazer agora".
- `references/newchatshell/Chat with Context - Spec.md` + `nexxussai-chat-context-roadmap.md` — a spec de produto original ("a tela é a fonte da verdade"; "nenhuma mutação escondida") e a pergunta-título "como o chat sabe o que chamar?".

### 3.2 Protocolo em código — backend (BC `ai_chat`)

- `apps/api/app/ai_chat/domain/value_objects/stream_event.py` — fonte da verdade dos eventos, incl. `ActionProposalEvent` (`proposal_id, action_kind, rationale, risk_level, requires_confirmation, target_screen_id, field_values`).
- `apps/api/app/ai_chat/domain/entities/action_proposal.py`, `screen_definition.py`, `screen_context_snapshot.py` — entidades do protocolo; FSM `proposed → confirmed → executed`, `proposed → cancelled|denied|expired`, `confirmed → failed|denied`.
- `apps/api/app/ai_chat/domain/services/screen_context_sanitizer.py` — remove `token/access_token/refresh_token/password/secret/cookie/jwt/csrf`, campos desconhecidos e campos `sensitive`.
- `apps/api/app/ai_chat/domain/services/action_proposal_policy_service.py` — infere `RiskLevel` por `ActionKind`; `submit`/`open_resource` e risco high/critical sempre exigem confirmação.
- `apps/api/app/ai_chat/domain/value_objects/action_kind.py` — taxonomia: `navigate, fill_fields, focus_field, submit, open_resource, clarify`.
- `apps/api/app/ai_chat/application/use_cases/send_lateral_message.py` — injeta contexto sanitizado como system message JSON; normaliza o stream; trata cancelamento.
- `apps/api/app/ai_chat/infrastructure/llm/provider_stream_normalizer.py` — normalização provider-agnóstica: aceita `str|dict|CompletionChunk|StreamEvent` de qualquer adapter e converte ao vocabulário canônico. O domínio nunca vê formato raw.
- `apps/api/app/ai_chat/infrastructure/stream/active_streams.py` + `sse_emitter.py` — cancelamento cooperativo (`DELETE /api/chat/stream/{id}`) e serialização SSE.
- `apps/api/app/ai_chat/infrastructure/http/lateral_chat_router.py` — endpoints do protocolo lateral; contém `_DefaultPermissionPolicy` sempre-True (lacuna conhecida).
- `apps/api/app/ai_chat/infrastructure/persistence/screen_registry_seed.py` — registry de telas no backend (`chat`, `files`, `education-catalog`, `admin-users`).
- `apps/api/app/ai_orchestration/infrastructure/llm/llm_factory.py` + `anthropic_adapter.py`, `openai_adapter.py`, `gemini_adapter.py`, `deepseek_adapter.py` — seleção por `LLM_PROVIDER`; porta atual `llm_port.py` só `complete/stream` de strings, **sem `tools`**.
- Legado instrutivo: `apps/api/app/flows/tools.py` (AGENT_TOOLS estilo function calling manual) e `flows/execution_runner.py` (loop agêntico com `max_iterations`) — a pré-história do protocolo no produto.
- `apps/api/app/mcp/server.py` — protótipo FastMCP isolado, desconectado da aplicação.

### 3.3 Protocolo em código — frontend

- `apps/web/src/features/conversation/api/lateralChatService.ts` — cliente do protocolo: `streamLateralMessage` (fetch + `getReader()` + `AbortSignal`), `confirmActionProposal` (com `idempotency_key`), `recordToolResult`.
- `apps/web/src/features/conversation/model/useLateralChat.ts` — orquestração com idempotency key por proposta (`crypto.randomUUID`) e rollback otimista.
- `apps/web/src/features/conversation/model/useScreenContext.ts` — `registerScreen()` → snapshot com `contextHash` calculado e `capturedAt`.
- `apps/web/src/features/conversation/model/screenRegistry.ts` — registry espelhado no cliente.
- `apps/web/src/components/chat/lateral/ActionCard.tsx` — render da proposta por `actionKind` + cor por `riskLevel` + confirmar/cancelar.
- `apps/web/src/store/conversation/useChatStore.ts` — consumidor SSE do chat principal (switch completo sobre o vocabulário de eventos).

### 3.4 Lacunas declaradas (nexxussai)

Tool calling real (porta com `tools` só em spec) · `ActionProposalEvent` nunca emitido pelo backend (VO, persistência e endpoints existem; falta o use case `ProposeAction`) · frontend não executa ações propostas (sem `ActionExecutionAdapter`) · MCP só superfície (`list_servers()` → `[]`) · execução de código stub · permissão do lateral sempre-True · testes T061–T065 abertos em `specs/014-chat-lateral-contexto/tasks.md`.

## 4. Tabela terminológica (semente do glossário)

| Conceito | ghdaru | nexxussai | Indústria (a confirmar na spec 002/estudos) |
|---|---|---|---|
| Estado da tela enviado à IA | Snapshot de Contexto (3 níveis) | ScreenContextSnapshot | context / state (AG-UI), resources (MCP) |
| Inventário do que a IA pode fazer | Catálogo de Ações (`ActionSpec`) | ScreenRegistry + `ActionKind` | tools (MCP/function calling) |
| Ação aguardando humano | Proposta de Ação (FSM) | ActionProposal (FSM) | elicitation (MCP), permission request (ACP), human-in-the-loop |
| IA muda a interface | Comando de UI (`ui.navigate`…) | ação `navigate/fill_fields/focus_field` | generative UI / frontend tools (AG-UI) |
| Fluxo IA→app | eventos tipados com `seq` | eventos SSE canônicos | data stream protocol (Vercel), session/update (ACP), events (AG-UI) |
| Registro auditável | Traço de Execução | ExecutionTrace / tool-results | — |
| Gravidade da ação | Classe de Risco (8 níveis; 2 impl.) | RiskLevel + requires_confirmation | — |

## 5. O que as duas bases ensinam (síntese para os capítulos)

1. **Duas direções, um protocolo**: app→IA é *descrição* (contexto + capacidades declaradas); IA→app é *streaming de eventos tipados* (conteúdo + intenções de ação). Nenhuma das bases deixa a IA tocar a UI diretamente.
2. **SSE sobre POST venceu WebSocket** nas duas bases, com mecanismos complementares (ghdaru: `seq`+replay; nexxussai: cancelamento cooperativo) — um capítulo pode compor os dois.
3. **Declarativo, nunca DOM**: ambas rejeitaram explicitamente scraping/cliques simulados (ghdaru: Constituição P.IV; nexxussai: `research.md` decisão formal).
4. **Confirmação humana é parte do protocolo**, não da UI: FSM com estados e transições validadas em código nas duas bases; nexxussai adiciona `idempotency_key` e `context_hash` (a tela mudou entre proposta e confirmação?) — refinamentos exportáveis.
5. **Autorização fora do LLM** nas duas (capabilities/política server-side) — o modelo propõe, a política dispõe.
6. **A mesma lacuna dupla**: tool calling real e MCP. O protocolo de ambas está *pronto para* tools (input_schema JSON Schema no catálogo/registry) sem *usar* tools — a ponte é o assunto natural de um capítulo.
7. **Federação é a extensão natural**: o ghdaru já formalizou que o contrato de integração de apps externas é o mesmo contrato da IA (manifesto + snapshot + catálogo) — tese forte para o capítulo de federação/MCP.
