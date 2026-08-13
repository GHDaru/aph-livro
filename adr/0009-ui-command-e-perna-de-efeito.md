# ADR 0009 — O `ui_command` é a perna de efeito de uma proposta, não um canal paralelo

**Data**: 2026-08-13 · **Status**: aceita · **Decisores**: consolidação de dois pareceres de especialistas (completude de protocolo com medição nos laboratórios; didática e sequenciamento), com a recomendação adotada integralmente — houve consenso, e nenhuma divergência a resolver

## Contexto

Ao escrever a [J08](../livro/jornadas/j08-acao-de-leitura.md), o bloco "Exemplo de sequência" do §A.3 do Anexo A apresentou uma ambiguidade real. Ele imprime **dois mecanismos** para o mesmo efeito observável, navegar para `/projetos`, usando literalmente o mesmo `ui.navigate`:

- um par `action_proposal` com `risk:"read"` e `requires_confirmation:false`, seguido de `action_result` com `status:"executed"`;
- um `ui_command` com `{command:"ui.navigate", args}`, solto, sem vínculo com nada.

Lidos lado a lado, parecem duas rotas alternativas. A pergunta era se a J08 deveria desenhá-las como dois fios, como um fio com variação, ou tratar uma e remeter a outra.

A decisão importa além da editoria. Pela regra 1 do [ADR 0008](0008-jornadas-do-protocolo.md), **diagrama publicado vira wire de fato**: desenhar dois canais rivais afirmaria, no artefato que o leitor mais lembra, que existe um caminho de execução com autoridade própria, fora do catálogo.

## Decisão

### 1. Um fio, três pernas

A J08 desenha **um** fio: `action_proposal` → `ui_command` → `action_result`. As três pernas em traço cheio.

O `ui_command` não é alternativa à proposta: é a **perna de efeito** dela. A norma implica isso sem enunciar — o APH-5.1 diz que nenhuma ação executa no momento em que o modelo a menciona e que toda ação nasce proposta; o APH-4.1 diz que o catálogo é a única superfície executável. Um `ui_command` que não seja perna de uma proposta é uma ação que nunca nasceu proposta e executa fora do catálogo, o que é duplamente não-conforme.

E o laboratório A resolve exatamente assim, com teste verde asserindo a **ordem canônica** dos eventos (`test_conversation.py:74`, no commit `a02cb12`): `thinking, action_proposal, ui_command, action_result, content, done`. "Executar direto" é uma aresta da máquina de estados — `proposed → executing`, pulando `awaiting_approval` —, e nunca o salto por cima da proposta. O caminho mutador do mesmo laboratório prova a regra pelo avesso: `session.logout` para no gate e **não emite `ui_command`** até a confirmação.

### 2. Uma segunda figura, para a variação de forma, não para um segundo caminho

O laboratório B não tem o tipo `ui_command`: o verbo de interface viaja **dentro** da proposta, como campo. Isso é variação explicitamente autorizada — o APH-2.1 diz "`ui_command` ou ação equivalente no frontend", e o §A.8 registra a ausência.

A J08 desenha essa forma numa figura pequena, na seção de variação, e o contraste faz o trabalho pedagógico: lá a perna de efeito **falta**, e o resultado é o cartão morto que o capítulo 06 já documenta. Mesmo sem nome próprio, a perna é obrigatória.

### 3. O APH-6.6 aparece em prosa, e não como seta

O requisito é ⚗️ e tem duas metades. A metade ✅, "verbo mutador nasce proposta", é matéria da [J09](../livro/jornadas/README.md), não desta. A metade 🧪, "o executor consulta a classe de risco e recusa fail-closed", é um check **ausente** — e ausência não é seta tracejada. Ela entra como `Note over` no executor, uma linha em "Quando o fio quebra", uma linha em "Lacunas e derivas" e um marcador em "Como reconhecer no seu sistema".

Isso respeita a regra 2 do ADR 0008, que manda o requisito parcial desenhar as duas metades separadas, sem inventar traço para o que não existe.

### 4. A ideia-âncora, e quanto da máquina de estados mostrar

