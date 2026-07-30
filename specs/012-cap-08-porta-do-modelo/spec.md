# Spec 012 — Capítulo 08: A porta do modelo e o tool calling

**Status**: Implementada (texto completo) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar a **estrutura** (fase 1 do `livro/GUIA-CAPITULO.md`, §"Estrutura antes do conteúdo") do capítulo 08 em `livro/capitulos/08-porta-do-modelo.md`: cabeçalho datado, objetivos de aprendizagem, "O problema" redigido por completo, fundamentos científicos candidatos (⏳), fontes da indústria com URL, esqueleto de H3 do estado da arte (com rascunho da Leitura executiva), perguntas de verificação e Apêndice de evidência por laboratório populado com paths — incluindo o H3 `### Divergências`.

## Por quê

O capítulo 08 nomeia a **segunda fronteira** do desenho — a interna, entre o harness e os provedores de LLM — e mostra que as duas bases a resolveram do mesmo jeito: uma porta única que normaliza qualquer provedor em chunks tipados, com erros traduzidos em categorias de domínio e usage como fato contábil. É também o capítulo da lacuna mais reveladora das duas bases: o catálogo de ações está *pronto* para tool calling (`input_schema` em JSON Schema) mas nenhuma delas *entrega* o catálogo ao modelo como tools — a intenção ainda nasce de roteamento determinístico. Sem esta estrutura, a fase 2 não tem contrato, e o registro de expiração E2 do `livro/HISTORICO.md` (que nasce deste capítulo) fica sem capítulo de origem redigido.

## Critérios de aceite

- [x] **CA-1**: `livro/capitulos/08-porta-do-modelo.md` contém todas as seções do esqueleto v3 na ordem do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 — "O problema" redigido (4–6 parágrafos); estado da arte como esqueleto de H3 com 1–2 frases (até 3 curtas) por seção; Leitura executiva rascunhada.
- [x] **CA-2**: o Apêndice traz `### ghdaru`, `### nexxussai-monorepo` **e** `### Divergências` populados com paths em backticks e fatos concretos de `estudos/fonte-base-codigo.md` pertinentes a este capítulo: porta única (`LlmProviderPort`/`LLMPort`), chunks tipados, adapters, roteamento de intenção, catálogo pronto-para-tools, pré-história agêntica do nexxussai.
- [x] **CA-3**: toda fonte externa citada tem URL verificável; papers aparecem só como candidatos com ID arXiv e status ⏳ (Toolformer 2302.04761, τ-bench 2406.12045), com a validação declarada como trabalho da fase 2 (nenhum sustenta afirmação do corpo).
- [x] **CA-4**: cada pergunta de `## Verificação` testa um objetivo de `## Objetivos de aprendizagem` (alinhamento 1:1, com dica entre parênteses).
- [x] **CA-5**: as fronteiras do sumário (`livro/README.md`, "08 × 05" e "02 × 03"/"03 × 06") são respeitadas — o que acontece com a intenção *depois* que nasce (proposta, FSM, confirmação) fica no cap. 05; o vocabulário público de eventos que os chunks viram fica no cap. 03. O capítulo cobre só a porta interna e o *nascimento* da intenção.
- [x] **CA-6**: o capítulo referencia o registro de expiração **E2** do `livro/HISTORICO.md` como nascido dele (sem editar o HISTORICO nesta entrega).
- [x] **CA-7**: siglas por extenso na 1ª ocorrência; exemplos/payloads (se houver) com valores fictícios evidentes; nenhum arquivo fora dos 4 desta spec é editado.

## Fora de escopo

O **texto completo** do capítulo (prosa integral do estado da arte) é a fase 2, em spec de continuação — inclui a validação dupla dos papers candidatos (⏳ → ✓ em `livro/bibliografia.md`) e a revalidação das URLs de indústria. Também fora: qualquer implementação de tool calling nas bases (elas são somente leitura); atualização de `CHANGELOG.md`/`HISTORICO.md` (feita pelo orquestrador no fechamento do lote); e qualquer edição em `livro/README.md`, `livro/glossario.md`, `livro/bibliografia.md` ou arquivos de outros capítulos/specs.
