# Spec 010 — Capítulo 06: Comandos de UI e slot filling

**Status**: Implementada (estrutura) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar a **estrutura** (fase 1 do `livro/GUIA-CAPITULO.md`, §"Estrutura antes do conteúdo") do capítulo 06 em `livro/capitulos/06-comandos-de-ui.md`: cabeçalho datado, objetivos de aprendizagem, "O problema" redigido por completo, fundamentos científicos candidatos (⏳), fontes da indústria com URL, esqueleto de H3 do estado da arte (com rascunho da Leitura executiva), perguntas de verificação e Apêndice de evidência por laboratório populado com paths.

## Por quê

O capítulo 06 sustenta uma das teses mais afiadas do livro: quando a IA muda a interface, ela o faz por **comandos declarativos de um vocabulário fechado** — nunca por cliques simulados, coordenadas de tela ou leitura de DOM (Document Object Model). As duas bases rejeitaram formalmente o caminho "operar a UI como humano" (ghdaru: Constituição P.IV; nexxussai: decisão formal em `specs/014-chat-lateral-contexto/research.md`), e a indústria fornece tanto o anti-padrão documentado (computer use da Anthropic) quanto os precedentes positivos (frontend tools do AG-UI, `window.openai`, intents do MCP-UI). O capítulo também é a casa do **slot filling** — o diálogo estruturado em que a IA pede dados por schema e a aplicação renderiza o formulário — lacuna declarada nas duas bases e já normatizada pela indústria (elicitation do MCP). Sem essa estrutura aprovada, a fase 2 (prosa integral) não tem contrato.

## Critérios de aceite

- [x] **CA-1**: `livro/capitulos/06-comandos-de-ui.md` contém todas as seções do esqueleto v3 na ordem do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 — "O problema" redigido (4–6 parágrafos); estado da arte como esqueleto de H3 com 2–4 frases por seção; Leitura executiva rascunhada.
- [x] **CA-2**: o Apêndice traz `### ghdaru` e `### nexxussai-monorepo` populados com paths em backticks e fatos concretos pertinentes a este capítulo — no mínimo: `catalog.py` (`ui.navigate`, `session.logout`), `applyUiCommand()` em `ChatPanel.tsx`, o vocabulário previsto não implementado (`ui.form.patch`, `user.input.required`) como lacuna declarada; `action_kind.py` (taxonomia `ActionKind`), `action_proposal_policy_service.py` (reversível × persistente) e a lacuna do `ActionExecutionAdapter` ausente no frontend.
- [x] **CA-3**: toda fonte externa citada tem URL verificável; papers aparecem só como candidatos com ID arXiv e status ⏳, com a validação declarada como trabalho da fase 2 (nenhum sustenta afirmação do corpo).
- [x] **CA-4**: cada pergunta de `## Verificação` testa um objetivo de `## Objetivos de aprendizagem` (alinhamento 1:1, com dica entre parênteses).
- [x] **CA-5**: as fronteiras do sumário (`livro/README.md`) são respeitadas — a **governança** da ação (FSM — máquina de estados finita —, classes de risco, confirmação, idempotência) pertence ao cap. 05 e entra aqui apenas como referência; snapshot/screen registry pertencem ao cap. 04; o vocabulário de eventos em si pertence ao cap. 03. Este capítulo cobre só a especialização "família de ações que muda a interface" e o slot filling como diálogo estruturado.
- [x] **CA-6**: siglas por extenso na 1ª ocorrência; exemplos/payloads com valores fictícios evidentes; nenhum arquivo fora dos 4 desta spec é editado (em particular: `CHANGELOG.md`, `HISTORICO.md`, `livro/README.md`, `livro/glossario.md`, `livro/bibliografia.md` e arquivos de outros capítulos/specs permanecem intocados).

## Fora de escopo

O **texto completo** do capítulo (prosa integral das seções do estado da arte) é a fase 2, em spec de continuação — inclui a validação dupla dos papers candidatos (⏳ → ✓ em `livro/bibliografia.md`) e a revalidação das URLs de indústria antes de sustentar afirmações no corpo. Também fora: a mecânica da FSM de proposta, classes de risco e idempotência (cap. 05); o desenho do snapshot e do screen registry (cap. 04); a comparação sistemática de protocolos externos (cap. 10); atualização de `CHANGELOG.md`/`HISTORICO.md` (feita pelo orquestrador no fechamento do lote) e qualquer edição em `livro/README.md`, `livro/glossario.md` ou `livro/bibliografia.md`.
