# 04 — A voz da aplicação: contexto de tela

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

> **Status: estrutura aprovável (fase 1).** As seções do estado da arte estão em esqueleto (1–2 frases de intenção por H3); "O problema", a evidência do Apêndice e as fontes candidatas já estão completos. A prosa integral é a fase 2 da [spec 008](../../specs/008-cap-04-contexto-de-tela/spec.md).

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** por que, no protocolo aplicação↔harness, a aplicação se descreve ao agente — e por que as duas bases rejeitaram formalmente a alternativa (inferir a interface por DOM scraping ou screenshots).
2. **Distinguir** os três mecanismos complementares da direção app→IA (inteligência artificial): o snapshot enviado a cada mensagem, o registro de telas como fonte de verdade compartilhada e a sanitização server-side.
3. **Analisar** um snapshot de contexto real: níveis (domínio/interface/conversa), campos tipados, entidade selecionada, `context_hash` e `captured_at` — e o que fica deliberadamente de fora.
4. **Implementar** (em nível de projeto) um registro de telas espelhado front/back com marcação de sensibilidade por campo.
5. **Avaliar** um desenho de contexto de tela sob as quatro tensões: riqueza de contexto × privacidade × custo de tokens × sincronia.

## O problema

Um agente embutido numa aplicação só é útil se souber *onde o usuário está* e *o que ele está vendo*. Quando alguém pergunta "esse relatório está certo?" ao chat lateral, a resposta depende de o modelo saber qual tela está aberta, qual entidade está selecionada e quais campos estão preenchidos. Há duas rotas para esse conhecimento — e elas definem dois paradigmas incompatíveis.

A primeira rota é a **inferência**: o agente olha a interface como um humano olharia — screenshots interpretados por visão computacional, ou leitura direta do DOM (Document Object Model). É o paradigma do *computer use* ([Anthropic — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)): lento, falível e difícil de autorizar, porque o que o agente "vê" não tem contrato. A segunda rota é a **descrição**: a aplicação se descreve ao agente, num vocabulário estruturado que ela mesma define e controla.

As duas implementações-laboratório deste livro tomaram a mesma decisão, de forma independente e *formal*: a IA nunca infere a interface. No `nexxussai-monorepo`, a introspecção do DOM e o prompt hardcoded por tela foram avaliados e **rejeitados por decisão registrada** (`specs/014-chat-lateral-contexto/research.md`); no `ghdaru`, o contexto declarado em níveis é princípio constitucional não-negociável (`.specify/memory/constitution.md`, Princípio IV). A partir dessa decisão negativa, ambas construíram a mesma tríade positiva: um **snapshot** que viaja com cada mensagem, um **registro de telas** compartilhado entre frontend e backend, e uma **sanitização server-side** que garante que o que é sensível nunca chega ao modelo.

Resolver o problema por descrição, porém, cria um problema novo: *o que* descrever, *quanto* e *quando*. O capítulo inteiro se move dentro de quatro restrições em tensão:

- **Riqueza de contexto** — quanto mais a aplicação conta, melhores as respostas e mais precisas as propostas de ação; um snapshot que envia só o identificador da tela (o estado atual do cliente `ghdaru`, lacuna declarada) limita o agente a generalidades.
- **Privacidade** — a tela contém tokens, senhas, dados pessoais; nada disso pode atravessar a fronteira para o modelo, e a garantia precisa ser da *plataforma* (server-side), não da boa vontade de cada tela. (O modelo de ameaça completo — prompt injection, separação de camadas — é assunto do capítulo 07; aqui a sanitização aparece como propriedade do snapshot.)
- **Custo de tokens** — o snapshot viaja a cada mensagem: cada byte custa janela de contexto e dinheiro; o `nexxussai-monorepo` fixa um teto de payload (alvo < 32 KB — quilobytes) e um schema fechado (`additionalProperties: false`) exatamente por isso.
- **Sincronia** — a tela muda entre a captura e a resposta do agente; sem `captured_at` e sem um hash do contexto (`context_hash`), a aplicação não consegue detectar que uma proposta de ação foi feita sobre uma tela que já não existe.

Um bom protocolo de contexto de tela é o equilíbrio explícito entre essas quatro forças — e, como mostra a seção de indústria, é um equilíbrio que nenhum protocolo externo padronizou até a data de captura deste capítulo.

## Fundamentos científicos

