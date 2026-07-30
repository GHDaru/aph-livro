# 09 — Federação e composição

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** por que o contrato de integração de uma aplicação federada é o mesmo contrato que a IA já usa — manifesto + snapshot + catálogo — e o que a decisão negativa do ghdaru ("protocolo de integração novo, separado" descartado em `docs/adr/0003-modelos-integracao-aplicacoes.md`) evita.
2. **Distinguir** os três níveis de integração (interno, federado, headless) e justificar a regra "todo terceiro começa no nível 3".
3. **Analisar** o handshake postMessage `ghd.*` e suas verificações de segurança específicas (`event.origin` conferido nos dois lados; token validado por introspecção, nunca confiado cegamente) — e reconhecer a mesma mecânica no padrão de UI embutida do Model Context Protocol (MCP Apps: iframe sandboxado + postMessage).
4. **Avaliar** o papel do MCP como projeção do catálogo para fora, separando o que as duas bases-laboratório especificaram do que de fato implementaram.

## O problema

Os capítulos anteriores mostraram a aplicação conversando com o *seu próprio* agente: a tela se descreve por snapshot (cap. 04), declara o que pode ser feito por um catálogo (cap. 05) e recebe de volta eventos tipados e comandos de UI (caps. 03 e 06). Mas plataformas reais não são monólitos: hospedam módulos de terceiros, embutem aplicações parceiras, expõem capacidades para fora. A pergunta deste capítulo é o teste de generalidade do protocolo inteiro — **o que acontece quando a aplicação que quer participar da conversa não é sua?**

A resposta óbvia — e errada — é inventar um "protocolo de integração": um SDK de embed, uma API de plugin, um contrato novo entre a plataforma e o terceiro. O laboratório `ghdaru` considerou exatamente essa alternativa e a **descartou por escrito**: o Architecture Decision Record (ADR) `docs/adr/0003-modelos-integracao-aplicacoes.md` (repositório `ghdaru`) registra como opção rejeitada um "protocolo de integração novo, separado do snapshot/catálogo — duplicaria conceitos que a IA já usa". A observação por trás da decisão é simples e estruturante: a IA já exige que qualquer módulo se descreva (snapshot) e declare suas ações (catálogo). Uma aplicação externa que cumpra **esse mesmo contrato** é, do ponto de vista do harness, indistinguível de um módulo interno. Não há um segundo protocolo a inventar — há um único contrato com níveis de confiança distintos.

O que muda entre o módulo interno e o terceiro não é o vocabulário, é a **confiança**. Um módulo interno é confiável por construção; um terceiro precisa se apresentar antes de ser embutido. Daí os dois acréscimos que a federação faz ao protocolo, ambos especificados no `ghdaru` (`docs/integration/`): o **Manifesto de Aplicação** — uma declaração prévia, validável por JSON Schema (`docs/integration/manifest.schema.json`), do que a aplicação é, que ações oferece e com que risco — e o **handshake** `ghd.*` sobre postMessage, em que cada lado verifica a origem do outro (`event.origin`) e o token de sessão é validado por introspecção no servidor (`/auth/introspect`, servido por `apps/api/src/ghdaru_api/http/auth_router.py`), nunca aceito de face. A segurança *geral* do protocolo é assunto do cap. 07; aqui interessa apenas a camada que o embed acrescenta.

Há ainda a direção oposta da federação: se o catálogo declara ações com `input_schema` em JSON Schema, ele está a um passo de ser **projetado para fora** como tools MCP — o `ghdaru` desenhou o catálogo "para virar tools MCP" (`specs/001-fundacao-shell-chat/plan.md`) e reservou o campo `endpoints.mcp_card` no manifesto; o `nexxussai-monorepo` planeja "expor telas como MCP tools" na fase 6 do seu roadmap (`docs/proposta-chat-lateral.md`). E a indústria, em 2025–2026, fez o movimento inverso: com MCP Apps (extensão SEP-1865, de *Specification Enhancement Proposal*) e o precursor MCP-UI, servidores passaram a embutir *interfaces* dentro de hosts de agente — usando iframe sandboxado e postMessage com mensagens JSON-RPC, a **mesma mecânica** do handshake `ghd.*` ([MCP Blog, 2025-11-21](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)). Dois desenhos independentes, o mesmo canal e as mesmas verificações: é a convergência que dá a este capítulo sua tese.

