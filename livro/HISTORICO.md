# Histórico do livro

Este livro é **datado por construção** (Constituição, Princípio IV): a fronteira aplicação↔IA está em padronização ativa, e afirmações verdadeiras hoje expiram. Este arquivo registra as edições e mantém o registro de expiração.

## Como ler as datas do livro

- **Data do evento** — no corpo dos capítulos, imutável ("em dez/2025 a spec X foi publicada").
- **Data de captura** ("estado da arte capturado em") — no cabeçalho de cada capítulo; tudo no capítulo é verdadeiro *até essa data*.
- **Data de revisão** — última passada editorial; não implica recaptura do estado da arte.

Reavaliar = nova rodada com nova data, nunca sobrescrever a história.

## Snapshot por capítulo

| Capítulo | Estado da arte capturado em | Estágio | Última revisão |
|---|---|---|---|
| 00 — Introdução | 2026-07 | texto completo | 2026-07-30 |
| 01 — Fundamentos e vocabulário | 2026-07 | texto completo | 2026-07-30 |
| 02 — Transporte e sessão | 2026-07 | texto completo | 2026-07-31 |
| 03 — A voz da IA: eventos tipados | 2026-07 | texto completo | 2026-08-03 |
| 04 — A voz da aplicação: contexto de tela | 2026-07 | texto completo | 2026-07-30 |
| 05 — Ações governadas | 2026-07 | texto completo (piloto) | 2026-08-03 |
| 06 — Comandos de UI e slot filling | 2026-07 | texto completo | 2026-07-31 |
| 07 — Segurança do protocolo | 2026-07 | texto completo | 2026-08-03 |
| 08 — A porta do modelo e o tool calling | 2026-07 | texto completo | 2026-07-30 |
| 09 — Federação e composição | 2026-07 | texto completo | 2026-07-31 |
| 10 — O estado da arte externo | 2026-07 | texto completo | 2026-08-03 |
| 11 — Convergências | 2026-07 | texto completo | 2026-08-03 |

*Estágios (GUIA-CAPITULO §"Estrutura antes do conteúdo"): estrutura → texto completo.*

## Registro de expiração

Previsões e afirmações sensíveis ao tempo, pontuadas contra a realidade a cada edição: 🔵 em aberto · 🟢 confirmada · 🟡 parcial · 🔴 refutada.

| # | Afirmação | Origem | Estado | Evidência |
|---|---|---|---|---|
| E1 | A fronteira app↔agente embutido não terá protocolo dominante único antes de 2027; a padronização virá por composição (eventos tipados + tools + confirmação humana) e não por um spec vencedor. | cap. 11 (estrutura) | 🔵 | 2026-08-03: +1 convergência independente — o caso externo Traycer (`estudos/caso-traycer.md`) compõe vocabulário fechado de eventos + gate humano como estado, sem adotar spec único. Evidência acumulada; pontuação só em janela. |
| E2 | As duas bases-laboratório implementarão tool calling real (catálogo→tools) antes de adotarem qualquer protocolo externo de UI. | cap. 08 (estrutura) | 🔵 | — |

## Edições

### Edição 0.07 — 2026-08-03 · Padrão APH v0.3: incorporação do caso Traycer (spec 025)

- **`livro/padrao-aph.md` → v0.3**, incorporando os 8 candidatos do estudo da spec 024 (`estudos/caso-traycer.md`): emenda no APH-1.3 (mecanismo equivalente de entrega — snapshot + deltas com fonte durável/CRDT, com a garantia "não perder a conversa" como critério); nota no APH-2.2 (segundo regime de evolução: versionamento negociado por método, fail-closed); **APH-5.6 e APH-5.7 novos** (🧪 DEVERIA — gates pendentes sobrevivem à reconexão; fila de aprovação separada por classe de ação); evidência externa registrada no APH-6.4 (terceira implementação independente de slot filling). Regra preservada: evidência de caso externo **não promove** requisito a ✅ — nenhum 🧪 virou DEVE.
- **O fio não mudou**: nenhum schema alterado; Anexo A permanece v0.2 (declarado no §9); gate de wire segue verde sem edição.
- **Notas datadas (2026-08-03)** nos caps. 03 e 05 ("o que roubar": `retryable`, progresso *replace-latest*, sumário/detalhe de tool pré-computados, sentinelas de capacidade; APH-5.6/5.7), 07 (contraexemplo A2A — cautela não-herdada e deadlock de supervisão como fronteira do argumento), 10 (linha Traycer na matriz + nota sobre a natureza da linha) e 11 (L2 confirmada pelo caso; nenhuma lacuna muda de estado). Evidência registrada em E1 (🔵 mantido). Glossário: entrada CRDT.
- **IA (A3)**: agente **Claude Code (Anthropic)**; pedido ("proximo") e curadoria humanos (GHDaru).

