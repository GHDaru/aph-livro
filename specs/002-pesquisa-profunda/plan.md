# Plan 002 — Pesquisa profunda

## Abordagem

Duas frentes paralelas:

1. **Interna** (fonte-base): varredura profunda dos repositórios `ghdaru` e `nexxussai-monorepo` por agentes de exploração (docs, specs, constituições, código de domínio/aplicação/adapters/frontend, testes), consolidada pelo orquestrador em `estudos/fonte-base-codigo.md`. Critério: todo achado com path.
2. **Externa** (indústria + ciência): agente curador de pesquisa (padrão Maestro: fontes citadas) com WebSearch/WebFetch, produzindo `estudos/panorama-industria.md` (fichas "tradução para decisão" + tabela comparativa) e `estudos/candidatos-bibliografia.md` (papers ⏳).

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ É o objeto da spec: paths na frente interna, URLs na externa, ⏳ para o não confirmado. |
| II. Fonte-base é o código | ✅ Frente interna primeiro e mais profunda; repos tratados como somente leitura. |
| III. Esqueleto v3 | N/A (estudos não são capítulos; formato livre com cabeçalho datado). |
| IV. Livro vivo | ✅ Ambos os arquivos datam a captura (2026-07). |
| V. Segurança | ✅ Nenhum segredo citado; exemplos de payload fictícios. |
| VI. Neutralidade | ✅ Panorama cobre múltiplos vendors; avaliação por adoção/governança. |
| VII. Spec-driven | ✅ Esta spec; decisões de fundação já em ADR 0001–0003. |

## Riscos

- Fontes web inacessíveis via proxy → mitigação: fontes alternativas (docs oficiais, GitHub) e marca ⏳.
- Alucinação de referência científica → mitigação: status ⏳ obrigatório até validação dupla na spec do capítulo consumidor.
