# 11 — Convergências: o protocolo unificado

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

> **Estágio: estrutura** (fase 1 do [GUIA-CAPITULO](../GUIA-CAPITULO.md)). "O problema" está redigido; o estado da arte está em esqueleto de H3 com as tabelas consolidadas; a prosa integral é a fase 2 (spec de continuação). Este capítulo **não introduz conteúdo novo**: ele compõe o que os capítulos 01–10 estabelecem, citando-os por número.

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** os seis elementos do núcleo do protocolo aplicação↔harness e apontar, para cada um, o capítulo que o estabelece e a evidência (laboratórios + indústria) que o sustenta.
2. **Distinguir** o que já convergiu (núcleo) do que segue aberto (as quatro lacunas nomeadas), justificando por que cada lacuna ainda não tem padrão.
3. **Decidir**, para uma aplicação que embute um agente hoje, a ordem de adoção — tool calling → slot filling → Model Context Protocol (MCP) como projeção → protocolo externo quando consolidar — e defender essa ordem pela cadeia de dependências técnicas.
4. **Avaliar** as apostas datadas do livro (E1 e E2 do [registro de expiração](../HISTORICO.md)) contra a realidade do momento da leitura, usando os critérios pontuáveis registrados.

## O problema

Dez capítulos decompuseram a fronteira entre a aplicação e a inteligência artificial (IA) embutida em mecanismos: o canal (cap. 02), o vocabulário de eventos (cap. 03), o contexto de tela (cap. 04), as ações governadas (cap. 05), os comandos de interface de usuário (UI) (cap. 06), a segurança (cap. 07), a porta do modelo (cap. 08), a federação (cap. 09) e o mercado externo (cap. 10). Cada um sustentou suas afirmações com evidência: código dos dois laboratórios e fontes primárias da indústria. Falta responder à pergunta que quem constrói hoje realmente faz: **de tudo isso, o que já pode ser tratado como núcleo estável do protocolo — e o que ainda é aposta?**

A resposta não está em nenhuma fonte isolada. As duas bases-laboratório convergiram de forma independente para a mesma topologia — vocabulários diferentes, desenho idêntico (`estudos/fonte-base-codigo.md` §1; cap. 00) — mas são apenas dois pontos de dados. Os ecossistemas externos, por sua vez, padronizam pedaços: o Agent-User Interaction Protocol (AG-UI) padroniza os eventos, o MCP a federação e o input humano com schema, o Agent Client Protocol (ACP) a permissão explícita, o Vercel AI SDK o stream tipado, os vendors a porta do modelo (cap. 10; `estudos/panorama-industria.md`). Nenhum deles cobre a fronteira inteira.

O que este capítulo faz é cruzar as fontes. Quando duas implementações sem contato entre si e cinco ecossistemas sem coordenação chegam ao mesmo desenho — proposta de ação como estado de primeira classe, autorização fora do modelo, eventos tipados em stream —, a repetição deixa de ser coincidência e vira sinal. Este capítulo formaliza o sinal em **seis afirmações** que já se pode adotar como núcleo, cada uma remetida ao capítulo que a demonstrou.

A honestidade precisa ser simétrica: nomear também o que **não** convergiu. Nenhum protocolo externo padroniza o contexto de tela — o que a aplicação envia ao agente sobre o estado da UI — e são justamente os laboratórios que têm o desenho mais completo dessa metade (`estudos/panorama-industria.md`, §"Lacunas e incertezas"; cap. 04). Classes de risco não têm taxonomia comum, o traço de execução não é interoperável, e a ponte catálogo→tools segue por atravessar nos dois laboratórios (cap. 08). Lacuna nomeada é agenda de trabalho; lacuna omitida é dogma.

As restrições em tensão são as de todo fechamento de síntese: **afirmar o núcleo cedo demais** congela dogma sobre uma fronteira em padronização ativa; **afirmar tarde demais** torna o livro inútil para quem decide agora; **esperar um spec vencedor** contradiz a evidência de que a padronização vem por composição. O formato livro vivo resolve a tensão: as afirmações deste capítulo são datadas (cabeçalho) e as previsões são pontuáveis (registro de expiração E1/E2 em [`HISTORICO.md`](../HISTORICO.md)) — quando a realidade mudar, o capítulo perde a razão em público, não em silêncio.

