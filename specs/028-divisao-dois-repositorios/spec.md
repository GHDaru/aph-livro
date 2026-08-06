# Spec 028 — Divisão em dois repositórios: a especificação e o livro

**Status**: Fase 1 implementada (ferramenta pronta; execução aguarda gate humano) · **Data**: 2026-08-06 · **Raia**: infra (sempre plena + gates de reversibilidade)

## O quê

Separar `protocolos` em dois repositórios, conforme o [ADR 0004](../../adr/0004-divisao-em-dois-repositorios.md): `protocolos` passa a ser **a especificação do Padrão APH** (norma + o necessário para usá-la) e o **livro vivo** migra para um repositório próprio (`aph-livro`, nome assumido — variável única no script), com histórico preservado.

Entregue em **duas fases**, porque a ordem importa e uma delas é irreversível na prática:

**Fase 1 (esta entrega — não destrutiva)**
1. Decisão registrada (ADR 0004) com a tabela de alocação e o acoplamento resolvido.
2. `migracao/` — ferramenta completa e **verificada por ensaio**: extração do livro com histórico (`git-filter-repo`), reescrita de links entre as metades, e o roteiro na ordem segura.
3. Ensaio de verdade: o repositório do livro é materializado num diretório de trabalho, o build roda dentro dele e os links são conferidos — a prova de que a migração funciona antes de qualquer coisa sair do lugar.

**Fase 2 (após o gate humano — destrutiva na ordem certa)**
4. O usuário cria `aph-livro` no GitHub e roda o push (esta sessão não tem escopo para escrever em repositório novo).
5. O projeto do Vercel é reapontado para `aph-livro` — **preservando a URL**, porque os handoffs entregues ao time do ghdaru linkam para ela.
6. Só então `protocolos` é limpo: livro removido, `padrao/` promovido à raiz, `valida-wire.mjs` movido para `conformidade/`, código e CI religados.

## Por quê

Pedido do Accountable (2026-08-06): "Vamos dividir o projeto do protocolo em dois". Motivação registrada no ADR: dois públicos e dois ritmos sob o mesmo teto — quem implementa o padrão não deveria acompanhar edições editoriais para saber o que é normativo, e o livro não deveria carregar a estabilidade que uma norma exige. O sintoma concreto: os schemas normativos apontam para um GitHub Pages que não existe mais.

## Critérios de aceite

**Fase 1**
- [x] **CA-1**: ADR com tabela de alocação artefato a artefato, alternativas avaliadas e consequências — incluindo o custo do reapontamento do Vercel e a ordem segura.
- [x] **CA-2**: o acoplamento de código entre as metades (suíte e gate de wire lendo `livro/padrao/schemas/`) tem solução decidida e implementada na ferramenta: schemas ficam com a especificação; nenhum código atravessa a fronteira depois da divisão.
- [x] **CA-3**: a extração preserva **histórico** (não é cópia): o repositório do livro nasce com os commits que tocaram seus arquivos.
- [x] **CA-4**: ensaio executado — o livro extraído **constrói** (motor de publicação roda dentro dele) e os links relativos resolvem; a especificação resultante passa nos seus gates (wire + autoteste).
- [x] **CA-5**: nenhum arquivo sai do lugar nesta fase; `protocolos` continua servindo o site como hoje.

**Fase 2 (pendente de gate humano)**
- [ ] **CA-6**: `aph-livro` criado e populado; Vercel reapontado com a URL preservada; site do livro no ar a partir do repositório novo.
- [ ] **CA-7**: `protocolos` limpo e religado, com CI verde e sem referência quebrada ao livro.

## Fora de escopo

Criar skills (o Accountable registrou a ideia — avaliação de código e sugestão de alteração — como candidata a spec própria); dar site próprio à especificação; renomear `protocolos`; alterar qualquer laboratório.
