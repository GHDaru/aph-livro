# Jornada J13 — Reconexão com aprovação pendente: o gate que sobrevive na tela e morre no servidor

> **Fio capturado em 2026-08** · última revisão 2026-08-13 · [histórico e registro de expiração](../HISTORICO.md)

> ⚠️ **Jornada majoritariamente experimental.** A sobrevivência da aprovação à reconexão não está verificada em laboratório nenhum, e num deles o resultado é **pior que perder o gate**: ele reaparece na tela e não pode mais ser decidido.

**Capítulos**: [02 — Transporte e sessão](../capitulos/02-transporte-sessao.md) · [05 — Ações governadas](../capitulos/05-acoes-governadas.md)
**Norma**: APH-5.6🧪, 5.7🧪 · 1.3 · [Anexo A §A.2, §A.4](https://github.com/GHDaru/protocolos/blob/main/padrao/anexo-a-wire-format.md)
**Laboratórios**: `ghdaru` **persistência assimétrica**: eventos no banco, propostas em memória de processo · `nexxussai-monorepo` propostas duráveis, e **nenhum endpoint para listá-las**
**Maturidade do fio**: ✅ o replay (APH-1.3). 🧪 a sobrevivência da aprovação e as filas separadas
**Pressupõe**: [J02](j02-conexao-cai.md), [J09](j09-acao-mutadora.md) · **Classes de evidência**: [ADR 0012](../../adr/0012-classes-de-evidencia-fora-dos-laboratorios.md) · **Índice**: [jornadas](README.md)

## Em uma frase

A [J02](j02-conexao-cai.md) garantiu que a conversa não se perde na queda. Esta jornada mostra que **a decisão pendente é outra coisa**, e que reconstruí-la a partir da conversa produz um gate que parece vivo e não é.

## O que você vai conseguir explicar

- Por que perder uma aprovação pendente é perda de governança, e não de experiência.
- Por que reconstruir o gate pelo replay não é equivalente a recebê-lo no estado inicial.
- Por que filas separadas por classe de ação não são organização, e sim informação.

## Quem fala com quem

| No diagrama | O que é |
|---|---|
| **Cliente** | Quem reconecta e precisa saber o que está pendente |
| **Servidor** | Quem guarda — ou não — a proposta aguardando decisão |
| **Log de eventos** | A fonte durável da conversa |
| **Repositório de propostas** | Onde vive o estado do gate |

## O fio

> **Figura J13-F1** — a reconexão como ela acontece hoje no laboratório A. O cartão volta; a decisão não.

```mermaid
sequenceDiagram
    autonumber
    accTitle: Reconexão reconstrói o cartão pendente pelo replay e a confirmação falha
    accDescr: A proposta aguarda decisão. A conexão cai e o processo do servidor reinicia. O cliente reconecta e pede o replay, que vem do log durável e traz o evento de proposta. O cliente reconstrói o cartão pendente e o usuário confirma. O servidor não encontra a sessão, porque as propostas vivem em memória de processo, e responde não encontrado. O gate sobreviveu na tela e não sobreviveu no servidor.
    participant C as Cliente
    participant S as Servidor
    participant L as Log de eventos
    participant R as Repositório de propostas
    S-->>C: action_proposal { requires_confirmation: true }
    Note over S,R: a proposta fica em awaiting_approval
    Note over C,S: a conexão cai; o processo reinicia
    C->>S: GET .../events?after=N
    S->>L: lê do durável
    L-->>S: inclui o action_proposal
    S-->>C: replay
    C->>C: reconstrói o cartão pendente
    C->>S: POST .../proposals/{id} { approved: true }
    S->>R: procura a proposta
    R-->>S: a sessão não existe mais
    S--xC: 404
    Note over C: o cartão está lá, e não decide nada
```

| # | De → Para | Troca | Lastro |
|---|---|---|---|
| 1–2 | Servidor → Cliente | proposta aguardando decisão | ✅ é o fio da [J09](j09-acao-mutadora.md) |
| 3–6 | Cliente → Servidor → Log | replay | ✅ o mecanismo funciona, e é o da [J02](j02-conexao-cai.md) |
| 7 | Cliente → si | reconstrução do cartão | ✅ acontece, e é o problema |
| 8–10 | Cliente → Servidor → Repositório | confirmação | ⚠️ **falha**: o log é durável e o repositório de propostas não |
| 11 | Servidor → Cliente | não encontrado | ⚠️ o gate sobreviveu na tela e não no servidor |

### 1. Perder o gate é perder governança

A norma é explícita sobre a natureza do problema: reconectar e perder uma aprovação pendente **não é apenas perda de experiência do usuário**. É perda de governança.

A razão é a da [J09](j09-acao-mutadora.md). O gate só é um controle porque é um estado no servidor, com endereço, prazo e dono. Uma aprovação que desaparece na reconexão vira uma ação que ninguém aprovou e ninguém recusou: ela não executou, o que é seguro, mas também não foi decidida, o que significa que o registro não sabe dizer o que aconteceu. Some-se o prazo de validade — que, como a [J09](j09-acao-mutadora.md) mostrou, é descoberto só na tentativa de confirmar — e o desfecho mais provável é uma proposta que expira em silêncio, sem que ninguém tenha decidido nada.

A norma admite dois caminhos: o cliente **reconstrói** os gates pendentes pelo replay, ou os **recebe** no estado inicial da assinatura, numa lista de aprovações pendentes. Ela trata os dois como equivalentes. Não são, e é o que a próxima seção mostra.

### 2. Reconstruir pelo replay não é equivalente a receber o estado

O laboratório A tem uma **persistência assimétrica**, e ela produz o pior desfecho possível.

Os eventos vão para o banco: o log é durável, e o replay funciona. As propostas vivem num repositório **em memória de processo**. Depois de um reinício, o replay ainda devolve o evento de proposta — então o cliente reconstrói fielmente o cartão pendente, com os botões — e a confirmação encontra uma sessão que não existe mais, respondendo "não encontrado".

O resultado é **pior que perder o gate**. Um gate perdido some, e a pessoa percebe. Um gate reconstruído a partir da conversa parece vivo: está na tela, tem botões, convida à ação — e não decide nada. A interface mente com convicção.

E aqui está a lição de protocolo, que vale além deste laboratório: **o replay reconstrói a conversa, não o estado**. O evento de proposta é o registro de que uma proposta foi feita, e não a proposta. Tratar um como o outro funciona enquanto o servidor não reinicia, que é exatamente o cenário em que a garantia importa.

A norma não faz essa distinção. Ela oferece os dois caminhos como alternativas e não diz que o primeiro só é equivalente ao segundo se o estado da proposta for tão durável quanto o log. Está registrado nas lacunas.

O outro laboratório erra pelo lado oposto, e é instrutivo: lá as propostas **são duráveis**, com tabela e migração. Só que não há endpoint nem chamador que as liste — o método existe no repositório e ninguém o usa. O estado sobrevive e é inalcançável.

Juntos, os dois contêm o desenho completo que nenhum contém sozinho, que é o padrão que se repete no livro inteiro.

### 3. A lista de aprovações pendentes não tem lugar no fio

O caminho que a norma prefere — receber os gates pendentes no estado inicial — esbarra numa ausência concreta: **não há campo para isso em lugar nenhum**.

O snapshot é o objeto que a aplicação manda para a inteligência artificial, e é fechado. Não existe endpoint de estado inicial da sessão. A superfície tem criação de sessão, envio de mensagem, replay, cancelamento e decisão de proposta — e nenhuma operação que responda "o que está aguardando decisão".

Ou seja: dos dois caminhos que a norma oferece, um é frágil pelo motivo da seção anterior, e o outro **não tem forma no fio**.

### 4. Filas separadas são informação, não arrumação

O requisito irmão pede que classes de ação com consequências materialmente distintas tenham filas de aprovação **separadas**, ou ao menos apresentação separada, com metadados próprios da classe.

A fonte externa faz exatamente isso, e a leitura do código mostra por que a separação é substantiva. Há uma fila de aprovações genéricas e uma fila **própria para edição de arquivo**, e a segunda carrega o que a primeira não teria onde pôr: os caminhos afetados e a operação. Uma aprovação de edição de arquivo sem os caminhos é um botão pedindo confiança; com os caminhos, é uma decisão.

Vale distinguir isso de uma separação parecida, porque confundi-las esconde o ponto. Na mesma fonte existe também uma fila de **entrevista**, e ela é de outra ordem: aprovação e entrevista não são duas classes da mesma coisa, são dois tipos de decisão — "posso?" e "com quê?" —, com tipos de retorno incompatíveis. Essa separação é a da [J12](j12-slot-filling.md). Aqui, o que está em jogo é o particionamento **dentro** da aprovação.

Nos laboratórios não há particionamento nenhum: um cartão só, discriminando classes por cor de borda.

## Quando o fio quebra

| Desvio | Bifurca em | Código | Como termina |
|---|---|---|---|
| O processo reinicia com proposta pendente | passo 8 | não encontrado | o cartão volta pelo replay e a decisão falha |
| O cliente não reconstrói o cartão | passo 7 | — | o gate some; a proposta expira sem decisão |
| A proposta é durável e não há como listá-la | — | — | o estado sobrevive e é inalcançável |
| Uma classe de risco alto compartilha fila e forma com as demais | — | — | a pessoa decide sem os metadados que a classe exige |

## Como reconhecer no seu sistema

- Deixe uma proposta pendente e **reinicie o servidor**. Se o cartão voltar e o botão falhar, você tem o pior dos dois mundos.
- Pergunte ao seu backend o que está aguardando decisão. Se não houver como perguntar, o caminho preferido pela norma não existe aí.
- Compare a durabilidade do log de eventos com a do estado das propostas. Se forem diferentes, o replay vai reconstruir cartões que não decidem.
- Veja se as aprovações de classes muito diferentes chegam à pessoa com os mesmos campos. Se sim, a decisão de maior consequência é a menos informada.

Da suíte de conformidade, o replay é verificado no Nível 1; a sobrevivência da aprovação não é verificada em lugar nenhum.

## Lacunas e derivas (2026-08-13)

| Lacuna | Onde | Estado | Gatilho |
|---|---|---|---|
| **Aprovações pendentes não têm campo no snapshot nem endpoint de estado inicial**: dos dois caminhos que a norma oferece, um não tem forma no fio | APH-5.6, §A.2, §A.4 | **aberta**, candidata a spec na norma | criar a operação, ou o campo |
| A norma trata "reconstruir pelo replay" e "receber no estado inicial" como **equivalentes**, e eles só são equivalentes se o estado da proposta for tão durável quanto o log. Onde não é, o replay reconstrói um gate que não decide | APH-5.6, APH-1.3 | **aberta**, candidata a spec na norma | dizer o que precisa sobreviver: o cartão, ou a decidibilidade |
| O mecanismo equivalente ao replay — fonte durável, snapshot na assinatura — é reconhecido pela norma e **não tem fio especificado**; só a obrigação de registrar a escolha | APH-1.3 | aberta | primeira implementação que o adote e queira interoperar |
| Filas separadas por classe não existem em laboratório nenhum: um cartão só, discriminando por cor | APH-5.7 | aberta | primeira implementação |
| A única fonte de ambos os requisitos está fora dos laboratórios, e é host fechado | APH-5.6, APH-5.7 | conhecida | verificação em laboratório |

**O que promoveria o APH-5.6 a ✅**: uma operação que devolva as aprovações pendentes de uma sessão, e um estado de proposta tão durável quanto o log de eventos — em qualquer laboratório, com teste que **reinicie o processo**.

**O que promoveria o APH-5.7 a ✅**: uma segunda classe de ação com fila e metadados próprios, em laboratório.

## Verificação

1. Um sistema reconstrói o cartão pendente pelo replay e a confirmação falha depois de um reinício. Explique por que esse desfecho é **pior** que simplesmente perder o cartão, e diga o que a interface está afirmando de errado.
2. A norma oferece dois caminhos para a aprovação sobreviver. Diga qual condição precisa valer para que o primeiro seja equivalente ao segundo — a norma não a enuncia.
3. Uma aprovação de edição de arquivo chega sem os caminhos afetados. O botão funciona, o gate existe e a máquina de estados está correta. Diga o que falta, e por que isso é do protocolo e não da tela.

---

## Apêndice — evidência por fonte

### `ghdaru` — laboratório

| Momento | Onde |
|---|---|
| Log de eventos durável, com chave composta por sessão e sequência | `apps/api/src/ghdaru_api/persistence/repositories/chat_events.py`, escolhido em `persistence/factory.py` quando há banco configurado |
| Propostas em repositório **em memória de processo** | `apps/api/src/ghdaru_api/conversation/adapters/in_memory.py`, ligado em `http/chat_router.py` |
| A confirmação exige a sessão, e responde não encontrado sem ela | `http/chat_router.py`, na verificação de posse da sessão |
| Reaplicação dos comandos no replay | `apps/web/src/features/conversation/ui/ChatPanel.tsx` |
| Lista de aprovações pendentes | **não existe** |

### `nexxussai-monorepo` — laboratório

| Momento | Onde |
|---|---|
| Propostas duráveis, com tabela e migração | `apps/api/app/ai_chat/infrastructure/persistence/action_proposal_orm_model.py` e a migração correspondente |
| Método para listar propostas de uma sessão | `apps/api/app/ai_chat/domain/repositories/action_proposal_repository.py` — **sem chamador e sem endpoint** |
| Filas separadas por classe | **não existem** |

### Fora dos laboratórios — o que sustenta o desenho

Nada aqui promove maturidade ([ADR 0012](../../adr/0012-classes-de-evidencia-fora-dos-laboratorios.md)).

#### Traycer — autor externo, em produção, host fechado

| Momento | Onde | Requisito que toca |
|---|---|---|
| Aprovações pendentes no estado inicial da assinatura | `protocol/src/host/agent/gui/subscribe.ts` | **APH-5.6** |
| Fila **própria** para edição de arquivo, com caminhos afetados e operação | mesmo arquivo | **APH-5.7** |
| Fila de entrevista, separada das duas | mesmo arquivo | é a [J12](j12-slot-filling.md), não este requisito |

### Onde isto está na norma

| Momento | Requisito |
|---|---|
| 1. Perder o gate é perda de governança | APH-5.6 🧪 |
| 2. Os dois caminhos, e a condição não enunciada | APH-5.6 🧪, APH-1.3 |
| 3. Sem campo e sem operação | §A.2, §A.4 |
| 4. Filas separadas por classe | APH-5.7 🧪 |

### O que não tem lastro nenhum

- **A operação que devolve as aprovações pendentes** — não existe na superfície, e nenhum laboratório a tem.
- **Filas separadas por classe** — nenhum laboratório.
- **O mecanismo equivalente ao replay** — reconhecido pela norma, sem fio especificado.
