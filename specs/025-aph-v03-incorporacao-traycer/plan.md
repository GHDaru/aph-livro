# Plan — Spec 025 (Padrão APH v0.3)

## Como

1. **`livro/padrao-aph.md` → v0.3**: título/cabeçalho/§0 (limitação n=2 mitigada pelo caso externo, não eliminada); emenda em APH-1.3; nota em APH-2.2; APH-5.6/5.7 novos em §4.5 (🧪, DEVERIA); evidência externa em APH-6.4; §5 (tabela de maturidade) com 5.6–5.7 no grau 🧪 e a regra "caso externo não promove"; checklist §7 (recomendados novos); §9 (versionamento: v0.3, fio inalterado).
2. **Notas datadas (2026-08-03)**: cap. 03 (roubar: `retryable`, *replace-latest*, sentinelas); cap. 05 (gates no snapshot, fila por classe, sumário/detalhe de tool); cap. 07 (contraexemplo A2A — cautela não-herdada, deadlock de supervisão como fronteira do argumento); cap. 10 (linha Traycer na matriz + nota sobre a natureza da linha; cabeçalho de revisão); cap. 11 (L2 confirmada pelo caso; ponteiro ao cap. 07; evidência de E1).
3. **`livro/HISTORICO.md`**: snapshot (revisões dos caps. tocados), evidência em E1 (🔵 mantido), edição 0.07.
4. **`livro/glossario.md`**: entrada CRDT (§2 siglas). Demais termos do caso já cobertos ou evitados na prosa.
5. **Navegação/rotulagem**: `publicar/build.mjs` (rótulo "★ Padrão APH v0.3") e `livro/README.md` (specs 018 · 021 · 025).
6. **Gates**: `valida-wire.mjs` (deve permanecer verde sem tocar schemas) + `build.mjs` (links). Revisão independente em contexto fresco. CHANGELOG.

## Constitution Check

- **P.I (evidência)**: toda afirmação nova sobre o Traycer referencia o estudo (que carrega os paths e a ressalva ⏳ do host fechado); nenhuma promoção de maturidade sem laboratório/convergência — CA-2 é o teste.
- **P.II (fonte-base)**: nenhum repositório de consulta é alterado; o clone `traycer` segue somente leitura.
- **P.III (esqueleto v3)**: capítulos recebem notas datadas, não mudanças de estrutura.
- **P.IV (livro vivo)**: edição 0.07 + datação em cada nota + snapshot atualizado.
- **P.V (segredos)**: nenhum segredo; nenhum identificador interno de modelo em artefato.
- **P.VI (vendor-agnóstico, pt-BR)**: emendas escritas por garantia ("não perder a conversa"), não por produto; Traycer citado como caso, não como recomendação.
- **P.VII (spec-driven)**: esta spec; CHANGELOG; DoD = gates verdes + revisão independente; merge na `main` é gate humano já delegado para casos reversíveis (decisão vigente da sessão).

## Decisões (reversíveis, registradas aqui)

- **Anexo A não sobe de versão**: nenhum schema muda; §A.9 já prevê MINOR para `kind`/campo novo — não há nenhum. O padrão declara o desacoplamento no §9.
- **§6 (tabela de compatibilidade) não ganha coluna Traycer**: a tabela compara specs de ecossistema; o caso entra pela matriz do cap. 10 (linha com nota de natureza) — diff mínimo, sem esticar a semântica da tabela.
- **"Steering" não entra no vocabulário do livro**: a prosa usa português claro ("correções de rumo durante o turno") — evita jargão órfão sem criar entrada para termo de uso único.
