# Spec 003 — Estrutura do livro (sumário e formato)

**Status**: Implementada · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Definir a espinha do livro: sumário oficial (capítulos, títulos, uma linha de tese cada, fonte-base principal), o formato normativo de capítulo (esqueleto v3 adaptado a este livro), e o aparato do livro vivo (`HISTORICO.md`, `glossario.md`, `bibliografia.md`).

## Por quê

As specs de capítulo (004+, ADR 0002) precisam de um contrato comum: sem sumário aprovado e formato normativo, cada capítulo negociaria escopo e estrutura do zero, e as fronteiras entre capítulos ficariam ambíguas (mesmo problema que o livro descreve: contratos primeiro).

## Critérios de aceite

- [x] **CA-1**: `livro/README.md` (sumário) lista todos os capítulos com número, título, tese de uma linha, fonte-base principal e spec correspondente.
- [x] **CA-2**: `livro/GUIA-CAPITULO.md` normatiza o esqueleto v3 adaptado (seções obrigatórias, cabeçalho datado, regras de evidência) — suficiente para um agente escrever um capítulo sem consultar o livro-mãe.
- [x] **CA-3**: `livro/HISTORICO.md` existe com o formato de edições + registro de expiração; `livro/glossario.md` nasce com a tabela terminológica (ghdaru × nexxussai × indústria); `livro/bibliografia.md` nasce com as regras de status (✓/⏳/⭐).
- [x] **CA-4**: cada capítulo do sumário tem fronteira explícita com os vizinhos (o que entra/não entra), evitando sobreposição.

## Fora de escopo

Conteúdo dos capítulos (specs 004+). Publicação HTML/Pages (feature futura, se solicitada).
