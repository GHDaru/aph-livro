# Tasks — Spec 026

- [x] T1 — `conformidade/package.json` (pacote próprio; ajv/ajv-formats).
- [x] T2 — `conformidade/servidor-referencia.mjs` (Nível 1 em memória + 11 sabotagens parametrizadas).
- [x] T3 — `conformidade/suite.mjs` (11 checks executáveis + lista DECLARADO; schemas reais do Anexo A; relatório e exit code).
- [x] T4 — `conformidade/autoteste.mjs` (íntegro passa; cada uma das 11 sabotagens obtém o status esperado no check alvo (incl. caminho AVISO)).
- [x] T5 — `conformidade/README.md` (página do site: o quê, como rodar, verificado × declarado, limites).
- [x] T6 — CI: Gate 3 no `.github/workflows/ci.yml`.
- [x] T7 — Padrão: §0 (limitação), §7 (ponteiro), §8 (Níveis 2–3); `livro/README.md` (Parte normativa); `build.mjs` (navegação).
- [x] T8 — Glossário: caixa-preta, servidor de referência, sabotagem (teste de mutação).
- [x] T9 — Gates locais: autoteste + wire + build verdes.
- [x] T10 — Revisão independente em contexto fresco (com execução própria dos gates e experimento com alvo de nomes locais); 0 críticos, 4 importantes e 6 menores — todos corrigidos ou registrados como decisão antes do registro.
- [x] T11 — CHANGELOG + HISTORICO (edição 0.08); commit; push; merge na `main` (publica).
