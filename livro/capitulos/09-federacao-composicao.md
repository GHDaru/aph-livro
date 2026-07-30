# 09 — Federação e composição

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

> **Estágio: estrutura (fase 1)** — "O problema" redigido; estado da arte em esqueleto de H3; fontes candidatas listadas; evidência por path mapeada no Apêndice. Prosa integral na fase 2 (spec 013).

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

Este capítulo **ainda não tem ciência validada**: nenhuma entrada com status ✓ em [`bibliografia.md`](../bibliografia.md) sustenta afirmações sobre federação de aplicações ou UI embutida em hosts de agente. A curadoria registrou a lacuna explicitamente — a literatura científica sobre protocolos de eventos e generative UI era incipiente em 2026-07, e a evidência forte é da indústria (`estudos/candidatos-bibliografia.md`, "Observações de curadoria"; candidata futura: literatura de interação humano-computador (HCI) sobre mixed-initiative interfaces — ⏳). A evidência deste capítulo vem do código e das specs dos dois laboratórios e das fontes de indústria abaixo; a fase 2 reavaliará se há ciência a promover.

## Fontes da indústria

*(URLs capturadas em 2026-07-30 via `estudos/panorama-industria.md`; revalidar antes da prosa da fase 2.)*

- **[MCP Apps — extensão oficial de UI, SEP-1865 — MCP Blog](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)** (spec: [apps.mdx, revisão 2026-01-26](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)): a extensão — escrita em conjunto por maintainers da OpenAI e da Anthropic — entrega UI de servidores dentro de hosts via recursos `ui://`, **iframes sandboxados** e comunicação UI↔host por JSON-RPC sobre postMessage, com aprovação explícita do usuário para tool calls iniciadas pela UI. Tradução para decisão: a indústria padronizou para "UI de terceiro dentro do host" exatamente a mecânica que o handshake `ghd.*` especifica para "app de terceiro dentro da plataforma" — sandbox + postMessage + mensagens auditáveis + aprovação fora do conteúdo embutido.
- **[MCP-UI — projeto comunitário precursor](https://github.com/idosal/mcp-ui)** ([deep dive técnico — WorkOS](https://workos.com/blog/mcp-ui-a-technical-deep-dive-into-interactive-agent-interfaces)): do iframe para o host fluem *intents* tipados (`tool`, `intent`, `prompt`, `notify`, `link`) — a UI **pede**, o host **decide e executa**. Tradução para decisão: taxonomia mínima comprovada para mensagens emitidas por conteúdo não confiável; o mesmo princípio do `ghd.action_result`/`ghd.ui_command` — o embed nunca é o executor.
- **[OpenAI Apps SDK — apps dentro do ChatGPT](https://developers.openai.com/apps-sdk/reference)** ([anúncio](https://openai.com/index/introducing-apps-in-chatgpt/)): construído **sobre MCP**; widgets conversam com o host pela ponte `window.openai` (quatro verbos: `toolOutput`, `callTool`, `sendFollowUpMessage`, `setWidgetState`). Tradução para decisão: o vendor com maior distribuição também concluiu que o contrato de federação é o contrato do agente estendido — não um protocolo à parte; os quatro verbos são um teste de completude para o vocabulário do handshake.
- **[A2A — Agent Card (Google → Linux Foundation)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)**: capacidades declaradas em um card JSON descobrível (`/.well-known/agent.json`). Tradução para decisão: o paralelo direto do Manifesto de Aplicação em outra fronteira (agente↔agente) — declaração prévia, legível por máquina e validável é o padrão emergente para *qualquer* parte que se apresenta a um sistema; a avaliação comparativa completa é do cap. 10.

## O estado da arte

*(Esqueleto da fase 1 — cada H3 resume em 2–4 frases o que a prosa da fase 2 demonstrará.)*

### Três níveis de integração — e por que todo terceiro começa no 3

O ADR `docs/adr/0003-modelos-integracao-aplicacoes.md` (repositório `ghdaru`) define três níveis: **interno** (módulo da própria plataforma, confiança por construção), **federado** (app externa embutida via handshake) e **headless** (integração só por API, sem UI embutida — o `Principal` devolvido por `/auth/introspect` é seu contrato legível por máquina). A regra de admissão: **todo terceiro começa no nível 3** e sobe conforme demonstra conformidade. A seção mostrará que os níveis não mudam o contrato — mudam a confiança concedida sobre o mesmo contrato.

### O Manifesto de Aplicação: declarar-se antes de entrar

O manifesto (`docs/integration/manifesto-aplicacao.md`, `ghdaru`) é a declaração prévia da app federada, com **5 elementos**, validável mecanicamente pelo JSON Schema `docs/integration/manifest.schema.json` (draft 2020-12): inclui `actions[]` — cada ação com `risk` e `input_schema`, o espelho exato do Catálogo de Ações do cap. 05 —, `endpoints.mcp_card` e `capabilities_required`. A seção detalhará os 5 elementos e o paralelo com o Agent Card do A2A. Exemplos usarão valores fictícios evidentes (ex.: `"app_id": "app-exemplo-ficticio"`).

### O handshake `ghd.*`: postMessage como canal federado

A sequência especificada em `docs/integration/manifesto-aplicacao.md` (`ghdaru`): `ghd.handshake` → `ghd.ready` → `ghd.theme` → `ghd.snapshot` → `ghd.ui_command` → `ghd.action_result` — a app embutida envia snapshot e recebe comandos pelos **mesmos tipos** que o protocolo interno usa (caps. 04 e 06). Segurança específica do canal (só a do canal — o modelo de ameaça completo é do cap. 07): `event.origin` verificado **nos dois lados**, e token de sessão validado via `/auth/introspect` (`apps/api/src/ghdaru_api/http/auth_router.py` devolve o `Principal`) — nunca confiado cegamente; payloads de exemplo com `"token": "exemplo-ficticio"`.

### Um contrato, não dois: a decisão negativa estruturante

O coração do capítulo: a alternativa "protocolo de integração novo, separado do snapshot/catálogo" foi avaliada e **descartada** no ADR 0003 porque "duplicaria conceitos que a IA já usa" (`docs/adr/0003-modelos-integracao-aplicacoes.md`, `ghdaru`). A seção argumentará que a decisão negativa é o que torna a federação barata: quem já fala com a IA já sabe se federar — snapshot + catálogo servem aos dois públicos (agente e plataforma hospedeira). É a síntese nº 7 de `estudos/fonte-base-codigo.md`.

### MCP como projeção do catálogo para fora

O Model Context Protocol é a direção de saída da federação: o catálogo do `ghdaru` foi "desenhado para virar tools MCP" (`specs/001-fundacao-shell-chat/plan.md`; Princípio VI "API + MCP" da constituição do `ghdaru`; campo `endpoints.mcp_card` no manifesto), e o `nexxussai-monorepo` prevê "expor telas como MCP tools" na fase 6 de `docs/proposta-chat-lateral.md`. Estado real, declarado como lacuna: no `ghdaru`, zero código de MCP server; no `nexxussai-monorepo`, um protótipo FastMCP **desconectado da aplicação** (`apps/api/app/mcp/server.py`) e um `GET /api/mcp/servers` cujo registry devolve lista vazia (`mcp_registry_adapter.py`). A projeção é convergente nas duas bases — e implementada em nenhuma.

### O movimento inverso da indústria: MCP Apps e MCP-UI

Enquanto os laboratórios projetam o catálogo *para fora*, a indústria embute UI de terceiros *para dentro* de hosts de agente: MCP Apps (SEP-1865) usa recursos `ui://`, iframe sandboxado e JSON-RPC sobre postMessage com aprovação explícita de tool calls da UI ([spec 2026-01-26](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)); o precursor MCP-UI definiu os intents `tool/intent/prompt/notify/link` ([repo](https://github.com/idosal/mcp-ui)). A seção mostrará a simetria com o handshake `ghd.*` — mesma mecânica, direções opostas — e delimitará: a *avaliação comparativa* desses protocolos é do cap. 10; aqui eles entram só como extensão da federação.

### Construir para federar: instruções e checklist de conformidade

`docs/integration/instrucoes-construcao.md` (`ghdaru`) traduz o contrato em regras **DEVE/NÃO DEVE** e um checklist de conformidade — o portão objetivo entre os níveis de integração (complementado por `docs/integration/snapshot.md`, `guia-integracao.md` e `README.md`). A seção argumentará que conformidade verificável é o que transforma federação de acordo bilateral em protocolo: quem passa no checklist entra, independentemente de quem seja.

### Leitura executiva

*(Rascunho — consolidar na fase 2.)* O que roubar: (1) **não invente um segundo protocolo** — o contrato que sua aplicação já oferece à IA (snapshot + catálogo) é o contrato de integração de terceiros; a decisão negativa do ADR 0003 economiza um vocabulário inteiro; (2) exija um **manifesto validável por JSON Schema** antes de embutir qualquer coisa — declaração prévia com ações, risco e capacidades, como o Agent Card do A2A; (3) no handshake, **verifique `event.origin` dos dois lados e introspecte o token no servidor** — o embed nunca é confiável, nem o host presumido; (4) declare o catálogo com `input_schema` desde o dia 1: a projeção para MCP tools sai quase de graça; (5) todo terceiro **começa headless** e sobe por conformidade demonstrada. Contrato de frescor: a spec de MCP Apps é recente (revisão 2026-01-26) e em evolução — mudança na mecânica de embed (iframe/postMessage) dispara revisão extraordinária deste capítulo.

## Verificação

1. Uma equipe propõe criar um "SDK de plugins" com contrato próprio para apps parceiras. Que decisão registrada em ADR do `ghdaru` contradiz essa proposta, e qual é o argumento? (Dica: alternativa descartada no `docs/adr/0003-modelos-integracao-aplicacoes.md` — o que seria duplicado?)
2. Uma app de terceiro pede acesso direto ao nível federado, "porque já usamos o mesmo framework". Em que nível ela deve começar e o que a faz subir? (Dica: regra de admissão dos três níveis + checklist de `docs/integration/instrucoes-construcao.md`.)
3. No handshake `ghd.*`, por que o host não pode simplesmente confiar no token que a app embutida apresenta — e que duas verificações a spec exige? (Dica: `event.origin` nos dois lados; o que `/auth/introspect` devolve; compare com o sandbox + aprovação do MCP Apps.)
4. "As duas bases já suportam MCP" — verdadeiro ou falso, e com que evidência? (Dica: separe *desenhado para* (`specs/001-fundacao-shell-chat/plan.md`, fase 6 do roadmap) de *implementado* (`apps/api/app/mcp/server.py` desconectado, registry vazio).)

---

## Apêndice — evidência por laboratório

### ghdaru

Federação **inteiramente especificada, sem código** — a lacuna é declarada e é, ela própria, evidência da categoria (`estudos/fonte-base-codigo.md`, §2.4–2.5):

- `docs/adr/0003-modelos-integracao-aplicacoes.md` — três níveis de integração (interno/federado/headless); **decisão negativa estruturante**: "protocolo de integração novo, separado do snapshot/catálogo — duplicaria conceitos que a IA já usa" (descartado).
- `docs/integration/manifesto-aplicacao.md` — Manifesto de Aplicação com **5 elementos** + sequência do handshake postMessage: `ghd.handshake` / `ghd.ready` / `ghd.theme` / `ghd.snapshot` / `ghd.ui_command` / `ghd.action_result`; `event.origin` verificado nos dois lados; token validado via `/auth/introspect`.
- `docs/integration/manifest.schema.json` — JSON Schema (draft 2020-12) validável do manifesto: `actions[]` com `risk` e `input_schema`, `endpoints.mcp_card`, `capabilities_required`.
- `docs/integration/instrucoes-construcao.md` — regras DEVE/NÃO DEVE + checklist de conformidade; complementos: `docs/integration/snapshot.md`, `docs/integration/guia-integracao.md`, `docs/integration/README.md` — onde vive o insight "o contrato do Nível 2 é o mesmo que a IA já usa — snapshot + catálogo; não há um segundo protocolo a inventar".
- `apps/api/src/ghdaru_api/http/auth_router.py` — **código existente** que a federação reutiliza: `/auth/introspect` devolve o `Principal` (contrato legível por máquina do nível headless).
- `specs/001-fundacao-shell-chat/plan.md` — catálogo "desenhado para virar tools MCP"; `.specify/memory/constitution.md` (do `ghdaru`), Princípio VI: API + MCP.
- **Lacunas declaradas**: handshake `ghd.*` sem nenhuma implementação; MCP server previsto com zero código.

### nexxussai-monorepo

O espelho invertido: **código embrionário de MCP, sem especificação de federação** (`estudos/fonte-base-codigo.md`, §3.1–3.4):

- `docs/proposta-chat-lateral.md` — roadmap de maturidade em 6 fases; **fase 6: "expor telas como MCP tools"** — a mesma projeção do catálogo para fora, formulada de forma independente.
- `apps/api/app/mcp/server.py` — protótipo FastMCP isolado, **desconectado da aplicação** (nenhum caminho do chat lateral ou do registry de telas chega até ele).
- `mcp_registry_adapter.py` — superfície `GET /api/mcp/servers` com registry vazio (`list_servers()` → `[]`): o endpoint existe, o conteúdo não.
- **Lacunas declaradas**: MCP só superfície; não há manifesto, handshake ou níveis de integração especificados para apps de terceiros.

### Divergências

As lacunas são espelhadas em direções opostas — e a simetria sustenta a tese. O `ghdaru` percorreu o caminho **spec-first**: manifesto, handshake, níveis e checklist completos em `docs/integration/`, zero código. O `nexxussai-monorepo` percorreu o caminho **code-first**: um servidor FastMCP e um endpoint de registry no código, zero especificação de federação. Nenhum dos dois atravessou a ponte; ambos apontaram para o mesmo lado dela — o catálogo declarado (com `input_schema` por ação) como a matéria-prima tanto do embed federado quanto das tools MCP. A fase 2 explorará essa complementaridade como o roteiro de implementação que um leitor pode seguir.
