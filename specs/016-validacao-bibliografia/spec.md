# Spec 016 — Validação da bibliografia científica

**Status**: Em implementação · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Validar (ou rejeitar) os papers candidatos de `estudos/candidatos-bibliografia.md`, promovendo os confirmados a status **✓** em `livro/bibliografia.md` — pré-requisito da fase 2 dos capítulos (texto completo), que citarão ciência no corpo.

## Por quê

A Constituição (Princípio I) só permite que um paper sustente afirmação no corpo com status ✓ — ID↔título↔autores confirmados na fonte primária (arXiv) **e** por ≥1 menção independente. Sem esta spec, todos os capítulos da fase 2 teriam de manter a seção de Fundamentos científicos em ⏳.

## Critérios de aceite

- [ ] **CA-1**: cada candidato foi conferido na página de abstract do arXiv (ID, título, autores, ano) via acesso direto.
- [ ] **CA-2**: cada candidato tem ≥1 menção independente verificada (página de venue, Semantic Scholar, repositório oficial do benchmark, ou citação em survey) com URL.
- [ ] **CA-3**: `livro/bibliografia.md` atualizada — confirmados com ✓ (com as duas evidências de validação), não confirmados permanecem ⏳ com o motivo.
- [ ] **CA-4**: `estudos/candidatos-bibliografia.md` atualizado com o resultado por paper.

## Fora de escopo

Leitura crítica profunda de cada paper (acontece na fase 2 do capítulo que o citar, ao traduzi-lo para decisão). Busca de papers novos.