As restrições em tensão: **abertura a terceiros × superfície de ataque** (cada app embutida é conteúdo não confiável com canal para o host); **riqueza da integração × custo de conformidade** (quanto mais o terceiro pode fazer, mais o manifesto e o checklist exigem dele); e **unicidade do contrato × necessidades específicas do embed** (tema, dimensões, ciclo de vida do iframe — coisas que a IA nunca precisou pedir, mas o embed sim). A resolução dessas tensões — um contrato só, com níveis progressivos de confiança e um handshake auditável — é o assunto do estado da arte.

## Fundamentos científicos

Este capítulo **ainda não tem ciência validada**: nenhuma entrada com status ✓ em [`bibliografia.md`](../bibliografia.md) sustenta afirmações sobre federação de aplicações ou UI embutida em hosts de agente. A curadoria registrou a lacuna explicitamente — a literatura científica sobre protocolos de eventos e generative UI era incipiente em 2026-07, e a evidência forte é da indústria (`estudos/candidatos-bibliografia.md`, "Observações de curadoria"). A fase 2 reavaliou a lacuna e **não promoveu** nenhuma candidata: a literatura de interação humano-computador (HCI) sobre mixed-initiative interfaces segue ⏳ e, por regra da Constituição (Princípio I), não sustenta afirmação do corpo. Toda a evidência deste capítulo vem do código e das specs dos dois laboratórios e das fontes de indústria abaixo.

## Fontes da indústria

*(URLs capturadas em 2026-07-30 via `estudos/panorama-industria.md`.)*

