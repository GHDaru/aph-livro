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
| 02 — Transporte e sessão | 2026-07 | texto completo | 2026-07-30 |
| 03 — A voz da IA: eventos tipados | 2026-07 | texto completo | 2026-07-30 |
| 04 — A voz da aplicação: contexto de tela | 2026-07 | texto completo | 2026-07-30 |
| 05 — Ações governadas | 2026-07 | texto completo (piloto) | 2026-07-30 |
| 06 — Comandos de UI e slot filling | 2026-07 | texto completo | 2026-07-30 |
| 07 — Segurança do protocolo | 2026-07 | texto completo | 2026-07-30 |
| 08 — A porta do modelo e o tool calling | 2026-07 | texto completo | 2026-07-30 |
| 09 — Federação e composição | 2026-07 | texto completo | 2026-07-30 |
| 10 — O estado da arte externo | 2026-07 | texto completo | 2026-07-30 |
| 11 — Convergências | 2026-07 | texto completo | 2026-07-30 |

*Estágios (GUIA-CAPITULO §"Estrutura antes do conteúdo"): estrutura → texto completo.*

## Registro de expiração

Previsões e afirmações sensíveis ao tempo, pontuadas contra a realidade a cada edição: 🔵 em aberto · 🟢 confirmada · 🟡 parcial · 🔴 refutada.

| # | Afirmação | Origem | Estado | Evidência |
|---|---|---|---|---|
| E1 | A fronteira app↔agente embutido não terá protocolo dominante único antes de 2027; a padronização virá por composição (eventos tipados + tools + confirmação humana) e não por um spec vencedor. | cap. 11 (estrutura) | 🔵 | — |
| E2 | As duas bases-laboratório implementarão tool calling real (catálogo→tools) antes de adotarem qualquer protocolo externo de UI. | cap. 08 (estrutura) | 🔵 | — |

## Edições

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
