# Spec 026 — Suíte de conformidade executável: Nível 1 (Observador)

**Status**: Em implementação · **Data**: 2026-08-05 · **Raia**: plena (primeira feature de código do repositório)

## O quê

A primeira fatia da suíte de conformidade do Padrão APH: um programa (`conformidade/`) que testa **de fora** (caixa-preta, contra uma URL) uma aplicação candidata ao **Nível 1 (Observador)** e emite um relatório por requisito — VERIFICADO ✅ / FALHOU ❌ / AVISO 🟡 (DEVERIA) / DECLARADO 📋 (fora do alcance caixa-preta, lista para autodeclaração com evidência). Composta por:

1. **`suite.mjs`** — o examinador: exercita a superfície HTTP de referência do Anexo A (§A.2) e verifica os requisitos testáveis de fora do Nível 1, **reusando os JSON Schemas reais do Anexo A** (evento, snapshot, erro) na validação.
2. **`servidor-referencia.mjs`** — uma implementação mínima do Nível 1 (em memória, sem LLM) que existe para provar que a suíte funciona — e serve de exemplo executável do padrão.
3. **`autoteste.mjs`** — o gate: roda a suíte contra o servidor íntegro (tudo deve passar) e contra **sabotagens** dele — variantes com um defeito deliberado cada (seq duplicado, replay que perde evento, cancelamento silencioso, evento malformado, erro sem código, content-type errado) — e exige que cada sabotagem derrube exatamente o check alvo. Mesmo desenho do gate de wire (exemplos válidos aceitos + contraexemplos rejeitados), elevado de mensagens a **comportamento**.
4. **`conformidade/README.md`** — a documentação (página do site): o que é verificado, o que é declarado, como rodar contra a própria aplicação.

O autoteste entra no **CI como Gate 3**. O padrão atualiza a limitação declarada (§0), aponta a suíte no checklist (§7) e reduz o item do §8 aos Níveis 2–3. O padrão **permanece v0.3** (nenhum requisito muda — a suíte verifica, não normatiza) e o fio permanece v0.2.

## Por quê

Pedido do Accountable (2026-08-05, "pode ir para 026"), sobre a maior limitação declarada do padrão desde a v0.1: "sem suíte de conformidade executável". Autodeclaração sem teste vale pouco; padrão sem suíte é interpretação. Começa pelo Nível 1 porque é quase todo testável de fora — e escrever o teste executável de cada requisito é também o teste mais duro do próprio texto do padrão.

## Critérios de aceite

- [ ] **CA-1**: todo item do checklist Nível 1 (§7 do padrão) tem destino explícito no relatório da suíte: um check executável (com o requisito APH que cobre) ou entrada na lista DECLARADO com o porquê de não ser testável de fora. Nenhum item silenciosamente ausente.
- [ ] **CA-2**: a suíte valida eventos contra os **schemas reais** de `livro/padrao/schemas/` (nenhuma cópia); pratica o APH-2.2 que exige dos outros: `kind` desconhecido é ignorado e reportado, nunca reprovado.
- [ ] **CA-3**: autoteste verde = servidor íntegro passa em todos os checks **e** cada uma das 6 sabotagens derruba exatamente o check alvo; o autoteste roda no CI (Gate 3) e falha o pipeline se qualquer expectativa quebrar.
- [ ] **CA-4**: requisito DEVERIA (APH-3.5, schema fechado do snapshot) reprova como AVISO 🟡, nunca como FALHOU — a suíte distingue obrigatório de recomendado como o padrão distingue.
- [ ] **CA-5**: nenhuma mudança normativa: padrão segue v0.3, Anexo A segue v0.2, `valida-wire.mjs` verde sem alteração de schema; as edições no padrão são de status/ponteiro (§0, §7, §8).
- [ ] **CA-6**: revisão independente em contexto fresco (com execução própria do autoteste); termos novos no glossário no mesmo commit; CHANGELOG + HISTORICO (edição 0.08); publicado no site (merge na `main`).

## Fora de escopo

Suíte dos Níveis 2 e 3 (ações governadas, comandos de UI, federação — exigem catálogo e FSM; próxima fatia); paths configuráveis/adapters para superfícies não-referência (v1 testa os paths de referência do §A.2); modo cooperativo para testar o não-observável (sanitização, separação de camadas — seguem DECLARADO); rodar a suíte contra o ghdaru (pede ambiente vivo do laboratório; candidato natural a spec futura).
