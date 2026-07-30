# Plan 010 — Capítulo 06: Comandos de UI e slot filling (estrutura)

## Abordagem

Ler os insumos na ordem: constituição → `livro/GUIA-CAPITULO.md` (formato normativo da fase 1) → `livro/README.md` (tese e fronteiras do cap. 06, em especial 05×06, 04×06 e 03×06) → `estudos/fonte-base-codigo.md` (evidência por path) → `estudos/panorama-industria.md` (fontes externas com URL) → `estudos/candidatos-bibliografia.md` (papers ⏳). Em seguida, redigir a estrutura do capítulo em um único arquivo, organizada em três movimentos:

1. **A tese negativa primeiro**: as duas bases rejeitaram formalmente cliques simulados/DOM — Document Object Model — (ghdaru Constituição P.IV; nexxussai `research.md` da spec 014), e o computer use da Anthropic entra como o anti-padrão documentado pela própria fonte primária — pixels + cliques é a fronteira menos governável para um agente **embutido**, que não precisa inferir o que a aplicação já sabe declarar.
2. **A tese positiva**: comando de UI (interface de usuário) é a família de ações do catálogo cujo efeito é local à interface — vocabulário fechado (`ui.navigate`/`session.logout` implementados no ghdaru; taxonomia `ActionKind` no nexxussai), executor no host (`applyUiCommand()` traduz comando em efeito real de router/sessão) e a distinção reversível-executa × persistente-propõe (`action_proposal_policy_service.py`), que delimita a fronteira com o cap. 05.
3. **Slot filling como diálogo estruturado**: `ui.form.patch` e `user.input.required` (Coleta por Schema, definidos e não implementados — lacuna declarada nas duas bases, espelhada na indústria pela elicitation do MCP, Model Context Protocol) e o contraste com generative UI serializada (recuo do RSC — React Server Components — `streamUI` da Vercel como dado).

O Apêndice nasce populado com os paths pertinentes, incluindo as **ausências** ("a lacuna que confirma a categoria"): vocabulário previsto sem código no ghdaru; proposta renderizada mas nunca executada no nexxussai (sem `ActionExecutionAdapter`).

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Toda afirmação da estrutura tem path (`ghdaru`/`nexxussai-monorepo`), URL de indústria ou marca ⏳; papers ⏳ não sustentam o corpo — a seção declara isso. |
| II. Fonte-base é o código | ✅ O Apêndice nasce populado a partir de `estudos/fonte-base-codigo.md`; repos-laboratório permanecem somente leitura. |
| III. Esqueleto v3 | ✅ Todas as seções na ordem normativa do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 "Estrutura". |
| IV. Livro vivo | ✅ Cabeçalho com captura 2026-07, revisão 2026-07-30 e link para `../HISTORICO.md`; HISTORICO/CHANGELOG atualizados pelo orquestrador no fechamento do lote (fora do escopo desta entrega, registrado na spec). |
| V. Segurança | ✅ Nenhum segredo; payloads de exemplo com valores fictícios evidentes. |
| VI. Neutralidade | ✅ AG-UI, MCP-UI, OpenAI Apps SDK, Vercel AI SDK e Anthropic computer use apresentados por documentação primária e adoção medida, vendor-agnóstico (o anti-padrão é o *paradigma* pixels+cliques, não o vendor); português com termos técnicos sem tradução. |
| VII. Spec-driven | ✅ Esta spec (010) cobre o capítulo, com CAs testáveis, plan com Constitution Check e tasks; fase 2 em spec de continuação. |

## Riscos

- Vazamento de escopo para o cap. 05 (reexplicar a FSM — máquina de estados finita —, risco, confirmação, idempotência) → mitigação: CA-5; o capítulo referencia a governança e só desenvolve o critério *reversível × persistente* aplicado à família de UI.
- Vazamento para o cap. 04 (snapshot/registry) e cap. 03 (vocabulário de eventos) → mitigação: CA-5; `ui_command` aparece aqui pela semântica, não pelo envelope.
- Citação científica prematura → mitigação: tudo ⏳, com declaração explícita de que nada sustenta o corpo até a validação da fase 2 (a lacuna de literatura sobre slot filling/mixed-initiative é declarada, não disfarçada).