### Edição 0.06 — 2026-07-31 · Padrão APH v0.2: Anexo A, wire format (spec 021)

- **Anexo A** (`livro/padrao/anexo-a-wire-format.md`): o formato exato das mensagens — 5 JSON Schemas draft 2020-12 validáveis (`livro/padrao/schemas/`: evento com payload por kind, snapshot fechado, ação de catálogo, confirmação, erro), superfície HTTP de referência, registro mínimo de 7 códigos de erro, mapeamento nome-APH↔laboratórios e regras de versionamento do fio.
- **Enforcement**: `publicar/valida-wire.mjs` (ajv) valida 32 casos — exemplos válidos aceitos e contraexemplos rejeitados (incl. `senha_vazada` barrado pelo snapshot fechado) — como **gate de CI**: a publicação do site falha se o wire quebrar. A sequência de exemplo do anexo é literalmente os casos do gate.
- **Verificação**: revisão independente com execução própria dos gates e leitura direta dos laboratórios — 4 achados importantes corrigidos, incluindo um na direção inversa da usual: `expired` estava rebaixado a 🧪 quando o laboratório B o implementa (promovido a ✅); `captured_at` rebaixado a opcional (sem base para required); `context_hash` adicionado à confirmação (o contrato do laboratório B o exige — APH-5.4); exemplo do texto sincronizado verbatim com o gate.
- **IA (A3)**: agente **Claude Code (Anthropic)**; decisão da v0.2 e curadoria humanas (GHDaru).

### Edição 0.05 — 2026-07-31 · Glossário didático e regra anti-jargão (spec 019)

- **`livro/glossario.md`** reescrito em três camadas: os sete objetos do protocolo · ~30 siglas por extenso **e em palavras simples** · ~30 termos técnicos explicados em português claro com analogias (harness = "o carro em volta do motor"; hash = "impressão digital"; iframe sandboxado = "janela dentro da janela, de mãos amarradas"). Ambiguidade *token* (credencial × unidade de texto) explicitada.
- **Regra editorial permanente** (retro → regra versionada, Maestro): todo termo/sigla usado no livro DEVE ter entrada no glossário criada no mesmo commit; jargão órfão é defeito de revisão (GUIA-CAPITULO). Padrão APH ganhou ponteiro didático no cabeçalho.
- **IA (A3)**: agente **Claude Code (Anthropic)**; pedido e curadoria humanos (GHDaru).

### Edição 0.04 — 2026-07-31 · Padrão APH v0.1: a proposta normativa (spec 018)

- **Diagnóstico de bagagem** (pedido do Accountable): régua comprovado→DEVE / desenhado→DEVERIA-experimental / aberto→fora do normativo; limitações declaradas (n=2 laboratórios do mesmo autor, sem suíte de conformidade). Veredito: suficiente para v0.1.
- **`livro/padrao-aph.md`**: o padrão para aplicações que conversam integralmente com o harness via chat — 3 níveis de conformidade (Observador/Operador/Federado), ~40 requisitos APH-x.y com palavra normativa e maturidade declarada (✅/🧪), FSM de referência unificada, compatibilidade com AG-UI/MCP 2026-07-28/Vercel/ACP, checklist de autoavaliação e contrato de frescor próprio. Sumário do livro ganhou a "Parte normativa".
- **Verificação**: revisão independente em contexto fresco contra os 12 capítulos — 1 achado crítico (contradição níveis×checklist) e 4 importantes (sobre-afirmação de evidência no §5; citação fora da interseção; checklist incompleto; colisão de nomenclatura nível×requisito), todos corrigidos; os 5 pontos sensíveis (idempotência, `context_hash`, slot filling, tool calling, federação) confirmados como honestamente 🧪.
- **IA (A3)**: agente **Claude Code (Anthropic)**; diagnóstico e proposta sob curadoria humana (GHDaru); merge na `main` aguarda gate humano.

### Edição 0.03 — 2026-07-31 · Revisão extraordinária: MCP spec 2026-07-28 (spec 017)

