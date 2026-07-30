# CLAUDE.md — instruções para agentes neste repositório

Este repositório é o livro vivo **"Protocolo de Comunicação Aplicação ↔ Harness"** — *"a aplicação conversando com a IA, e a IA conversando com a aplicação"*.

## Regra primária

**Leia a constituição (`.specify/memory/constitution.md`) antes de qualquer trabalho.** Ela prevalece sobre qualquer outra prática. Resumo (leia-a por inteiro):

1. **Evidência acima de retórica** — afirmação sobre implementação exige path (`ghdaru`/`nexxussai-monorepo`); ciência exige status ✓ em `livro/bibliografia.md`; indústria exige URL verificável.
2. **A fonte-base é o código** — as duas implementações-laboratório são somente leitura; nunca commitar nelas.
3. **Esqueleto v3** de capítulo obrigatório (herdado do livro Engenharia de Harness).
4. **Livro vivo** — datar a captura; toda edição atualiza `livro/HISTORICO.md`.
5. **Sem segredos** em arquivo/commit/texto.
6. **Vendor-agnóstico**, português com termos técnicos sem tradução.
7. **Spec-driven (Maestro)** — uma spec por capítulo no mínimo; decisão vira ADR; CHANGELOG em toda entrega; DoD verificável; gate humano só para o irreversível.

## Fluxo de trabalho

`specs/NNN-nome/` → `spec.md` (o quê/porquê, critérios de aceite testáveis) → `plan.md` (como, com **Constitution Check**) → `tasks.md` → implement → DoD (links válidos, evidência presente, CHANGELOG + HISTORICO) → revisão independente → gate humano para merge.

## Mapa do repositório

- `livro/` — o livro: `capitulos/`, `HISTORICO.md`, `bibliografia.md`, `glossario.md`.
- `estudos/` — pesquisa registrada (fonte-base interna, panorama da indústria, candidatos a bibliografia).
- `specs/` — uma pasta por feature/capítulo.
- `adr/` — decisões imutáveis.
- `.specify/memory/constitution.md` — a constituição.

## Repositórios de consulta (somente leitura)

- `ghdaru` — fundação multi-tenant com chat transversal governado (Catálogo de Ações, Snapshot, eventos tipados, Manifesto).
- `nexxussai-monorepo` — plataforma com chat lateral com contexto de tela (ScreenRegistry, ActionProposal).
- `harness_engineering` — o livro-mãe Engenharia de Harness (formato editorial, caps. 13/15/17 vizinhos do tema).
- `maestro` — a metodologia de desenvolvimento (princípios, raias, DoD, gates).
