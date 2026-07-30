# ADR 0002 — Uma spec por capítulo, no mínimo

**Data**: 2026-07-30 · **Status**: Aceito · **Decisor**: GHDaru (instrução explícita na aprovação do plano)

## Contexto

O plano original previa uma única spec (`001-estruturacao-livro`) cobrindo toda a estruturação de capítulos. Na aprovação, o usuário determinou: *"Rode uma spec para cada capítulo no mínimo, se tiver uma feature grande pode abrir em uma spec específica."*

## Decisão

- **Cada capítulo do livro tem sua própria spec** em `specs/NNN-cap-XX-nome/`, com o ciclo completo (spec → plan com Constitution Check → tasks → implement → DoD).
- Features transversais (fundação, pesquisa, sumário/formato) também têm specs próprias.
- Uma feature grande dentro de um capítulo (ex.: benchmark comparativo de protocolos externos) pode abrir spec específica adicional.

## Alternativas avaliadas

- **Uma spec para o livro inteiro** — rejeitada pelo decisor: granularidade grossa demais; capítulos evoluem em ritmos diferentes e a rastreabilidade spec↔entrega se perde.
- **Spec por lote de capítulos** — rejeitada: mesmo problema em menor grau; a heurística Maestro (ambiguidade × raio de impacto) aplica-se por capítulo.

## Justificativa

Alinha com o Maestro: a spec é o input que gera o artefato, e cada capítulo é uma entrega verificável com critérios de aceite próprios (objetivos de Bloom, evidência com paths, fontes validadas). WIP pequeno, revisão por capítulo.

## Consequências

- Numeração: 001 fundação · 002 pesquisa · 003 sumário e formato do livro · 004+ um por capítulo.
- O overhead por spec é mantido baixo (spec/plan/tasks concisos), proporcional à raia.
- O CHANGELOG e o HISTORICO referenciam a spec de cada entrega.
