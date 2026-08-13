# Jornadas do protocolo — índice

> **Fio capturado em 2026-08** · última revisão 2026-08-13 · decisão de formato no [ADR 0008](../../adr/0008-jornadas-do-protocolo.md)

Os capítulos explicam o que cada peça do Padrão APH (Aplicação ↔ Harness) é. Estas jornadas mostram **a conversa acontecendo**: quem fala com quem, em que ordem, e o que atravessa o fio.

São o gênero vizinho das *journeys* da metodologia Maestro, com uma troca: onde a journey de produto tem fluxograma e captura de tela, a jornada de protocolo tem **diagrama de sequência e tabela de trocas**. A tabela é a fonte normativa da sequência; o diagrama é a mesma informação em forma visual, e desenha no GitHub.

## Como ler

Cada jornada é independente, mas a ordem abaixo é a de escrita e a de leitura recomendada: J01 é a única que não pressupõe nenhuma outra, transporte vem antes de semântica, catálogo antes de ação, e recusa depois do caminho feliz.

Três convenções valem em todas:

- **Traço cheio** é troca implementada e verificada em laboratório; **traço tracejado** é troca que só existe na norma (marcada 🧪). O requisito de maturidade parcial (⚗️) desenha as duas metades separadas.
- **Nenhuma jornada desenha mensagem que não exista nos schemas.** Onde o fio falta, o documento abre uma **lacuna nomeada** em vez de inventar. As lacunas encontradas viram candidatas a spec no repositório da norma.
- Cada momento tem **path no apêndice**. Momento sem path é aviso de que ele é aspiracional.

## As jornadas

### Bloco 1 — Nível 1 (Observador): o fio do chat

| # | Jornada | Em uma frase | Requisitos | Estado |
|---|---|---|---|---|
| [J01](j01-primeira-pergunta.md) | Primeira pergunta: sessão, snapshot e resposta | A espinha: a tela vira contexto e a resposta chega em pedaços | APH-1.1, 1.2, 2.1, 3.1–3.3, 3.5, 7.1, 7.3 | ✅ escrita |
| [J02](j02-conexao-cai.md) | A conexão cai: replay sem perda nem duplicação | O que garante que a conversa não se perde | APH-1.3, 1.2, 2.5 | ✅ escrita |
| [J03](j03-cancelamento.md) | O usuário manda parar: cancelamento cooperativo | Parar é protocolo, não silêncio | APH-1.4, 1.5 | ✅ escrita |
| [J04](j04-porta-do-modelo.md) | Por trás da porta: chunk de provedor vira evento canônico | Onde o formato do fornecedor morre | APH-2.3, 8.1, 8.2🧪, 1.5 | ✅ escrita |
| [J05](j05-citacao-e-proveniencia.md) | Resposta com fontes: citação e proveniência | Por que o anexo de agora não vale o documento curado | APH-2.1, 2.6🧪, 7.1 | ✅ escrita |
| [J06](j06-o-fio-evolui.md) | O fio evolui: tipo desconhecido, campo novo, versão | Como mudar sem quebrar quem já implementou | APH-2.2, §A.9, B.2.5 | ✅ escrita |

### Bloco 2 — Nível 2 (Operador): a ação governada

| # | Jornada | Em uma frase | Requisitos | Estado |
|---|---|---|---|---|
| [J07](j07-catalogo.md) | O que a aplicação sabe fazer: catálogo, risco e tools | A única superfície executável | APH-4.1–4.4🧪, 7.2 | ✅ escrita |
| [J08](j08-acao-de-leitura.md) | Ação de leitura: a proposta que executa direto | O caminho curto, e por que ele ainda é proposta | APH-5.1, 5.2, 5.5, 6.1–6.3, 6.6⚗️ | ✅ escrita |
| [J09](j09-acao-mutadora.md) | Ação mutadora: proposta, gate humano, execução, traço | O eixo do bloco: a máquina de estados inteira | APH-5.1, 5.2, 5.3🧪, 5.5, 5.8🧪, 7.2, 7.4 | ✅ escrita |
| J10 | A tela mudou entre propor e confirmar | Frescor não é autorização | APH-5.4, 3.4🧪 | ⏳ |
| J11 | Um lote, uma confirmação: N alvos, desfecho por alvo | Oito confirmações idênticas ensinam a clicar sem ler | APH-5.9🧪, 5.5, 5.2 | ⏳ |
| J12 | Falta um dado: slot filling estruturado | E a lacuna: não existe evento para pedir | APH-6.4🧪, 6.1, 6.5 | ⏳ |
| J13 | Reconexão com aprovação pendente | Perder um gate é perda de governança | APH-5.6🧪, 5.7🧪, 1.3 | ⏳ |

### Bloco 3 — As recusas

| # | Jornada | Em uma frase | Requisitos | Estado |
|---|---|---|---|---|
| J14 | Recusa por autoridade | Ausência é melhor fronteira que recusa | APH-4.1, 4.3, 7.2, 5.5 | ⏳ |
| J15 | Injeção barrada | O texto hostil que chega pela tela | APH-3.3, 3.5, 7.1, 7.3 | ⏳ |

### Bloco 4 — Nível 3 (Federado): a junta

