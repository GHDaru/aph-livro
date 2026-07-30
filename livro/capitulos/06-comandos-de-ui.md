# 06 — Comandos de UI e slot filling

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

> **Estrutura (fase 1)** — este arquivo é a estrutura aprovável do capítulo, conforme `livro/GUIA-CAPITULO.md` §"Estrutura antes do conteúdo". "O problema" está redigido; o estado da arte é um esqueleto de H3 anotado com o que a prosa da fase 2 demonstrará.

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** por que a IA muda a interface por comandos declarativos de um vocabulário fechado — e por que cliques simulados, coordenadas de tela e leitura de DOM (Document Object Model) foram formalmente rejeitados pelas duas bases e constituem o anti-padrão para o agente embutido.
2. **Distinguir** a família de comandos de UI (interface de usuário) — efeitos locais e reversíveis executáveis no frontend — das ações persistentes, que permanecem sob a governança de proposta e confirmação do capítulo 05.
3. **Analisar** os vocabulários de comando das duas bases (`ui.navigate`/`session.logout` × taxonomia `ActionKind`) e da indústria (frontend tools do AG-UI, `window.openai`, intents do MCP-UI), mapeando equivalências e lacunas.
4. **Implementar** o slot filling como diálogo estruturado — a IA pede dados por schema (`user.input.required`, Coleta por Schema, elicitation do MCP — Model Context Protocol) e a aplicação renderiza o formulário.
5. **Avaliar** as alternativas de generative UI — componente do app renderizando dados estruturados versus UI serializada pelo servidor — à luz do recuo documentado do RSC (React Server Components) `streamUI` da Vercel.

## O problema

Quando o agente embutido precisa mudar a tela — navegar para outra rota, preencher um campo, focar um elemento, encerrar a sessão — há dois caminhos possíveis. O primeiro é operar a interface como um humano operaria: capturar screenshots, calcular coordenadas, simular cliques e teclas, ou inspecionar o DOM para descobrir o que existe na página. O segundo é pedir à aplicação que ela mesma execute a mudança, por um **comando declarativo** pertencente a um vocabulário que a aplicação declarou de antemão. As duas implementações-laboratório deste livro escolheram o segundo caminho — e rejeitaram o primeiro **formalmente**, não por omissão: no `ghdaru`, a Constituição do produto (`.specify/memory/constitution.md`, Princípio IV) exige catálogo obrigatório e eventos tipados como única superfície de ação; no `nexxussai-monorepo`, a introspecção do DOM foi avaliada e descartada como decisão registrada (`specs/014-chat-lateral-contexto/research.md`).

