# CLAUDE.md — instruções para agentes neste repositório

Este repositório é o **livro vivo** *"Protocolo de Comunicação Aplicação ↔ Harness"*.
A parte normativa (Padrão APH, Anexo A, schemas, suíte de conformidade) vive em
`GHDaru/protocolos` — ver ADR 0004 da divisão.

## Regra primária

**Leia a constituição (`.specify/memory/constitution.md`) antes de qualquer trabalho.**
Ela prevalece sobre qualquer outra prática. Em resumo:

1. **Evidência acima de retórica** — afirmação sobre implementação exige path;
   ciência exige status ✓ na bibliografia; indústria exige URL verificável.
2. **A fonte-base é o código** — os laboratórios são somente leitura; nunca commitar neles.
3. **Esqueleto v3** de capítulo obrigatório.
4. **Livro vivo** — datar a captura; toda edição atualiza `livro/HISTORICO.md`.
5. **Sem segredos** em arquivo/commit/texto.
6. **Vendor-agnóstico**, português com termos técnicos sem tradução.
7. **Spec-driven (Maestro)** — uma spec por capítulo no mínimo; decisão vira ADR;
   CHANGELOG em toda entrega; DoD verificável.

## Fluxo

`specs/NNN-nome/` → `spec.md` → `plan.md` (com Constitution Check) → `tasks.md` →
implement → DoD (gate do build: links válidos) → revisão independente → gate humano.

## Mapa

- `livro/` — capítulos, glossário, bibliografia, HISTORICO.
- `estudos/` — pesquisa registrada. `specs/` — uma pasta por feature. `adr/` — decisões.
- `publicar/build.mjs` — motor do site (falha em link quebrado).

## Ao citar a norma

O Padrão APH e o Anexo A não estão mais aqui: referencie-os por URL no repositório
da especificação. Não copie trechos normativos para cá — o livro fundamenta, não normatiza.
