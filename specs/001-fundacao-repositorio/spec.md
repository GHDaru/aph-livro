# Spec 001 — Fundação do repositório

**Status**: Implementada · **Data**: 2026-07-30 · **Raia**: plena (fundação de governança)

## O quê

Fundar o repositório `protocolos` como o lar do livro vivo "Protocolo de Comunicação Aplicação ↔ Harness": governança (constituição), instruções para agentes, estrutura de diretórios, registro de decisões e forcing functions (CHANGELOG).

## Por quê

O repositório nasce vazio. Sem constituição e sem estrutura, nenhuma spec de capítulo tem contra o quê rodar o Constitution Check (Maestro), e as decisões de fundação ficariam sem registro (violando "artefatos vivos e rastreabilidade").

## Critérios de aceite

- [x] **CA-1**: `.specify/memory/constitution.md` existe, com versão SemVer, combinando os princípios editoriais do harness_engineering (evidência, esqueleto v3, livro vivo) e os do Maestro (spec-driven, DoD, ADR, CHANGELOG, gates) — verificável por leitura.
- [x] **CA-2**: `CLAUDE.md` orienta qualquer agente a ler a constituição primeiro e mapeia o repositório.
- [x] **CA-3**: ADRs 0001–0003 registram as decisões de fundação (livro próprio, uma spec por capítulo, branch única) no formato contexto→decisão→alternativas→justificativa→consequências.
- [x] **CA-4**: `CHANGELOG.md` existe com entrada `[Unreleased]` desta fundação.
- [x] **CA-5**: estrutura de diretórios criada: `livro/capitulos/`, `estudos/`, `specs/`, `adr/`.

## Fora de escopo

Conteúdo do livro (specs 003+), pesquisa (spec 002), CI/automação de gates (feature futura, se necessária — YAGNI).
