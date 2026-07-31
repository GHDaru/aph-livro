# Spec 017 — Revisão extraordinária: MCP spec 2026-07-28

**Status**: Implementada · **Data**: 2026-07-31 · **Raia**: plena (revisão extraordinária, cross-capítulo)

## O quê

Repesquisar e incorporar ao livro a publicação da spec **final** do Model Context Protocol de 2026-07-28 (núcleo stateless, MRTR substituindo requisições iniciadas pelo servidor, depreciação de Sampling/Roots/Logging/transporte legacy/DCR com política de 12 meses, extensões formais), atualizando os capítulos afetados e o registro do livro vivo.

## Por quê

O **contrato de frescor do cap. 10** nomeava explicitamente "o RC de 2026-07-28 virando final" como evento que invalida a leitura e dispara revisão extraordinária (Constituição, Princípio IV). O evento ocorreu e foi detectado pelo radar do livro-mãe (`harness_engineering/radar/diario/2026-07-31.md`). Os caps. 05/06/09/10/11 citam elicitation/sampling/MCP Apps; o cap. 02 dialoga com a guinada stateless.

## Critérios de aceite

- [x] **CA-1**: `estudos/atualizacao-mcp-2026-07-28.md` existe com os fatos verificados em fonte primária própria (URLs), o que não mudou, e o mapa de impacto por capítulo.
- [x] **CA-2**: cada capítulo com impacto A ou B recebe a atualização **datada no texto** (evento 2026-07-28), sem sobrescrever a história: a mecânica antiga é descrita como "até a spec 2025-06-18 / janela de depreciação", a nova como vigente.
- [x] **CA-3**: o contrato de frescor do cap. 10 é renovado (novo gatilho), e a "última revisão" dos capítulos tocados vai a 2026-07-31.
- [x] **CA-4**: `HISTORICO.md` ganha a edição 0.03 (revisão extraordinária, com o gatilho nomeado) e o snapshot atualiza as datas de revisão dos capítulos tocados; CHANGELOG atualizado.
- [x] **CA-5**: nenhuma afirmação nova sem URL; o argumento central dos caps. 05/06 (gate humano como primitiva de protocolo) é reavaliado explicitamente à luz do MRTR.

## Fora de escopo

Mudanças em capítulos sem impacto; adoção de "MCP Apps como capítulo próprio" (prematuro — reavaliar na janela trimestral 2026-10, como fez o livro-mãe); qualquer alteração nos repositórios-laboratório.