- **[MCP Apps — extensão oficial de UI, SEP-1865 — MCP Blog](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)** (spec: [apps.mdx, revisão 2026-01-26](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)): a extensão — escrita em conjunto por maintainers da OpenAI e da Anthropic — entrega UI de servidores dentro de hosts via recursos `ui://`, **iframes sandboxados** e comunicação UI↔host por JSON-RPC sobre postMessage, com aprovação explícita do usuário para tool calls iniciadas pela UI. Tradução para decisão: a indústria padronizou para "UI de terceiro dentro do host" exatamente a mecânica que o handshake `ghd.*` especifica para "app de terceiro dentro da plataforma" — sandbox + postMessage + mensagens auditáveis + aprovação fora do conteúdo embutido.
- **[MCP-UI — projeto comunitário precursor](https://github.com/idosal/mcp-ui)** ([deep dive técnico — WorkOS](https://workos.com/blog/mcp-ui-a-technical-deep-dive-into-interactive-agent-interfaces)): do iframe para o host fluem *intents* tipados (`tool`, `intent`, `prompt`, `notify`, `link`) — a UI **pede**, o host **decide e executa**. Tradução para decisão: taxonomia mínima comprovada para mensagens emitidas por conteúdo não confiável; o mesmo princípio do `ghd.action_result`/`ghd.ui_command` — o embed nunca é o executor.
- **[OpenAI Apps SDK — apps dentro do ChatGPT](https://developers.openai.com/apps-sdk/reference)** ([anúncio](https://openai.com/index/introducing-apps-in-chatgpt/)): construído **sobre MCP**; widgets conversam com o host pela ponte `window.openai` (quatro verbos: `toolOutput`, `callTool`, `sendFollowUpMessage`, `setWidgetState`). Tradução para decisão: o vendor com maior distribuição também concluiu que o contrato de federação é o contrato do agente estendido — não um protocolo à parte; os quatro verbos são um teste de completude para o vocabulário do handshake.
- **[A2A (Agent2Agent) — Agent Card (Google → Linux Foundation)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)**: capacidades declaradas em um card JSON (JavaScript Object Notation) descobrível (`/.well-known/agent.json`). Tradução para decisão: o paralelo direto do Manifesto de Aplicação em outra fronteira (agente↔agente) — declaração prévia, legível por máquina e validável é o padrão emergente para *qualquer* parte que se apresenta a um sistema; a avaliação comparativa completa é do cap. 10.

## O estado da arte

### Três níveis de integração — e por que todo terceiro começa no 3

A federação começa com uma taxonomia de confiança, não com uma API. O ADR `docs/adr/0003-modelos-integracao-aplicacoes.md` (repositório `ghdaru`, aceito em 2026-07-19) define **três níveis de integração** para qualquer aplicação que consuma a plataforma:

| | Nível 1 — Interno | Nível 2 — Federada | Nível 3 — Headless |
|---|---|---|---|
| Onde vive | monorepo da fundação | repositório e deploy próprios | repositório próprio |
| UI no shell | nativa | iframe sandbox / module federation | nenhuma |
| Identidade | compartilhada | token da fundação validado | token/credencial por chamada |
| Assistente transversal | nativo | reusado via manifesto | via API/MCP |
| Contrato | código | **Manifesto de Aplicação** | API + MCP |

A regra de admissão é explícita e unidirecional: **todo terceiro começa no Nível 3** — a menor superfície de risco, sem nenhuma UI dentro da plataforma — e só sobe ao Nível 2 com **manifesto revisado** e montagem em **iframe sandbox**. O Nível 1 é exclusivo de código da própria fundação; terceiro nenhum chega lá. A escada existe porque confiança se demonstra, não se declara: uma app headless que valida tokens corretamente, respeita isolamento de tenant e publica contrato OpenAPI provou, em produção, os pré-requisitos do embed.

O detalhe revelador é que **os níveis não mudam o contrato — mudam a confiança concedida sobre o mesmo contrato**. O Nível 3 já tem um contrato legível por máquina: o endpoint `POST /auth/introspect` (`apps/api/src/ghdaru_api/http/auth_router.py`, `ghdaru`) recebe um token e devolve o `Principal` — usuário, `tenant_id`, capabilities, expiração — ou apenas `{"active": false}`, sem vazar mais nada; o docstring do endpoint o nomeia literalmente "Contrato Nível 3 (Manifesto, Elemento 1)". O Nível 2 acrescenta a esse mesmo contrato as camadas de apresentação (manifesto, tema, handshake). E a plataforma registra a diferença como um único campo: o registro de módulos do tenant ganha `type: "internal" | "federated" | "headless"` (`docs/integration/manifesto-aplicacao.md`, §4) — três palavras para três níveis de confiança sobre um vocabulário só.

### O Manifesto de Aplicação: declarar-se antes de entrar

Antes de qualquer pixel dentro do shell, a app federada **se declara**. O Manifesto de Aplicação (`docs/integration/manifesto-aplicacao.md`, `ghdaru`) é o contrato de **cinco elementos**, cada um espelhando uma capacidade que a plataforma já usa internamente:

| # | Elemento | O que a app se compromete a fazer |
|---|---|---|
| 1 | Identidade | validar o token da fundação a cada requisição (sem login próprio); honrar tenant + capabilities |
| 2 | Marca | aplicar os tokens de tema do tenant como CSS variables, com fallback — troca de marca sem deploy |
| 3 | Camada Semântica | expor snapshot de 3 níveis da tela ativa + publicar suas ações no Catálogo de Ações |
| 4 | Design System | passar no checklist de interface (foco/teclado, contraste, alvos mínimos) |
| 5 | Auditoria | devolver traço de execução para 100% das ações — sem traço, ação rejeitada |

O Elemento 3 é o coração — e é onde a tese do capítulo fica literal. Cada ação da app federada é um `ActionSpec` com `action_id`, `intent_keywords`, `risk` (`read | confirm`) e `input_schema` em JSON Schema — **exatamente o formato do catálogo interno do cap. 05**. O próprio documento formula o insight: "o manifesto do Nível 2 é essencialmente o mesmo contrato que a IA já usa (snapshot + catálogo) […] Não há um segundo protocolo a inventar".

A declaração não é prosa de boa vontade: é **validável mecanicamente**. O JSON Schema `docs/integration/manifest.schema.json` (`ghdaru`, draft 2020-12, `additionalProperties: false`) exige `app_id`, `name`, `level`, `mount`, `screens`, `actions`, `capabilities_required` e `endpoints` — e codifica as regras dos níveis como validação condicional: `mount` diferente de `none` obriga `url` **e** `origin` (a origem esperada, "verificada nos dois lados do postMessage", na descrição do próprio campo); `level: "federated"` obriga `theme` e `screens`. Em `endpoints`, `validate_token` e `openapi` são obrigatórios; `mcp_card` é o gancho opcional da projeção MCP (próxima seção). Um excerto fictício:

```jsonc
{
  "app_id": "app-exemplo-ficticio",
  "name": "App Exemplo",
  "level": "federated",
  "mount": "iframe",
  "url": "https://app-exemplo.invalid/embed",
  "origin": "https://app-exemplo.invalid",
  "endpoints": { "validate_token": "/me", "openapi": "https://app-exemplo.invalid/openapi.json" },
  "actions": [{
    "action_id": "exemplo.criar_item",
    "title": "Criar um item",
    "intent_keywords": ["criar item"],
    "risk": "confirm",
    "input_schema": { "type": "object", "properties": { "titulo": { "type": "string" } }, "required": ["titulo"] }
  }],
  "capabilities_required": ["exemplo:read", "exemplo:write"]
}
```

É a mesma família de desenho que o A2A chama de Agent Card (`/.well-known/agent.json`): antes de participar, a parte se apresenta em um documento legível por máquina, com capacidades e requisitos — e a revisão desse documento é o gate humano da admissão.

### O handshake `ghd.*`: postMessage como canal federado

Aprovado o manifesto, a app entra no shell dentro de um **iframe sandbox** — para terceiros, a montagem por iframe + postMessage é obrigatória (`docs/integration/instrucoes-construcao.md`, C4, `ghdaru`). O canal fala seis tipos de mensagem, todos prefixados `ghd.*` (`docs/integration/manifesto-aplicacao.md`, §3):

| `type` | Direção | Payload |
|---|---|---|
| `ghd.handshake` | shell → app | `token`, `tenant`, `capabilities` |
| `ghd.ready` | app → shell | `appId`, `screens[]` |
| `ghd.theme` | shell → app | `tokens` de tema |
| `ghd.snapshot` | app → shell | snapshot (3 níveis, sanitizado) |
| `ghd.ui_command` | shell → app | `command` (`ui.navigate`, `ui.form.patch`, …) |
| `ghd.action_result` | app → shell | `trace` (resultado + duração + status) |

Repare na assimetria: só as **três primeiras** mensagens são novas — identidade, apresentação e tema, as necessidades específicas do embed. As três últimas são os **mesmos tipos do protocolo interno**: o snapshot do cap. 04, o comando de UI do cap. 06, o traço do cap. 05. O handshake não cria um vocabulário; ele abre um túnel para o vocabulário que já existia — a versão em mensagens da decisão "um contrato, não dois".

A segurança específica do canal (só a do canal — o modelo de ameaça completo é do cap. 07) tem duas verificações inegociáveis. Primeira: **`event.origin` é conferido nos dois lados** — a app rejeita mensagens que não venham da origem da fundação, e o shell rejeita mensagens que não venham da `origin` declarada no manifesto; mensagem de origem desconhecida é descartada, sempre. Segunda: **o token nunca é aceito de face**. Ele trafega **uma única vez**, no `ghd.handshake`, e a app o valida contra a fundação por introspecção antes de renderizar qualquer coisa — `/auth/introspect` devolve o `Principal` ou `{"active": false}` (`apps/api/src/ghdaru_api/http/auth_router.py`, `ghdaru`). Um exemplo fictício da abertura do canal:

```jsonc
// shell → iframe (a app só processa após conferir event.origin)
{
  "type": "ghd.handshake",
  "token": "token-exemplo-ficticio",
  "tenant": "tenant-exemplo",
  "capabilities": ["exemplo:read", "exemplo:write"]
}

// iframe → shell, somente depois de introspectar o token contra a fundação
{
  "type": "ghd.ready",
  "appId": "app-exemplo-ficticio",
  "screens": ["exemplo.lista", "exemplo.detalhe"]
}
```

O ADR 0003 registra os dois riscos monitorados do canal com suas mitigações — "origem forjada no postMessage (mitigado por verificação de `origin` nos dois lados); token confiado sem validação (mitigado por exigir validação contra a fundação no Elemento 1)". Ou seja: as duas verificações não são boas práticas anexadas depois; são a resposta escrita aos dois ataques que o desenho previu.

### Um contrato, não dois: a decisão negativa estruturante

O ADR 0003 descarta três alternativas, e a terceira é a que estrutura o capítulo: "**protocolo de integração novo, separado do snapshot/catálogo** — duplicaria conceitos que a IA já usa; mais superfície, menos coerência" (`docs/adr/0003-modelos-integracao-aplicacoes.md`, `ghdaru`; as outras duas — tudo como módulo interno, tudo como iframe genérico sem manifesto — caem por acoplamento e por perda de governança, respectivamente).

A decisão negativa vale mais que muitas positivas porque **elimina uma classe inteira de trabalho futuro**. Um protocolo de plugin separado exigiria seu próprio formato de descrição de tela, seu próprio inventário de ações, sua própria noção de risco e de traço — tudo coisa que o protocolo da IA já tem. Pior: os dois vocabulários divergiriam com o tempo, e cada app precisaria implementar ambos. Ao reusar snapshot + catálogo, o custo marginal de se federar despenca: **quem já fala com a IA já sabe se federar**. Uma app que expõe snapshot de 3 níveis e publica `ActionSpec` para o seu próprio assistente cumpre o Elemento 3 do manifesto sem escrever uma linha nova — restam identidade, tema e o handshake, que são configuração e cerimônia, não modelagem.

O corolário aparece na coluna "Assistente transversal" da tabela de níveis: dentro da app federada, o assistente da plataforma funciona **com a mesma governança** — classe de risco, confirmação, sanitização, traço — porque as mensagens que atravessam o iframe são as mesmas que atravessam o processo interno. A federação não ganhou um protocolo; ganhou um *transporte* (postMessage) e um *rito de admissão* (manifesto + revisão). É a síntese nº 7 de `estudos/fonte-base-codigo.md`: a federação é a extensão natural do contrato, não um contrato novo.

### MCP como projeção do catálogo para fora

A federação tem uma segunda direção: em vez de trazer uma app para dentro do shell, **exportar as capacidades da plataforma para fora** — para qualquer host de agente que fale Model Context Protocol. E aqui o desenho das duas bases converge de novo, porque a matéria-prima é a mesma: um catálogo cujas ações já carregam `input_schema` em JSON Schema é, estruturalmente, uma lista de tools MCP esperando um servidor.

Os dois laboratórios formularam essa projeção de forma independente. No `ghdaru`, ela é intenção de primeira classe: o plano da fundação registra "catálogo desenhado para virar tools MCP" (`specs/001-fundacao-shell-chat/plan.md`), a constituição do produto tem um princípio "API + MCP" (Princípio VI), as instruções de construção obrigam apps headless a expor capacidades "como servidor MCP […] declarando um *server card*" (`docs/integration/instrucoes-construcao.md`, B1) e o manifesto reserva o campo `endpoints.mcp_card` (`docs/integration/manifest.schema.json`). No `nexxussai-monorepo`, a mesma seta aparece no roadmap do chat lateral: a fase 6 lista "Futuro: expor telas como MCP tools" (`docs/proposta-chat-lateral.md`).

O estado real, porém, precisa ser dito com a honestidade que a Constituição deste livro exige: **a projeção está especificada em ambas as bases e implementada em nenhuma**. No `ghdaru`, não existe uma linha de código de MCP server — a intenção vive em specs e princípios. No `nexxussai-monorepo`, existe código, mas desconectado: `apps/api/app/mcp/server.py` é um protótipo FastMCP de análise de pull requests (servidor `github_pr_analysis`, transporte stdio) que nenhum caminho do chat lateral ou do registry de telas alcança; e o adapter `apps/api/app/ai_chat/infrastructure/mcp/mcp_registry_adapter.py` sustenta um `GET /api/mcp/servers` cujo `list_servers()` devolve lista vazia. A superfície existe; o conteúdo, não. Para o leitor, a lição é dupla: a projeção catálogo→MCP é o caminho natural (duas equipes o desenharam sem se ver), e ela ainda é uma ponte a atravessar — o custo de atravessá-la é baixo justamente porque o catálogo já fala JSON Schema.

### O movimento inverso da indústria: MCP Apps e MCP-UI

Enquanto os laboratórios projetam o catálogo *para fora*, a indústria de 2025–2026 percorreu a mesma ponte no sentido contrário: embutir UI de terceiros *para dentro* de hosts de agente. O MCP Apps (SEP-1865) — extensão oficial escrita em conjunto por maintainers da OpenAI e da Anthropic — permite que um servidor MCP declare recursos de UI com o esquema `ui://`, renderizados pelo host em **iframes sandboxados**, com comunicação UI↔host por JSON-RPC sobre postMessage e **aprovação explícita do usuário** para tool calls iniciadas pela UI ([spec 2026-01-26](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx); [MCP Blog](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)). O precursor comunitário MCP-UI havia estabelecido a taxonomia mínima do canal: do iframe para o host fluem intents tipados — `tool`, `intent`, `prompt`, `notify`, `link` — e o host permanece o único executor ([repo](https://github.com/idosal/mcp-ui)).

A simetria com o handshake `ghd.*` é ponto a ponto:

| Mecânica | handshake `ghd.*` (ghdaru, spec) | MCP Apps / MCP-UI (indústria) |
|---|---|---|
| Quem embute quem | plataforma embute app de terceiro | host de agente embute UI de servidor |
| Contenção | iframe sandbox | iframe sandbox |
| Canal | postMessage, mensagens `ghd.*` tipadas | postMessage, JSON-RPC do MCP |
| Declaração prévia | Manifesto de Aplicação revisado | recursos `ui://` pré-declarados |
| Ação vinda do embed | `ghd.action_result`/propostas sob risco+confirmação | tool call da UI sob aprovação explícita do usuário |

Dois desenhos independentes chegaram ao mesmo pacote — sandbox, postMessage, mensagens tipadas auditáveis, decisão de execução **fora** do conteúdo embutido — a partir de pontos de partida opostos. Essa convergência é o argumento empírico mais forte do capítulo: quando um laboratório spec-first e um consórcio de vendors resolvem o mesmo problema com a mesma mecânica sem se consultar, a mecânica provavelmente é o mínimo estrutural do problema, não uma preferência de design. A *avaliação comparativa* desses protocolos externos — adoção, governança, completude — é assunto do cap. 10; aqui eles entram apenas como a outra metade da federação.

### Construir para federar: instruções e checklist de conformidade

Contrato sem verificação é promessa. O `ghdaru` fecha o ciclo com um documento prescritivo — `docs/integration/instrucoes-construcao.md` — que traduz o manifesto em regras **DEVE/NÃO DEVE** organizadas em três partes cumulativas: a Parte A vale para todo nível (identidade validada a cada requisição, isolamento de tenant, ações como `ActionSpec`, sanitização de contexto, traço obrigatório, degradação controlada, OpenAPI publicado); a Parte B soma as obrigações do headless (capacidades expostas como API/MCP, autorização por chamada, erros categorizados); a Parte C soma as do federado (manifesto validável, tema do tenant, snapshot de 3 níveis, handshake com `origin` verificado, checklist de interface, UI commands entendidos e eventos tipados emitidos). Uma matriz mapeia instrução × nível, e um **checklist de conformidade** lista o que precisa estar verde antes de submeter — incluindo "Handshake com `origin` verificado nos dois lados" e "Manifesto valida contra `manifest.schema.json`".

O checklist é o que transforma federação de acordo bilateral em **protocolo**: a admissão deixa de depender de quem o terceiro é e passa a depender do que ele demonstra — quem passa no checklist entra, e o portão entre o Nível 3 e o Nível 2 é objetivo, não político. O documento termina com o princípio-guia que resume a postura: "o que não está declarado, não existe — a fundação prefere recusar uma integração incompleta a aceitar uma insegura". E o caminho está desenhado para ser percorrido primeiro em casa: o candidato de estreia nomeado no manifesto é o TOC Builder, uma aplicação da própria casa com repositório e release próprios, que entra como Nível 3 e sobe ao Nível 2 implementando o contrato — provando a escada ponta a ponta antes de qualquer terceiro externo (`docs/integration/manifesto-aplicacao.md`, §6).

### Leitura executiva

A federação é o teste de generalidade do protocolo app↔harness — e o protocolo passa no teste **não crescendo**: a decisão estruturante do ADR 0003 é negativa (nenhum protocolo de integração novo), os três níveis graduam confiança sobre um contrato único, o manifesto de cinco elementos é a versão validável do que a IA já exige de qualquer módulo, e o handshake `ghd.*` apenas transporta por postMessage os mesmos tipos que o protocolo interno já fala — acrescentando só identidade, apresentação e tema, com `event.origin` conferido nos dois lados e token introspectado no servidor. O MCP é a mesma federação na direção de saída (catálogo→tools, especificado nas duas bases, implementado em nenhuma), e o MCP Apps/MCP-UI é a prova externa: a indústria padronizou, para UI embutida em hosts de agente, exatamente a mecânica do handshake. **O que roubar**: (1) não invente um segundo protocolo — o contrato que sua aplicação já oferece à IA (snapshot + catálogo) é o contrato de integração de terceiros; (2) exija um manifesto validável por JSON Schema antes de embutir qualquer coisa — declaração prévia com ações, risco e capacidades, como o Agent Card do A2A; (3) no handshake, verifique `event.origin` dos dois lados e introspecte o token no servidor — o embed nunca é confiável, nem o host presumido; (4) declare o catálogo com `input_schema` desde o dia 1 — a projeção para MCP tools sai quase de graça; (5) todo terceiro começa headless e sobe por conformidade demonstrada em checklist, não por confiança declarada.

*Contrato de frescor: esta leitura expira se a mecânica de embed do MCP Apps mudar (a spec é recente — revisão 2026-01-26 — e em evolução: abandono de iframe/postMessage ou novo modelo de aprovação invalida a tabela de simetria), ou se uma das bases-laboratório implementar o MCP server ou o handshake `ghd.*` — nesse dia, "especificado em ambas, implementado em nenhuma" deixa de ser verdade e a seção de projeção precisa de nova captura.*

## Verificação

1. Uma equipe propõe criar um "SDK de plugins" com contrato próprio para apps parceiras. Que decisão registrada em ADR do `ghdaru` contradiz essa proposta, e qual é o argumento? (Objetivo 1; alternativa descartada no `docs/adr/0003-modelos-integracao-aplicacoes.md` — o que seria duplicado?)
2. Uma app de terceiro pede acesso direto ao nível federado, "porque já usamos o mesmo framework". Em que nível ela deve começar e o que a faz subir? (Objetivo 2; regra de admissão dos três níveis + checklist de `docs/integration/instrucoes-construcao.md`.)
3. No handshake `ghd.*`, por que o host não pode simplesmente confiar no token que a app embutida apresenta — e que duas verificações a spec exige? (Objetivo 3; `event.origin` nos dois lados; o que `/auth/introspect` devolve; compare com o sandbox + aprovação do MCP Apps.)
4. "As duas bases já suportam MCP" — verdadeiro ou falso, e com que evidência? (Objetivo 4; separe *desenhado para* (`specs/001-fundacao-shell-chat/plan.md`, fase 6 do roadmap) de *implementado* (`apps/api/app/mcp/server.py` desconectado, registry vazio).)

---

## Apêndice — evidência por laboratório

> Evidência por path — material de complementação, expandido a cada rodada de captura.

### ghdaru

Federação **inteiramente especificada, sem código** — a lacuna é declarada e é, ela própria, evidência da categoria (`estudos/fonte-base-codigo.md`, §2.4–2.5):

- `docs/adr/0003-modelos-integracao-aplicacoes.md` (aceito 2026-07-19) — três níveis de integração (interno/federado/headless); regra de confiança "todo terceiro começa no Nível 3"; riscos monitorados do canal (origem forjada; token sem validação) com mitigações; **decisão negativa estruturante**: "protocolo de integração novo, separado do snapshot/catálogo — duplicaria conceitos que a IA já usa; mais superfície, menos coerência" (descartado, junto com "tudo como módulo interno" e "iframe genérico sem manifesto").
- `docs/integration/manifesto-aplicacao.md` — Manifesto de Aplicação com **5 elementos** (identidade, marca, camada semântica, design system, auditoria) + sequência do handshake postMessage: `ghd.handshake` / `ghd.ready` / `ghd.theme` / `ghd.snapshot` / `ghd.ui_command` / `ghd.action_result`; `event.origin` verificado nos dois lados; token trafega uma vez e é validado via `/auth/introspect`; §4: registro de módulos com `type: internal|federated|headless`; §6: TOC Builder como candidato de estreia (Nível 3 → Nível 2).
- `docs/integration/manifest.schema.json` — JSON Schema (draft 2020-12, `additionalProperties: false`) validável do manifesto: required `app_id, name, level, mount, screens, actions, capabilities_required, endpoints`; `actions[]` com `action_id`, `intent_keywords`, `risk (read|confirm)` e `input_schema`; `endpoints.validate_token`/`openapi` obrigatórios e `mcp_card` opcional; validação condicional (`mount != none` → `url`+`origin`; `level: federated` → `theme`+`screens`); campo `origin`: "verificada nos dois lados do postMessage".
- `docs/integration/instrucoes-construcao.md` — regras DEVE/NÃO DEVE em três partes cumulativas (A comum, B headless, C federada) + matriz instrução×nível + checklist de conformidade; C6: tabela UI commands recebidos × eventos tipados emitidos; princípio-guia "o que não está declarado, não existe". Complementos: `docs/integration/snapshot.md`, `docs/integration/guia-integracao.md`, `docs/integration/README.md` — onde vive o insight "o contrato do Nível 2 é o mesmo que a IA já usa — snapshot + catálogo; não há um segundo protocolo a inventar".
- `apps/api/src/ghdaru_api/http/auth_router.py` — **código existente** que a federação reutiliza: `POST /auth/introspect` devolve o `Principal` (`user`, `tenant_id`, `capabilities`, `expires_at`) ou `{"active": false}` sem vazar mais nada; docstring: "Contrato Nível 3 (Manifesto, Elemento 1)".
- `specs/001-fundacao-shell-chat/plan.md` — catálogo "desenhado para virar tools MCP"; `.specify/memory/constitution.md` (do `ghdaru`), Princípio VI: API + MCP.
- **Lacunas declaradas**: handshake `ghd.*` sem nenhuma implementação; MCP server previsto com zero código.

### nexxussai-monorepo

O espelho invertido: **código embrionário de MCP, sem especificação de federação** (`estudos/fonte-base-codigo.md`, §3.1–3.4):

- `docs/proposta-chat-lateral.md` — roadmap de maturidade em 6 fases; **fase 6: "Futuro: expor telas como MCP tools"** — a mesma projeção do catálogo para fora, formulada de forma independente.
- `apps/api/app/mcp/server.py` — protótipo FastMCP isolado (servidor `github_pr_analysis`, transporte stdio, código de setup de notebook no topo), **desconectado da aplicação**: nenhum caminho do chat lateral ou do registry de telas chega até ele.
- `apps/api/app/ai_chat/infrastructure/mcp/mcp_registry_adapter.py` — superfície `GET /api/mcp/servers` com registry vazio (`list_servers()` → `[]`): o endpoint existe, o conteúdo não.
- **Lacunas declaradas**: MCP só superfície; não há manifesto, handshake ou níveis de integração especificados para apps de terceiros.

### Divergências

As lacunas são espelhadas em direções opostas — e a simetria sustenta a tese. O `ghdaru` percorreu o caminho **spec-first**: manifesto, handshake, níveis e checklist completos em `docs/integration/`, zero código. O `nexxussai-monorepo` percorreu o caminho **code-first**: um servidor FastMCP e um endpoint de registry no código, zero especificação de federação. Nenhum dos dois atravessou a ponte; ambos apontaram para o mesmo lado dela — o catálogo declarado (com `input_schema` por ação) como a matéria-prima tanto do embed federado quanto das tools MCP. Lidas juntas, as duas metades formam o roteiro de implementação que um leitor pode seguir: a especificação do `ghdaru` diz *o que* construir; a superfície do `nexxussai-monorepo` mostra *onde* o código se encaixa quando existir.
