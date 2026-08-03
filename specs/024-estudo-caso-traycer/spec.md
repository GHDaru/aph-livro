# Spec 024 — Estudo de caso: Traycer × Padrão APH

**Status**: Em implementação · **Data**: 2026-07-31 · **Raia**: plena (estudo; nenhum código alterado)

## O quê

Avaliar o **Traycer** (`ghdaru/traycer`, fork do `traycerai/traycer` — app desktop open-source de orquestração de agentes de código com chat, BYOA e agent-to-agent) contra o Padrão APH v0.2: `estudos/caso-traycer.md` com (a) o mapeamento do protocolo dele área por área com paths; (b) a delimitação do que é fronteira app↔agente (nosso escopo) × harness↔harness (livro-mãe); (c) a avaliação de conformidade/afinidade com o APH por família de requisito; (d) o que o caso ensina ao padrão (refinamentos, lacunas nossas, evidência para o registro de expiração E1).

## Por quê

Pedido do Accountable (2026-07-31): "avalie este caso para nosso protocolo". É o primeiro caso **externo aos dois laboratórios** avaliado contra o APH — teste de generalização do padrão (o diagnóstico da v0.1 apontou n=2 do mesmo autor como limitação; um terceiro caso, de autor independente, ataca exatamente essa fraqueza).

## Critérios de aceite

- [ ] **CA-1**: toda afirmação sobre o Traycer tem path no clone (`/workspace/traycer`, commit registrado); o que não foi conferido é marcado ⏳.
- [ ] **CA-2**: a avaliação distingue explicitamente o que está na fronteira do APH (app↔agente, UI de chat) do que está fora (orquestração harness↔harness, colaboração multiusuário) — sem esticar o escopo do padrão.
- [ ] **CA-3**: tabela de afinidade por família APH (1–8) com veredito honesto (conforme/parcial/divergente/fora de escopo) e o *porquê* de cada divergência.
- [ ] **CA-4**: seção "o que o APH aprende" com candidatos concretos (requisito novo? maturidade a revisar? linha nova na matriz do cap. 10? evidência para E1/E2?) — decisões de incorporação ficam para specs futuras, não nesta.
- [ ] **CA-5**: CHANGELOG registrado; publicado no site (merge na `main`).

## Fora de escopo

Alterar o padrão ou capítulos nesta spec (o estudo propõe; a incorporação é spec própria); avaliar o Traycer como produto (qualidade/UX); o repositório `traycer` permanece somente leitura.
