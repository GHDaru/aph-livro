# Glossário

Termos do protocolo aplicação↔harness, com a equivalência entre os dois laboratórios e a indústria. Fonte: `estudos/fonte-base-codigo.md` (§4) — coluna indústria refinada conforme `estudos/panorama-industria.md`.

| Termo do livro | Definição | ghdaru | nexxussai-monorepo | Indústria |
|---|---|---|---|---|
| **Snapshot de contexto** | Descrição estruturada e sanitizada do estado da aplicação enviada à IA a cada mensagem; a IA nunca infere a UI. | Snapshot de Contexto (3 níveis: domínio/interface/conversa) | `ScreenContextSnapshot` (com `context_hash`) | state/context (AG-UI); resources (MCP) |
| **Catálogo de ações** | Inventário declarado do que a IA pode fazer; única superfície executável. | Catálogo de Ações (`ActionSpec`, com `input_schema`) | `ScreenRegistry` + `ActionKind` | tools (MCP / function calling) |
| **Evento tipado** | Unidade do fluxo IA→app: `kind` de um vocabulário fechado e versionado + payload. | `EventKind` com envelope `{seq, kind, payload}` | vocabulário SSE canônico (`text_delta`, `artifact_*`, …) | data stream parts (Vercel AI SDK); events (AG-UI); session/update (ACP) |
| **Proposta de ação** | Intenção de ação da IA que aguarda decisão (humana ou de política) antes de executar; tem máquina de estados própria. | Proposta de Ação (FSM com `awaiting_approval`) | `ActionProposal` (FSM + `idempotency_key`) | elicitation (MCP); permission request (ACP); human-in-the-loop |
| **Comando de UI** | Instrução declarativa da IA para a interface (`navigate`, `form.patch`…); nunca clique simulado ou DOM. | Comando de UI (`ui.navigate`, `session.logout`) | ações `navigate/fill_fields/focus_field` | frontend tools / generative UI |
| **Classe de risco** | Gravidade declarada de uma ação, que determina o gate (executa direto / confirma / bloqueia). | Classe de Risco (taxonomia ampliada; `read|confirm` implementadas) | `RiskLevel` + `requires_confirmation` | — (não padronizado) |
| **Traço de execução** | Registro auditável e visível de toda ação executada; sem traço, a ação é não-governada. | Traço de Execução (`action_result` obrigatório) | `ExecutionTrace` / tool-results | — (não padronizado) |
| **Sanitização de contexto** | Remoção server-side de segredos e campos sensíveis do snapshot antes do modelo. | `sanitize_snapshot()` (markers) | `ScreenContextSanitizer` (denylist + campos `sensitive`) | — |
| **Porta do modelo** | Interface única que normaliza qualquer provedor de LLM em chunks tipados. | `LlmProviderPort` (`reasoning|content|finish`) | `LLMPort` + `provider_stream_normalizer` | — (interno a cada SDK) |
| **Manifesto de aplicação** | Contrato declarativo com que uma aplicação se apresenta à fundação (identidade, telas, ações, endpoints). | Manifesto de Aplicação (`manifest.schema.json`) | — (roadmap) | app manifest (padrões de plugin) |
| **Harness** | O scaffolding que envolve o modelo de IA (loop, ferramentas, contexto); ver livro-mãe Engenharia de Harness. | — | — | agent harness |
