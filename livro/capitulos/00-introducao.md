# 00 — Introdução: a fronteira aplicação↔IA

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

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

A ciência deste capítulo caracteriza o **paradigma que o livro contrasta**: o agente de interface gráfica de usuário (GUI, Graphical User Interface) que opera a aplicação *de fora*, por pixels e cliques. Dois surveys validados mapeiam esse campo:

- ✓ ⭐ *Large Language Model-Brained GUI Agents: A Survey* — Zhang et al. ([arXiv 2411.18279](https://arxiv.org/abs/2411.18279)) — o mapa de referência do paradigma visual: agentes que percebem a interface por screenshots e árvores de elementos, ancoram a intenção do usuário em componentes da tela e agem emulando entrada humana (cliques, digitação). O survey cataloga os desafios abertos do paradigma — ancorar (*grounding*) a intenção em uma tela que o agente só vê, latência de inferência, confiabilidade e segurança das ações. Tradução para decisão: esses custos são estruturais de operar *de fora* da aplicação, sem contrato — e são a base empírica da decisão fundadora dos dois laboratórios: mover a fronteira para *dentro*, onde a aplicação se descreve e declara ações tipadas, e o problema de grounding desaparece por construção.
- ✓ *GUI Agents: A Survey* — Nguyen et al. ([arXiv 2412.13501](https://arxiv.org/abs/2412.13501), Findings of ACL 2025) — taxonomiza os agentes de GUI por forma de percepção (visual/screenshot, representações estruturadas como árvores de acessibilidade e HTML, híbridas) e por espaço de ação, além dos benchmarks do campo. Tradução para decisão: mesmo dentro do paradigma visual, a trajetória documentada é reduzir a dependência de pixels em favor de representações estruturadas da interface — o protocolo declarativo deste livro é o limite dessa trajetória: a estrutura não é *extraída* da tela pelo agente, é *declarada* pela própria aplicação.

Os dois surveys sustentam o contraste; a ciência dos demais mecanismos vive nos capítulos que os tratam — governança de ações no cap. 05 (ToolEmu, AgentDojo), segurança no cap. 07 (prompt injection indireta), tool calling no cap. 08 (Toolformer, τ-bench). (Bibliografia completa e status de validação: [`bibliografia.md`](../bibliografia.md).)

## Fontes da indústria

Fichas extraídas de [`estudos/panorama-industria.md`](../../estudos/panorama-industria.md) (captura 2026-07-30); aqui entram como panorama — a análise comparativa é do cap. 10.

- **[AG-UI — Agent-User Interaction Protocol](https://github.com/ag-ui-protocol/ag-ui)**: protocolo aberto orientado a eventos para conectar backends de agentes a frontends (~16+ tipos de evento, SSE como default, estado por snapshot+delta). Tradução para decisão: é o precedente mais direto da direção IA→app deste livro — um protocolo próprio deve no mínimo mapear 1:1 para suas categorias, ou adotá-lo e estender.
- **[MCP Apps — extensão oficial de UI do MCP](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)**: UI declarada como recurso (`ui://`), iframes sandboxados, mensagens auditáveis, aprovação explícita para tool calls iniciadas pela UI. Tradução para decisão: o estado da arte de generative UI federada — confirma que "template pré-declarado + dados" vence HTML livre gerado pelo modelo.
- **[ACP — Agent Client Protocol (Zed)](https://agentclientprotocol.github.io/python-sdk/)**: JSON-RPC (JavaScript Object Notation Remote Procedure Call) sobre stdio; o agente notifica por `session/update` e pede autorização por `session/request_permission` — a aprovação vive no cliente. Tradução para decisão: blueprint direto de "proposta de ação com confirmação humana" como estado de primeira classe do protocolo.
- **[Vercel AI SDK — UI Message Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)**: SSE com partes tipadas start/delta/end e aprovação de tool como estado do protocolo (`needsApproval`). Tradução para decisão: o formato de eventos tipados mais adotado no ecossistema web — compatibilidade com ele reduz o custo de adoção de qualquer protocolo novo.

## O estado da arte

### As duas direções do protocolo

A primeira coisa a enxergar no protocolo é a sua **assimetria**. As duas direções não são espelho uma da outra: a aplicação *descreve*, a IA *age por mediação*. Na direção app→IA não trafega intenção — trafega um retrato: o estado da tela, estruturado, sanitizado e acompanhado do inventário do que pode ser feito ali. Na direção IA→app não trafega interface — trafega um stream de eventos tipados que a aplicação interpreta e executa segundo suas próprias regras. Em nenhum momento, em nenhuma das duas bases-laboratório, a IA toca a UI: não há clique simulado, não há DOM lido, não há screenshot — exatamente o paradigma que a literatura de GUI agents descreve ([arXiv 2411.18279](https://arxiv.org/abs/2411.18279)) e que ambos os laboratórios rejeitaram por decisão formal (`specs/014-chat-lateral-contexto/research.md`, `nexxussai-monorepo`; Constituição, Princípio IV, `ghdaru`).

Um fragmento fictício de cada direção torna a assimetria concreta. App→IA — a aplicação envia, junto com a mensagem do usuário, o snapshot do que está na tela (no espírito do `ScreenContextSnapshot` do `nexxussai-monorepo`, `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json`):

```json
{
  "screen_id": "usuarios.lista",
  "route": "/usuarios",
  "visible_fields": { "filtro": "ativos" },
  "context_hash": "hash-ficticio-0123456789abcdef",
  "captured_at": "2026-07-30T12:00:00Z"
}
```

IA→app — a IA responde por eventos no envelope `{seq, kind, payload}` (o contrato do `ghdaru`, espelhado em TypeScript em `apps/web/src/features/conversation/domain/events.ts`); quando quer mudar a interface, emite um comando declarativo, nunca um clique:

```json
{ "seq": 7, "kind": "ui_command", "payload": { "command": "ui.navigate", "args": { "route": "/usuarios" } } }
```

O snapshot diz "é isto que existe e é isto que pode ser feito"; o evento diz "é isto que proponho fazer" — e a aplicação, dona da execução, decide como (e se) o efeito acontece. A direção app→IA é o assunto dos caps. [04](04-contexto-de-tela.md) (contexto de tela) e [05](05-acoes-governadas.md) (o catálogo como superfície executável); a direção IA→app, dos caps. [02](02-transporte-sessao.md)–[03](03-eventos-tipados.md) (canal e vocabulário) e [06](06-comandos-de-ui.md) (comandos de UI).

### Sete conceitos em uma frase cada

Todo o resto do livro compõe sete conceitos. Aqui eles são apenas nomeados — o cap. [01](01-fundamentos.md) os define formalmente — mas já com o fato que importa: **cada um existe nas duas bases, com nomes diferentes** (tabela terminológica completa em `estudos/fonte-base-codigo.md`, §4):

| Conceito | Em uma frase | ghdaru | nexxussai-monorepo |
|---|---|---|---|
| Snapshot | o retrato estruturado e sanitizado da tela que viaja com a mensagem | Snapshot de Contexto (3 níveis) | `ScreenContextSnapshot` |
| Catálogo | o inventário fechado do que a IA pode fazer | Catálogo de Ações (`ActionSpec`) | `ScreenRegistry` + `ActionKind` |
| Evento tipado | a unidade do que a IA fala: tipo + payload, em stream | `EventKind` (`thought, content, …`) | eventos SSE canônicos (`text_delta, …`) |
| Proposta de ação | a ação que nasce pedindo permissão, com estado próprio | Proposta de Ação (FSM) | `ActionProposal` (FSM) |
| Comando de UI | a instrução declarativa que muda a interface | Comando de UI (`ui.navigate`) | ações `navigate / fill_fields / focus_field` |
| Classe de risco | a gravidade declarada que calibra o gate humano | Classe de Risco (taxonomia ampliada; 2 impl.) | `RiskLevel` + `requires_confirmation` |
| Traço de execução | o registro auditável do que foi de fato executado | Traço de Execução | `ExecutionTrace` / tool-results |

FSM abrevia *Finite State Machine* (máquina de estados finitos) — a proposta de ação não é uma mensagem, é uma entidade com estados e transições validadas em código, nas duas bases. Essa tabela é a semente da linguagem ubíqua do livro: nos capítulos seguintes, os termos da coluna "Conceito" são usados como nomes canônicos, e os vocabulários dos laboratórios aparecem como dialetos.

### Convergência independente: dois laboratórios, uma topologia

As duas bases não poderiam ter origens mais distintas. O `ghdaru` é uma fundação multi-tenant em que o chat nasceu como interface transversal *governada por contrato*: a Constituição do produto (`.specify/memory/constitution.md`, Princípio IV, não-negociável) fixa eventos tipados, FSM de ação, catálogo obrigatório e autorização fora do LLM antes de qualquer feature. O `nexxussai-monorepo` é uma plataforma de produto (chat com RAG — Retrieval-Augmented Generation —, knowledge base, admin) em que o chat lateral com contexto de tela nasceu de uma spec de produto (`specs/014-chat-lateral-contexto/`) respondendo à pergunta — como o chat sabe o que está na tela e o que pode chamar? —. Um partiu do contrato; o outro, do caso de uso. E chegaram ao mesmo lugar (tabela-síntese completa em `estudos/fonte-base-codigo.md`, §1):

| Dimensão | ghdaru | nexxussai-monorepo |
|---|---|---|
| Transporte | SSE sobre POST, `seq` monotônico + replay | SSE sobre POST, cancelamento cooperativo |
| IA→app | `thought, content, action_proposal, action_result, citation, ui_command, finished, error` | `text_delta, thinking_delta, artifact_*, execution_*, tool_call, tool_result, action_proposal, done, error` |
| App→IA | Snapshot de Contexto + Catálogo de Ações | `ScreenContextSnapshot` + `ScreenRegistry` |
| Governança | FSM de proposta, classes de risco, traço obrigatório | FSM de proposta, `risk_level`, `idempotency_key`, `context_hash` |
| Lacunas | tool calling real e MCP ausentes | tool calling real e MCP ausentes |

Três leituras dessa tabela sustentam a tese. Primeira: **os vocabulários diferem em toda linha** — `thought` × `thinking_delta`, `ui_command` × `navigate/fill_fields` — o que descarta cópia e estabelece a independência das descobertas. Segunda: **a topologia é idêntica em toda linha** — duas direções, eventos tipados sobre SSE, contexto declarado, proposta + confirmação, autorização fora do modelo. Terceira, e a mais curiosa: **até as lacunas são espelhadas**. Ambas as bases têm catálogo com `input_schema` pronto para virar tools e nenhuma usa tool calling real; ambas preveem MCP e nenhuma o conecta (`specs/001-fundacao-shell-chat/plan.md` no `ghdaru`; `docs/backend-ai-chat-interface.md`, porta com `tools` não implementada, no `nexxussai-monorepo`). Dois times pararam, sem se falar, diante da *mesma* ponte — evidência de que a ponte é uma propriedade do terreno, não do viajante.

As divergências que restam não enfraquecem o argumento — completam-no: são refinamentos complementares, não desenhos alternativos. O `ghdaru` formalizou a federação (Manifesto de Aplicação + handshake, `docs/integration/manifesto-aplicacao.md`); o `nexxussai-monorepo` blindou a confirmação com `idempotency_key` e `context_hash` (`apps/web/src/features/conversation/api/lateralChatService.ts`). Cada laboratório descobriu um pedaço que falta ao outro — e os caps. [05](05-acoes-governadas.md) e [09](09-federacao-composicao.md) tratam esses refinamentos como exportáveis.

### O mercado na mesma fronteira (panorama)

Se a fronteira é real, o mercado deveria estar disputando-a — e está. O **AG-UI** ([github.com/ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)) é o precedente mais direto: um protocolo aberto de eventos tipados agente↔frontend, com SSE como transporte default, blocos em trincas `Start/Content/End`, estado sincronizado por `StateSnapshot`/`StateDelta` (JSON Patch) e integração oficial documentada pela Microsoft no Agent Framework ([Microsoft Learn](https://learn.microsoft.com/en-us/agent-framework/integrations/ag-ui/)). É, essencialmente, a direção IA→app deste livro padronizada por terceiros.

O **MCP** atacou a fronteira pelo lado da federação: a extensão oficial **MCP Apps** ([anúncio, 2025-11-21](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)) — escrita em conjunto por maintainers da OpenAI e da Anthropic — permite que servidores entreguem UI como recurso declarado (`ui://`), renderizada em iframes sandboxados, com mensagens auditáveis e aprovação explícita do usuário para tool calls iniciadas pela UI. É a confirmação, vinda de fora, de que interface gerada por agente precisa de template pré-declarado e gate humano — não de HTML livre.

O **ACP** ([python-sdk](https://agentclientprotocol.github.io/python-sdk/)) formaliza a mesma conversa em outro domínio (editor↔coding agent): JSON-RPC sobre stdio, o agente notificando por `session/update` e pedindo autorização por `session/request_permission` — a aprovação vive no cliente, fora do LLM. E o **Vercel AI SDK** ([stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)) impôs o formato de fato do ecossistema web: SSE com partes tipadas start/delta/end e aprovação de tool como estado do protocolo (`needsApproval`) — adotado até por frameworks concorrentes ([LlamaIndex chat-ui](https://github.com/run-llama/chat-ui)).

Quatro ecossistemas, quatro pontos de partida, o mesmo destino — eventos tipados, confirmação humana como primitiva, execução fora do modelo. Mas nenhum deles padroniza o **contexto de tela**: o que a aplicação envia ao agente sobre o estado da UI segue sem vocabulário próprio em todos os protocolos pesquisados (registro em `estudos/panorama-industria.md`, "Lacunas e incertezas" — o AG-UI chega perto com `StateSnapshot`/`StateDelta`, mas sem semântica de tela). É exatamente a metade do protocolo que os dois laboratórios mais desenvolveram. A matriz comparativa completa, protocolo a protocolo e dimensão a dimensão, é do cap. [10](10-estado-da-arte-externo.md); aqui basta o panorama: a fronteira é real, é disputada, e está pela metade.

### O mapa do livro (capítulos 01–11)

O livro percorre o protocolo de dentro para fora. A sequência é um trajeto, não um índice — cada capítulo assume os anteriores:

- **[01 — Fundamentos e vocabulário](01-fundamentos.md)**: define as duas direções e os sete conceitos, com o fluxo completo do pedido ao traço e a tabela de equivalências entre os dialetos dos laboratórios.
- **[02 — Transporte e sessão](02-transporte-sessao.md)**: o canal — por que SSE sobre POST venceu WebSocket nas duas bases, o preço do parser manual, entrega confiável por `seq` + replay, cancelamento cooperativo e o envelope de erro como parte do protocolo.
- **[03 — A voz da IA: eventos tipados](03-eventos-tipados.md)**: o vocabulário fechado e versionado que trafega no canal — famílias de eventos, o padrão start/delta/end da indústria e a normalização multi-provider que protege o vocabulário.
- **[04 — A voz da aplicação: contexto de tela](04-contexto-de-tela.md)**: a direção app→IA — snapshot em níveis, registro de telas compartilhado, camada semântica e sanitização server-side; descrever, nunca deixar inferir.
- **[05 — Ações governadas](05-acoes-governadas.md)**: o catálogo como única superfície executável e a máquina de estados proposta→confirmação→execução→resultado, com risco proporcional, idempotência, `context_hash` e traço.
- **[06 — Comandos de UI e slot filling](06-comandos-de-ui.md)**: a família de ações que muda a interface por comandos declarativos, o executor no host e a Coleta por Schema — com o anti-padrão pixels/cliques aprofundado.
- **[07 — Segurança do protocolo](07-seguranca.md)**: o modelo de ameaça (prompt injection em quatro canais) e as quatro camadas de defesa arquitetural — separação de confiança, sanitização em profundidade, autorização fora do LLM, auditoria por traço.
- **[08 — A porta do modelo e o tool calling](08-porta-do-modelo.md)**: a porta única que normaliza qualquer provedor em chunks tipados, e a ponte a atravessar — a lacuna espelhada do catálogo pronto para tools que não usa tools.
- **[09 — Federação e composição](09-federacao-composicao.md)**: o contrato de integração de uma aplicação externa é o mesmo contrato da IA (manifesto + snapshot + catálogo); MCP como projeção do catálogo para fora.
- **[10 — O estado da arte externo](10-estado-da-arte-externo.md)**: AG-UI, MCP (Apps/elicitation), ACP, Vercel AI SDK e OpenAI Apps SDK comparados na matriz por dimensão — o que já consolidou e o que segue aberto.
- **[11 — Convergências: o protocolo unificado](11-convergencias.md)**: a síntese normativa — o núcleo de afirmações sustentadas, as lacunas nomeadas, o roadmap de adoção e as apostas datadas e pontuáveis do livro.

As fronteiras finas entre vizinhos (o que entra no 02 e não no 03, no 05 e não no 06, e assim por diante) estão delimitadas no [sumário](../README.md), seção "Fronteiras entre capítulos".

### A relação com o livro-mãe Engenharia de Harness

Este livro é filho do [Engenharia de Harness](https://github.com/GHDaru/harness_engineering) — herda dele o formato editorial (esqueleto v3, livro vivo, evidência por path) — mas cobre uma fronteira que o livro-mãe delimita e não atravessa. A divisão de trabalho é por fronteira, não por tema. O cap. 13 do livro-mãe (Interfaces) e o cap. 15 (Harness Embutido) olham o *interior* do harness: como ele expõe interfaces e como se comporta quando embutido num produto. O cap. 17 (Camada de Protocolos) olha a fronteira *entre harnesses*: MCP, A2A e ACP como padrões de interoperabilidade agente↔agente e agente↔host em geral.

Este livro ocupa o espaço entre os dois: a fronteira **app↔harness** — as mensagens que cruzam a linha entre a aplicação de produto e o agente embutido nela. Busque no livro-mãe a anatomia do agente (loop, contexto, tools, orquestração) e o panorama geral dos protocolos de interoperabilidade; busque aqui o que só aqui existe: o contrato bilateral com contexto de tela declarado, catálogo derivado da aplicação, propostas de ação com FSM e comandos de UI — o vocabulário da conversa, não a fisiologia dos interlocutores. Quando o cap. [10](10-estado-da-arte-externo.md) compara protocolos externos, ele cita o cap. 17 do livro-mãe em vez de reproduzi-lo (fronteira registrada no [sumário](../README.md), §"Fronteiras entre capítulos").

### Leitura executiva

Existe um protocolo natural na fronteira entre a aplicação de produto e o agente de IA embutido nela, com duas direções assimétricas: a aplicação **se descreve** — snapshot de contexto sanitizado + catálogo fechado de capacidades — e a IA **age por eventos tipados** sob confirmação humana proporcional ao risco, sem jamais tocar a interface. Duas bases de código descobriram esse desenho de forma independente — vocabulários diferentes, topologia idêntica, até as lacunas espelhadas — e quatro ecossistemas externos (AG-UI, MCP Apps, ACP, Vercel AI SDK) atacam a mesma fronteira sem ainda padronizar o conjunto: contexto de tela, em particular, segue sem padrão externo. A literatura de GUI agents documenta o custo do caminho oposto — operar a interface de fora, por pixels e cliques, pagando grounding, latência e falibilidade ([arXiv 2411.18279](https://arxiv.org/abs/2411.18279)); o protocolo declarativo dissolve esses custos movendo a fronteira para dentro da aplicação. **O que roubar**: trate a fronteira app↔IA como protocolo de primeira classe — nomeie os sete conceitos, feche o vocabulário de eventos, declare o contexto e o catálogo — e não como cola de feature; e leia o livro como trajeto, porque cada mecanismo assume os anteriores. As apostas datadas sobre *para onde* a padronização caminha não são deste capítulo: estão no cap. [11](11-convergencias.md), registradas como previsões pontuáveis no [HISTORICO](../HISTORICO.md).

*Contrato de frescor: esta leitura expira se um protocolo externo padronizar contexto de tela como vocabulário próprio com adoção relevante — nesse dia, a lacuna que este livro nomeia vira padrão a adotar, e a introdução (e o cap. 10) exigem revisão extraordinária.*

## Verificação

1. Enuncie a tese central do livro em duas frases: o que existe na fronteira app↔IA e qual é a evidência empírica de que não é uma escolha de estilo? (Objetivo 1; dica: "protocolo natural" + o que significa duas bases convergirem com vocabulários diferentes.)
2. Nas duas direções do protocolo, o que trafega de app→IA e o que trafega de IA→app? Por que nenhuma delas envolve a IA tocando o DOM? (Objetivo 2; dica: uma direção *descreve*, a outra *age por eventos* — e o paradigma pixels + cliques dos surveys de GUI agents é o contraexemplo.)
3. Por que vocabulários **diferentes** com topologia **idêntica** é evidência mais forte de protocolo natural do que se as duas bases usassem os mesmos nomes? (Objetivo 3; dica: o que nomes iguais sugeririam sobre a independência das descobertas? E o que as lacunas espelhadas acrescentam?)
4. Você quer entender (a) como uma proposta de ação é confirmada, (b) como se defende de prompt injection e (c) como o MCP conversa com outros harnesses — em que capítulo deste livro, ou do livro-mãe, está cada resposta? (Objetivo 4; dica: mapa dos capítulos + fronteira com os caps. 13/15/17 do Engenharia de Harness.)

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
- `apps/web/src/features/conversation/adapters/fake-chat.ts` — adaptador demo que espelha o contrato inteiro sem backend: uma spec executável do protocolo.
- `docs/adr/0003-modelos-integracao-aplicacoes.md` — decisão negativa estruturante: um protocolo de integração *separado* do snapshot/catálogo foi descartado ("duplicaria conceitos que a IA já usa") — semente do cap. 09.
- Lacunas declaradas que espelham o outro laboratório: tool calling real e servidor MCP previstos e ausentes (`specs/001-fundacao-shell-chat/plan.md`: catálogo "desenhado para virar tools MCP", zero código).

### nexxussai-monorepo

- `specs/005-backend-ai-chat/contracts/stream-events.md` — vocabulário SSE canônico documentado (`text_delta, thinking_delta, artifact_*, execution_*, tool_call, tool_result, done, error`), com regra de evolução do contrato.
- `apps/api/app/ai_chat/domain/value_objects/stream_event.py` — fonte da verdade dos eventos em código, incluindo `ActionProposalEvent` (`risk_level`, `requires_confirmation`).
- `apps/api/app/ai_chat/domain/entities/action_proposal.py` + `screen_context_snapshot.py` — FSM de proposta (`proposed → confirmed → executed`, com `cancelled|denied|expired|failed`) e snapshot de contexto de tela como entidades de domínio.
- `apps/api/app/ai_chat/infrastructure/persistence/screen_registry_seed.py` + `apps/web/src/features/conversation/model/screenRegistry.ts` — registry de telas compartilhado backend/frontend: a aplicação se descreve, a IA nunca infere a UI.
- `specs/014-chat-lateral-contexto/research.md` — decisões formais que definem a topologia: introspecção do DOM rejeitada; execução automática de tool calls rejeitada.
- `specs/014-chat-lateral-contexto/contracts/chat-lateral-api.yaml` — o protocolo com contexto de tela como OpenAPI (telas, mensagens SSE, confirmação de ações).
- `references/newchatshell/Chat with Context - Spec.md` — a spec de produto original — "a tela é a fonte da verdade" e o princípio de nenhuma mutação escondida (no original: "Toda mutação aparece na UI. O chat nunca grava em segredo") — e a pergunta que originou o desenho: como o chat sabe o que chamar.
- Lacunas declaradas que espelham o outro laboratório: tool calling real só em spec (`docs/backend-ai-chat-interface.md`, porta `ILLMCompletion` com `tools` não implementada); MCP só superfície (`apps/api/app/mcp/server.py`, protótipo desconectado).

### Divergências

- **Vocabulário** — mesmo conceito, nomes distintos: `thought` (ghdaru) × `thinking_delta` (nexxussai); `ui_command` (ghdaru) × ações `navigate/fill_fields/focus_field` (nexxussai, `apps/api/app/ai_chat/domain/value_objects/action_kind.py`). A divergência é a evidência de descoberta independente.
- **Refinamentos únicos de cada lado** — ghdaru formalizou federação (manifesto + handshake em `docs/integration/manifesto-aplicacao.md`, sem código); nexxussai adicionou `idempotency_key` e `context_hash` à confirmação (`apps/web/src/features/conversation/api/lateralChatService.ts`, `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json`) — refinamentos exportáveis um para o outro, tratados nos caps. 05 e 09.
- **Ponto de partida** — ghdaru partiu do contrato (Constituição, Princípio IV, antes de qualquer feature); nexxussai partiu do caso de uso (spec 014 de produto). Convergiram na mesma topologia — o argumento central deste capítulo.
