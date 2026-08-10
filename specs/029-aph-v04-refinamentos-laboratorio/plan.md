# Plan — Spec 029 (Padrão APH v0.4)

> **Este plano nasceu tarde.** A spec 029 foi implementada sem `plan.md`, e a revisão independente apontou (I5) que o **Constitution Check é justamente o portão que teria pego o achado crítico C2** — requisitos 🧪 redigidos com DEVE. Escrito depois, com as correções já aplicadas, e mantido como registro honesto de que a etapa foi pulada e o preço apareceu.

## Como

1. **Verificar a evidência do ADR 0005 antes de normatizar** — o laboratório está em `a02cb12`, posterior ao clone da spec 027; ler por `git show origin/main:<path>`, sem checkout (a árvore de trabalho do laboratório não se toca).
2. **`livro/padrao-aph.md` → v0.4**: APH-2.6 (§4.2), APH-6.6 (§4.6), APH-5.8 (§4.5), refino do APH-3.4, promoção do APH-5.4, reforço do APH-7.1; §0 (régua de maturidade + versão do fio), §5 (tabela, com a maturidade ⚗️ nova), §7 (checklist), §9 (versionamento).
3. **`livro/padrao/anexo-a-wire-format.md` → v0.3**: `provenance` opcional na citação (§A.3), mapeamento de nomes (§A.8), nota de versionamento (§A.9).
4. **Schema + exemplos**: `provenance` em `$defs.citation`; um exemplo com o campo, um contraexemplo com valor vazio.
5. **Propagação de versão**: suíte, README da suíte, navegação do site, sumário do livro.
6. **Gates + revisão independente + registro** (HISTORICO 0.11, CHANGELOG).

## Constitution Check

| Princípio | Situação |
|---|---|
| **I — evidência** | Toda afirmação nova sobre o laboratório é conferida **nesta spec**, contra `a02cb12`. *Falhou na primeira passada*: a cláusula "teste anti-regressão que impede o executor de ganhar um caso de submissão" foi herdada da prosa do ADR 0005 e **não existe no código** (`git grep ui.submit -- apps/web` → zero). Corrigida após a revisão; o commit-âncora entrou no cabeçalho do padrão para as linhas não apodrecerem em silêncio. |
| **II — laboratório somente leitura** | Nada alterado; leitura só por `git show`. `git status --porcelain` vazio ao fim. |
| **III — esqueleto v3** | Não se aplica: a entrega é normativa, não de capítulo. |
| **IV — livro vivo** | Edição 0.11 no HISTORICO, com o registro de expiração revisitado. |
| **V — sem segredos** | Nenhum. |
| **VI — vendor-agnóstico** | Requisitos escritos por garantia, não por produto; o laboratório aparece como evidência e como contraexemplo, nunca como recomendação. |
| **VII — spec-driven** | *Falhou*: este plano não existia na implementação. É o portão que teria barrado o C2 (abaixo). |

### O portão que faltou

**Requisito 🧪 nunca é DEVE** (§0 do padrão). Na primeira passada, APH-5.8, APH-6.6 e o reforço do APH-7.1 — todos com metade ou totalidade 🧪 — foram redigidos com DEVE/NÃO DEVE, e o item do APH-6.6 caiu no bloco **obrigatório** do checklist de Nível 2. Consequência concreta: o `ghdaru`, medido na spec 027, passaria a reprovar o Nível 2 por um requisito que **nenhum laboratório implementou** — o padrão mudaria o significado de um nível com base em desenho, não em prática. Corrigido: DEVE → DEVERIA nas metades 🧪, e o item movido para *Recomendado*.

*Dívida registrada*: o mesmo desvio é **pré-existente** em APH-9.1–9.3 (🧪 com DEVE desde a v0.1). Não corrijo aqui — mudar o §4.9 é fora do escopo desta spec e merece decisão própria. Fica como achado para a próxima revisão do padrão.

## Decisões (reversíveis, registradas)

- **Maturidade ⚗️ (nova)**: requisito com obrigações de maturidade diferente declara as duas e vale a mais fraca. Alternativa recusada: partir em dois requisitos numerados — inflaria a numeração e separaria uma invariante que se lê melhor junta.
- **`PROPOSAL_CONTEXT_STALE` continua 🧪**: a *situação* foi implementada, mas sob nome local (`STALE_CONTEXT`); nenhuma implementação emite o nome canônico. Manter 🧪 preserva o precedente do `UNAUTHORIZED` (não-🧪 porque é emitido literalmente). Reversível: basta alguém emitir o nome canônico.
- **Fio v0.3, não v0.2.1**: o ADR 0005 sugeriu PATCH; o §A.9 só tem MINOR e MAJOR, e o esquema do anexo é `0.MINOR`. Campo opcional novo = MINOR.
- **Suíte não ganha check novo**: APH-2.6 e o reforço do APH-7.1 são Nível 1, mas não observáveis de fora — entraram na lista DECLARADO (10 → 12). APH-6.6/5.8 são Nível 2, fora do alcance da suíte atual.
