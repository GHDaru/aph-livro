# Plan 005 — Capítulo 01: Fundamentos e vocabulário (estrutura)

## Abordagem

Derivar a estrutura inteiramente do material já consolidado, sem pesquisa nova: a tese e a fronteira vêm do sumário (`livro/README.md`, cap. 01 e §"Fronteiras entre capítulos"); a espinha do estado da arte é a tabela terminológica de `livro/glossario.md` (semente em `estudos/fonte-base-codigo.md` §4), reduzida aos sete conceitos fundamentais; a evidência por path do Apêndice vem de `estudos/fonte-base-codigo.md` (§§2–3, com as lacunas declaradas de §§2.5 e 3.4 como "lacuna que confirma a categoria"); as fichas de indústria selecionam do `estudos/panorama-industria.md` as fontes que validam as *categorias* do vocabulário (AG-UI, MCP, ACP, Vercel AI SDK, computer use como anti-padrão), não seu detalhe; os papers pertinentes entram como candidatos ⏳ de `estudos/candidatos-bibliografia.md`, declarados como não-sustentantes até validação. O estado da arte organiza-se em H3 que espelham a tese (assimetria → fluxo completo com diagrama textual → tabela dos sete conceitos → direção app→IA → direção IA→app → governança transversal → Leitura executiva), cada um com 2–4 frases e ponteiro explícito ao capítulo vizinho que detalha o tema — mantendo transporte, semântica de eventos e FSM fora daqui.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência acima de retórica | ✅ Toda afirmação de implementação com path + repositório; indústria com URL em "tradução para decisão"; ciência só ⏳, declarada como não-sustentante do corpo. |
| II. A fonte-base é o código | ✅ Apêndice por laboratório populado a partir de `estudos/fonte-base-codigo.md`; repositórios-fonte não são tocados; corpo sintetiza, paths vivem no Apêndice. |
| III. Método pedagógico / esqueleto v3 | ✅ Todas as seções na ordem normativa do `livro/GUIA-CAPITULO.md`; verbos de Bloom; tabela para o enumerável (sete conceitos), prosa para a explicação; siglas por extenso na 1ª ocorrência; uma ideia por H3. |
| IV. Livro vivo | ✅ Cabeçalho com data de captura (2026-07) e última revisão (2026-07-30); Leitura executiva com contrato de frescor; HISTORICO atualizado no fechamento do lote (fora desta spec, registrado no Fora de escopo). |
| V. Segurança | ✅ Nenhum segredo; exemplos (fluxo, nomes de eventos) sem payloads reais; qualquer payload futuro será fictício evidente. |
| VI. Neutralidade e acessibilidade | ✅ Equivalentes de indústria citados por adoção documentada, vendor-agnóstico; português com termos técnicos (*harness*, *streaming*, *tool calling*) sem tradução forçada. |
| VII. Spec-driven (Maestro) | ✅ Spec própria (005 ↔ cap. 01, offset da spec 003); raia plena; DoD por critérios de aceite verificáveis; gate humano da estrutura antes da fase 2; CHANGELOG/HISTORICO no fechamento do lote pelo orquestrador. |
