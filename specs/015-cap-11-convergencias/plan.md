# Plan 015 — Capítulo 11: Convergências (estrutura)

## Abordagem

Ler os insumos na ordem: constituição → `livro/GUIA-CAPITULO.md` (formato normativo da fase 1) → `livro/README.md` (sumário **inteiro** — este capítulo sintetiza todos, e a linha do cap. 11 fixa a tese: "síntese normativa: núcleo + lacunas + roadmap de adoção") → `livro/HISTORICO.md` (registro de expiração E1/E2, que a seção "O que este livro aposta" referencia) → `estudos/fonte-base-codigo.md` (§5 "O que as duas bases ensinam" = a semente dos seis elementos do núcleo; §2.5 e §3.4 = o roadmap de lacunas por laboratório para o Apêndice) → `estudos/panorama-industria.md` (tabela comparativa = coluna "indústria" da matriz consolidada; seção "Lacunas e incertezas" = a lacuna de contexto de tela).

Em seguida, redigir a estrutura em um único arquivo com a disciplina de **composição, não criação**: cada afirmação do núcleo aponta o capítulo (por número) que a estabelece, mais o ponteiro de evidência (path ou URL) já consolidado nos estudos; a matriz laboratórios × indústria entra como **uma** tabela consolidada (o detalhe é do cap. 10); as quatro lacunas são nomeadas com a fonte que as demonstra; o roadmap de adoção ordena a travessia (tool calling → slot filling → MCP como projeção → protocolo externo quando consolidar) citando os capítulos que fundamentam cada passo; e "O que este livro aposta" amarra E1/E2 sem pontuá-las (pontuar é rito do HISTORICO, fora do escopo). O Apêndice, neste capítulo, tem papel próprio: consolidar o roadmap de lacunas de cada laboratório com paths — as ausências como evidência (a "lacuna dupla espelhada" de `estudos/fonte-base-codigo.md` §1 e §5.6).

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Toda afirmação da estrutura tem path (`ghdaru`/`nexxussai-monorepo`), URL de indústria ou marca ⏳; papers ⏳ não sustentam o corpo — a seção declara isso. |
| II. Fonte-base é o código | ✅ O núcleo nasce da convergência das duas bases (`estudos/fonte-base-codigo.md`); a indústria contextualiza; o Apêndice consolida lacunas por path; repos-laboratório permanecem somente leitura. |
| III. Esqueleto v3 | ✅ Todas as seções na ordem normativa do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 "Estrutura"; tabelas para fatos enumeráveis (matriz, lacunas), prosa para explicação. |
| IV. Livro vivo | ✅ Cabeçalho com captura 2026-07, revisão 2026-07-30 e link para `../HISTORICO.md`; as apostas do capítulo são explicitamente pontuáveis (E1/E2); HISTORICO/CHANGELOG atualizados pelo orquestrador no fechamento do lote (fora do escopo, registrado na spec). |
| V. Segurança | ✅ Nenhum segredo; nenhum payload real (capítulo de síntese, sem exemplos de payload). |
| VI. Neutralidade | ✅ Protocolos externos comparados por adoção/governança documentadas (URLs do panorama), vendor-agnóstico; o roadmap recomenda por ordem de dependência técnica, não por vendor; português com termos técnicos sem tradução. |
| VII. Spec-driven | ✅ Esta spec (015) cobre o capítulo, com CAs testáveis, plan com Constitution Check e tasks; fase 2 em spec de continuação. |

## Riscos

- **Conteúdo novo disfarçado de síntese** (a maior tentação de um capítulo de convergências) → mitigação: CA-3 — toda afirmação do núcleo cita o capítulo de origem por número; nada entra que não esteja em 01–10.
- **Duplicar a matriz do cap. 10** → mitigação: uma única tabela consolidada (elemento do núcleo × capítulo × laboratórios × indústria), com remissão explícita ao cap. 10 para o detalhe.
- **Aposta não pontuável** (previsão vaga que nunca poderá ser marcada 🟢/🔴) → mitigação: "O que este livro aposta" só referencia afirmações já registradas com critério datado em `livro/HISTORICO.md` (E1/E2).