## Fundamentos científicos

*Nenhum paper sustenta afirmação do corpo nesta fase: todos os candidatos abaixo estão ⏳ (a validar); a validação dupla (existência + leitura crítica) e a promoção a ✓ em [`bibliografia.md`](../bibliografia.md) são trabalho da fase 2.* Por ser síntese, este capítulo herda os candidatos dos capítulos que compõe:

- **Toolformer** ([arXiv 2302.04761](https://arxiv.org/abs/2302.04761)) ⏳ — base do elemento "catálogo como interface natural" (via cap. 08): o modelo decide *quando/qual/como*, a aplicação executa.
- **ToolEmu** ([arXiv 2309.15817](https://arxiv.org/abs/2309.15817)) ⏳ — risco residual quantificado de agentes executando ações (via cap. 05): o argumento empírico da confirmação proporcional ao risco (N3).
- **τ-bench** ([arXiv 2406.12045](https://arxiv.org/abs/2406.12045)) ⏳ — inconsistência de agentes com tools + usuário + política (via caps. 05 e 08): fundamenta protocolos que distribuem controle entre app e humano.
- **Indirect prompt injection** ([arXiv 2302.12173](https://arxiv.org/abs/2302.12173)) ⏳ — a fronteira dados×instruções apagada (via cap. 07): base dos elementos N4 (autorização fora do modelo) e N6 (declarativo, nunca DOM — Document Object Model).

## Fontes da indústria

*Fichas restritas às fontes que evidenciam a **convergência**; o tratamento individual de cada protocolo é do cap. 10. URLs a revalidar na fase 2.*

- **[AG-UI Protocol — repositório oficial](https://github.com/ag-ui-protocol/ag-ui)**: o precedente externo mais próximo do protocolo completo — Server-Sent Events (SSE) como default, trincas start/content/end, estado por snapshot+delta; confirma N1 e N2, mas não padroniza contexto de tela (L1).
- **[MCP — elicitation (spec 2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)**: "pergunte ao humano com schema" com aprovação no cliente; confirma N3/N4 e é o espelho externo do slot filling (passo 2 do roadmap).
- **[ACP — Agent Client Protocol](https://kiro.dev/docs/cli/acp/)**: `session/request_permission` fora do agente + catálogo de capacidades exposto pelo cliente; confirma N1, N3 e N4 em outra fronteira (editor↔agente).
- **[Vercel AI SDK — Tool Approvals](https://ai-sdk.dev/docs/agents/tool-approvals)**: aprovação de tool como **estado do protocolo** (`approval-requested`), não como prompt; confirma N3 no ecossistema de maior adoção web.
- **[OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)**: o Open Worldwide Application Security Project dá a justificativa normativa de N4 e N5 (LLM01 Prompt Injection, LLM06 Excessive Agency) — LLM = Large Language Model.

## O estado da arte

### O núcleo comum: seis afirmações sustentadas

*[fase 2]* A seção demonstra que cada elemento do núcleo é sustentado por três fontes independentes — os dois laboratórios e ao menos um ecossistema externo — e que, portanto, adotá-lo hoje não é aposta, é estado da arte. A matriz detalhada, protocolo a protocolo, é do cap. [10](10-estado-da-arte-externo.md); aqui entra só a consolidação em uma tabela:

| # | Afirmação do núcleo | Estabelecida em | Laboratórios (nomes; paths no Apêndice e nos caps.) | Indústria (confirmação) |
|---|---|---|---|---|
| N1 | Duas direções assimétricas: a aplicação **descreve** (contexto declarado + catálogo declarado); a IA **age** por eventos tipados | caps. [01](01-fundamentos.md), [04](04-contexto-de-tela.md), [05](05-acoes-governadas.md) | Snapshot de Contexto + Catálogo de Ações (`ghdaru`); `ScreenContextSnapshot` + `ScreenRegistry` (`nexxussai-monorepo`) | [AG-UI](https://github.com/ag-ui-protocol/ag-ui) (POST app→IA, stream IA→app); [ACP](https://kiro.dev/docs/cli/acp/) (cliente expõe capacidades tipadas) |
| N2 | Streaming de eventos com **vocabulário fechado e versionado**, padrão start/delta/end, sobre SSE | caps. [02](02-transporte-sessao.md), [03](03-eventos-tipados.md) | `EventKind` + `seq`/replay (`ghdaru`); vocabulário SSE canônico + normalização multi-provider (`nexxussai-monorepo`) | [Vercel AI SDK](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) (partes start/delta/end); [Anthropic `content_block_*`](https://platform.claude.com/docs/en/build-with-claude/streaming); trincas do AG-UI |
| N3 | Toda ação **nasce proposta** e percorre uma máquina de estados (FSM — Finite State Machine) com **confirmação humana proporcional ao risco** | cap. [05](05-acoes-governadas.md) | FSM de Proposta de Ação (`ghdaru`); `ActionProposal` + `requires_confirmation` por `risk_level` (`nexxussai-monorepo`) | [ACP `session/request_permission`](https://kiro.dev/docs/cli/acp/); [Vercel `needsApproval`](https://ai-sdk.dev/docs/agents/tool-approvals); [MCP elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation); [LangGraph interrupts](https://www.assistant-ui.com/docs/runtimes/langgraph/overview) |
| N4 | **Autorização fora do modelo**: o modelo propõe, a política da aplicação dispõe | caps. [05](05-acoes-governadas.md), [07](07-seguranca.md) | capabilities/política server-side nas duas bases | [OWASP LLM06](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf); MCP (aprovação no cliente) |
| N5 | **Traço auditável de ponta a ponta**: toda proposta, decisão e execução deixa registro | caps. [05](05-acoes-governadas.md), [07](07-seguranca.md) | Traço de Execução (`ghdaru`); `idempotency_key` + `context_hash` + tool-results (`nexxussai-monorepo`) | [MCP Apps](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/) (mensagens JSON-RPC auditáveis; JSON = JavaScript Object Notation) |
| N6 | **Declarativo sempre, DOM nunca**: a IA muda a UI por comandos tipados, jamais por pixels/cliques simulados | caps. [04](04-contexto-de-tela.md), [06](06-comandos-de-ui.md) | rejeição formal de DOM scraping nas duas bases | [computer use como anti-padrão](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) (lento, falível, difícil de autorizar) |

### As lacunas nomeadas: o que ainda não convergiu

*[fase 2]* A seção argumenta que as quatro lacunas não são falhas dos laboratórios nem dos protocolos externos, mas o mapa do que a padronização ainda deve entregar — e que L4 é a alavanca das demais:

| # | Lacuna | Situação em 2026-07 | Onde o livro a demonstra |
|---|---|---|---|
| L1 | **Contexto de tela padronizado** | Nenhum protocolo externo o cobre como vocabulário próprio (AG-UI chega perto com `StateSnapshot`/`StateDelta`); os laboratórios têm o desenho mais completo (snapshot em níveis, sanitização, registry) | `estudos/panorama-industria.md` §"Lacunas e incertezas"; caps. [04](04-contexto-de-tela.md), [10](10-estado-da-arte-externo.md) |
| L2 | **Classes de risco como taxonomia padrão** | Cada base tem a sua (8 classes previstas/2 implementadas no `ghdaru`; `RiskLevel` + `requires_confirmation` no `nexxussai-monorepo`); a indústria só oferece o binário aprovar/negar | cap. [05](05-acoes-governadas.md); coluna "indústria" vazia em `estudos/fonte-base-codigo.md` §4 |
| L3 | **Traço de execução interoperável** | O traço existe por produto, sem formato comum que permita auditoria cruzada | caps. [05](05-acoes-governadas.md), [07](07-seguranca.md); `estudos/fonte-base-codigo.md` §4 |
| L4 | **Ponte catálogo→tools (tool calling)** | As duas bases têm catálogo *pronto para* tools (input schema em JSON Schema) sem *usar* tools — a mesma lacuna, espelhada; é o passo que destrava slot filling, MCP e a adoção de protocolo externo | cap. [08](08-porta-do-modelo.md); Apêndice deste capítulo |

### Roadmap de adoção para quem constrói hoje

*[fase 2]* A seção transforma núcleo + lacunas em ordem de execução, justificada por dependência técnica (cada passo pressupõe o anterior), e é deliberadamente a mesma ordem que os roadmaps internos dos dois laboratórios declaram (ver Apêndice):

1. **Tool calling** (catálogo→tools) — cap. [08](08-porta-do-modelo.md): o input schema do catálogo já é JSON Schema nas duas bases; ligá-lo à porta do modelo destrava tudo o que segue (L4).
2. **Slot filling** (coleta por schema) — cap. [06](06-comandos-de-ui.md): com tools reais, `form.patch`/`user.input.required` viram o equivalente interno da [elicitation do MCP](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation).
3. **MCP como projeção do catálogo** — cap. [09](09-federacao-composicao.md): o catálogo governado projeta-se como tools MCP sem inventar segundo protocolo (a tese de federação do `ghdaru` em `docs/integration/`).
4. **Protocolo externo quando consolidar** — cap. [10](10-estado-da-arte-externo.md): quem implementou N1–N6 mapeia 1:1 para AG-UI (ou sucessor) por adaptador; adotar antes da consolidação é trocar contrato interno estável por alvo móvel.

### O que este livro aposta

*[fase 2]* A seção fecha o livro amarrando a síntese às previsões **pontuáveis** do [registro de expiração](../HISTORICO.md) (🔵 em aberto na captura de 2026-07), que futuras edições marcarão 🟢/🟡/🔴 com evidência:

- **E1** — a fronteira app↔agente embutido não terá protocolo dominante único antes de 2027; a padronização virá **por composição** (eventos tipados + tools + confirmação humana), não por um spec vencedor. É o corolário direto do núcleo N1–N6 existir *entre* protocolos, não *em* um deles.
- **E2** — as duas bases-laboratório implementarão tool calling real (catálogo→tools) antes de adotarem qualquer protocolo externo de UI. É o corolário do roadmap: o passo 1 destrava os demais, e os roadmaps internos dos dois laboratórios (Apêndice) já apontam nessa ordem.

### Leitura executiva

*[rascunho — fase 2]* O que roubar deste capítulo: o **núcleo de seis afirmações como checklist de desenho** — quem constrói a fronteira app↔IA hoje pode adotar N1–N6 sem esperar padronização, porque dois laboratórios independentes e cinco ecossistemas externos já convergiram para eles (caps. 01–10); e a **ordem do roadmap** — tool calling primeiro, porque é a lacuna (L4) que destrava slot filling, MCP e a eventual adoção de protocolo externo. O que segue aberto (L1–L3) é agenda, não impedimento: contexto de tela é a contribuição que os laboratórios têm a exportar, não a importar. *Contrato de frescor: a consolidação de um protocolo externo que padronize contexto de tela — ou a pontuação de E1/E2 no [`HISTORICO.md`](../HISTORICO.md) — invalida esta leitura e dispara revisão extraordinária.*

## Verificação

1. Enumere os seis elementos do núcleo e, para dois deles à sua escolha, aponte o capítulo que os estabelece e uma confirmação da indústria. *(Dica: a tabela de "O núcleo comum" traz as três colunas; N3 é o mais confirmado — quatro ecossistemas.)* — testa o objetivo 1.
2. Por que "contexto de tela padronizado" é lacuna (L1) se AG-UI tem `StateSnapshot`/`StateDelta`? *(Dica: estado sincronizado ≠ vocabulário próprio de descrição da UI com níveis, sanitização e registry — cap. 04 × cap. 10.)* — testa o objetivo 2.
3. Sua equipe quer "adotar AG-UI já" numa aplicação que ainda não tem tool calling. Que ordem o roadmap recomenda e com que justificativa técnica? *(Dica: qual lacuna destrava as demais, e o que significa "trocar contrato interno estável por alvo móvel"?)* — testa o objetivo 3.
4. Está lendo este capítulo depois de 2027? Pontue E1 mentalmente: houve protocolo dominante único ou composição? Que evidência você usaria para marcar 🟢 ou 🔴? *(Dica: o registro de expiração do `HISTORICO.md` define o critério; a resposta exige fonte verificável, não impressão.)* — testa o objetivo 4.

---

## Apêndice — evidência por laboratório

*Papel específico neste capítulo: consolidar o **roadmap de lacunas** de cada laboratório — a evidência de que o passo 1 do roadmap (tool calling) é o gargalo real, e a base empírica de E2. Fonte: `estudos/fonte-base-codigo.md` §2.5 e §3.4; paths verificáveis nos repositórios indicados (somente leitura).*

### ghdaru

Lacunas declaradas, em ordem de dependência:

- **Tool calling (L4)**: o `input_schema` do Catálogo de Ações (`apps/api/src/ghdaru_api/conversation/domain/catalog.py`) não vira tools; o roteador de intenção é determinístico por keywords (`apps/api/src/ghdaru_api/conversation/adapters/rule_intent.py`) e o adapter de modelo não usa function calling (`apps/api/src/ghdaru_api/ai_gateway/adapters/nemotron.py`).
- **MCP**: previsto na constituição do laboratório (Princípio VI) e o catálogo "desenhado para virar tools MCP" (`specs/001-fundacao-shell-chat/plan.md`) — zero código.
- **Slot filling**: `ui.form.patch` e `user.input.required` definidos, não implementados.
- **Federação**: handshake `ghd.*` inteiramente especificado (`docs/integration/manifesto-aplicacao.md`, `docs/integration/manifest.schema.json`) sem código.
- **Risco (L2)**: das 8 classes previstas, só `read|confirm` implementadas (`RiskClass` em `apps/api/src/ghdaru_api/conversation/domain/models.py`).
- **Contexto (L1)**: snapshot nível interface incompleto — hoje só `screen.id`/`route`.
- Divergência de nomenclatura constituição (`ToolCallRequest/Confirmation/Response`) × código (`action_proposal`/`action_result`).

### nexxussai-monorepo

Lacunas declaradas, em ordem de dependência:

- **Tool calling (L4)**: a porta atual só faz `complete/stream` de strings, sem `tools` (`apps/api/app/ai_orchestration/infrastructure/llm/llm_port.py`); `CompletionRequest.tools` existe apenas na especificação `docs/backend-ai-chat-interface.md`.
- **Proposta sem emissor**: `ActionProposalEvent` definido (`apps/api/app/ai_chat/domain/value_objects/stream_event.py`), com entidade, persistência e endpoints — mas nunca emitido pelo backend (falta o use case `ProposeAction`).
- **Execução no frontend**: o cliente confirma propostas (`apps/web/src/features/conversation/api/lateralChatService.ts`) mas não as executa (sem `ActionExecutionAdapter`).
- **MCP**: só superfície — protótipo isolado em `apps/api/app/mcp/server.py`, desconectado da aplicação.
- **Autorização (N4 pendente de fechar)**: `_DefaultPermissionPolicy` sempre-True em `apps/api/app/ai_chat/infrastructure/http/lateral_chat_router.py`.
- Testes T061–T065 abertos em `specs/014-chat-lateral-contexto/tasks.md`; roadmap declarado em `docs/proposta-chat-lateral.md` (Fase 4 = tool calling real; Fase 6 = telas como tools MCP).

### Divergências

A convergência final é a das **ausências**: os dois laboratórios têm exatamente a mesma lacuna dupla (tool calling real + MCP) apesar de vocabulários e stacks distintos (`estudos/fonte-base-codigo.md` §1 e §5.6) — evidência de que a ponte catálogo→tools é gargalo estrutural da categoria, não acidente de um produto. Divergem no que vem *depois*: o `ghdaru` já formalizou a federação por manifesto (`docs/integration/`) sem código; o `nexxussai-monorepo` a deixou como fase de roadmap (`docs/proposta-chat-lateral.md`, Fase 6) — os dois caminhos desembocam no mesmo passo 3 do roadmap deste capítulo, o que sustenta a ordem apostada em E2.