> **Todo este bloco é experimental.** O Nível 3 é declarado experimental pela norma, e nenhuma implementação o exercitou de ponta a ponta. As obrigações usam DEVE de propósito, e são **condicionais**: não obrigam a federar, obrigam quem federar.

| # | Jornada | Em uma frase | Requisitos | Estado |
|---|---|---|---|---|
| J16 | Admissão de uma aplicação federada | O que precisa estar acordado antes do primeiro embarque | APH-9.1🧪, B.4, B.5, B.10 | ⏳ |
| J17 | Embarque e handshake | Quem fala primeiro, e por que a credencial não é a sessão | APH-9.2🧪, 9.4a, 9.5🧪, B.1–B.3, B.6 | ⏳ |
| J18 | A aplicação federada propõe (nunca executa) | O contrato da IA reinstanciado para terceiros | APH-9.4b🧪, 4.1, 5.1, B.3.3, B.7, B.9 | ⏳ |
| J19 | O embarque é recusado | Três recusas, três decisores, um estado honesto | APH-9.2🧪, B.1.2, B.2.3, B.6.5 | ⏳ |

## O que não tem jornada, e por quê

Nem todo requisito é uma conversa. Nove ficaram de fora por decisão registrada no [ADR 0008](../../adr/0008-jornadas-do-protocolo.md), e o motivo é sempre o mesmo: **não há fio para desenhar**, e forçar um seria inventar protocolo.

| Requisito | Por que não |
|---|---|
| APH-3.1, registro de telas | Arquitetura interna. O fio carrega o resultado (o snapshot), não a fonte de verdade que o produziu. Entra como pré-condição em J01 |
| APH-4.3, catálogo derivado de permissões | A conformidade é uma **ausência**: a ação que não entra no inventário. Só desenhável por contraste, e é o que J07 e J14 fazem |
| APH-6.5, nenhuma interface serializada pelo modelo | Proibição negativa. Não há fio, só contraexemplo. Nota em J12 |
| APH-8.1, metade "SDK não circula fora dos adaptadores" | Arquitetura interna. A metade observável está em J04 |
| APH-7.4, escopo de auditoria | As jornadas mostram o traço sendo escrito; a consulta ao traço não tem fio na norma |
| APH-9.3, projeção MCP | A norma remete à especificação do Model Context Protocol e não define fio próprio. Uma jornada aqui redesenharia outro protocolo |
| §A.8, mapeamento de nomes | Tabela de tradução, não conversa |
| B.8, modo embarcado | São estados de tela, não mensagens. Entram em J17 como estados |
| B.11, B.12, meta-conformidade | Como declarar conformidade, por lado. Nenhum fio |

## Lacunas da norma que estas jornadas encontraram

Registradas aqui à medida que aparecem, com o documento que as levantou. Cada uma é candidata a spec no repositório da norma, e nenhuma é preenchida por conta própria.

| # | Lacuna | Onde apareceu | Estado |
|---|---|---|---|
| 1 | Não existe tipo de evento para **pedido estruturado de dados**: o vocabulário fechado tem oito, e o mais próximo é o comando `clarify`. A resposta do usuário ao formulário não tem forma no fio | J12 (APH-6.4) | a registrar |
| 2 | Aprovações pendentes não têm campo no schema de snapshot nem endpoint de estado inicial | J13 (APH-5.6) | a registrar |
| 3 | O prazo de validade de uma proposta não é dito pela norma: nem o valor, nem quem dispara a expiração, nem por qual mensagem. No laboratório A ele é descoberto só na tentativa de confirmar | J09 (APH-5.1) | a registrar |
| 4 | O estado canônico `stale` não tem implementação; o laboratório encerra como `cancelled` e chama o erro de `STALE_CONTEXT` | J10 (APH-5.4) | conhecido, mapeado no §A.8 |
| 5 | O mecanismo equivalente ao replay (fonte durável) não tem fio especificado, só a obrigação de registrar a escolha | J02 (APH-1.3) | a registrar |
| 6 | O regime de versionamento negociado por método é reconhecido pela norma, que não especifica handshake nenhum para ele | J06 (APH-2.2) | a registrar |
| 7 | Nenhum laboratório publica a lista de prefixos de rota reservados | J16 (B.10.2) | a registrar |
| 8 | O comando de interface **não tem correlação no fio** com a proposta que o autorizou: o payload exige só o comando, sem identificador de proposta, de ação ou classe de risco. O check fail-closed do APH-6.6 fica sem insumo | J08 (APH-6.6, §A.3) | a registrar |
| 9 | *Deriva editorial, não lacuna*: o bloco de exemplo do §A.3 imprime dois eventos com o mesmo número de sequência, contra o APH-1.2. O JSON de referência está correto, e por isso nenhum gate pega | J08 (§A.3) | a reportar |
| 10 | O APH-5.1 manda as transições fora da tabela falharem, e **a norma não publica tabela nenhuma**. As arestas `proposed → executing`, `proposed → denied`, `proposed → expired` e `confirmed → denied` existem em código e em nenhum lugar da norma | J09 (APH-5.1) | a registrar |
| 11 | Guardas que respondem por código HTTP não aparecem no fio: quem só escuta o fluxo não vê expiração nem contexto desatualizado acontecerem | J09 (§A.3, §A.7) | a registrar |
