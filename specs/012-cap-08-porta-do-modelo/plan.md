# Plan 012 — Capítulo 08: A porta do modelo e o tool calling (estrutura)

## Abordagem

Ler os insumos na ordem: constituição → `livro/GUIA-CAPITULO.md` (formato normativo da fase 1) → `livro/README.md` (tese do cap. 08 e fronteiras "08 × 05", "02 × 03") → `estudos/fonte-base-codigo.md` (§2.2 `ai_gateway` + roteador de intenção do ghdaru; §3.2 `ai_orchestration` + pré-história `flows/` do nexxussai; §5 item 6 "a mesma lacuna dupla") → `estudos/panorama-industria.md` (function calling dos vendors, fine-grained tool streaming, `needsApproval` do Vercel AI SDK) → `estudos/candidatos-bibliografia.md` (Toolformer, τ-bench, ambos ⏳).

Em seguida, redigir a estrutura em um único arquivo. "O problema" carrega a tese em prosa completa (segunda fronteira interna + lacuna espelhada) porque não depende de validação pendente — toda evidência é path ou URL já capturada nos estudos. O estado da arte vira esqueleto de H3 anotado (1–2 frases dizendo o que a prosa da fase 2 demonstrará), organizado em dois movimentos: primeiro a porta (normalização, chunks, erros, usage), depois o nascimento da intenção (roteador determinístico → tool calling como ponte). O Apêndice nasce populado com os paths dos dois laboratórios e um `### Divergências` (1 adapter × 4 + factory; normalização no adapter × camada dedicada; usage first-class × porta com tools especificada em doc; roteador em produção × intenção ainda não nascendo no lateral). O registro de expiração E2 é referenciado como nascido deste capítulo, sem editar `livro/HISTORICO.md`.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Toda afirmação da estrutura tem path (`ghdaru`/`nexxussai-monorepo`), URL de indústria ou marca ⏳; papers ⏳ não sustentam o corpo — a seção declara isso explicitamente. |
| II. Fonte-base é o código | ✅ O Apêndice nasce populado a partir de `estudos/fonte-base-codigo.md`; os repositórios-laboratório permanecem somente leitura (nenhuma implementação de tool calling neles — isso está no "Fora de escopo"). |
| III. Esqueleto v3 | ✅ Todas as seções na ordem normativa do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 "Estrutura", com `### Divergências` no Apêndice. |
| IV. Livro vivo | ✅ Cabeçalho com captura 2026-07, revisão 2026-07-30 e link para `../HISTORICO.md`; o capítulo referencia E2 (registro de expiração já criado no HISTORICO); CHANGELOG/HISTORICO atualizados pelo orquestrador no fechamento do lote. |
| V. Segurança | ✅ Nenhum segredo; qualquer exemplo de payload com valores fictícios evidentes. |
| VI. Neutralidade | ✅ Function calling apresentado como capacidade multi-vendor (OpenAI, Anthropic, Vercel AI SDK) por docs oficiais; português com termos técnicos (*tool calling*, *streaming*, *chunk*) sem tradução. |
| VII. Spec-driven | ✅ Esta spec (012) cobre a estrutura do capítulo, com CAs testáveis, plan com Constitution Check e tasks; fase 2 em spec de continuação. |

## Riscos

- Vazamento de escopo para o cap. 05 (FSM de proposta/confirmação) ou para o cap. 03 (vocabulário público de eventos) → mitigação: CA-5 + fronteiras declaradas no próprio texto ("como a intenção nasce" vs. "o que acontece depois"; "chunk interno" vs. "evento público").
- Citação científica prematura → mitigação: tudo ⏳, com declaração explícita de que nada sustenta o corpo até a validação da fase 2.
- Tentação de "resolver" a lacuna (propor implementação de tool calling nas bases) → mitigação: bases são somente leitura; a ponte é descrita como estado da arte + expiração E2, não como tarefa.