A rejeição não é preciosismo arquitetural: o paradigma "pixels + cliques" existe, é comercial e está documentado pela própria fonte primária como frágil. O computer use da Anthropic devolve ações como `screenshot`, `left_click` e `type` sobre capturas de tela — e a própria documentação e avaliações independentes registram latência alta, erros frequentes e restrições de resolução ([docs — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool); [Anthropic — developing computer use](https://www.anthropic.com/news/developing-computer-use)). Esse paradigma tem seu lugar: automatizar software de terceiros que **não oferece** contrato nenhum. Mas para o agente embutido no próprio produto ele é um anti-padrão deliberado — a aplicação já sabe quais rotas, campos e ações existem; forçar o modelo a redescobrir isso por visão computacional joga fora a informação mais barata e confiável disponível, e torna a ação lenta, falível e quase impossível de autorizar com precisão.

Escolher o caminho declarativo, porém, cria os problemas que este capítulo trata. Primeiro, o **vocabulário**: quais comandos existem, quem os declara e o que acontece com o que não foi declarado ("o que não está declarado, a IA não faz" — `docs/integration/instrucoes-construcao.md` e `docs/integration/guia-integracao.md`, repositório `ghdaru`). Segundo, o **executor**: um comando declarativo só vira mudança de tela se algum código do frontend o traduzir em efeito real — o `applyUiCommand()` de `apps/web/src/features/conversation/ui/ChatPanel.tsx` (`ghdaru`) faz exatamente isso para `ui.navigate` e `session.logout`; a ausência desse tradutor no `nexxussai-monorepo` (proposta renderizada, nunca executada) mostra que a categoria não é opcional. Terceiro, a **fronteira com a governança**: nem todo comando pode executar direto — a política do `nexxussai-monorepo` (`action_proposal_policy_service.py`) separa o reversível (navegar, focar, preencher rascunho) do persistente (submeter, abrir recurso), e só o primeiro grupo dispensa a confirmação humana que o capítulo 05 governa.

Há ainda o caso em que a IA não tem o que precisa para agir: faltam dados do usuário. A resposta ingênua — perguntar em prosa livre e tentar interpretar a resposta em prosa livre — reintroduz exatamente a ambiguidade que o protocolo quer eliminar. A resposta estruturada é o **slot filling**: a IA emite um pedido de input com schema (`user.input.required`, a "Coleta por Schema" da Constituição do `ghdaru` e de `docs/research/resultado-pesquisa-chat-ai-first-avaliacao.md`), a aplicação renderiza o formulário com seus próprios componentes, e a resposta volta validada. As duas bases definiram o conceito e nenhuma o implementou — uma lacuna espelhada que a indústria já normatizou por conta própria: a elicitation do MCP é precisamente "o servidor pede input ao humano com JSON Schema, o cliente renderiza e devolve dados validados" ([spec MCP 2025-06-18 — elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)).

O desenho final vive sob tensões que a prosa da fase 2 desenvolverá: **expressividade do vocabulário × superfície de risco** (cada comando novo é poder novo dado ao modelo); **fluidez da experiência × controle humano** (executar tudo automaticamente é fluido e perigoso; confirmar tudo é seguro e insuportável); e **UI gerada pelo modelo × componentes do app** — o recuo da própria Vercel, pausando o desenvolvimento do AI SDK RSC e removendo a API `render` ([referência — render (Removed)](https://ai-sdk.dev/docs/reference/ai-sdk-rsc/render)), sugere que em produção a generative UI converge para "o app renderiza dados estruturados", não "o servidor serializa componentes".

## Fundamentos científicos

> **Declaração (fase 1):** nenhum paper abaixo está validado (status ✓) em [`bibliografia.md`](../bibliografia.md); todos são **candidatos ⏳** herdados de `estudos/candidatos-bibliografia.md`. Nenhuma afirmação do corpo se sustenta neles até a validação dupla da fase 2. A literatura científica específica sobre slot filling dirigido por schema em agentes embutidos e sobre generative UI é incipiente em 2026-07; a busca complementar em HCI (Human-Computer Interaction; venues CHI/UIST, mixed-initiative interfaces) está registrada como pendência ⏳ nos estudos.

- ⏳ **GUI Agents: A Survey** ([arXiv 2412.13501](https://arxiv.org/abs/2412.13501)) — mapeia sistematicamente o paradigma "percepção de tela + emulação de ação humana" (clicar, digitar, navegar); é a taxonomia do anti-padrão que este capítulo contrasta com comandos declarativos.
- ⏳ **Large Language Model-Brained GUI Agents: A Survey** ([arXiv 2411.18279](https://arxiv.org/abs/2411.18279)) — detalha o problema do *grounding* de elementos de tela — exatamente o que um vocabulário declarado pela aplicação elimina por construção. Possível fusão com o item anterior na fase 2 (um no corpo, outro em nota).
- ⏳ **τ²-bench** ([arXiv 2506.07982](https://arxiv.org/abs/2506.07982)) — avalia o cenário *dual-control*, em que usuário e agente podem ambos agir sobre o ambiente; é o quadro empírico do problema central deste capítulo (duas mãos na mesma interface).

Ponteiro: [`bibliografia.md`](../bibliografia.md).

## Fontes da indústria

- **[Computer use tool — Anthropic](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)** (+ [developing computer use](https://www.anthropic.com/news/developing-computer-use)): o vendor documenta ações `screenshot`/`left_click`/`type` sobre pixels, com latência alta, erros frequentes e limites de resolução — e isso implica, para o protocolo, que pixels + cliques ficam reservados a software de terceiros sem contrato; o agente **embutido** sempre tem contrato melhor.
- **[AG-UI — Agent-User Interaction Protocol](https://github.com/ag-ui-protocol/ag-ui)**: declara *frontend tools* — ferramentas registradas e executadas no frontend, sob controle do app — como feature de primeira classe; confirma que a indústria trata "a IA age na interface" como invocação de capacidade declarada, não como manipulação de DOM.
- **[MCP-UI — intents tipados](https://github.com/idosal/mcp-ui)** (+ [WorkOS — technical overview](https://workos.com/blog/mcp-ui-a-technical-deep-dive-into-interactive-agent-interfaces)): do iframe para o host fluem intents `tool`, `intent`, `prompt`, `notify`, `link` — a UI **pede**, o host **decide e executa**; é uma taxonomia mínima comprovada de comandos de UI emitidos por conteúdo não confiável.
- **[OpenAI Apps SDK — `window.openai`](https://developers.openai.com/apps-sdk/reference)** (+ [exemplos oficiais](https://github.com/openai/openai-apps-sdk-examples)): quatro verbos — `toolOutput`, `callTool`, `sendFollowUpMessage`, `setWidgetState` — cobrem leitura, ação, fala e estado; é o teste de completude mais maduro em produção para um vocabulário widget↔host.
- **[MCP — elicitation (spec 2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)**: o servidor pede input ao usuário com JSON Schema e o cliente renderiza e devolve dados validados — o slot filling já normatizado como movimento de protocolo, precedente direto de `user.input.required`.
- **[Vercel AI SDK — render (Removed) / AI SDK RSC pausado](https://ai-sdk.dev/docs/reference/ai-sdk-rsc/render)** (+ [stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)): o recuo da generative UI serializada por RSC em favor do AI SDK UI implica, para o protocolo, que comandos de UI devem carregar **dados estruturados para componentes do app**, não componentes gerados pelo modelo.

## O estado da arte

> Esqueleto anotado (fase 1): cada H3 indica em 2–4 frases o que a prosa da fase 2 demonstrará, com a evidência já apontada.

### A família de ações que muda a interface

Definirá **comando de UI** como a especialização, dentro do catálogo governado do cap. 05, das ações cujo efeito é local à interface — navegação, foco, preenchimento, sessão. Mostrará que as duas bases o tratam como cidadão do mesmo catálogo (não um canal paralelo): no `ghdaru` os comandos vivem em `catalog.py` ao lado de qualquer ação; no `nexxussai-monorepo` são valores da mesma taxonomia `ActionKind`. A fronteira com o cap. 05 (governança) e com o cap. 03 (envelope do evento `ui_command`) será demarcada logo na abertura.

### Vocabulário fechado, declarado pela aplicação

Apresentará os dois vocabulários reais em tabela: `ghdaru` — `ui.navigate` (com `enum` de rotas derivado dos módulos habilitados do tenant) e `session.logout`; `nexxussai-monorepo` — `navigate, fill_fields, focus_field, submit, open_resource, clarify` (`action_kind.py`). Desenvolverá a consequência do fechamento: o vocabulário é a superfície de autorização — cada comando é enumerável, tipável e negável, o que nenhum clique simulado é.

### O anti-padrão: pixels, cliques e DOM

Consolidará a tese negativa com as três evidências: rejeição formal nas duas bases (Constituição P.IV do `ghdaru`; decisão de `research.md` na spec 014 do `nexxussai-monorepo`), o computer use da Anthropic como paradigma documentadamente lento e falível, e os surveys de GUI agents (⏳) como mapa do custo de *grounding* que o comando declarativo elimina por construção. Fechará com o critério de uso legítimo do paradigma pixels (software de terceiros sem contrato).

### Reversível executa, persistente propõe

Detalhará o critério que separa o comando de UI executável direto da ação que volta ao funil do cap. 05: no `nexxussai-monorepo`, `action_proposal_policy_service.py` permite que ações reversíveis (navegar, focar, preencher) rodem no frontend, enquanto `submit`/`open_resource` e risco alto exigem confirmação sempre. Argumentará que essa linha — reversibilidade, não "parecer inofensivo" — é o contrato exportável da seção.

### Do comando ao efeito: o executor no host

Mostrará a peça que fecha o circuito: `applyUiCommand()` (`ChatPanel.tsx`, `ghdaru`) traduz `ui.navigate`/`session.logout` em efeitos reais de router e sessão — o modelo nunca toca a UI; o host executa em nome dele. A lacuna espelhada do `nexxussai-monorepo` (não há `ActionExecutionAdapter`; o `ActionCard.tsx` renderiza a proposta mas nada a executa) será usada como prova por ausência: sem executor, o protocolo termina em cartão morto.

### Slot filling: a Coleta por Schema

Especificará o diálogo estruturado de coleta de dados: `user.input.required` e `ui.form.patch` (definidos na Constituição P.IV do `ghdaru` e em `docs/research/resultado-pesquisa-chat-ai-first-avaliacao.md`; **não implementados** — lacuna declarada), o `clarify` do `nexxussai-monorepo` como primo pobre em prosa livre, e a elicitation do MCP como a forma já normatizada pela indústria. Incluirá um payload de exemplo com valores fictícios evidentes (ex.: `{"schema": {"properties": {"email": {"type": "string"}}}, "reason": "exemplo-ficticio"}`).

### O vocabulário da indústria e a lição do generative UI

Comparará as taxonomias externas — frontend tools do AG-UI, intents do MCP-UI (`tool/prompt/link/notify`), os quatro verbos do `window.openai` — com os vocabulários dos laboratórios, mapeando equivalências. Fechará com o dado contra a UI serializada: o AI SDK RSC pausado e a API `render` removida pela Vercel apontam que o comando de UI maduro transporta **dados para componentes que o app já possui**.

### Leitura executiva

*Rascunho (fase 2 finaliza):* O que roubar: (1) comando de UI é ação de catálogo como qualquer outra — mesma declaração, mesma governança, apenas com efeito local e política mais permissiva quando reversível; (2) a linha executa-direto × propõe-e-confirma é a **reversibilidade**, decidida por política server-side, nunca pelo modelo; (3) todo vocabulário precisa de um executor no host (`applyUiCommand()` é a menor implementação honesta; proposta sem executor é cartão morto); (4) slot filling por schema — a IA pergunta com JSON Schema, o app renderiza com componentes próprios — já tem forma normatizada (elicitation do MCP) e é a próxima ponte óbvia das duas bases; (5) não serialize UI gerada pelo modelo: mande dados estruturados para componentes pré-declarados. *Contrato de frescor: a estabilização de um padrão dominante de comandos de UI (por exemplo, adoção ampla de MCP Apps/AG-UI para este caso de uso, ou reversão do recuo do RSC) invalida esta leitura e dispara revisão extraordinária.*

## Verificação

1. Por que as duas bases rejeitaram cliques simulados e leitura de DOM, e em que caso o paradigma "pixels + cliques" ainda é legítimo? (Dica: quem já tem contrato declarado não precisa redescobri-lo por visão computacional — objetivo 1.)
2. Uma ação `fill_fields` preenche um formulário ainda não submetido; uma ação `submit` grava no banco. Qual executa direto no frontend e qual exige o funil do cap. 05 — e qual é o critério geral? (Dica: reversibilidade decidida por política server-side, `action_proposal_policy_service.py` — objetivo 2.)
3. Mapeie `ui.navigate` (ghdaru) e o intent `link` (MCP-UI) numa mesma categoria, e aponte um verbo do `window.openai` sem equivalente nos laboratórios. (Dica: compare as tabelas de vocabulário; `setWidgetState` — objetivo 3.)
4. Desenhe o fluxo de slot filling para "agendar reunião" quando falta a data: que evento a IA emite, quem renderiza o formulário e por onde a resposta volta? (Dica: `user.input.required` com JSON Schema + renderização pelo app + resposta validada, como na elicitation do MCP — objetivo 4.)
5. Sua equipe propõe que o modelo gere o JSX dos formulários dinamicamente. Que evidência da indústria você citaria para recomendar o contrário, e qual a alternativa? (Dica: AI SDK RSC pausado/`render` removida; dados estruturados para componentes do app — objetivo 5.)

---

## Apêndice — evidência por laboratório

### ghdaru

- `apps/api/src/ghdaru_api/conversation/domain/catalog.py` — Catálogo v1 com os dois comandos implementados: `ui.navigate` (risk=read; `enum` de rotas derivado dos módulos habilitados do tenant) e `session.logout` (risk=confirm). A regra "o que não está declarado, a IA não faz" está em `docs/integration/instrucoes-construcao.md` e `docs/integration/guia-integracao.md`.
- `apps/web/src/features/conversation/ui/ChatPanel.tsx` — `applyUiCommand()`: o executor no frontend que traduz `ui.navigate`/`session.logout` em efeitos reais de router e sessão. É a peça que fecha o circuito comando→efeito.
- `apps/web/src/shared/semantic/registry.ts` — Camada Semântica: `SemanticObject.aiActions: NAVIGATE|FILL_FIELDS|SUBMIT|READ` (`[]` = sensível) — a declaração, item a item de tela, do que a IA pode tocar (o registry em si é assunto do cap. 04).
- `.specify/memory/constitution.md` (Princípio IV) + `docs/research/resultado-pesquisa-chat-ai-first-avaliacao.md` — definem o vocabulário previsto **maior**: `ui.form.patch`, `action.confirmation`, `user.input.required` (slot filling / Coleta por Schema). **Lacuna declarada:** nenhum dos três tem código (`estudos/fonte-base-codigo.md` §2.5) — a categoria existe no contrato antes de existir na implementação.
- `docs/linguagem-ubiqua.md` — *Comando de UI* e *Coleta por Schema* como termos canônicos do domínio.

### nexxussai-monorepo

- `apps/api/app/ai_chat/domain/value_objects/action_kind.py` — a taxonomia completa: `navigate, fill_fields, focus_field, submit, open_resource, clarify`. Quatro dos seis tipos são comandos de UI no sentido deste capítulo.
- `apps/api/app/ai_chat/domain/services/action_proposal_policy_service.py` — a política que infere `RiskLevel` por `ActionKind`: ações reversíveis (navigate/focus/fill) podem rodar no frontend; `submit`/`open_resource` e risco high/critical sempre exigem confirmação. É a linha reversível×persistente em código.
- `apps/api/app/ai_chat/domain/value_objects/stream_event.py` — `ActionProposalEvent` carrega `action_kind`, `target_screen_id` e `field_values`: o payload do comando de UI viaja dentro da proposta (o envelope é assunto do cap. 03; a FSM — máquina de estados finita — da proposta, do cap. 05).
- `apps/web/src/components/chat/lateral/ActionCard.tsx` — renderiza a proposta por `actionKind` com cor por `riskLevel`. **Lacuna declarada:** não existe `ActionExecutionAdapter` no frontend — a proposta é renderizada mas **não executada** (`estudos/fonte-base-codigo.md` §3.4): o espelho invertido do ghdaru, que tem executor e vocabulário mínimo.
- `specs/014-chat-lateral-contexto/research.md` — decisão formal registrada: introspecção do DOM **rejeitada**; execução automática de tool calls **rejeitada**.

### Divergências

- **Onde mora o vocabulário:** no `ghdaru`, comandos são entradas do Catálogo de Ações (com `input_schema` por ação); no `nexxussai-monorepo`, são uma enumeração fechada (`ActionKind`) com payload fixo por tipo. Mesma categoria, granularidades diferentes — a fase 2 discute qual escala melhor.
- **Lacunas espelhadas e complementares:** o `ghdaru` implementou o executor (`applyUiCommand()`) mas só dois comandos; o `nexxussai-monorepo` tem a taxonomia rica e a política de reversibilidade, mas nenhum executor. Juntos, os dois laboratórios contêm o desenho completo que nenhum contém sozinho.
- **Slot filling:** definido e não implementado no `ghdaru` (`user.input.required`); aproximado em prosa livre no `nexxussai-monorepo` (`clarify`, sem schema). A elicitation do MCP mostra a forma final que falta a ambos.
