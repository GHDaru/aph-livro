# Spec 009 — Capítulo 05: Ações governadas (piloto, texto completo)

**Status**: Implementada (texto completo) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Escrever o capítulo 05 — "Ações governadas" — **por inteiro** (fase 1 + fase 2 do GUIA-CAPITULO na mesma spec), servindo de **capítulo-piloto** do livro: valida o esqueleto v3 adaptado, o padrão de Apêndice por laboratório e o tom editorial antes de os demais capítulos saírem da fase de estrutura.

## Por quê

O capítulo 05 é o mais rico em evidência das duas bases (FSM em código nos dois laboratórios, catálogo/registry, políticas de risco, idempotência, traço) e o centro de gravidade do livro — a governança é o que distingue este protocolo de um chat comum. Pilotar aqui maximiza o aprendizado de formato com o menor risco de retrabalho.

## Critérios de aceite

- [x] **CA-1**: o capítulo segue todas as seções do GUIA-CAPITULO na ordem, com cabeçalho datado (2026-07 / 2026-07-30).
- [x] **CA-2**: toda afirmação sobre implementação tem path em backticks com o laboratório identificado; toda fonte de indústria tem URL do `estudos/panorama-industria.md`; ciência aparece como candidata ⏳ com declaração explícita de validação pendente (nenhuma afirmação do corpo depende dela).
- [x] **CA-3**: o Apêndice traz `### ghdaru`, `### nexxussai-monorepo` e `### Divergências`, incluindo as lacunas ("a ausência que confirma a categoria").
- [x] **CA-4**: cada pergunta de Verificação testa um objetivo de aprendizagem declarado.
- [x] **CA-5**: fronteiras do sumário respeitadas — nascimento da intenção (cap. 08), comandos de UI (cap. 06) e transporte (cap. 02) apenas referenciados.
- [x] **CA-6**: payloads de exemplo com valores fictícios evidentes.

## Fora de escopo

Validação ✓ dos papers (fica para a rodada de fundamentação científica, que atualizará a seção); tradução do capítulo para outros formatos (publicação HTML).
