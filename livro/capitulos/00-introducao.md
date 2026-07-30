# 00 — Introdução: a fronteira aplicação↔IA

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

> **Fase da spec 004: estrutura.** As seções de estado da arte abaixo estão em esqueleto (o que cada uma demonstrará); a prosa integral é a fase 2.

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** a tese central do livro: existe um protocolo natural na fronteira entre a aplicação de produto e o agente de inteligência artificial (IA) embutido nela — "a aplicação conversando com a IA, e a IA conversando com a aplicação".
2. **Distinguir** as duas direções do protocolo: app→IA (a aplicação *se descreve* — contexto de tela + capacidades declaradas) e IA→app (a IA *age* — stream de eventos tipados, propostas de ação, comandos de interface de usuário — UI).
3. **Avaliar** por que a convergência independente de duas bases de código (`ghdaru` e `nexxussai-monorepo`) — vocabulários diferentes, topologia idêntica — constitui evidência empírica de um protocolo natural, e o que o panorama externo (AG-UI, MCP Apps, ACP, Vercel AI SDK) confirma e o que deixa em aberto.
4. **Decidir** onde encontrar cada assunto: que capítulo (01–11) trata de cada mecanismo do protocolo, e o que pertence ao livro-mãe [Engenharia de Harness](https://github.com/GHDaru/harness_engineering) (caps. 13, 15 e 17) em vez de a este livro.

## O problema

Toda aplicação de produto está ganhando um agente de IA embutido. O chat deixou de ser um widget de suporte no canto da tela para virar uma interface transversal: o usuário espera que ele *saiba* o que está na tela ("resume esta lista", "o que significa este erro?") e que *aja* sobre a aplicação ("preenche o formulário", "me leva para o cadastro de usuários"). No momento em que essas duas expectativas se tornam requisito, surge uma pergunta de engenharia que a maioria dos times responde improvisando: **como a aplicação e o agente conversam?**

Duas respostas ingênuas dominam a prática. A primeira é deixar o modelo *ver* a interface — screenshots, scraping de DOM (Document Object Model) — e *operá-la* como um humano, clicando e digitando. É o paradigma do *computer use*, e a própria documentação de quem o oferece registra latência alta, erros frequentes e restrições de resolução ([Anthropic — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)); os dois laboratórios deste livro o rejeitaram formalmente ("nunca DOM scraping": decisão registrada em `specs/014-chat-lateral-contexto/research.md` do `nexxussai-monorepo`; separação de camadas como princípio não-negociável em `.specify/memory/constitution.md`, Princípio IV, do `ghdaru`). A segunda resposta é a cola ad hoc: cada feature inventa seu próprio endpoint, seu próprio formato de evento, sua própria regra de confirmação. Funciona no primeiro caso de uso e desmorona no terceiro — a segurança fica espalhada, o vocabulário fragmenta, e nenhum agente novo consegue ser plugado sem reescrever a integração.

A tese deste livro é que existe uma terceira resposta, e que ela não precisa ser inventada — precisa ser *nomeada*, porque já foi descoberta. Há um **protocolo natural** com duas direções assimétricas. Na direção app→IA, a aplicação **se descreve**: envia um retrato estruturado e sanitizado do estado da tela (o Snapshot de Contexto do `ghdaru`, em `apps/api/src/ghdaru_api/conversation/domain/sanitize.py` e `docs/integration/snapshot.md`; o `ScreenContextSnapshot` do `nexxussai-monorepo`, em `apps/api/app/ai_chat/domain/entities/screen_context_snapshot.py`) e declara o inventário fechado do que a IA pode fazer (o Catálogo de Ações em `apps/api/src/ghdaru_api/conversation/domain/catalog.py` do `ghdaru`; o `ScreenRegistry` em `apps/api/app/ai_chat/infrastructure/persistence/screen_registry_seed.py` do `nexxussai-monorepo`). Na direção IA→app, a IA **fala por eventos tipados** em streaming — conteúdo, raciocínio, propostas de ação que aguardam confirmação humana, comandos declarativos de UI — nunca tocando a interface diretamente.

A evidência empírica que sustenta essa tese é o fato central deste livro: **duas bases de código, desenvolvidas de forma independente, convergiram para essa mesma topologia com vocabulários diferentes**. Onde o `ghdaru` diz `thought, content, action_proposal, ui_command` (`apps/api/src/ghdaru_api/conversation/domain/models.py`), o `nexxussai-monorepo` diz `text_delta, thinking_delta, tool_call, action_proposal` (`apps/api/app/ai_chat/domain/value_objects/stream_event.py`). Os nomes divergem — o que descarta cópia — mas a estrutura é a mesma: duas direções, eventos tipados sobre Server-Sent Events (SSE), contexto declarado (nunca inferido do DOM), ações governadas por proposta + confirmação, autorização fora do LLM (Large Language Model). Quando dois times chegam ao mesmo desenho sem se falar, o desenho provavelmente não é uma escolha de estilo: é a forma da fronteira.

O mercado ataca exatamente essa fronteira — o AG-UI (Agent–User Interaction Protocol) padroniza eventos agente↔frontend ([github.com/ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)), o MCP (Model Context Protocol) ganhou extensão oficial de UI ([MCP Apps](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)), o ACP (Agent Client Protocol) formaliza a conversa editor↔agente ([python-sdk](https://agentclientprotocol.github.io/python-sdk/)), o Vercel AI SDK impôs um formato de stream tipado de fato ([stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)) — mas ainda não padronizou o conjunto: em particular, **nenhum protocolo externo pesquisado padroniza contexto de tela** como vocabulário próprio (lacuna registrada em `estudos/panorama-industria.md`, seção "Lacunas e incertezas"). O espaço entre o que as duas bases descobriram e o que a indústria já normatizou é o assunto deste livro.

O protocolo vive sob restrições em tensão, que reaparecem capítulo a capítulo: **riqueza de contexto × privacidade × custo de tokens** (quanto da tela enviar, e sanitizado como?); **autonomia do agente × governança humana** (quando a IA pode agir sem perguntar?); **padronizar cedo × aprender com implementação** (adotar um protocolo externo ou nomear o próprio?). Este capítulo não resolve nenhuma delas — apresenta o mapa de onde cada uma é resolvida.

## Fundamentos científicos

> **Nenhuma referência validada ainda.** Os papers abaixo são candidatos herdados de `estudos/candidatos-bibliografia.md`, todos com status **⏳ (a validar)**: a validação dupla (existência + leitura crítica) e a promoção a ✓ em [`bibliografia.md`](../bibliografia.md) são trabalho da fase 2 desta spec. Até lá, nenhum deles sustenta afirmação do corpo.

- ⏳ **Toolformer** ([arXiv 2302.04761](https://arxiv.org/abs/2302.04761)) — candidato a ancestral científico do function calling: o modelo decide *quando/qual/como* chamar uma API; a aplicação executa. Base potencial para apresentar o catálogo de ações como interface natural modelo↔aplicação.
- ⏳ **Not what you've signed up for** (indirect prompt injection, [arXiv 2302.12173](https://arxiv.org/abs/2302.12173)) — candidato a fundamento do porquê a fronteira precisa de protocolo: aplicações LLM-integradas apagam a fronteira entre dados e instruções, logo tudo que a tela envia ao modelo é canal de ataque.
- ⏳ **GUI Agents: A Survey** ([arXiv 2412.13501](https://arxiv.org/abs/2412.13501)) — candidato a mapa do paradigma "pixels + cliques" que este livro contrasta com o protocolo declarativo (contraste apresentado aqui como panorama; o anti-padrão é aprofundado no cap. 07).

## Fontes da indústria

Fichas extraídas de [`estudos/panorama-industria.md`](../../estudos/panorama-industria.md) (captura 2026-07-30); aqui entram como panorama — a análise comparativa é do cap. 10.

- **[AG-UI — Agent-User Interaction Protocol](https://github.com/ag-ui-protocol/ag-ui)**: protocolo aberto orientado a eventos para conectar backends de agentes a frontends (~16+ tipos de evento, SSE como default, estado por snapshot+delta). Tradução para decisão: é o precedente mais direto da direção IA→app deste livro — um protocolo próprio deve no mínimo mapear 1:1 para suas categorias, ou adotá-lo e estender.
- **[MCP Apps — extensão oficial de UI do MCP](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)**: UI declarada como recurso (`ui://`), iframes sandboxados, mensagens auditáveis, aprovação explícita para tool calls iniciadas pela UI. Tradução para decisão: o estado da arte de generative UI federada — confirma que "template pré-declarado + dados" vence HTML livre gerado pelo modelo.
- **[ACP — Agent Client Protocol (Zed)](https://agentclientprotocol.github.io/python-sdk/)**: JSON-RPC (JavaScript Object Notation Remote Procedure Call) sobre stdio; o agente notifica por `session/update` e pede autorização por `session/request_permission` — a aprovação vive no cliente. Tradução para decisão: blueprint direto de "proposta de ação com confirmação humana" como estado de primeira classe do protocolo.
- **[Vercel AI SDK — UI Message Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)**: SSE com partes tipadas start/delta/end e aprovação de tool como estado do protocolo (`needsApproval`). Tradução para decisão: o formato de eventos tipados mais adotado no ecossistema web — compatibilidade com ele reduz o custo de adoção de qualquer protocolo novo.

## O estado da arte

*(Esqueleto da fase 1 — cada H3 indica o que a prosa da fase 2 demonstrará.)*

### As duas direções do protocolo

Apresentará a assimetria fundadora: app→IA é *descrição* (a aplicação envia contexto sanitizado e declara capacidades), IA→app é *ação mediada* (stream de eventos tipados que a aplicação interpreta e executa). Mostrará, com um payload fictício mínimo de cada direção, que nenhuma das duas bases deixa a IA tocar a UI diretamente. Remeterá: direção app→IA aos caps. 04–05; direção IA→app aos caps. 02–03 e 06.

### Sete conceitos em uma frase cada

Nomeará, sem aprofundar, os conceitos que o cap. 01 define formalmente: snapshot, catálogo, evento tipado, proposta de ação, comando de UI, classe de risco e traço de execução. Demonstrará que cada um existe nas duas bases com nomes diferentes (tabela terminológica de `estudos/fonte-base-codigo.md`, §4), preparando a linguagem ubíqua do livro.

### Convergência independente: dois laboratórios, uma topologia

Contará a origem das duas bases (`ghdaru`: chat transversal governado numa fundação multi-tenant; `nexxussai-monorepo`: chat lateral com contexto de tela numa plataforma de produto) e demonstrará a convergência pela tabela-síntese de `estudos/fonte-base-codigo.md` §1 — vocabulários diferentes, topologia idêntica, e até as *lacunas* espelhadas (tool calling real e MCP ausentes em ambas). Argumentará por que isso é evidência de protocolo natural, não coincidência.

### O mercado na mesma fronteira (panorama)

Percorrerá em um parágrafo cada AG-UI, MCP Apps, ACP e Vercel AI SDK — o suficiente para mostrar que a fronteira é real e disputada — e apontará a lacuna aberta: nenhum deles padroniza contexto de tela (registro em `estudos/panorama-industria.md`). A matriz comparativa completa e a análise por dimensão são do cap. 10; aqui entra só o panorama.

### O mapa do livro (capítulos 01–11)

Apresentará o sumário como trajeto: fundamentos (01), o canal (02), a voz da IA (03), a voz da aplicação (04), ações governadas (05), comandos de UI (06), segurança (07), a porta do modelo (08), federação (09), o mercado externo (10) e a síntese normativa (11). Cada capítulo em 1–2 frases, com a fronteira entre vizinhos conforme `livro/README.md` §"Fronteiras entre capítulos".

### A relação com o livro-mãe Engenharia de Harness

Delimitará a divisão de trabalho com o [Engenharia de Harness](https://github.com/GHDaru/harness_engineering): o cap. 13 (Interfaces) e o cap. 15 (Harness Embutido) cobrem o *interior* do harness, e o cap. 17 (Camada de Protocolos) cobre a fronteira *entre harnesses* (MCP/A2A/ACP em geral); este livro cobre a fronteira **app↔harness** — a conversa entre a aplicação de produto e o agente embutido nela. Explicará o que o leitor deve buscar lá e o que só existe aqui.

### Leitura executiva

*(Rascunho da tese — a redigir em definitivo na fase 2.)* Existe um protocolo natural entre aplicação e agente embutido, com duas direções assimétricas: a aplicação se descreve (snapshot + catálogo), a IA age por eventos tipados sob confirmação humana. Duas bases de código o descobriram de forma independente — vocabulários diferentes, topologia idêntica — e quatro ecossistemas externos (AG-UI, MCP Apps, ACP, Vercel AI SDK) atacam a mesma fronteira sem ainda padronizar o conjunto; contexto de tela segue sem padrão externo. O que roubar: trate a fronteira app↔IA como protocolo de primeira classe, não como cola de feature. *Evento que invalida esta leitura: um protocolo externo padronizar contexto de tela com adoção relevante.*

## Verificação

1. Enuncie a tese central do livro em duas frases: o que existe na fronteira app↔IA e qual é a evidência empírica de que não é uma escolha de estilo? (Dica: "protocolo natural" + o que significa duas bases convergirem com vocabulários diferentes.)
2. Nas duas direções do protocolo, o que trafega de app→IA e o que trafega de IA→app? Por que nenhuma delas envolve a IA tocando o DOM? (Dica: uma direção *descreve*, a outra *age por eventos* — e o computer use é o contraexemplo.)
3. Por que vocabulários **diferentes** com topologia **idêntica** é evidência mais forte de protocolo natural do que se as duas bases usassem os mesmos nomes? (Dica: o que nomes iguais sugeririam sobre a independência das descobertas? E o que as lacunas espelhadas acrescentam?)
4. Você quer entender (a) como uma proposta de ação é confirmada, (b) como se defende de prompt injection e (c) como o MCP conversa com outros harnesses — em que capítulo deste livro, ou do livro-mãe, está cada resposta? (Dica: mapa dos capítulos + fronteira com os caps. 13/15/17 do Engenharia de Harness.)

---

## Apêndice — evidência por laboratório

Evidência de **convergência e panorama** pertinente a este capítulo, extraída de [`estudos/fonte-base-codigo.md`](../../estudos/fonte-base-codigo.md) (captura 2026-07-30). O detalhe de cada mecanismo vive nos apêndices dos caps. 02–09.

### ghdaru

- `.specify/memory/constitution.md` — Princípio IV (não-negociável) fixa o protocolo por contrato: eventos tipados SSE, FSM (máquina de estados finitos) de ação, catálogo obrigatório, contexto em 3 níveis, separação de camadas contra prompt injection, autorização fora do LLM.
- `docs/linguagem-ubiqua.md` — o vocabulário do laboratório A: *Snapshot de Contexto*, *Catálogo de Ações*, *Proposta de Ação*, *Comando de UI*, *Classe de Risco*, *Traço de Execução*, *Manifesto de Aplicação*.
- `apps/api/src/ghdaru_api/conversation/domain/models.py` — `EventKind` (`thought, content, action_proposal, action_result, citation, ui_command, finished, error`), `RiskClass`, FSM de proposta com tabela `_TRANSITIONS`.
- `apps/api/src/ghdaru_api/conversation/domain/catalog.py` — Catálogo v1 (docstring: "a IA nunca enxerga rota desabilitada"); a regra "o que não está declarado, a IA não faz" está em `docs/integration/instrucoes-construcao.md` e `docs/integration/guia-integracao.md`.
- `apps/api/src/ghdaru_api/http/chat_router.py` — transporte SSE sobre POST com `seq` + replay (`GET .../events?after=N`).
- `apps/web/src/features/conversation/domain/events.ts` + `ports/chat-port.ts` — espelho TypeScript do contrato no frontend (`ChatEvent {seq, kind, payload}`).
- `docs/adr/0003-modelos-integracao-aplicacoes.md` — decisão negativa estruturante: um protocolo de integração *separado* do snapshot/catálogo foi descartado ("duplicaria conceitos que a IA já usa") — semente do cap. 09.
- Lacunas declaradas que espelham o outro laboratório: tool calling real e servidor MCP previstos e ausentes (`specs/001-fundacao-shell-chat/plan.md`: catálogo "desenhado para virar tools MCP", zero código).

### nexxussai-monorepo

- `specs/005-backend-ai-chat/contracts/stream-events.md` — vocabulário SSE canônico documentado (`text_delta, thinking_delta, artifact_*, execution_*, tool_call, tool_result, done, error`), com regra de evolução do contrato.
- `apps/api/app/ai_chat/domain/value_objects/stream_event.py` — fonte da verdade dos eventos em código, incluindo `ActionProposalEvent` (`risk_level`, `requires_confirmation`).
- `apps/api/app/ai_chat/domain/entities/action_proposal.py` + `screen_context_snapshot.py` — FSM de proposta (`proposed → confirmed → executed`, com `cancelled|denied|expired|failed`) e snapshot de contexto de tela como entidades de domínio.
- `apps/api/app/ai_chat/infrastructure/persistence/screen_registry_seed.py` + `apps/web/src/features/conversation/model/screenRegistry.ts` — registry de telas compartilhado backend/frontend: a aplicação se descreve, a IA nunca infere a UI.
- `specs/014-chat-lateral-contexto/research.md` — decisões formais que definem a topologia: introspecção do DOM rejeitada; execução automática de tool calls rejeitada.
- `specs/014-chat-lateral-contexto/contracts/chat-lateral-api.yaml` — o protocolo com contexto de tela como OpenAPI (telas, mensagens SSE, confirmação de ações).
- Lacunas declaradas que espelham o outro laboratório: tool calling real só em spec (`docs/backend-ai-chat-interface.md`, porta `ILLMCompletion` com `tools` não implementada); MCP só superfície (`apps/api/app/mcp/server.py`, protótipo desconectado).

### Divergências

- **Vocabulário** — mesmo conceito, nomes distintos: `thought` (ghdaru) × `thinking_delta` (nexxussai); `ui_command` (ghdaru) × ações `navigate/fill_fields/focus_field` (nexxussai, `apps/api/app/ai_chat/domain/value_objects/action_kind.py`). A divergência é a evidência de descoberta independente.
- **Refinamentos únicos de cada lado** — ghdaru formalizou federação (manifesto + handshake em `docs/integration/manifesto-aplicacao.md`, sem código); nexxussai adicionou `idempotency_key` e `context_hash` à confirmação (`apps/web/src/features/conversation/api/lateralChatService.ts`, `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json`) — refinamentos exportáveis um para o outro, tratados nos caps. 05 e 09.