- **Gatilho**: o contrato de frescor do cap. 10 nomeava "o RC de 2026-07-28 virando final" — a spec final do Model Context Protocol foi publicada em 2026-07-28 (detecção via radar do livro-mãe `harness_engineering/radar/diario/2026-07-31.md`; reverificação própria em fonte primária, `estudos/atualizacao-mcp-2026-07-28.md`).
- **O que mudou no MCP**: núcleo stateless (fim do handshake/`Mcp-Session-Id`), MRTR substituindo requisições iniciadas pelo servidor (elicitation sobrevive re-encanada; **sampling depreciado**), headers de roteamento, cache declarativo, framework formal de extensões (MCP Apps via `extensions`), política de depreciação com janela de 12 meses, e — achado que o radar não destacou — **remoção da resumabilidade SSE** (`Last-Event-ID`), antítese do `seq`+replay do laboratório A.
- **Capítulos atualizados (com datação do evento no texto)**: 10 (impacto A — seção MCP, matriz, leitura executiva e **contrato de frescor renovado**); 02, 05, 06, 09 e 11 (impacto B — notas datadas; o argumento central do gate humano saiu *reforçado*: o padrão sobreviveu à reescrita da spec que o carrega).
- **Verificação**: fatos confirmados em fonte primária (blog oficial, changelog 2026-07-28, página de elicitation da spec nova, releases no GitHub); links relativos conferidos.
- **IA (A3)**: agente **Claude Code (Anthropic)**; gatilho reportado pelo humano; merge na `main` autorizado pelo humano em 2026-07-31.

### Edição 0.02 — 2026-07-30 · Fase 2: texto completo dos 12 capítulos (specs 004–016)

- **Spec 016**: bibliografia validada — 7 papers promovidos a ✓ com dupla evidência (arXiv + venue/repositório oficial); ⭐ atribuído aos âncoras dos caps. 00, 05, 07 e 08; convenção de menção-contexto registrada.
- **Specs 004–015 (fase 2)**: os 11 capítulos em estágio "estrutura" ganharam prosa integral, em três ondas (01–04; 06–09; 00, 10, 11), cada capítulo com evidência conferida por leitura direta nos laboratórios antes de entrar no texto. Caps. 00, 05, 07 e 08 com ciência ✓ sustentando o corpo.
- **Verificação**: duas revisões independentes em contexto fresco (onda 1: ~55 paths conferidos, 4 achados importantes; ondas 2–3: ~75 paths e ~50 trechos lidos, 4 achados importantes) — todos os achados corrigidos, incluindo dois de Princípio I (status ✓/⏳ inconsistente; afirmação sobre verificação de `context_hash` refutada pelo código e corrigida para "desenhado, não verificado" nos caps. 04/05/11). Pendências da edição 0.01 resolvidas (pergunta do objetivo 3 do cap. 10; siglas do cap. 02). Verificação mecânica: links relativos resolvem; nenhum banner de fase restante.
- **Achado novo da fase 2** (leitura direta): divergência tripla do `context_hash` no `nexxussai-monorepo` (cliente 8 hex × schema ≥16 × backend SHA-256[:16]) — registrada no Apêndice do cap. 04 e na L3 do cap. 11.
- **IA (A3)**: agente **Claude Code (Anthropic)**; orquestração e curadoria humanas (GHDaru); merge da edição 0.01 na `main` autorizado pelo humano em 2026-07-30.

### Edição 0.01 — 2026-07-30 · Fundação e estruturação do livro (specs 001–015)

- **Specs 001–003**: fundação do repositório (constituição v1.0.0, ADRs 0001–0003), pesquisa profunda registrada em `estudos/` (fonte-base em código dos dois laboratórios com paths; panorama da indústria com URLs; candidatos a bibliografia ⏳) e estrutura do livro (sumário com 12 capítulos e fronteiras explícitas, GUIA-CAPITULO, aparato do livro vivo).
- **Specs 004–015 (uma por capítulo, ADR 0002)**: os 12 capítulos entregues — caps. 00–04 e 06–11 na fase *estrutura* (esqueleto v3 com "O problema" redigido, fontes e Apêndice de evidência por path); **cap. 05 (Ações governadas) completo, como piloto do formato**.
- **Verificação**: conferência mecânica de links relativos (todos resolvem); revisão independente em contexto fresco contra constituição/GUIA/fronteiras (~60 paths conferidos por existência nos repositórios-fonte, citações conferidas verbatim) — 2 achados críticos de evidência e 6 secundários, todos corrigidos nesta edição; pendências registradas para a fase 2: pergunta dedicada ao objetivo 3 do cap. 10 e expansão de siglas discutíveis (REST/CDN/HTTP no cap. 02).
- **IA (A3)**: agente **Claude Code (Anthropic)**; orquestração e curadoria humanas (GHDaru); decisões em `adr/0001`–`0003`.
