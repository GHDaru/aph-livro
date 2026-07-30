# ADR 0001 — Livro próprio no repo `protocolos`, com governança híbrida Maestro + editorial

**Data**: 2026-07-30 · **Status**: Aceito · **Decisor**: GHDaru (plano aprovado em sessão)

## Contexto

O tema "protocolo de comunicação aplicação ↔ harness" precisa de um lar. Existem: o livro-mãe **Engenharia de Harness** (`harness_engineering`), que cobre o interior do harness (caps. 02–16) e a fronteira entre harnesses (cap. 17 — MCP, A2A, ACP), mas não a fronteira aplicação↔IA em profundidade; duas implementações reais do protocolo (`ghdaru` e `nexxussai-monorepo`) que convergiram de forma independente; a metodologia **Maestro** (`maestro`) para evolução de features; e o repositório `protocolos`, vazio.

## Decisão

1. O tema vira um **livro próprio**, versionado integralmente no repo `GHDaru/protocolos` — não um capítulo do livro-mãe.
2. A governança é **híbrida**: fluxo de features e enforcement do **Maestro** (spec-driven, raias, DoD verificável, ADRs, CHANGELOG, gates humanos proporcionais ao risco) + padrão **editorial** do harness_engineering (esqueleto v3, evidência por path, livro vivo com datação, bibliografia com status).
3. Os repositórios-fonte (`ghdaru`, `nexxussai-monorepo`, `harness_engineering`, `maestro`) são **somente leitura**.

## Alternativas avaliadas

- **Capítulo/apêndice no livro-mãe** — rejeitada: o tema tem escopo de livro (≥10 capítulos), fonte-base própria (dois produtos, não harnesses de mercado) e ritmo próprio; inflaria o livro-mãe e violaria seu foco (o harness por dentro).
- **Documento de arquitetura no `ghdaru`** — rejeitada: perderia a neutralidade (Princípio VI) e a generalização a partir das *duas* bases; o ghdaru já tem seus docs de integração com outro propósito (prescrever, não ensinar).
- **Governança só Maestro ou só editorial** — rejeitada: Maestro não trata livro/datação/evidência editorial; o editorial do livro-mãe não trata raias/DoD/CHANGELOG. Os dois se compõem sem conflito.

## Justificativa

O usuário pediu explicitamente: metodologia Maestro para evolução, entrega no formato do harness_engineering, registro e versionamento no projeto protocolo. A convergência independente das duas bases de código é a tese empírica que justifica um livro dedicado.

## Consequências

- Nasce a constituição própria (v1.0.0) combinando os dois conjuntos de princípios.
- O livro-mãe é citado como referência (caps. 13, 15, 17), nunca duplicado.
- Todo trabalho futuro do tema acontece neste repositório.