**Este capítulo ainda não tem fonte científica validada (✓) na [bibliografia](../bibliografia.md).** As candidatas abaixo estão em processo de validação (⏳, ver `estudos/candidatos-bibliografia.md`) e não sustentam afirmações do corpo:

- ⏳ **GUI Agents: A Survey** ([arXiv 2412.13501](https://arxiv.org/abs/2412.13501)) e ⏳ **Large Language Model-Brained GUI Agents** ([arXiv 2411.18279](https://arxiv.org/abs/2411.18279)) — mapeiam o paradigma "pixels + cliques" e o problema de *grounding* de elementos de tela, exatamente o problema que um contexto de tela declarado pela aplicação elimina por construção. Candidatas a base do contraste inferência × descrição.
- ⏳ **Indirect Prompt Injection** ([arXiv 2302.12173](https://arxiv.org/abs/2302.12173)) — todo conteúdo que a aplicação envia ao modelo é canal de ataque; pertinente aqui apenas como motivação da sanitização (o desenvolvimento é do capítulo 07).

## Fontes da indústria

Fichas candidatas (URLs verificadas em `estudos/panorama-industria.md`, captura 2026-07-30):

- **[AG-UI — Agent-User Interaction Protocol, eventos de estado](https://docs.ag-ui.com/concepts/events)**: o protocolo aberto mais próximo do tema oferece `StateSnapshot` e `StateDelta` (delta em JSON Patch, RFC 6902 — Request for Comments) para sincronizar estado app↔agente — mas o conteúdo do estado é **genérico e não normatizado**: não há vocabulário de tela, campos ou sensibilidade. Tradução para decisão: adote o par snapshot/delta como mecânica, mas o vocabulário do *conteúdo* você terá de definir.
- **[MCP — Model Context Protocol, resources](https://modelcontextprotocol.io/specification/2025-06-18)**: resources são a primitiva do MCP para "dados que o host oferece ao modelo" — um envelope de leitura, sem semântica de tela, sem sanitização normatizada. Tradução para decisão: um snapshot de tela *cabe* num resource, mas o MCP não diz o que ele deve conter.
- **[Anthropic — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)** (anti-padrão deliberado): a própria documentação registra latência alta e erros frequentes no paradigma screenshot+clique — o contraponto que justifica a rota declarativa.
- **Constatação-chave do panorama** (`estudos/panorama-industria.md`, §Lacunas): *nenhum* dos protocolos pesquisados (AG-UI, MCP, ACP — Agent Client Protocol, Vercel AI SDK, OpenAI Apps SDK) padroniza **contexto de tela** como vocabulário próprio. É o espaço aberto que os dois laboratórios preenchem — e que este capítulo nomeia.

## O estado da arte

*(Esqueleto da fase 1 — cada H3 com a intenção da prosa da fase 2.)*

### A decisão fundadora: descrever, nunca inferir

A rejeição formal do DOM scraping nas duas bases (`nexxussai-monorepo`: `specs/014-chat-lateral-contexto/research.md`; `ghdaru`: Constituição, Princípio IV) não é detalhe de implementação — é a decisão que cria a categoria "contexto de tela" como parte do protocolo. Quem descreve controla o contrato; quem infere não tem contrato nenhum.

### O snapshot: a fotografia que viaja com cada mensagem

O mecanismo central: um objeto estruturado e imutável capturado no cliente e enviado junto com cada mensagem do usuário — no `nexxussai-monorepo`, o `ScreenContextSnapshot` com `fields` tipados, `selected_entity`, `context_hash` e `captured_at` (`apps/api/app/ai_chat/domain/entities/screen_context_snapshot.py`; captura no cliente em `apps/web/src/features/conversation/model/useScreenContext.ts`). O `context_hash` e o `captured_at` são a resposta à tensão de sincronia; o schema fechado, à de custo.

### Níveis de contexto: domínio, interface, conversa

O `ghdaru` desenha o Snapshot de Contexto em três níveis — domínio (dados do negócio), interface (tela e campos), conversa (histórico) — documentados em `docs/integration/snapshot.md`; hoje o cliente envia só `screen.id`/`route` (lacuna declarada), o que faz deste laboratório o caso de estudo do desenho *à frente* da implementação. Os níveis são a resposta à tensão riqueza × custo: cada nível tem política própria de inclusão.

### O registro de telas: fonte de verdade compartilhada

Para que o snapshot signifique o mesmo dos dois lados da fronteira, o vocabulário de telas é registrado uma vez e espelhado: no `nexxussai-monorepo`, `screen_registry_seed.py` (backend) e `screenRegistry.ts` (frontend), expostos por `GET /api/chat/screens`. O registro é o que transforma "contexto" de convenção frágil em contrato verificável — e é onde as alternativas rejeitadas (prompt hardcoded por tela, introspecção do DOM) mostram por que perderam.

### A camada semântica: objetos de interface com intenção declarada

O `ghdaru` leva o registro um passo além: cada item de tela é um `SemanticObject` com `aiActions` declaradas (`NAVIGATE|FILL_FIELDS|SUBMIT|READ`; lista vazia `[]` = objeto sensível, invisível para a IA) — 16 objetos em `apps/web/src/shared/semantic/registry.ts`. A sensibilidade vira propriedade *declarada do objeto*, não filtro a posteriori.

### Sanitização server-side: o que nunca chega ao modelo

A garantia de privacidade é da plataforma, no servidor, antes de qualquer prompt: o `ghdaru` percorre o snapshot recursivamente removendo campos que casam com `SENSITIVE_MARKERS` (`password`, `senha`, `secret`, `token`, `credential` — `apps/api/src/ghdaru_api/conversation/domain/sanitize.py`); o `nexxussai-monorepo` combina denylist (`token`, `jwt` — JSON Web Token —, `cookie`, `csrf` — Cross-Site Request Forgery — etc.), campos marcados `sensitive` no registro e a remoção de **campos desconhecidos** (`apps/api/app/ai_chat/domain/services/screen_context_sanitizer.py`). Duas estratégias, uma propriedade: o que é sensível não atravessa. (Contra *quem* essa propriedade defende é o capítulo 07.)

### O espaço aberto: o que a indústria ainda não padronizou

AG-UI tem snapshot/delta genéricos, MCP tem resources — nenhum protocolo externo diz *o que* um contexto de tela contém, como se marca sensibilidade ou como se detecta staleness (`estudos/panorama-industria.md`, §Lacunas). A convergência independente dos dois laboratórios é, até a captura deste capítulo, o melhor material disponível para nomear esse padrão.

### Leitura executiva

*(Fase 2 — parágrafo final com "o que roubar". Candidatos já visíveis: snapshot imutável com `context_hash` + `captured_at`; registro de telas espelhado com endpoint de descoberta; sensibilidade declarada no registro + sanitização server-side com remoção de campos desconhecidos; três níveis de contexto com política de inclusão por nível. Contrato de frescor: se um protocolo externo padronizar vocabulário de contexto de tela, este capítulo entra em revisão extraordinária.)*

## Verificação

1. Por que as duas bases rejeitaram a introspecção do DOM, e onde essa rejeição está *registrada* em cada uma? (Dica: uma é decisão de pesquisa em spec, a outra é princípio constitucional — objetivo 1.)
2. Um snapshot chega ao servidor com `context_hash` diferente do hash da tela sobre a qual uma proposta de ação será confirmada. Qual das quatro tensões esse mecanismo endereça, e o que a aplicação deve fazer? (Dica: a tela mudou entre captura e resposta — objetivos 3 e 5.)
3. Qual é a diferença entre marcar um campo como `sensitive` no registro de telas e removê-lo na sanitização server-side — e por que o `nexxussai-monorepo` também remove campos *desconhecidos*? (Dica: declaração × garantia; o que não está no contrato não viaja — objetivos 2 e 4.)
4. O AG-UI oferece `StateSnapshot`/`StateDelta`; por que isso *não* resolve o problema deste capítulo? (Dica: mecânica de sincronização × vocabulário do conteúdo — objetivo 5.)

---

## Apêndice — evidência por laboratório

### ghdaru

| Evidência | Path | Fato |
|---|---|---|
| Desenho do snapshot em 3 níveis | `docs/integration/snapshot.md` | Níveis domínio / interface / conversa; contrato de integração usa o mesmo snapshot que a IA. |
| Contexto declarado como princípio | `.specify/memory/constitution.md` (Princípio IV) | Contexto em 3 níveis obrigatório; separação de camadas; não-negociável. |
| Sanitização server-side | `apps/api/src/ghdaru_api/conversation/domain/sanitize.py` | `sanitize_snapshot()` recursivo; `SENSITIVE_MARKERS = ("password","senha","secret","token","credential")`. |
| Snapshot no pipeline da mensagem | `apps/api/src/ghdaru_api/conversation/application/handle_message.py` | Pipeline `mensagem → sanitize → catálogo → intenção`; snapshot entra como mensagem `system` separada e rotulada. |
| Camada Semântica de Interface | `apps/web/src/shared/semantic/registry.ts` + `types.ts` | `SemanticObject.aiActions: NAVIGATE\|FILL_FIELDS\|SUBMIT\|READ`; `[]` = sensível; 16 objetos registrados. |
| Montagem do snapshot no cliente | `apps/web/src/features/conversation/ui/ChatPanel.tsx` | Cliente monta o snapshot enviado com a mensagem. |
| Espelho TypeScript do contrato | `apps/web/src/features/conversation/domain/events.ts` | Tipo `Snapshot` espelhado no frontend. |
| Teste que fixa a sanitização | `apps/api/tests/conversation/test_conversation.py` | Sanitização coberta por teste de domínio. |

**Lacuna declarada (a lacuna que confirma a categoria):** o cliente envia hoje apenas `screen.id`/`route` — o nível interface completo do desenho de `docs/integration/snapshot.md` ainda não é populado (`estudos/fonte-base-codigo.md`, §2.5). O desenho existe e é normativo; a implementação está atrás dele.

### nexxussai-monorepo

| Evidência | Path | Fato |
|---|---|---|
| Entidade do snapshot | `apps/api/app/ai_chat/domain/entities/screen_context_snapshot.py` | `ScreenContextSnapshot` imutável: `fields` tipados, `selected_entity`, `context_hash`, `captured_at`. |
| Captura no cliente | `apps/web/src/features/conversation/model/useScreenContext.ts` | `registerScreen()` → snapshot com `contextHash` calculado e `capturedAt`. |
| Registro de telas (backend) | `apps/api/app/ai_chat/infrastructure/persistence/screen_registry_seed.py` | Telas seed: `chat`, `files`, `education-catalog`, `admin-users`. |
| Registro de telas (frontend) | `apps/web/src/features/conversation/model/screenRegistry.ts` | Registry espelhado no cliente. |
| Descoberta de telas | `specs/014-chat-lateral-contexto/contracts/chat-lateral-api.yaml` | `GET /api/chat/screens` no contrato OpenAPI do protocolo lateral. |
| Schema fechado do snapshot | `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json` | JSON Schema com `additionalProperties: false` e `context_hash`. O alvo de payload < 32 KB está em `specs/014-chat-lateral-contexto/plan.md` (Performance Goals). |
| Alternativas rejeitadas (decisão formal) | `specs/014-chat-lateral-contexto/research.md` | Prompt hardcoded por tela: rejeitado; introspecção do DOM: rejeitada. |
| Sanitizador de contexto | `apps/api/app/ai_chat/domain/services/screen_context_sanitizer.py` | Remove `token/access_token/refresh_token/password/secret/cookie/jwt/csrf`, campos `sensitive` e campos desconhecidos. |
| Snapshot no prompt | `apps/api/app/ai_chat/application/use_cases/send_lateral_message.py` | Injeta o contexto **sanitizado** como system message JSON. |
| Definição de tela como entidade | `apps/api/app/ai_chat/domain/entities/screen_definition.py` | Tela é entidade de domínio, não convenção de frontend. |

**Lacunas declaradas:** o `context_hash` já existe e é usado na confirmação de propostas, mas o ciclo completo de ação sobre a tela depende de lacunas do cap. 05 (`ActionProposalEvent` nunca emitido; frontend sem executor — `estudos/fonte-base-codigo.md`, §3.4).

### Divergências

| Dimensão | ghdaru | nexxussai-monorepo |
|---|---|---|
| Riqueza do snapshot | Desenho em 3 níveis, implementação mínima (`screen.id`/`route`) | Snapshot rico implementado (`fields`, `selected_entity`), sem o conceito de níveis |
| Sincronia | Sem hash de contexto | `context_hash` + `captured_at` + `idempotency_key` na confirmação |
| Registro | Camada Semântica no frontend (16 `SemanticObject` com `aiActions`) | Registry espelhado front/back + endpoint de descoberta |
| Sanitização | Markers por substring, recursivo | Denylist + campos `sensitive` do registro + remoção de campos desconhecidos |
| Sensibilidade | Declarada no objeto semântico (`aiActions: []`) | Declarada no campo do registro (`sensitive`) |

A composição dos dois é o snapshot "completo" que nenhum dos laboratórios tem sozinho: níveis do `ghdaru` + hash/imutabilidade do `nexxussai` + sensibilidade declarada no registro dos dois lados — matéria-prima da síntese do capítulo 11.