A ideia-âncora da J08 é **"mesmo o que executa direto nasce proposta, e por isso deixa traço"**. É a única das candidatas que só esta jornada pode ensinar, e é a que corrige a intuição errada do leitor: sem gate → sem cerimônia → sem registro. O `requires_confirmation: false` tira o humano do caminho, não a proposta.

A máquina tem dez estados; a J08 percorre quatro. Ela mostra **só o trecho curto**, e aponta o todo por **organizador prévio verbal** — uma frase na abertura e uma nota no diagrama —, nunca por desenho. O princípio é o sequenciamento simples→complexo do 4C/ID: a J08 é a tarefa inteira na condição mais simples, não metade da máquina. Desenhar os dez estados cedo arrastaria o `stale` 🧪 para dentro de uma jornada cujo fio é ✅ ponta a ponta, e esvaziaria a J09, que o índice chama de o eixo do bloco.

### 5. Duas lacunas nomeadas, abertas por esta decisão

**A primeira é da norma, e é a mais acionável que a série produziu até aqui**: o `ui_command` **não tem correlação no fio** com a proposta que o autorizou. Em `evento.schema.json`, o payload exige só `command`, e não tem `proposal_id`, `action_id` nem `risk`. Isso morde o próprio APH-6.6: a norma pede ao executor um check por classe de risco **sem lhe fornecer o insumo**. Cumprir a metade 🧪 exige uma de duas coisas — campo de correlação no fio, ou o cliente consultando o catálogo —, e nenhuma das duas está dita. Vira candidata a spec em `GHDaru/protocolos`.

**A segunda é uma deriva editorial, encontrada de passagem**: o bloco de exemplo do §A.3 imprime dois eventos com `seq: 5` — o `action_result` de lote e o `ui_command` —, contra o APH-1.2, que exige `seq` monotônico por sessão. O JSON golden está correto (o lote é `seq: 12`), então o defeito é só do bloco ilustrativo, e nenhum gate o pega porque o gate valida o golden. Fica registrado aqui e reportado ao repositório da norma; **este livro não o corrige por conta própria**.

## Alternativas avaliadas

- **Dois fios distintos, dois diagramas.** Recusada pela regra 1 do ADR 0008: publicaria um canal com autoridade própria que nenhum schema e nenhum laboratório sustentam. Contradiria também o capítulo 06 deste livro, que já diz que a família de comandos "não é um canal paralelo — é cidadã do mesmo catálogo". Aqui a norma não conflita com o livro: ela **silencia**; então o capítulo governa.
- **Tratar só a proposta e remeter o comando a outra jornada.** Recusada: não há jornada para recebê-lo. O índice não tem jornada de comando de interface, e o ADR 0008 não o listou entre o que fica sem jornada — APH-6.1 e 6.2, ambos ✅, ficariam sem fio em toda a série.
- **Mostrar a máquina de estados inteira na J08.** Recusada: seis estados desenhados que não disparam nesta jornada são carga sem função, e o custo cai sobre a J09.
- **Dar figura própria ao contraexemplo do APH-6.6.** Recusada: deslocaria o holofote do caminho feliz para a patologia, numa jornada que é a porta de entrada do Bloco 2.

## Consequências

- A J08 fica com duas figuras, e a segunda é sobre **forma**, não sobre caminho. Quem ler rápido leva a lição certa: o atalho é o gate, nunca a proposta.
- O livro passa a afirmar, em prosa, um vínculo que a norma implica e não enuncia. Isso é dívida de sincronização no sentido do Princípio VIII, e está nomeado na lacuna 1 acima em vez de escondido.
- O contraexemplo vivo do laboratório A ganha leitura precisa, e ela é mais desconfortável do que a do capítulo 06: o executor obedeceria a **qualquer** `ui_command` que visse, e a garantia de que só chega verbo de leitura é inteiramente a montante. Some-se a isso que o executor **reaplica** comandos no replay pós-reconexão, o que é inócuo para navegação e não seria para verbo mutador.
- Duas candidatas a spec saem para `GHDaru/protocolos`, e nenhuma é preenchida aqui.
