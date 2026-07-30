# Plan 001 — Fundação do repositório

## Abordagem

Escrever os artefatos de governança à mão (sem scaffolding externo), adaptando: constituição = 7 princípios (I–VI editoriais herdados do harness_engineering; VII = fluxo Maestro). ADRs imutáveis desde o dia zero. CHANGELOG no formato Keep a Changelog pt-BR.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ A própria constituição exige path/URL/status; nenhuma afirmação factual nos artefatos de fundação carece de fonte (decisões citam sessão/repos). |
| II. Fonte-base é o código | ✅ Repos-fonte declarados somente leitura no CLAUDE.md e na constituição. |
| III. Esqueleto v3 | N/A (sem capítulo nesta spec); o esqueleto é normatizado para as próximas. |
| IV. Livro vivo | ✅ HISTORICO será criado na spec 003 (estrutura do livro); datação normatizada. |
| V. Segurança | ✅ Nenhum segredo em nenhum artefato. |
| VI. Neutralidade | ✅ Constituição vendor-agnóstica. |
| VII. Spec-driven | ✅ Esta própria fundação roda como spec 001 com ADRs e CHANGELOG. |

Sem segredo · sem identificador interno de modelo nos artefatos versionados.

## Decisões (viram ADR)

- ADR 0001 — livro próprio + governança híbrida
- ADR 0002 — uma spec por capítulo
- ADR 0003 — branch única da sessão
