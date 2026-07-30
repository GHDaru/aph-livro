# Panorama da indústria — Protocolo de Comunicação Aplicação ↔ Harness

**Estado da arte capturado em 2026-07.** Data da pesquisa: **2026-07-30**.

**Escopo:** protocolos e frameworks que governam a fronteira entre uma aplicação de
produto (web app) e o agente de IA embutido nela — streaming de eventos tipados,
contexto de tela, catálogo de ações / tool calling, propostas de ação com confirmação
humana, comandos de UI declarativos, generative UI, segurança (prompt injection,
autorização fora do LLM) e federação (MCP como superfície). Fontes: docs oficiais,
specs, repositórios e anúncios verificados via web em 2026-07-30. Afirmações não
verificadas em fonte primária estão marcadas com ⏳.

---

## 1. Fronteira agente ↔ UI (protocolos dedicados)

### [AG-UI — Agent-User Interaction Protocol (CopilotKit)](https://github.com/ag-ui-protocol/ag-ui)

- Protocolo aberto, orientado a eventos, para conectar backends de agentes a
  frontends; o repositório declara "~16 standard event types" e transporte agnóstico:
  "Works with any event transport (SSE, WebSockets, webhooks, etc.)". Na prática de
  referência (CopilotKit), o frontend faz um HTTP POST com o input/estado e consome
  um stream SSE de eventos tipados ([CopilotKit — AG-UI Protocol](https://www.copilotkit.ai/blog/ag-ui-protocol-bridging-agents-to-any-front-end)).
- Vocabulário de eventos (nomes exatos, capturados em 2026-07-30 de
  [docs.ag-ui.com/concepts/events](https://docs.ag-ui.com/concepts/events)):
  - *Lifecycle*: `RunStarted`, `RunFinished`, `RunError`, `StepStarted`, `StepFinished`
  - *Text message*: `TextMessageStart`, `TextMessageContent`, `TextMessageEnd` (+ `TextMessageChunk` de conveniência)
  - *Tool call*: `ToolCallStart`, `ToolCallArgs`, `ToolCallEnd`, `ToolCallResult` (+ `ToolCallChunk`)
  - *State*: `StateSnapshot`, `StateDelta` (JSON Patch, RFC 6902), `MessagesSnapshot`
  - *Activity*: `ActivitySnapshot`, `ActivityDelta`
  - *Reasoning*: `ReasoningStart/End`, `ReasoningMessageStart/Content/End`, `ReasoningEncryptedValue`
  - *Special*: `Raw` (pass-through de sistemas externos), `Custom`
- Features declaradas no repositório: streaming de chat em tempo real, sincronização
  **bidirecional** de estado, generative UI e mensagens estruturadas, enriquecimento
  de contexto em tempo real, integração de *frontend tools* e colaboração
  human-in-the-loop ([README](https://github.com/ag-ui-protocol/ag-ui)).
- Parcerias listadas no repositório: LangGraph, CrewAI, Microsoft Agent Framework,
  Google ADK, AWS Strands Agents, Mastra, Pydantic AI, Agno, LlamaIndex, AG2;
  integrações de comunidade incluem Claude Agent SDK e Langroid. Adoção no GitHub em
  2026-07-30: ~15,1k stars / 1,4k forks ([repo](https://github.com/ag-ui-protocol/ag-ui)).
- A Microsoft documenta integração oficial AG-UI no Agent Framework
  ([Microsoft Learn](https://learn.microsoft.com/en-us/agent-framework/integrations/ag-ui/)).
- Eventos validados com schemas Zod para type safety em toda a stack
  ([CopilotKit docs](https://docs.copilotkit.ai/built-in-agent/ag-ui)).
- **Tradução para decisão:** AG-UI é o precedente mais direto do que o livro chama de
  "aplicação conversando com a IA": confirma que a indústria convergiu para (a) SSE
  como transporte default, (b) trincas `Start/Content(Args)/End` por bloco, (c) estado
  sincronizado por snapshot + delta (JSON Patch), e (d) `Custom`/`Raw` como válvula de
  escape. Um protocolo próprio deve, no mínimo, mapear 1:1 para essas categorias — ou
  adotar AG-UI e estender.

### [ACP — Agent Client Protocol (Zed Industries)](https://agentclientprotocol.github.io/python-sdk/)

- Padrão aberto publicado pela Zed Industries em agosto de 2025 para comunicação
  editor ↔ coding agent; aplica o modelo do LSP a agentes: qualquer agente ACP roda
  em qualquer editor ACP ([Morph — ACP explained](https://www.morphllm.com/agent-client-protocol);
  [Kiro docs — ACP](https://kiro.dev/docs/cli/acp/)).
- Transporte: JSON-RPC 2.0 sobre stdin/stdout (JSON delimitado por linha), com o
  editor tipicamente spawnando o agente como subprocesso
  ([Kiro docs](https://kiro.dev/docs/cli/acp/)).
- O agente envia notificações `session/update` (mensagens, tool calls, progresso) e
  pede autorização para operações sensíveis via `session/request_permission` — a
  aprovação fica no cliente/humano, não no agente
  ([DeepWiki — zed ACP](https://deepwiki.com/zed-industries/zed/8.2-acp-protocol-and-connection);
  [Agentic AI KB — ACP](https://agentic-ai.readthedocs.io/en/latest/Standards/agent-client-protocol/)).
- O cliente expõe primitivas que o agente chama de volta: `fs/read_text_file`,
  `fs/write_text_file`, `terminal/create`, `terminal/output`, `terminal/kill` etc. —
  ou seja, a "aplicação" (editor) é um provedor de capacidades tipadas para o agente
  ([DeepWiki — opencode ACP](https://deepwiki.com/sst/opencode/7.4-agent-client-protocol-(acp))).
- Adotado por múltiplos clientes/agentes além do Zed (JetBrains, Neovim, opencode,
  Kiro; pedidos de suporte em projetos como hermes-agent)
  ([issue NousResearch/hermes-agent#569](https://github.com/NousResearch/hermes-agent/issues/569)).
- **Tradução para decisão:** ACP demonstra o padrão simétrico que interessa ao livro:
  a aplicação oferece um *catálogo de capacidades* que o agente invoca, e toda ação
  sensível passa por um request de permissão explícito, tipado, fora do LLM. O par
  `session/update` (fluxo IA→app) + `session/request_permission` (proposta com
  confirmação humana) é um blueprint direto para "proposta de ação com confirmação".

### [A2A — Agent2Agent Protocol (Google → Linux Foundation)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)

*(apenas para posicionar a fronteira — não é o foco do livro)*

- Lançado pela Google em abril de 2025 (Apache-2.0), hoje governado pela Linux
  Foundation; padroniza comunicação **agente↔agente** entre organizações/vendors
  ([Wikipedia — Agent2Agent](https://en.wikipedia.org/wiki/Agent2Agent);
  [Google Cloud Blog — upgrade do A2A](https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-um-upgrade) ⏳ URL exata do post de upgrade: ver [versão indexada](https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade)).
- Primitivas: **Agent Card** (JSON de capacidades em `/.well-known/agent.json`),
  **Task** (com ciclo de vida pending/in-progress/completed/failed), **Message** com
  *Parts* multimodais, **Artifact** (saída da task); streaming de progresso via SSE
  ([Galileo — A2A guide](https://galileo.ai/blog/google-agent2agent-a2a-protocol-guide)).
- **Tradução para decisão:** A2A resolve outra fronteira (peer-to-peer entre agentes);
  serve ao livro como contraste: o protocolo app↔IA é assimétrico (a aplicação é
  soberana), enquanto A2A é simétrico. Vale emprestar o conceito de *card* de
  capacidades descobrível e o ciclo de vida explícito de task.

---

## 2. Fronteira host ↔ servidor de contexto (MCP e suas extensões de UI)

### [MCP — Elicitation e Sampling (spec 2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)

- A revisão 2025-06-18 do MCP adicionou *structured tool output*, **elicitation**
  (servidor pede input adicional ao usuário) e *resource links* em resultados de
  tools ([timeline de versões do MCP](https://hidekazu-konishi.com/entry/mcp_specification_version_timeline.html)).
- Elicitation: o servidor envia um request com JSON Schema; o cliente apresenta um
  formulário/prompt ao usuário e devolve dados validados. A spec não manda um modelo
  de interação específico, mas exige que o cliente deixe claro *o que* está sendo
  pedido e *por quê* ([spec — elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)).
- Sampling é o dual: o servidor pede ao **cliente** que consulte o LLM (o cliente
  mantém controle sobre modelo e aprovação) — "sampling asks the LLM, elicitation
  asks the human" ([Memgraph — elicitation & sampling](https://memgraph.com/blog/memgraph-mcp-elicitation-and-sampling)).
- Em 2026-07-28 o projeto publicou o *release candidate* da próxima versão da spec
  ([MCP Blog — 2026-07-28 RC](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)).
- **Tradução para decisão:** o MCP já normatizou dois movimentos que o protocolo
  app↔IA precisa: (1) "pergunte ao humano com schema" (elicitation = proposta de
  input estruturado, renderizada pela aplicação, não pelo modelo) e (2) inversão de
  controle mantendo autorização no cliente. A fronteira de federação do livro deve
  tratar o app como *host MCP*: elicitation/sampling chegam "de fora" e caem no mesmo
  funil de confirmação humana do protocolo interno.

### [MCP Apps — extensão oficial de UI (SEP-1865)](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)

- Anunciada em 2025-11-21 como extensão **opcional e retrocompatível** do MCP para
  servidores entregarem interfaces interativas a hosts; escrita em conjunto por core
  maintainers da OpenAI e da Anthropic com os criadores do MCP-UI — unifica MCP-UI e
  Apps SDK num padrão único ([Inkeep — Anthropic e OpenAI juntas](https://inkeep.com/blog/anthropic-openai-mcp-apps-extension)).
- Mecânica: recursos de UI declarados com URI scheme `ui://`, associados a tools via
  `_meta.ui/resourceUri`; conteúdo inicial só `text/html`, renderizado em **iframes
  sandboxados**; comunicação UI↔host reutiliza o JSON-RPC do MCP via `postMessage`
  ([spec 2026-01-26 — apps.mdx](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)).
- Segurança em camadas: sandbox de iframe, templates pré-declarados revisáveis,
  mensagens JSON-RPC auditáveis e aprovação explícita do usuário para chamadas de
  tools iniciadas pela UI ([MCP Blog](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)).
- Claude passou a suportar MCP Apps em 2026-01-26, com nove parceiros de lançamento
  (Amplitude, Asana, Box, Canva, Clay, Figma, Hex, monday.com, Slack)
  ([The Register, 2026-01-26](https://theregister.com/2026/01/26/claude_mcp_apps_arrives)).
- **Tradução para decisão:** MCP Apps é o estado da arte de "generative UI federada":
  UI declarada como recurso + canal de mensagens auditável + tool calls da UI sujeitas
  a aprovação. Para o livro: se a aplicação um dia hospedar UIs de terceiros, o
  desenho já existe; e mesmo internamente, o padrão "template pré-declarado + dados"
  é mais seguro que HTML gerado livremente pelo modelo.

### [MCP-UI — projeto comunitário precursor](https://github.com/idosal/mcp-ui)

- SDK (cliente e servidor) que definiu o `UIResource` com três MIME types:
  `text/html` (inline), `text/uri-list` (URL externa) e
  `application/vnd.mcp-ui.remote-dom` (Remote DOM da Shopify, renderizado com os
  componentes do próprio host) ([DeepWiki — idosal/mcp-ui](https://deepwiki.com/idosal/mcp-ui)).
- Do iframe para o host fluem *intents* tipados via `postMessage`: `tool`, `intent`,
  `prompt`, `notify`, `link` — a UI **pede**, o host **decide e executa**
  ([WorkOS — MCP-UI technical overview](https://workos.com/blog/mcp-ui-a-technical-deep-dive-into-interactive-agent-interfaces)).
- Reconhecido pelo blog oficial do MCP como uma das duas fontes (com o Apps SDK) que
  a extensão MCP Apps formaliza ([MCP Blog](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)).
- **Tradução para decisão:** o vocabulário de intents do MCP-UI (`tool`, `prompt`,
  `link`, `notify`) é uma taxonomia mínima e comprovada para "comandos de UI
  declarativos" emitidos por conteúdo não confiável — o host permanece o único
  executor. O Remote DOM mostra a alternativa a iframes quando se quer look-and-feel
  nativo.

---

## 3. Frameworks de chat-in-app e streaming tipado

### [Vercel AI SDK — UI Message Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)

- O *data stream protocol* usa SSE; backends custom sinalizam com o header
  `x-vercel-ai-ui-message-stream: v1`; o stream termina com marcador `[DONE]`
  ([docs — stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)).
- Partes tipadas com padrão start/delta/end e IDs por bloco: texto (`text-delta`),
  reasoning, *source parts* (referências a URLs/documentos), tool parts, além de
  *data parts* customizadas — consumidas por `useChat`/`useCompletion`; no servidor,
  `streamText` → `toUIMessageStream` → `createUIMessageStreamResponse`
  ([docs — stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol);
  [Vercel — AI SDK 5](https://vercel.com/blog/ai-sdk-5)).
- Generative UI via RSC (`streamUI`): o desenvolvimento do AI SDK RSC está **pausado**
  e a Vercel recomenda AI SDK UI para produção; a API `render` foi removida
  ([referência — render (Removed)](https://ai-sdk.dev/docs/reference/ai-sdk-rsc/render)).
- Human-in-the-loop nativo: tools com `needsApproval: true` param no estado
  `approval-requested`; o frontend renderiza aprovar/negar e responde com
  `addToolApprovalResponse` do `useChat`
  ([docs — Tool Approvals](https://ai-sdk.dev/docs/agents/tool-approvals);
  [cookbook — Human-in-the-Loop](https://ai-sdk.dev/cookbook/next/human-in-the-loop)).
- **Tradução para decisão:** é o formato de eventos tipados mais adotado no
  ecossistema web/TypeScript e prova três escolhas: SSE + partes tipadas com id/start/
  delta/end; *data parts* como extensão tipada para payloads da aplicação; e
  aprovação de tool como **estado do protocolo** (não como prompt). O recuo do RSC
  streamUI sugere: generative UI em produção = componentes do app renderizando dados
  estruturados, não componentes serializados pelo servidor.

### [assistant-ui + LangGraph `useStream`](https://www.assistant-ui.com/docs/runtimes/langgraph/overview)

- assistant-ui é um framework de chat UI para React; o runtime LangGraph traz
  streaming, eventos de subgrafos, *UI messages*, interrupts, metadata e cancelamento
  end-to-end, integrando com `@langchain/langgraph-sdk`
  ([docs — LangGraph runtime](https://www.assistant-ui.com/docs/runtimes/langgraph/overview);
  [docs — streaming](https://www.assistant-ui.com/docs/runtimes/langgraph/streaming)).
- O LangGraph emite um stream rico: chunks de mensagem, eventos de subgrafo, UI
  messages customizadas, erros e metadata; hooks como `useStream`/`useTypedStream`
  reagem a cada tipo ([LangChain — frontend overview](https://docs.langchain.com/oss/python/langchain/frontend/overview)).
- A LangChain mantém o `agent-chat-ui`, web app de referência para conversar com
  qualquer agente LangGraph ([GitHub — agent-chat-ui](https://github.com/langchain-ai/agent-chat-ui)).
- *Interrupts* do LangGraph são o mecanismo de pausa para input/aprovação humana
  exposto na UI ([docs — LangGraph runtime](https://www.assistant-ui.com/docs/runtimes/langgraph/overview)).
- **Tradução para decisão:** confirma o padrão "grafo no servidor, projeção tipada no
  cliente" e mostra que *interrupt/resume* é a formalização de human-in-the-loop no
  nível da orquestração — o protocolo app↔IA precisa de um evento de interrupção que
  carregue payload estruturado e de um caminho de retomada.

### [LlamaIndex chat-ui](https://github.com/run-llama/chat-ui)

- Componentes React de chat para apps LLM (message bubbles, input, widgets custom
  para documentos gerados/recuperados), estilizados com Tailwind/shadcn e instaláveis
  via shadcn CLI ([README](https://github.com/run-llama/chat-ui/blob/main/README.md);
  [ui.llamaindex.ai](https://ui.llamaindex.ai/)).
- Integra-se ao backend "conectando o `ChatSection` ao hook `useChat` do vercel/ai" —
  ou seja, adota o UI Message Stream da Vercel como protocolo de fato
  ([README](https://github.com/run-llama/chat-ui/blob/main/README.md)).
- **Tradução para decisão:** evidência de consolidação: até frameworks concorrentes
  tratam o stream protocol da Vercel como *lingua franca* do chat-in-app. Compatibilidade
  com ele (nativa ou por adaptador) reduz custo de adoção de qualquer protocolo novo.

---

## 4. Plataformas dos vendors (OpenAI e Anthropic)

### [OpenAI — Apps SDK + ChatKit](https://developers.openai.com/apps-sdk/reference)

- Apps SDK (preview) permite apps que rodam **dentro** do ChatGPT; é construído sobre
  MCP, "estendendo o MCP para que apps rodem em qualquer lugar que adote o padrão"
  ([OpenAI — Introducing apps in ChatGPT](https://openai.com/index/introducing-apps-in-chatgpt/)).
- Widgets são renderizados inline no chat; a ponte de comunicação é a API
  `window.openai`: `toolOutput` (dados estruturados da tool), `callTool` (widget
  invoca tool MCP), `sendFollowUpMessage` (widget "fala" com o modelo),
  `setWidgetState` (estado persistido que viaja na conversa)
  ([exemplos oficiais](https://github.com/openai/openai-apps-sdk-examples);
  [DeepWiki — window.openai reference](https://deepwiki.com/openai/openai-apps-sdk-examples/4.2-window.openai-api-reference)).
- ChatKit é o kit de UI de chat embarcável da OpenAI (widgets: cards, forms, charts)
  ([ChatKit guide](https://developers.openai.com/api/docs/guides/chatkit)).
- Realtime API (interface GA; header beta `OpenAI-Beta: realtime=v1` descontinuado):
  sessões bidirecionais de áudio+texto sobre WebRTC (browser, com data channel para
  eventos) ou WebSocket (server); eventos JSON para function calls, session updates e
  controle (commit/cancel/stop)
  ([Realtime guide](https://developers.openai.com/api/docs/guides/realtime);
  [Realtime WebSocket](https://platform.openai.com/docs/guides/realtime-websocket)).
- **Tradução para decisão:** o `window.openai` é o contrato widget↔host mais maduro em
  produção: quatro verbos cobrem leitura de dados, ação, fala e estado — um bom teste
  de completude para o vocabulário de comandos de UI do livro. A Realtime API mostra
  que, mudando o transporte (WebRTC/WS), o desenho "eventos JSON tipados + function
  calling em canal lateral" permanece.

### [Anthropic — streaming da Messages API e tool use](https://platform.claude.com/docs/en/build-with-claude/streaming)

- O streaming da Messages API usa SSE com envelope de eventos: `message_start`,
  `content_block_start`, `content_block_delta`, `content_block_stop`,
  `message_delta`, `message_stop`, `ping`, `error`
  ([docs — streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)).
- Tool use em streaming: argumentos chegam como `input_json_delta` dentro de
  `content_block_delta`; o *fine-grained tool streaming* (header
  `fine-grained-tool-streaming-2025-05-14`) emite parâmetros sem buffering/validação
  de JSON, reduzindo latência para argumentos grandes
  ([docs — fine-grained tool streaming](https://platform.claude.com/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming)).
- Computer use (beta): o modelo devolve ações `screenshot`, `left_click`, `type`,
  `scroll` etc. sobre screenshots; a própria documentação e avaliações independentes
  registram latência alta, erros frequentes e restrições de resolução (≤ XGA/WXGA)
  ([docs — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool);
  [Anthropic — developing computer use](https://www.anthropic.com/news/developing-computer-use);
  [Simon Willison, 2024-10-22](https://simonwillison.net/2024/Oct/22/computer-use/)).
- **Tradução para decisão:** o envelope `content_block_*` é o "nível 0" sobre o qual
  qualquer protocolo app↔IA se apoia — o protocolo do app é uma *re-emissão semântica*
  desses deltas. E computer use funciona no livro como anti-padrão deliberado: pixels
  + cliques é a fronteira menos governável (lenta, falível, difícil de autorizar);
  ações declarativas tipadas com catálogo e confirmação são o contraponto.

---

## 5. Segurança e governança de ações

### [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)

- **LLM01: Prompt Injection** — manipulação direta (usuário) ou **indireta** (conteúdo
  não confiável de sites, documentos, e-mails, repositórios lidos pelo modelo);
  especialmente perigosa com RAG, plugins, tools e agentes, quando conteúdo malicioso
  é tratado como instrução confiável ([Promptfoo — OWASP LLM Top 10](https://www.promptfoo.dev/docs/red-team/owasp-llm-top-10/)).
- **LLM06: Excessive Agency** — risco de agentes agirem além do escopo pretendido;
  mitigação: least privilege nas tools, e **aprovação humana para ações de alto
  risco**, filtragem de input/output e testes adversariais contínuos
  ([Pomerium — OWASP Top 10 for LLMs](https://www.pomerium.com/blog/the-owasp-top-10-for-llms-and-how-to-defend-against-them);
  [PDF oficial v2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)).
- **Tradução para decisão:** dá a justificativa normativa para dois princípios do
  protocolo: (1) tudo que entra no contexto do modelo vindo da tela/dados é *dado*,
  nunca instrução com autoridade; (2) a autorização de ações vive na aplicação
  (catálogo + política + confirmação), jamais no prompt.

### Human-in-the-loop como feature de protocolo (padrões convergentes)

- Vercel AI SDK: `needsApproval` + estado `approval-requested` +
  `addToolApprovalResponse` ([Tool Approvals](https://ai-sdk.dev/docs/agents/tool-approvals)).
- OpenAI Agents SDK (JS): guia dedicado de human-in-the-loop com interrupção e
  retomada de execução ([openai-agents-js — HITL](https://openai.github.io/openai-agents-js/guides/human-in-the-loop/)).
- ACP: `session/request_permission` — aprovação no cliente
  ([Agentic AI KB — ACP](https://agentic-ai.readthedocs.io/en/latest/Standards/agent-client-protocol/)).
- MCP: elicitation (input humano com schema) e aprovação explícita de tool calls
  iniciadas por UIs no MCP Apps ([spec elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation);
  [MCP Blog — Apps](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)).
- **Tradução para decisão:** quatro ecossistemas independentes convergiram para o
  mesmo desenho — *proposta de ação como estado de primeira classe do protocolo*, com
  payload estruturado, decisão fora do LLM e caminho de retomada. Esse é o núcleo não
  negociável do capítulo de propostas de ação.

---

## Tabela comparativa (capturada em 2026-07-30)

| Protocolo / framework | Transporte | Vocabulário de eventos | Direção | Governança de ações (confirmação humana?) | Status de adoção |
|---|---|---|---|---|---|
| [AG-UI](https://github.com/ag-ui-protocol/ag-ui) | Agnóstico (SSE default; WS, webhooks) | ~16+ tipos: Run/Step, TextMessage*, ToolCall*, StateSnapshot/Delta, Activity*, Reasoning*, Raw/Custom | Bidirecional (POST app→IA; stream IA→app; state sync 2 vias) | Human-in-the-loop declarado como feature; frontend tools sob controle do app | ~15,1k stars; parcerias LangGraph, CrewAI, MS Agent Framework, Google ADK, AWS Strands |
| [MCP + elicitation/sampling](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation) | JSON-RPC (stdio, HTTP/SSE) | tools, resources, prompts; elicitation (form c/ JSON Schema); sampling | Bidirecional host↔servidor | Sim — cliente controla aprovação de tools, sampling e elicitation | Padrão de fato da indústria; RC de nova spec em [2026-07-28](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) |
| [MCP Apps (SEP-1865)](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx) | JSON-RPC via postMessage (iframe sandbox) | Recursos `ui://` + mensagens JSON-RPC auditáveis | UI↔host (dentro do host MCP) | Sim — aprovação explícita do usuário para tool calls da UI | Oficial (OpenAI+Anthropic); no Claude desde [2026-01-26](https://theregister.com/2026/01/26/claude_mcp_apps_arrives), 9 parceiros |
| [ACP (Zed)](https://kiro.dev/docs/cli/acp/) | JSON-RPC 2.0 sobre stdio | `session/update`, `session/request_permission`, `fs/*`, `terminal/*` | Bidirecional (agente↔editor) | Sim — `session/request_permission` no cliente | Zed, JetBrains, Neovim, opencode, Kiro |
| [Vercel AI SDK (UI Message Stream)](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) | SSE (`x-vercel-ai-ui-message-stream: v1`) | Partes start/delta/end: text, reasoning, source, tool, data parts custom; `[DONE]` | IA→app (stream); app→IA via requests + tool results/approvals | Sim — `needsApproval` / `addToolApprovalResponse` ([docs](https://ai-sdk.dev/docs/agents/tool-approvals)) | Default do ecossistema React/Next; adotado até por [LlamaIndex chat-ui](https://github.com/run-llama/chat-ui) |
| [OpenAI Apps SDK / ChatKit](https://developers.openai.com/apps-sdk/reference) | MCP + `window.openai` (postMessage no host) | `toolOutput`, `callTool`, `sendFollowUpMessage`, `setWidgetState` | Bidirecional widget↔host↔modelo | Host medeia tool calls; diretório com revisão de apps | Preview; apps no ChatGPT ([anúncio](https://openai.com/index/introducing-apps-in-chatgpt/)) |
| [OpenAI Realtime API](https://developers.openai.com/api/docs/guides/realtime) | WebRTC (data channel) ou WebSocket | Eventos JSON: sessão, áudio, function calling, controle | Bidirecional | Function calling executado pelo app (fora do modelo) | GA (interface beta aposentada) |
| [Anthropic Messages API](https://platform.claude.com/docs/en/build-with-claude/streaming) | SSE | `message_*`, `content_block_*`, `input_json_delta`, `ping`, `error` | IA→app (stream); app→IA por request | Tool use: app executa e devolve `tool_result` (execução sempre fora do modelo) | GA; base de inúmeros harnesses |
| [assistant-ui / LangGraph useStream](https://www.assistant-ui.com/docs/runtimes/langgraph/overview) | SSE/HTTP (LangGraph server) | Message chunks, subgraph events, UI messages, interrupts, metadata | Bidirecional (stream + resume) | Sim — interrupts para aprovação/input humano | assistant-ui + [agent-chat-ui](https://github.com/langchain-ai/agent-chat-ui) de referência |
| [A2A](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) | HTTP + SSE (JSON-RPC) | Agent Card, Task (lifecycle), Message/Parts, Artifact | Agente↔agente (peer) | Fora de escopo do protocolo (delegada aos agentes/hosts) | Linux Foundation; 150+ organizações ⏳ ([Stellagent](https://stellagent.ai/insights/a2a-protocol-google-agent-to-agent), fonte secundária) |

---

## Lacunas e incertezas registradas

- ⏳ A lista "~16 event types" do README do AG-UI diverge da contagem das docs (que já
  incluem Activity e Reasoning events, somando mais de 16); tratar as docs
  ([docs.ag-ui.com/concepts/events](https://docs.ag-ui.com/concepts/events)) como fonte
  canônica da enumeração.
- ⏳ Números de adoção (stars, "150+ organizações" do A2A) são instantâneos de
  2026-07-30 e/ou fontes secundárias — revalidar antes de citar no corpo do livro.
- ⏳ O site oficial do ACP (agentclientprotocol.com) não foi acessado diretamente
  nesta rodada; os detalhes de mensagens foram confirmados por SDK oficial
  ([python-sdk](https://agentclientprotocol.github.io/python-sdk/)) e docs de
  implementadores (Kiro, Zed via DeepWiki).
- Nenhum dos protocolos pesquisados padroniza **contexto de tela** (o que a aplicação
  envia ao agente sobre o estado da UI) como vocabulário próprio — AG-UI chega perto
  com `StateSnapshot`/`StateDelta` e "real-time context enrichment", e o ACP com as
  primitivas `fs/*` expostas pelo cliente. É espaço aberto que o livro pode nomear.
