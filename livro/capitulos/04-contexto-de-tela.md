# 04 — A voz da aplicação: contexto de tela

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

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

**Este capítulo não tem fonte científica validada (✓) atribuída a ele na [bibliografia](../bibliografia.md)** — nenhuma afirmação do corpo depende de paper. As fontes vizinhas, já validadas para outros capítulos, apenas delimitam o território:

- ✓ **GUI Agents: A Survey** ([arXiv 2412.13501](https://arxiv.org/abs/2412.13501)) e ✓ **Large Language Model-Brained GUI Agents** ([arXiv 2411.18279](https://arxiv.org/abs/2411.18279)) — validadas na bibliografia e atribuídas ao **capítulo 00**: mapeiam o paradigma "pixels + cliques" e o problema de *grounding* de elementos de tela, o pano de fundo do contraste inferência × descrição que este capítulo desenvolve por evidência de código.
- ✓ **Indirect Prompt Injection** ([arXiv 2302.12173](https://arxiv.org/abs/2302.12173)) — atribuída ao **capítulo 07**: todo conteúdo que a aplicação envia ao modelo é canal de ataque; aqui aparece apenas como motivação da sanitização (o desenvolvimento é do 07).

Candidatas ainda não validadas (⏳) vivem em [`estudos/candidatos-bibliografia.md`](../../estudos/candidatos-bibliografia.md) e não sustentam afirmações do corpo. Quando a rodada de fundamentação científica atribuir um paper-âncora a este capítulo, esta seção será reescrita.

## Fontes da indústria

Fichas (URLs verificadas em `estudos/panorama-industria.md`, captura 2026-07-30):

- **[AG-UI — Agent-User Interaction Protocol, eventos de estado](https://docs.ag-ui.com/concepts/events)**: o protocolo aberto mais próximo do tema oferece `StateSnapshot` e `StateDelta` (delta em JSON Patch, RFC 6902 — Request for Comments) para sincronizar estado app↔agente — mas o conteúdo do estado é **genérico e não normatizado**: não há vocabulário de tela, campos ou sensibilidade. Tradução para decisão: adote o par snapshot/delta como mecânica, mas o vocabulário do *conteúdo* você terá de definir.
- **[MCP — Model Context Protocol, resources](https://modelcontextprotocol.io/specification/2025-06-18)**: resources são a primitiva do MCP para "dados que o host oferece ao modelo" — um envelope de leitura, sem semântica de tela, sem sanitização normatizada. Tradução para decisão: um snapshot de tela *cabe* num resource, mas o MCP não diz o que ele deve conter.
- **[Anthropic — computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)** (anti-padrão deliberado): a própria documentação registra latência alta e erros frequentes no paradigma screenshot+clique — o contraponto que justifica a rota declarativa.
- **Constatação-chave do panorama** (`estudos/panorama-industria.md`, §Lacunas): *nenhum* dos protocolos pesquisados (AG-UI, MCP, ACP — Agent Client Protocol, Vercel AI SDK, OpenAI Apps SDK) padroniza **contexto de tela** como vocabulário próprio. É o espaço aberto que os dois laboratórios preenchem — e que este capítulo nomeia.

## O estado da arte

### A decisão fundadora: descrever, nunca inferir

Tudo que este capítulo descreve deriva de uma decisão anterior — e negativa. Diante do problema "como o agente sabe o que o usuário vê?", a tentação natural é a inferência: dar ao modelo o DOM, ou screenshots, e deixá-lo descobrir. As duas bases enfrentaram essa tentação e a recusaram *por escrito*. No `nexxussai-monorepo`, a introspecção do DOM e o prompt hardcoded por tela foram avaliados como alternativas e rejeitados por decisão formal registrada em `specs/014-chat-lateral-contexto/research.md` — não é folclore de equipe, é artefato de engenharia com justificativa. No `ghdaru`, a recusa subiu ainda mais alto: o contexto declarado em níveis é princípio constitucional não-negociável (`.specify/memory/constitution.md`, Princípio IV), e a documentação de integração é explícita — o snapshot é "um objeto derivado do catálogo semântico (nunca do DOM cru)" (`docs/integration/snapshot.md`).

Por que a inferência falha por construção, e não por imaturidade das ferramentas? Porque **o que não tem contrato não pode ser governado**. Um screenshot ou um DOM cru não podem ser versionados (qualquer refactor de CSS muda "a interface" que o modelo vê), não podem ser validados (não há schema do que é um pixel), não podem ser autorizados (impossível dizer "este trecho o agente pode ver, aquele não") e — o mais grave — não podem ser sanitizados, porque **só se remove o que se consegue nomear**. O DOM contém tudo: o campo de senha, o token no atributo, o dado pessoal na célula da tabela. A inferência entrega esse tudo indistinto ao modelo. A própria documentação do *computer use* da Anthropic registra a latência alta e os erros frequentes do paradigma ([docs oficiais](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)) — mas mesmo que fosse rápido e preciso, continuaria ingovernável.

A descrição inverte o jogo: **quem descreve controla o contrato; quem infere não tem contrato nenhum**. A aplicação define um vocabulário — o que é uma tela, um campo, uma entidade em foco — e só o que cabe nesse vocabulário atravessa a fronteira. Dessa inversão nascem os três mecanismos do capítulo: o *snapshot* (o que viaja), o *registro de telas* (o que o que viaja significa) e a *sanitização* (o que nunca viaja). As próximas seções percorrem os três.

### O snapshot: a fotografia que viaja com cada mensagem

O mecanismo central é um objeto estruturado, capturado no cliente no momento em que o usuário envia a mensagem, e transportado junto com ela. No `nexxussai-monorepo`, é o `ScreenContextSnapshot` — uma dataclass **congelada** (`frozen=True`) com `screen_id`, `route`, `title`, `fields` tipados, `selected_entity`, `context_hash` e `captured_at` (`apps/api/app/ai_chat/domain/entities/screen_context_snapshot.py`). No cliente, o hook `useScreenContext.ts` expõe `registerScreen()`: cada tela, ao montar, registra sua descrição, e o hook calcula `contextHash` e `capturedAt` na hora (`apps/web/src/features/conversation/model/useScreenContext.ts`). No `ghdaru`, o `ChatPanel` monta o snapshot e o envia com cada `sendMessage` (`apps/web/src/features/conversation/ui/ChatPanel.tsx`).

Três propriedades do snapshot respondem, uma a uma, a três das quatro tensões do capítulo:

1. **Imutabilidade** — o snapshot é fotografia, não referência viva: congelado na construção, ele registra o que o usuário via *naquele instante*, e não muda se a tela mudar depois. É o que torna as duas propriedades seguintes confiáveis.
2. **`context_hash`** — calculado na própria construção: no backend do `nexxussai-monorepo`, o `create()` serializa `screen_id`, `route` e `fields` em JSON canônico (`sort_keys=True`) e aplica SHA-256, truncado a 16 caracteres hexadecimais (`screen_context_snapshot.py`). É a resposta à tensão de **sincronia**: uma proposta de ação nasce amarrada ao hash do contexto que a originou, e a confirmação pode detectar que "o chão se moveu" (o uso na confirmação é o capítulo 05).
3. **`captured_at`** — timestamp em UTC (Coordinated Universal Time) atribuído na construção: permite política de frescor ("snapshot mais velho que N segundos não sustenta ação") sem depender de relógio de conversa.

A quarta tensão — **custo** — é respondida pelo contrato: o snapshot do `nexxussai-monorepo` tem JSON Schema fechado com `additionalProperties: false`, e cada campo é um `fieldValue` tipado (`type`, `value`, `label`, `redacted`) — nada fora do vocabulário sequer valida (`specs/014-chat-lateral-contexto/contracts/screen-context.schema.json`). O alvo de tamanho é explícito no plano da feature: o payload de contexto deve ficar **abaixo de 32 KB para as telas canônicas** (`specs/014-chat-lateral-contexto/plan.md`, Performance Goals). Um snapshot conforme tem esta forma (valores fictícios evidentes):

```json
{
  "screen_id": "pedidos-editar",
  "route": "/pedidos/9999/editar",
  "title": "Editar pedido (exemplo fictício)",
  "fields": {
    "cliente": { "type": "text", "value": "Cliente Exemplo Ltda.", "label": "Cliente" },
    "valor_total": { "type": "number", "value": 1234.56, "label": "Valor total" },
    "observacoes": { "type": "textarea", "value": "entregar até sexta (exemplo)" }
  },
  "selected_entity": { "tipo": "pedido", "id": "pedido-exemplo-9999" },
  "context_hash": "aaaa1111bbbb2222",
  "captured_at": "2026-07-30T12:00:00Z"
}
```

Repare no que **não** está aqui: nenhum token, nenhuma credencial, nenhum campo de senha — e não por disciplina do exemplo, mas por construção: o `create()` da entidade já descarta chaves proibidas antes mesmo de o snapshot existir, e a sanitização server-side (adiante) reforça a garantia.

### Níveis de contexto: domínio, interface, conversa

O `ghdaru` responde à pergunta "*o que* descrever?" com uma arquitetura que o `nexxussai-monorepo` não tem: o snapshot em **três níveis**, documentados em `docs/integration/snapshot.md`:

| Nível | Pergunta que responde | Fonte | Conteúdo |
|---|---|---|---|
| 1 — Domínio | quem / onde / com que permissão | **servidor** (usuário autenticado + perfil do tenant) | tenant, papel, módulos habilitados, entidade em foco |
| 2 — Interface | o que o usuário está vendo | **cliente**, derivado do catálogo semântico | `screen.id`, `screen.route`, campos e estados (só itens com `aiActions ≠ []`) |
| 3 — Conversa | o que já foi dito / o que falta | **servidor** (estado da `ChatSession`) | intenção detectada, proposta de ação pendente + estado, campos faltantes (slot filling) |

O detalhe mais fino do desenho está na coluna "Fonte": **cada nível tem origem e autoridade próprias**. O nível de domínio é derivado *no servidor*, a partir do usuário autenticado e do perfil do tenant — na formulação da própria documentação, "o cliente informa a tela, o servidor sabe quem é" (`docs/integration/snapshot.md`, §2). O cliente não tem como mentir sobre permissões, porque nunca é perguntado sobre elas. O nível de conversa também é composto no servidor, a partir do estado da sessão (a proposta pendente e sua posição na máquina de estados, os campos que ainda faltam). Só o nível de interface vem do cliente — e mesmo ele é derivado do catálogo semântico, nunca do DOM.

Os níveis são também a resposta estrutural à tensão riqueza × custo: em vez de um único objeto que cresce sem critério, **cada nível tem política de inclusão própria** — o domínio é pequeno e sempre presente; a interface inclui apenas itens que o catálogo declara visíveis à IA; a conversa carrega só o necessário para não recomeçar a coleta a cada mensagem. E aqui está a lacuna mais honesta do laboratório A: hoje o `ChatPanel` monta apenas o mínimo do nível 2 — `screen.id` e `route` (`apps/web/src/features/conversation/ui/ChatPanel.tsx`; `estudos/fonte-base-codigo.md`, §2.5). O desenho normativo (requisito FR-011 de `specs/001-fundacao-shell-chat/spec.md`) está à frente da implementação. Longe de enfraquecer o caso, isso o torna instrutivo: o contrato dos três níveis existe, é testável e disciplina a evolução — a riqueza chegará *dentro* dele, não improvisada.

### O registro de telas: fonte de verdade compartilhada

Um snapshot só significa alguma coisa se os dois lados da fronteira concordarem sobre o que é uma tela. O `nexxussai-monorepo` resolve isso tornando a tela uma **entidade de domínio** — `ScreenDefinition`, com campos (`key`, `label`, `kind`, `options`, flag `sensitive`) e ações (`name`, `kind`, `requires_confirmation`) — e não uma convenção de frontend (`apps/api/app/ai_chat/domain/entities/screen_definition.py`). O registro nasce com quatro telas seed — `chat`, `files`, `education-catalog`, `admin-users` — em `apps/api/app/ai_chat/infrastructure/persistence/screen_registry_seed.py`, é espelhado no cliente (`apps/web/src/features/conversation/model/screenRegistry.ts`) e é **descobrível**: `GET /api/chat/screens` devolve as telas ativas (`specs/014-chat-lateral-contexto/contracts/chat-lateral-api.yaml`).

O que o registro compra, concretamente, são três capacidades que nenhuma convenção informal oferece:

1. **Validação** — o sanitizador consulta a definição da tela e descarta qualquer campo do snapshot que ela não conheça (`screen_context_sanitizer.py`): o registro é o gabarito contra o qual o payload do cliente é conferido.
2. **O prompt certo** — o use case `send_lateral_message.py` monta o resumo de contexto entregue ao modelo a partir da **definição**, não do payload cru: `available_fields` (só os não sensíveis), `available_actions` e `current_values` já sanitizados. O modelo vê o que o registro autoriza, na forma que o registro descreve.
3. **Descoberta** — um cliente (ou uma ferramenta de diagnóstico) pode perguntar ao protocolo quais telas ele conhece, em vez de depender de documentação paralela.

É aqui que as alternativas rejeitadas em `specs/014-chat-lateral-contexto/research.md` mostram por que perderam. O prompt hardcoded por tela duplica conhecimento sem contrato: cresce linearmente com o número de telas, diverge silenciosamente do código real e não oferece nada verificável. A introspecção do DOM nem chega a ter *o que* validar. O registro é o meio-termo exato: **uma declaração única, consumida dos dois lados** — o frontend a usa para capturar, o backend para validar, sanitizar e descrever ao modelo.

### A camada semântica: objetos de interface com intenção declarada

O `ghdaru` leva o registro um passo além do "o que existe": ele declara **o que a IA pode fazer com cada item**. A Camada Semântica de Interface registra 16 `SemanticObject` em `apps/web/src/shared/semantic/registry.ts` — cada um com `id`, `kind` (screen, section, component, field, action), `purpose`, estados e, o campo decisivo, `aiActions`: o subconjunto de `READ | FILL_FIELDS | SUBMIT | NAVIGATE` que a IA pode considerar sobre aquele objeto.

A convenção mais elegante do desenho é o caso vazio: **`aiActions: []` significa objeto sensível — invisível para a IA**. O exemplo real está no próprio registro: `identity.login-password-field` declara `aiActions: []` com o propósito explícito "conteúdo e existência de valor nunca expostos à IA" (`registry.ts`). A consequência é arquitetural: o item sensível **nem chega a ser montado** no snapshot — a regra FR-011/SC-006 do `ghdaru` exige que só itens com `aiActions ≠ []` entrem no nível de interface (`docs/integration/snapshot.md`). A sensibilidade deixa de ser filtro a posteriori e vira propriedade declarada do objeto, decidida na origem, por quem conhece a tela.

Comparado ao flag `sensitive` por campo do `nexxussai-monorepo`, o modelo do `ghdaru` é mais expressivo: em vez do binário sensível/não-sensível, ele declara a *intenção* — um campo pode ser legível mas não preenchível (`READ` sem `FILL_FIELDS`), uma seção pode ser navegável mas não submetível. E a camada não é opcional: a regra constitucional do repositório (Princípio VII, citada no cabeçalho do próprio `registry.ts`) exige que todo item de tela consulte o catálogo — usar um objeto existente, herdar com delta (`inheritsFrom`) ou criar um novo registrando-o no mesmo PR. O catálogo não envelhece por esquecimento porque a governança o torna obrigatório — a mesma força que mantém o registro de telas do laboratório B como fonte de verdade, aplicada com mais granularidade.

### Sanitização server-side: o que nunca chega ao modelo

A garantia de privacidade não pode morar na boa vontade de cada tela — precisa ser da plataforma, no servidor, antes de qualquer prompt. O `ghdaru` implementa isso em 16 linhas: `sanitize_snapshot()` percorre o snapshot recursivamente (dicionários e listas, em qualquer profundidade) e descarta toda chave cujo nome contenha um dos `SENSITIVE_MARKERS` — `password`, `senha`, `secret`, `token`, `credential` — com casamento por substring, case-insensitive (`apps/api/src/ghdaru_api/conversation/domain/sanitize.py`). `accessToken`, `user_password`, `api_secret`: todos caem, mesmo sem terem sido previstos um a um. O resultado entra no pipeline como mensagem `system` separada e rotulada — "Contexto de tela (sanitizado)" — nunca misturado ao texto do usuário (`apps/api/src/ghdaru_api/conversation/application/handle_message.py`). E a sanitização está fixada por teste de domínio (`apps/api/tests/conversation/test_conversation.py`).

O `nexxussai-monorepo` chega à mesma propriedade por três filtros compostos (`apps/api/app/ai_chat/domain/services/screen_context_sanitizer.py`): a **denylist exata** (`token`, `access_token`, `refresh_token`, `password`, `secret`, `cookie`, `jwt` — JSON Web Token —, `csrf` — Cross-Site Request Forgery); os campos marcados **`sensitive`** na definição da tela; e — o filtro mais forte — a remoção de **campos desconhecidos**: se `definition.get_field(key)` devolve `None`, o campo não passa. É *default-deny*: o que não está no contrato não viaja, inclusive o que ninguém pensou em proibir. E a defesa começa antes do serviço: o próprio `create()` da entidade já filtra as chaves proibidas na construção do snapshot (`screen_context_snapshot.py`).

Duas estratégias, uma propriedade: **o que é sensível não atravessa**. O `ghdaru` aposta na heurística ampla — a substring captura variações não previstas, ao custo de falsos positivos ocasionais; o `nexxussai-monorepo` aposta no contrato estrito — só passa o que foi declarado, ao custo de manter o registro completo. A composição das duas (heurística por substring **mais** default-deny contra o registro) é mais forte do que qualquer uma isolada — e nenhuma exige confiar no cliente, porque ambas rodam no servidor, na fronteira exata antes do prompt. Contra *quem* essa propriedade defende — e por que sanitizar não basta contra prompt injection — é o assunto do capítulo 07; aqui, o que importa é que a sanitização é **propriedade do snapshot**, verificável e testada, não uma etapa opcional do pipeline.

### O espaço aberto: o que a indústria ainda não padronizou

Colocado o desenho dos laboratórios lado a lado com os protocolos externos, o contraste é nítido. O AG-UI, o mais próximo do tema, oferece `StateSnapshot` e `StateDelta` (JSON Patch, RFC 6902) — a *mecânica* de sincronizar estado entre app e agente — mas o conteúdo do estado é genérico e não normatizado: não há vocabulário de tela, de campo, de entidade selecionada, nem marcação de sensibilidade ([docs.ag-ui.com/concepts/events](https://docs.ag-ui.com/concepts/events)). O MCP tem *resources* — o envelope "dados que o host oferece ao modelo" — sem qualquer semântica de tela ou sanitização normatizada ([spec 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)). O ACP chega perto no espírito — o cliente expõe capacidades tipadas ao agente (`fs/*`, `terminal/*`) — mas no domínio errado: arquivos de editor, não telas de produto. A constatação do panorama é literal: nenhum dos protocolos pesquisados padroniza **contexto de tela** como vocabulário próprio (`estudos/panorama-industria.md`, §Lacunas, captura 2026-07-30).

O que falta, nomeado com precisão, são as três coisas que os dois laboratórios construíram de forma independente: (1) o **vocabulário do conteúdo** — o que é uma tela, um campo tipado, uma entidade selecionada; (2) a **sensibilidade no contrato** — `sensitive` por campo, `aiActions: []` por objeto; (3) a **detecção de staleness** — `context_hash` e `captured_at` como cidadãos do schema. A convergência independente das duas bases nesses três pontos é, até a data de captura, o melhor material disponível para nomear o padrão — e é matéria-prima direta da síntese normativa do capítulo 11.

### Leitura executiva

O contexto de tela é a metade app→IA do protocolo, e nasce de uma decisão negativa: **descrever, nunca inferir** — registrada como decisão formal num laboratório e como princípio constitucional no outro, porque só o que é descrito tem contrato, e só o que tem contrato pode ser validado, sanitizado e autorizado. Sobre essa decisão, três mecanismos se compõem: o *snapshot* imutável que viaja com cada mensagem, com `context_hash` e `captured_at` calculados na construção (sincronia) e schema fechado com teto de payload (custo); o *registro de telas* espelhado front/back com endpoint de descoberta, que transforma "contexto" de convenção frágil em contrato verificável; e a *sanitização server-side*, que garante — por heurística ampla num laboratório, por default-deny no outro — que o sensível nunca atravessa. A camada semântica do `ghdaru` mostra o passo seguinte: sensibilidade e intenção declaradas por objeto, na origem. E a indústria, que já padronizou transporte, eventos e até o gate de aprovação humana (cap. 05), ainda não padronizou nada disso. **O que roubar**: rejeite a inferência *formalmente* (uma decisão registrada, não um hábito); modele o snapshot como valor imutável com hash e timestamp atribuídos na construção; registre telas como entidades de domínio espelhadas nos dois lados, com endpoint de descoberta; declare a sensibilidade no registro (e roube o `aiActions: []` — invisibilidade por declaração vazia); sanitize no servidor combinando denylist por substring com remoção de campos desconhecidos; e estruture o contexto em níveis com fonte e política de inclusão próprias — mesmo que comece enviando só o identificador da tela, o contrato disciplina a riqueza que virá.

*Contrato de frescor: esta leitura expira se um protocolo externo (AG-UI, MCP, ACP, Vercel AI SDK ou OpenAI Apps SDK) padronizar vocabulário de contexto de tela — conteúdo, marcação de sensibilidade ou detecção de staleness. Nesse dia, o espaço aberto fecha, a seção de indústria muda de sinal e este capítulo entra em revisão extraordinária.*

## Verificação

1. Por que as duas bases rejeitaram a introspecção do DOM, e onde essa rejeição está *registrada* em cada uma? (Dica: uma é decisão de pesquisa em spec, a outra é princípio constitucional — objetivo 1.)
2. Um snapshot chega ao servidor com `context_hash` diferente do hash da tela sobre a qual uma proposta de ação será confirmada. O que esse mecanismo detecta, como o hash é calculado e o que a aplicação deve fazer? (Dica: serialização canônica na construção; a tela mudou entre captura e resposta — objetivo 3.)
3. Qual é a diferença entre marcar um campo como `sensitive` no registro de telas e removê-lo na sanitização server-side — e por que o `nexxussai-monorepo` também remove campos *desconhecidos*? (Dica: declaração × garantia; o que não está no contrato não viaja — objetivos 2 e 4.)
4. O AG-UI oferece `StateSnapshot`/`StateDelta`; por que isso *não* resolve o problema deste capítulo? Avalie a resposta sob as quatro tensões. (Dica: mecânica de sincronização × vocabulário do conteúdo — objetivo 5.)

---

## Apêndice — evidência por laboratório

### ghdaru

| Evidência | Path | Fato |
|---|---|---|
| Desenho do snapshot em 3 níveis | `docs/integration/snapshot.md` | Níveis domínio / interface / conversa; contrato de integração usa o mesmo snapshot que a IA; "objeto derivado do catálogo semântico (nunca do DOM cru)". |
| Domínio derivado no servidor | `docs/integration/snapshot.md`, §2 | Nível 1 vem de `authenticated_user` + perfil do tenant (`/me`) — "o cliente informa a tela, o servidor sabe quem é". |
| Contexto declarado como princípio | `.specify/memory/constitution.md` (Princípio IV) | Contexto em 3 níveis obrigatório; separação de camadas; não-negociável. |
| Sanitização server-side | `apps/api/src/ghdaru_api/conversation/domain/sanitize.py` | `sanitize_snapshot()` recursivo (dicts e listas); `SENSITIVE_MARKERS = ("password","senha","secret","token","credential")`; casamento por substring case-insensitive. |
| Snapshot no pipeline da mensagem | `apps/api/src/ghdaru_api/conversation/application/handle_message.py` | Pipeline `mensagem → sanitize → catálogo → intenção`; snapshot sanitizado entra como `LlmMessage(role="system")` separada, rotulada "Contexto de tela (sanitizado)". |
| Camada Semântica de Interface | `apps/web/src/shared/semantic/registry.ts` + `types.ts` | `SemanticObject.aiActions: NAVIGATE\|FILL_FIELDS\|SUBMIT\|READ`; `[]` = sensível; 16 objetos registrados; `identity.login-password-field` com `aiActions: []` ("conteúdo e existência de valor nunca expostos à IA"); regra USAR→HERDAR→CRIAR no cabeçalho do arquivo. |
| Montagem do snapshot no cliente | `apps/web/src/features/conversation/ui/ChatPanel.tsx` | Cliente monta o snapshot enviado com a mensagem — hoje só `screen.id` (derivado do pathname) e `route`. |
| Espelho TypeScript do contrato | `apps/web/src/features/conversation/domain/events.ts` | Tipo `Snapshot` espelhado no frontend. |
| Teste que fixa a sanitização | `apps/api/tests/conversation/test_conversation.py` | Sanitização coberta por teste de domínio (SC-006: "nenhum snapshot contém itens sensíveis"). |

**Lacuna declarada (a lacuna que confirma a categoria):** o cliente envia hoje apenas `screen.id`/`route` — o nível interface completo do desenho de `docs/integration/snapshot.md` ainda não é populado (`estudos/fonte-base-codigo.md`, §2.5). O desenho existe e é normativo (FR-011 de `specs/001-fundacao-shell-chat/spec.md`); a implementação está atrás dele.

### nexxussai-monorepo

| Evidência | Path | Fato |
|---|---|---|
| Entidade do snapshot | `apps/api/app/ai_chat/domain/entities/screen_context_snapshot.py` | `ScreenContextSnapshot` imutável (`frozen=True`): `fields` tipados, `selected_entity`, `context_hash`, `captured_at` (UTC). |
| Hash na construção | `apps/api/app/ai_chat/domain/entities/screen_context_snapshot.py` | `create()` filtra `_FORBIDDEN_KEYS` e calcula `context_hash` = SHA-256 do JSON canônico (`sort_keys=True` de `screen_id`/`route`/`fields`) truncado a 16 hex. |
| Captura no cliente | `apps/web/src/features/conversation/model/useScreenContext.ts` | `registerScreen()` → snapshot com `contextHash` calculado e `capturedAt` ISO. |
| Registro de telas (backend) | `apps/api/app/ai_chat/infrastructure/persistence/screen_registry_seed.py` | Telas seed: `chat`, `files`, `education-catalog`, `admin-users`; campos com `key/label/kind/options/sensitive`; ações com `requires_confirmation`. |
| Registro de telas (frontend) | `apps/web/src/features/conversation/model/screenRegistry.ts` | Registry espelhado no cliente. |
| Descoberta de telas | `specs/014-chat-lateral-contexto/contracts/chat-lateral-api.yaml` | `GET /api/chat/screens` no contrato OpenAPI do protocolo lateral (implementado em `lateral_chat_router.py`). |
| Schema fechado do snapshot | `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json` | JSON Schema com `additionalProperties: false`, `context_hash` (mínimo 16 caracteres) e `fieldValue` tipado (`type/value/label/redacted`). O alvo de payload < 32 KB está em `specs/014-chat-lateral-contexto/plan.md` (Performance Goals). |
| Alternativas rejeitadas (decisão formal) | `specs/014-chat-lateral-contexto/research.md` | Prompt hardcoded por tela: rejeitado; introspecção do DOM: rejeitada. |
| Sanitizador de contexto | `apps/api/app/ai_chat/domain/services/screen_context_sanitizer.py` | Três filtros: denylist exata (`token/access_token/refresh_token/password/secret/cookie/jwt/csrf`), campos `sensitive` da definição e campos desconhecidos (`get_field(...) is None` → descarta). |
| Snapshot no prompt | `apps/api/app/ai_chat/application/use_cases/send_lateral_message.py` | Injeta `context_summary` como system message: `available_fields` (não sensíveis), `available_actions` e `current_values` sanitizados — derivados da **definição**, não do payload cru; `screen_context_hash` gravado no metadata do bloco do usuário. |
| Definição de tela como entidade | `apps/api/app/ai_chat/domain/entities/screen_definition.py` | Tela é entidade de domínio, não convenção de frontend. |

**Lacunas declaradas:** o `context_hash` existe no contrato e na entidade e viaja com a mensagem, mas **não é verificado na confirmação**: o payload de `confirmActionProposal` leva apenas `idempotency_key` (`lateralChatService.ts`) e `ConfirmActionProposal.execute` (`apps/api/app/ai_chat/application/use_cases/confirm_action_proposal.py`) não o lê nem compara; e o ciclo completo de ação sobre a tela depende de lacunas do cap. 05 (`ActionProposalEvent` nunca emitido; frontend sem executor — `estudos/fonte-base-codigo.md`, §3.4). Além disso, o hash calculado no **cliente** (`computeHash` em `useScreenContext.ts`) produz 8 caracteres hexadecimais — abaixo do mínimo de 16 exigido pelo schema (`screen-context.schema.json`) e diferente do SHA-256 truncado do backend: as três definições de `context_hash` divergem entre si (lacuna verificada por leitura direta, 2026-07-30).

### Divergências

| Dimensão | ghdaru | nexxussai-monorepo |
|---|---|---|
| Riqueza do snapshot | Desenho em 3 níveis, implementação mínima (`screen.id`/`route`) | Snapshot rico implementado (`fields`, `selected_entity`), sem o conceito de níveis |
| Sincronia | Sem hash de contexto | `context_hash` + `captured_at` + `idempotency_key` na confirmação |
| Registro | Camada Semântica no frontend (16 `SemanticObject` com `aiActions`) | Registry espelhado front/back + endpoint de descoberta |
| Sanitização | Markers por substring, recursivo | Denylist + campos `sensitive` do registro + remoção de campos desconhecidos |
| Sensibilidade | Declarada no objeto semântico (`aiActions: []`) | Declarada no campo do registro (`sensitive`) |
| Autoridade por nível | Domínio e conversa derivados no servidor; só a interface vem do cliente | Snapshot inteiro capturado no cliente; servidor valida contra o registro |

A composição dos dois é o snapshot "completo" que nenhum dos laboratórios tem sozinho: níveis do `ghdaru` + hash/imutabilidade do `nexxussai` + sensibilidade declarada no registro dos dois lados — matéria-prima da síntese do capítulo 11.
