# Plan — Spec 031 (Padrão APH v0.5)

> Escrito **antes** da implementação, ao contrário da spec 029 — cuja lição foi que o Constitution Check é o portão que pega justamente este tipo de erro.

## Como

1. **Varrer** todos os requisitos 🧪 do padrão procurando DEVE/NÃO DEVE/DEVEM, para saber o tamanho real da dívida antes de escolher o remédio.
2. **Decidir e registrar** ([ADR 0006](../../adr/0006-nivel-experimental-e-obrigacao-condicional.md)): nível experimental + obrigação condicional, em vez de rebaixar a palavra normativa.
3. **Editar**: §0 (a régua, com a exceção nomeada e escopada), §3 (Nível 3 marcado 🧪 + parágrafo explicando por quê e o que isso significa para quem declara), §7 (rótulo no checklist), §9 (versionamento v0.5), cabeçalho.
4. **Gates** (wire, build, autoteste) + registro (CHANGELOG, HISTORICO 0.12).

## Constitution Check

| Princípio | Situação |
|---|---|
| **I — evidência** | A afirmação nova é negativa e verificável: "nenhuma implementação conhecida exercitou o Nível 3". Sustentada pelo que o livro já registrou — os dois laboratórios têm MCP em roadmap e zero código (cap. 09 e Apêndice do cap. 10), e o caso externo (Traycer) não federa apps de terceiros no sentido do §4.9. Não invento evidência positiva. |
| **II — laboratório somente leitura** | Nada tocado. |
| **III — esqueleto v3** | Não se aplica (entrega normativa). |
| **IV — livro vivo** | Edição 0.12. |
| **V — sem segredos** | Nenhum. |
| **VI — vendor-agnóstico** | A mudança é de régua, não de tecnologia. |
| **VII — spec-driven** | spec + plan + tasks + ADR, na ordem. |

**Portão específico desta spec** — a mudança *afrouxa* alguma obrigação? Não: nenhum DEVE vira DEVERIA, nenhum requisito sai. O que muda é o rótulo de maturidade do nível, que **acrescenta** informação ao leitor. Uma implementação conforme à v0.4 segue conforme à v0.5.

## Decisões

- **v0.5, não v0.4.1**: o esquema do padrão é `0.MINOR` (sem PATCH, como o fio). E a mudança não é cosmética — o significado de "declarar Nível 3" mudou.
- **Manter o DEVE em 9.1/9.2**: alternativas e racional no ADR 0006. O ponto decisivo foi qual obrigação se perderia: as duas travas de segurança da federação.
- **Não estender a marca experimental a outros níveis**: 1 e 2 têm implementação medida (spec 027). Marcar por precaução esvaziaria a marca.
