# Spec 004 — Capítulo 00: Introdução — a fronteira aplicação↔IA

**Status**: Implementada (estrutura) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar a **estrutura** (fase 1 do `livro/GUIA-CAPITULO.md`, §"Estrutura antes do conteúdo") do capítulo 00 em `livro/capitulos/00-introducao.md`: cabeçalho datado, objetivos de aprendizagem, "O problema" redigido por completo, fundamentos científicos candidatos (⏳), fontes da indústria com URL, esqueleto de H3 do estado da arte (com rascunho da Leitura executiva), perguntas de verificação e Apêndice de evidência por laboratório populado com paths.

## Por quê

O capítulo 00 é a porta de entrada do livro: apresenta a tese (existe um protocolo natural na fronteira aplicação↔agente embutido, descoberto de forma independente por duas bases de código e ainda não padronizado pelo mercado), as duas direções do protocolo, o mapa dos capítulos 01–11 e a relação com o livro-mãe Engenharia de Harness. Sem essa estrutura aprovada, a fase 2 (prosa integral) não tem contrato — e os demais capítulos não têm a quem remeter o leitor para o quadro geral.

## Critérios de aceite

- [x] **CA-1**: `livro/capitulos/00-introducao.md` contém todas as seções do esqueleto v3 na ordem do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 — "O problema" redigido (4–6 parágrafos); estado da arte como esqueleto de H3 com 2–4 frases por seção; Leitura executiva rascunhada.
- [x] **CA-2**: o Apêndice traz `### ghdaru` e `### nexxussai-monorepo` populados com paths em backticks e fatos concretos extraídos de `estudos/fonte-base-codigo.md`, pertinentes a este capítulo (convergência e panorama, não mecanismo).
- [x] **CA-3**: toda fonte externa citada tem URL verificável; papers aparecem só como candidatos com ID arXiv e status ⏳, com a validação declarada como trabalho da fase 2 (nenhum sustenta afirmação do corpo).
- [x] **CA-4**: cada pergunta de `## Verificação` testa um objetivo de `## Objetivos de aprendizagem` (alinhamento 1:1, com dica entre parênteses).
- [x] **CA-5**: as fronteiras do sumário (`livro/README.md`) são respeitadas — nenhum mecanismo técnico dos caps. 02–09 é aprofundado; a matriz de convergência entra como panorama; a relação com os caps. 13/15/17 do livro-mãe é delimitada, não reproduzida.
- [x] **CA-6**: siglas por extenso na 1ª ocorrência; exemplos/payloads (se houver) com valores fictícios evidentes; nenhum arquivo fora dos 4 desta spec é editado.

## Fora de escopo

O **texto completo** do capítulo (prosa integral das seções do estado da arte) é a fase 2, em spec de continuação — inclui a validação dupla dos papers candidatos (⏳ → ✓ em `livro/bibliografia.md`) e a revalidação das URLs de indústria antes de sustentar afirmações no corpo. Também fora: atualização de `CHANGELOG.md`/`HISTORICO.md` (feita pelo orquestrador no fechamento do lote) e qualquer edição em `livro/README.md`, `livro/glossario.md` ou `livro/bibliografia.md`.
