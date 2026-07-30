# Plan 004 — Capítulo 00: Introdução (estrutura)

## Abordagem

Ler os insumos na ordem: constituição → `livro/GUIA-CAPITULO.md` (formato normativo da fase 1) → `livro/README.md` (tese e fronteiras do cap. 00) → `estudos/fonte-base-codigo.md` (evidência por path da convergência) → `estudos/panorama-industria.md` (fontes externas com URL) → `estudos/candidatos-bibliografia.md` (papers ⏳). Em seguida, redigir a estrutura do capítulo em um único arquivo: "O problema" em prosa completa (é a seção que carrega a tese e não depende de validação pendente), estado da arte como esqueleto de H3 anotado (2–4 frases por seção dizendo o que a prosa da fase 2 demonstrará), fontes candidatas transcritas dos estudos com URL/⏳, e Apêndice populado apenas com a evidência de **convergência** (paths que mostram a topologia comum), deixando o detalhe de cada mecanismo para os caps. 02–09.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Toda afirmação da estrutura tem path (`ghdaru`/`nexxussai-monorepo`), URL de indústria ou marca ⏳; papers ⏳ não sustentam o corpo — a seção declara isso. |
| II. Fonte-base é o código | ✅ O Apêndice nasce populado a partir de `estudos/fonte-base-codigo.md`; repos-laboratório permanecem somente leitura. |
| III. Esqueleto v3 | ✅ Todas as seções na ordem normativa do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 "Estrutura". |
| IV. Livro vivo | ✅ Cabeçalho com captura 2026-07, revisão 2026-07-30 e link para `../HISTORICO.md`; HISTORICO/CHANGELOG atualizados pelo orquestrador no fechamento do lote (fora do escopo desta entrega, registrado na spec). |
| V. Segurança | ✅ Nenhum segredo; exemplos fictícios evidentes quando houver. |
| VI. Neutralidade | ✅ Protocolos externos (AG-UI, MCP Apps, ACP, Vercel AI SDK) apresentados por adoção/governança documentadas, vendor-agnóstico; português com termos técnicos sem tradução. |
| VII. Spec-driven | ✅ Esta spec (004) cobre o capítulo, com CAs testáveis, plan com Constitution Check e tasks; fase 2 em spec de continuação. |

## Riscos

- Vazamento de escopo (aprofundar mecanismos dos caps. 02–09) → mitigação: CA-5 + esqueleto de H3 limitado a "o que a seção demonstrará".
- Citação científica prematura → mitigação: tudo ⏳, com declaração explícita de que nada sustenta o corpo até a validação da fase 2.
