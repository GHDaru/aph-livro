# Plan 003 — Estrutura do livro

## Abordagem

Sumário derivado da pesquisa (spec 002): os capítulos seguem a anatomia do protocolo — abertura (fronteira e vocabulário), as duas direções (app→IA: contexto; IA→app: eventos), a camada de governança (ações, risco, segurança), a camada de motor (porta do modelo/tool calling), a camada de composição (federação/MCP), e o fechamento comparativo/normativo (estado da arte externo, convergências). Formato de capítulo herdado do esqueleto v3 do harness_engineering com uma adaptação: o Apêndice de evidência é **por laboratório** (ghdaru / nexxussai) em vez de por harness de mercado.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Sumário aponta fonte-base por capítulo; GUIA-CAPITULO exige path/URL/status ✓. |
| II. Fonte-base é o código | ✅ Apêndice por laboratório obrigatório em todo capítulo. |
| III. Esqueleto v3 | ✅ GUIA-CAPITULO é a materialização; ordem de seções fixa. |
| IV. Livro vivo | ✅ HISTORICO com registro de expiração; cabeçalho datado normatizado. |
| V. Segurança | ✅ GUIA proíbe payloads com valores reais. |
| VI. Neutralidade | ✅ Cap. de estado da arte avalia por adoção/governança. |
| VII. Spec-driven | ✅ Uma spec por capítulo mapeada no próprio sumário (ADR 0002). |

## Decisão de numeração

Specs 004–015 ↔ capítulos 00–11 (offset fixo: spec = capítulo + 4). Registrada aqui (reversível; não exige ADR próprio).
