# Histórico do livro

Este livro é **datado por construção** (Constituição, Princípio IV): a fronteira aplicação↔IA está em padronização ativa, e afirmações verdadeiras hoje expiram. Este arquivo registra as edições e mantém o registro de expiração.

## Como ler as datas do livro

- **Data do evento** — no corpo dos capítulos, imutável ("em dez/2025 a spec X foi publicada").
- **Data de captura** ("estado da arte capturado em") — no cabeçalho de cada capítulo; tudo no capítulo é verdadeiro *até essa data*.
- **Data de revisão** — última passada editorial; não implica recaptura do estado da arte.

Reavaliar = nova rodada com nova data, nunca sobrescrever a história.

## Snapshot por capítulo

| Capítulo | Estado da arte capturado em | Estágio | Última revisão |
|---|---|---|---|
| 00 — Introdução | 2026-07 | texto completo | 2026-07-30 |
| 01 — Fundamentos e vocabulário | 2026-07 | texto completo | 2026-07-30 |
| 02 — Transporte e sessão | 2026-07 | texto completo | 2026-07-31 |
| 03 — A voz da IA: eventos tipados | 2026-07 | texto completo | 2026-08-03 |
| 04 — A voz da aplicação: contexto de tela | 2026-07 | texto completo | 2026-07-30 |
| 05 — Ações governadas | 2026-07 | texto completo (piloto) | 2026-08-03 |
| 06 — Comandos de UI e slot filling | 2026-07 | texto completo | 2026-07-31 |
| 07 — Segurança do protocolo | 2026-07 | texto completo | 2026-08-03 |
| 08 — A porta do modelo e o tool calling | 2026-07 | texto completo | 2026-07-30 |
| 09 — Federação e composição | 2026-07 | texto completo | 2026-07-31 |
| 10 — O estado da arte externo | 2026-07 | texto completo | 2026-08-03 |
| 11 — Convergências | 2026-07 | texto completo | 2026-08-03 |

*Estágios (GUIA-CAPITULO §"Estrutura antes do conteúdo"): estrutura → texto completo.*

## Registro de expiração

Previsões e afirmações sensíveis ao tempo, pontuadas contra a realidade a cada edição: 🔵 em aberto · 🟢 confirmada · 🟡 parcial · 🔴 refutada.

| # | Afirmação | Origem | Estado | Evidência |
|---|---|---|---|---|
| E1 | A fronteira app↔agente embutido não terá protocolo dominante único antes de 2027; a padronização virá por composição (eventos tipados + tools + confirmação humana) e não por um spec vencedor. | cap. 11 (estrutura) | 🔵 | 2026-08-03: +1 convergência independente — o caso externo Traycer (`estudos/caso-traycer.md`) compõe vocabulário fechado de eventos + gate humano como estado, sem adotar spec único. Evidência acumulada; pontuação só em janela. |
| E2 | As duas bases-laboratório implementarão tool calling real (catálogo→tools) antes de adotarem qualquer protocolo externo de UI. | cap. 08 (estrutura) | 🟡 | 2026-08-10: **parcialmente confirmada no laboratório A** — o épico Chat-OS entrega ferramentas reais ao modelo (`ui_submit` como ação de catálogo com `permission="ask"`, `agent_tools.py`), sem nenhum protocolo externo de UI adotado. Falta a segunda base para pontuar em cheio; a promoção definitiva fica para a janela. |

## Edições

### Edição 0.16 — 2026-08-13 · Linguagem humana, glossário e a regra de sincronização (spec 035 de `GHDaru/protocolos`)

- **Os três documentos normativos foram reescritos**, por motivo editorial: o texto carregava marcas de escrita de máquina que cobravam caro de quem lê para implementar. Travessões **de prosa** caíram de 174 para **zero** nos três somados (contando também títulos e tabelas, de 245 para 18), cada sigla passou a vir por extenso na primeira ocorrência, e os parágrafos-monólito viraram parágrafos.
- **A norma não mudou**, e isso é verificado por gate. Um instantâneo dos 89 requisitos, tirado **antes** da primeira edição, registra maturidade e força de cada obrigação; qualquer divergência derruba o CI. O gate pegou duas mudanças normativas silenciosas durante a reescrita: um `DEVE` a mais no APH-1.4 e outro no APH-9.4b, os dois introduzidos ao quebrar frases em duas. As duas endureciam a norma sem revisão.
- **O que o gate não pegou, a revisão independente pegou, e ela era contra este livro.** A reescrita afirmou que o item LLM06 do OWASP é "vazamento de informação sensível"; ele é *Excessive Agency*, agência excessiva. O texto normativo anterior citava `LLM01/LLM06` sem dizer o que eram, e a reescrita inventou o conteúdo, na base normativa declarada de um requisito ✅. **Seis passagens deste livro já traziam a versão certa**, com a fonte no cap. 07 (PDF do OWASP Top 10 for LLM Applications v2025). A norma foi corrigida. É a demonstração mais clara do porquê do Princípio VIII: os dois lados se conferem, e desta vez foi o livro que segurou a norma.
- **A especificação ganhou glossário próprio** (`padrao/glossario.md`), com 41 siglas e os termos técnicos. O motivo é o teste de aptidão que o próprio Anexo B fixou: quem clona só a especificação precisa entender o contrato sem sair dela. O glossário **deste livro** continua sendo o didático, e ganhou uma seção sobre os termos que chegaram com a federação.
- **Emenda à constituição: Princípio VIII, "Dois repositórios, uma norma"** (v1.1.0). Mudança no normativo passa a obrigar a verificação deste livro, com resultado registrado mesmo quando for "nada a mudar". A regra nasceu de uma constatação incômoda: entre as specs 032 e 034 o normativo mudou quatro vezes e o livro não foi tocado nenhuma. Esta edição é a primeira aplicação da regra, e o que ela encontrou está nas três edições abaixo.

### Edição 0.15 — 2026-08-13 · Matriz de obrigação por lado e o hospedeiro sob suíte (spec 034)

- **Anexo B v0.2**: as 49 obrigações da federação (44 cláusulas do anexo e os 5 requisitos do §4.9) passaram a declarar **de que lado caem** — hospedeiro, aplicação ou ambos — em arquivo de dados com gate próprio, e não em tabela de markdown, que envelhece em silêncio.
- **O lado hospedeiro da junta ganhou suíte executável**: 10 checks de caixa-preta sobre manifesto, fronteiras de embarque, grant e introspecção, com 13 sabotagens. O lado da aplicação continua sem suíte, porque o canal `postMessage` exige navegador, e isso está dito em vez de disfarçado.
- **Três hospedeiros adversários, construídos pela revisão independente, recebiam APTO violando cláusula dada como verificada.** O mais instrutivo: a suíte lia resposta HTTP fora de 2xx como `null`, e `null` como conformidade. A lição ficou no ADR 0009: sabotar o servidor de referência prova que o check reage; só um adversário independente prova que ele não pode ser contornado.

### Edição 0.14 — 2026-08-12 · Anexo B: o contrato da junta federada (spec 033)

- **Anexo B v0.1**, o fio da federação, fechando cinco lacunas de contrato relatadas pelos dois times que constroem a junta: canal, envelope `ghd.*` e sequência, contrato de admissão, schema do manifesto, grant e introspecção, capability, modo embarcado, confiança assimétrica e rota canônica.
- **A lacuna não era hipótese.** Ao ler os dois lados para escrever o anexo, os envelopes se mostraram incompatíveis: o hospedeiro exige `{protocol, v, type, payload}` e descarta o resto; a aplicação emite `{tipo, versao}`. Ligados hoje, o `ghd.ready` cairia no descarte e o handshake nunca sairia.
- **Segundo achado, do mesmo tipo**: a aplicação posta `ghd.ready` com `targetOrigin: "*"` tendo a origem do hospedeiro em mãos por configuração.

### Edição 0.13 — 2026-08-12 · Padrão APH v0.6: a primeira correção de texto normativo publicado (spec 032)

- **O APH-9.2 estava errado, e dois times descobriram implementando.** Ele prescrevia `sandbox` mais verificação de origem nos dois lados, o que é autocontraditório: sem `allow-same-origin` a origem é opaca, `event.origin` chega `"null"` e o `targetOrigin` é forçado a `"*"`. A norma empurrava para a insegurança que ela mesma queria evitar. A v0.6 prescreve a configuração correta e acrescenta a exigência de **site distinto** (eTLD+1), porque origem distinta não impede um subdomínio irmão de ler os cookies do hospedeiro.
- **APH-9.4 novo, ⚗️, com as metades declaradas**: a credencial própria do embarque é ✅; a interseção com as capabilities do usuário, cobrada por rota, nasce 🧪. A primeira redação dizia que o requisito inteiro era ✅, e a revisão independente mostrou que a maturidade estava **invertida** — o que estava provado ficara 🧪 e o que não estava, ✅. O handoff chegou a dizer ao time do hospedeiro que ele já cumpria o que não tinha implementado.
- **APH-9.5 novo** (a introspecção autentica o chamador) e APH-7.4 com remissão em vez de obrigação nova.

### Edição 0.12 — 2026-08-10 · Padrão APH v0.5: nível experimental e obrigação condicional (spec 031)

- **A dívida que a revisão da 029 apontou está fechada** — e ela era real: o §4.9 usava **DEVE** em requisitos **🧪** desde a v0.1, violando a régua do próprio §0. A varredura mostrou que a violação era pontual (2 de 11 requisitos 🧪; os outros nove já usavam DEVERIA).
- **A correção óbvia estava errada.** Rebaixar `APH-9.1`/`APH-9.2` para DEVERIA deixaria o Nível 3 com **zero obrigações** (o `APH-9.3` já era DEVERIA) — um nível de conformidade que não separa quem cumpre de quem declara. Pior: o que se perderia seriam justamente as duas travas de segurança da federação (verificar `origin` nos dois lados, validar token por introspecção).
- **O que a régua misturava**: a maturidade do *requisito* e a maturidade do *nível que o exige*. O §0 fora escrito presumindo que todo requisito vive em nível já provado — e o Nível 3 é inteiramente experimental. Decisão ([ADR 0006](https://github.com/GHDaru/protocolos/blob/main/adr/0006-*.md)): o **Nível 3 passa a ser declarado experimental** (🧪), e dentro de um nível experimental requisito 🧪 PODE usar DEVE, porque a obrigação é **condicional** — não obriga a federar, obriga quem federar. O aviso de maturidade fica no nível, onde o leitor decide.
- **Nada afrouxou**: nenhum DEVE virou DEVERIA, nenhum requisito saiu, o fio segue v0.3. Uma implementação conforme à v0.4 segue conforme à v0.5 — o que mudou é que declarar Nível 3 agora declara também que se está construindo à frente da evidência.
- **IA (A3)**: agente **Claude Code (Anthropic)**; decisão de norma sob gate humano (GHDaru).

### Edição 0.11 — 2026-08-10 · Padrão APH v0.4 e fio v0.3: os refinamentos sobem ao normativo (spec 029)

- **`livro/padrao-aph.md` → v0.4**, aplicando o [ADR 0005](https://github.com/GHDaru/protocolos/blob/main/adr/0005-*.md): **APH-2.6** (🧪 proveniência na citação — separa fonte curada de anexo não-confiável, para que a distinção do APH-7.1 não se perca na tela); **APH-6.6** (executor de comando de UI recusa *fail-closed* verbo mutador; `submit` no APH-6.1 designa a proposta, não a execução); **APH-5.8** (🧪 valores server-authoritative para ação mutadora, com construção fail-closed); **APH-3.4 refinado** (`context_hash` é frescor, **não** autorização); **APH-5.4 promovido a ✅**; **APH-7.1 reforçado** (camada não-confiável demarcada no contrato de contexto, antes do primeiro conteúdo injetado).
- **Fio → v0.3** (`livro/padrao/anexo-a-wire-format.md`): a citação ganhou `provenance` **opcional** — a primeira vez que a regra do §A.9 é exercitada (campo opcional novo = MINOR; consumidor da v0.2 segue funcionando porque ignora o que não conhece). Gate de wire subiu de 32 para **34 casos**: exemplo com proveniência, e contraexemplo de proveniência vazia (declarar origem exige dizer qual).
- **A verificação de evidência corrigiu três afirmações antes de virarem norma** (Princípio I; laboratório conferido no tip `a02cb12`, posterior ao clone da edição 0.09): a proveniência é *string aberta e ainda não emitida* no laboratório — não o "vocabulário fechado" que o ADR descrevia —, então APH-2.6 entra 🧪; o APH-6.6 tem **metades de maturidade diferente** (o verbo governado é ✅, a guarda no executor é 🧪 — o contraexemplo `session.logout` segue despachado direto em `ui-commands.ts:67`, bug que o próprio ADR 0018 do laboratório registra em aberto); e o laboratório encerra a proposta obsoleta como `cancelled` com erro `STALE_CONTEXT`, **não** no estado `stale` — que segue 🧪, com o nome local registrado no mapeamento §A.8.
- **Novidade de método**: nasceu a maturidade **⚗️ parcial** (§0 e §5), para requisito cujas metades têm evidência diferente — com a regra de que vale a metade mais fraca, inclusive para a proibição "🧪 nunca é DEVE".
- **Registro de expiração**: **E2 passa de 🔵 a 🟡** — o laboratório A entrega ferramentas reais ao modelo (o `ui_submit` do R6) sem ter adotado protocolo externo de UI, que é a ordem que a aposta previa; falta a segunda base para pontuar em cheio.
- **A revisão independente reprovou a primeira passada**, e o que ela pegou vale registrar: (a) eu havia **herdado do ADR uma afirmação sem conferir** — um "teste anti-regressão" que não existe no código —, exatamente o erro que esta edição se gaba de ter corrigido três vezes; (b) três requisitos 🧪 estavam redigidos com **DEVE**, violando a própria régua do §0, e um deles caíra no bloco obrigatório do checklist — o que faria o laboratório reprovar o Nível 2 por algo que ninguém implementou. Corrigido antes do registro. Ficou também a dívida pré-existente anotada: o §4.9 usa DEVE em requisitos 🧪 desde a v0.1, e isso merece decisão própria.
- **Propagação**: versões atualizadas na suíte, no README dela (a lista DECLARADO cresceu de 10 para **12** itens, com os dois novos de Nível 1 que a caixa-preta não alcança), na navegação do site e no sumário.
- **IA (A3)**: agente **Claude Code (Anthropic)**; proposta redigida em sessão paralela (ADR 0005), verificação de evidência e subida ao normativo nesta; gate humano do Accountable (GHDaru).
- **Na mesma entrega, spec 030 — skills de adoção** (`.claude/skills/`, página em `skills.md`): `aph-avaliar` e `aph-sugerir` cobrem por leitura de código os **10 itens** que a suíte declara não alcançar de fora. Nascem carregando as armadilhas que este livro documentou: crédito parcial, declaração-que-não-é-mecanismo e a assimetria de sub/sobre-afirmar — cada uma com o caso real que a originou.

### Edição 0.10 — 2026-08-10 · ADR 0005: refinamentos APH do laboratório ghdaru (R5/R6), candidatos a v0.4

- **`adr/0005-refinamentos-aph-do-laboratorio-ghdaru-r5-r6.md`**: decisão + evidência a partir dos rounds R5
  (anexo efêmero) e R6 (`ui.submit` governado) do épico Chat-OS do `ghdaru`, conduzidos com comitê + security
  review. Quatro refinamentos aditivos: **P1** proveniência na família *citação* (novo APH-2.6; único que toca o
  fio — `provenance` opcional no Anexo A); **P2** invariante read×mutação com guarda **fail-closed** no executor
  direto (novo APH-6.6; contraexemplo de laboratório: executor cego a risco executando `session.logout` mutador
  direto); **P3** `context_hash` = **frescor, não autz** + valores de campo **server-authoritative** para
  mutação (refina APH-3.4; promove **APH-5.4** a ✅-lab via `STALE_CONTEXT`); **P4** camada **não-confiável
  explícita** para anexo/conteúdo do usuário (reforça APH-7.1).
- **Evidência**: paths verificáveis no `ghdaru` (ADRs 0017/0018, spec 030, `wire.py`, `agent_turn.py`,
  `screen_registry.py`, `context.py`) — Constituição §1; laboratório somente-leitura §2. Nada mudou no normativo
  ainda: a subida ao `livro/padrao-aph.md` (candidato v0.4) segue por spec própria com gate humano.
- **IA (A3)**: agente **Claude Code (Anthropic)**; a decisão de normatizar é gate humano (GHDaru).

### Edição 0.09 — 2026-08-06 · A suíte encontra o laboratório: perfis de adaptação e a primeira medição (spec 027)

- **Camada de perfis** (`conformidade/perfis/`): o padrão permite paths (DEVERIA) e nomes locais (PODE); um perfil traduz operações, campos, nomes de `kind`, formato do replay e autenticação do alvo para o canônico. **Regra de integridade**: perfil é dicionário, não isenção — não há campo de isenção (operação ausente faz o check **falhar**), o mapa de nomes é **validado na carga** e toda tradução aplicada sai no relatório. O Gate 3 passou a provar quatro propriedades (traduz / é necessária / não isenta nas operações / não isenta no vocabulário), com um modo "dialeto local" no servidor de referência como alvo conforme de teste.
- **A garantia acima nasceu falsa e foi corrigida antes de publicar**: a revisão independente falsificou o critério de aceite — com `{"done": "content"}` no perfil, um alvo **sem terminador** passava 11/11 e o veredito invertia, porque os `content` viravam `done` e o payload de `done` é permissivo. A guarda de nomes (recusa de roubo de nome canônico e de fusão de tipos) e a quarta prova do autoteste vieram desse achado. Fica também o limite declarado, que nenhuma guarda resolve: perfil que minta sobre campos do próprio produto é declaração falsa, da mesma classe da autodeclaração mentirosa — o remédio é o artefato ser versionado, revisável e citado no relatório.
- **Primeira medição de uma aplicação real** (`conformidade/execucoes/2026-08-06-ghdaru.md`): a API do `ghdaru` (commit `5084575`) foi subida localmente em modo offline (sem chave de provedor → adapter fake) e exercitada pela suíte. Resultado: **NÃO APTO ao Nível 1 — 8/11 verificados, 1 aviso, 2 falhas** (cancelamento inexistente, APH-1.4; envelope de erro sem código estável, APH-1.5/A.7), com causa de cada desvio apontada por path e receita de reprodução completa. Determinismo conferido em duas execuções; o laboratório permaneceu **byte a byte intacto** (venv fora do repositório, bytecode desligado, `git status` vazio ao fim); credenciais só por variável de ambiente, nenhuma em arquivo.
- **Execução calibra leitura**: o confronto com a auditoria por leitura (spec 023) divergiu em dois pontos, em direções opostas — APH-1.5 estava generoso (🟡 → ❌: crédito parcial premiava a intenção, e o requisito existe para o cliente discriminar por código) e APH-3.5 estava severo (❌ → 🟡: é DEVERIA, e a escala plana da auditoria perdia a distinção). O handoff do roteiro Nível 2 recebeu a seção "o que a medição mudou" e critérios de pronto amarrados aos checks. Achado a favor do laboratório: o campo sensível do teste **não chega ao modelo** (`sanitize.py:4`) — o APH-3.3 tem evidência, ainda que o schema não seja fechado.
- **Nada de normativo mudou**: padrão segue v0.3, Anexo A v0.2, schemas intocados.
- **IA (A3)**: agente **Claude Code (Anthropic)**; pedido e curadoria humanos (GHDaru).

### Edição 0.08 — 2026-08-05 · Suíte de conformidade executável: Nível 1 (spec 026)

- **`conformidade/`** — a primeira feature de código do repositório: `suite.mjs` (11 checks caixa-preta contra a superfície de referência do Anexo A §A.2, validando eventos contra os **schemas reais** de `livro/padrao/schemas/`; relatório VERIFICADO/FALHOU/AVISO/DECLARADO com veredito e exit code), `servidor-referencia.mjs` (Nível 1 em memória, sem LLM — exemplo executável do padrão) e `autoteste.mjs` (**Gate 3 do CI**: íntegro passa em tudo; **11 sabotagens**, uma por check no mínimo, cada uma detectada pelo check certo com o status esperado — a do snapshot furado exercita o caminho AVISO de ponta a ponta).
- **Honestidade de método**: os 10 itens do Nível 1 que a caixa-preta não alcança (sanitização server-side, separação de camadas, registry, normalizador, metades do cliente — parser, dedup —, teto de tamanho) são **listados como DECLARADO com o porquê** — a suíte não finge cobertura. DEVERIA reprova como AVISO, nunca como FALHOU. Limitações declaradas no README: a v1 testa os **nomes canônicos** do vocabulário (nomes locais, que o padrão permite, esperam o mapeamento da fatia dos adapters) e os paths de referência.
- **Padrão segue v0.3** (a suíte verifica, não normatiza; fio segue v0.2): §0 atualiza a limitação declarada ("sem suíte" → "suíte cobre só o Nível 1"), §7 aponta a suíte, §8 restringe o item futuro aos Níveis 2–3. Página da suíte publicada no site (`conformidade/README.md`), na navegação e na Parte normativa do sumário. Glossário: caixa-preta, servidor de referência, sabotagem (teste de mutação), exit code, npm.
- **Verificação**: gates verdes (wire 32 casos; build com links; autoteste 11/11 íntegro + 11/11 sabotagens) e **revisão independente em contexto fresco** com execução própria dos gates e um experimento próprio (alvo conforme com nomes locais) — 0 críticos, 4 importantes e 6 menores, todos corrigidos ou registrados como decisão antes deste registro: parser SSE passou a ignorar comentários (gramática padrão), a restrição a nomes canônicos virou limitação declarada em vez de reprovação muda, as metades-cliente do checklist entraram em DECLARADO, e a cobertura de sabotagens subiu de 6 para 11 (detalhe na spec 026).
- **IA (A3)**: agente **Claude Code (Anthropic)**; pedido ("pode ir para 026") e curadoria humanos (GHDaru).

### Edição 0.07 — 2026-08-03 · Padrão APH v0.3: incorporação do caso Traycer (spec 025)

- **`livro/padrao-aph.md` → v0.3**, incorporando os 8 candidatos do estudo da spec 024 (`estudos/caso-traycer.md`): emenda no APH-1.3 (mecanismo equivalente de entrega — snapshot + deltas com fonte durável/CRDT, com a garantia "não perder a conversa" como critério); nota no APH-2.2 (segundo regime de evolução: versionamento negociado por método, fail-closed); **APH-5.6 e APH-5.7 novos** (🧪 DEVERIA — gates pendentes sobrevivem à reconexão; fila de aprovação separada por classe de ação); evidência externa registrada no APH-6.4 (terceira implementação independente de slot filling). Regra preservada: evidência de caso externo **não promove** requisito a ✅ — nenhum 🧪 virou DEVE.
- **O fio não mudou**: nenhum schema alterado; Anexo A permanece v0.2 (declarado no §9); gate de wire segue verde sem edição.
- **Notas datadas (2026-08-03)** nos caps. 03 e 05 ("o que roubar": `retryable`, progresso *replace-latest*, sumário/detalhe de tool pré-computados, sentinelas de capacidade; APH-5.6/5.7), 07 (contraexemplo A2A — cautela não-herdada e deadlock de supervisão como fronteira do argumento), 10 (linha Traycer na matriz + nota sobre a natureza da linha) e 11 (L2 confirmada pelo caso; nenhuma lacuna muda de estado). Evidência registrada em E1 (🔵 mantido). Glossário: entradas CRDT, *replace-latest*, deadlock e fail-closed/fail-open.
- **Verificação**: gates verdes (wire 32 casos; build 100 páginas, zero links quebrados) + revisão independente em contexto fresco contra o estudo, o padrão e o clone do Traycer (paths conferidos por amostragem, incl. `retryable` e o comentário *replace-latest* no código) — 2 achados críticos (regra anti-jargão: termos novos sem entrada no glossário; checkboxes marcados antes do fato) e 1 importante (a frase "nenhuma linha faz do WebSocket o default" do cap. 10, que a linha nova tornava falsa) corrigidos antes do registro.
- **IA (A3)**: agente **Claude Code (Anthropic)**; pedido ("proximo") e curadoria humanos (GHDaru).

### Edição 0.06 — 2026-07-31 · Padrão APH v0.2: Anexo A, wire format (spec 021)

- **Anexo A** (`livro/padrao/anexo-a-wire-format.md`): o formato exato das mensagens — 5 JSON Schemas draft 2020-12 validáveis (`livro/padrao/schemas/`: evento com payload por kind, snapshot fechado, ação de catálogo, confirmação, erro), superfície HTTP de referência, registro mínimo de 7 códigos de erro, mapeamento nome-APH↔laboratórios e regras de versionamento do fio.
- **Enforcement**: `publicar/valida-wire.mjs` (ajv) valida 32 casos — exemplos válidos aceitos e contraexemplos rejeitados (incl. `senha_vazada` barrado pelo snapshot fechado) — como **gate de CI**: a publicação do site falha se o wire quebrar. A sequência de exemplo do anexo é literalmente os casos do gate.
- **Verificação**: revisão independente com execução própria dos gates e leitura direta dos laboratórios — 4 achados importantes corrigidos, incluindo um na direção inversa da usual: `expired` estava rebaixado a 🧪 quando o laboratório B o implementa (promovido a ✅); `captured_at` rebaixado a opcional (sem base para required); `context_hash` adicionado à confirmação (o contrato do laboratório B o exige — APH-5.4); exemplo do texto sincronizado verbatim com o gate.
- **IA (A3)**: agente **Claude Code (Anthropic)**; decisão da v0.2 e curadoria humanas (GHDaru).

### Edição 0.05 — 2026-07-31 · Glossário didático e regra anti-jargão (spec 019)

- **`livro/glossario.md`** reescrito em três camadas: os sete objetos do protocolo · ~30 siglas por extenso **e em palavras simples** · ~30 termos técnicos explicados em português claro com analogias (harness = "o carro em volta do motor"; hash = "impressão digital"; iframe sandboxado = "janela dentro da janela, de mãos amarradas"). Ambiguidade *token* (credencial × unidade de texto) explicitada.
- **Regra editorial permanente** (retro → regra versionada, Maestro): todo termo/sigla usado no livro DEVE ter entrada no glossário criada no mesmo commit; jargão órfão é defeito de revisão (GUIA-CAPITULO). Padrão APH ganhou ponteiro didático no cabeçalho.
- **IA (A3)**: agente **Claude Code (Anthropic)**; pedido e curadoria humanos (GHDaru).

### Edição 0.04 — 2026-07-31 · Padrão APH v0.1: a proposta normativa (spec 018)

- **Diagnóstico de bagagem** (pedido do Accountable): régua comprovado→DEVE / desenhado→DEVERIA-experimental / aberto→fora do normativo; limitações declaradas (n=2 laboratórios do mesmo autor, sem suíte de conformidade). Veredito: suficiente para v0.1.
- **`livro/padrao-aph.md`**: o padrão para aplicações que conversam integralmente com o harness via chat — 3 níveis de conformidade (Observador/Operador/Federado), ~40 requisitos APH-x.y com palavra normativa e maturidade declarada (✅/🧪), FSM de referência unificada, compatibilidade com AG-UI/MCP 2026-07-28/Vercel/ACP, checklist de autoavaliação e contrato de frescor próprio. Sumário do livro ganhou a "Parte normativa".
- **Verificação**: revisão independente em contexto fresco contra os 12 capítulos — 1 achado crítico (contradição níveis×checklist) e 4 importantes (sobre-afirmação de evidência no §5; citação fora da interseção; checklist incompleto; colisão de nomenclatura nível×requisito), todos corrigidos; os 5 pontos sensíveis (idempotência, `context_hash`, slot filling, tool calling, federação) confirmados como honestamente 🧪.
- **IA (A3)**: agente **Claude Code (Anthropic)**; diagnóstico e proposta sob curadoria humana (GHDaru); merge na `main` aguarda gate humano.

### Edição 0.03 — 2026-07-31 · Revisão extraordinária: MCP spec 2026-07-28 (spec 017)

- **Gatilho**: o contrato de frescor do cap. 10 nomeava "o RC de 2026-07-28 virando final" — a spec final do Model Context Protocol foi publicada em 2026-07-28 (detecção via radar do livro-mãe `harness_engineering/radar/diario/2026-07-31.md`; reverificação própria em fonte primária, `estudos/atualizacao-mcp-2026-07-28.md`).
- **O que mudou no MCP**: núcleo stateless (fim do handshake/`Mcp-Session-Id`), MRTR substituindo requisições iniciadas pelo servidor (elicitation sobrevive re-encanada; **sampling depreciado**), headers de roteamento, cache declarativo, framework formal de extensões (MCP Apps via `extensions`), política de depreciação com janela de 12 meses, e — achado que o radar não destacou — **remoção da resumabilidade SSE** (`Last-Event-ID`), antítese do `seq`+replay do laboratório A.
- **Capítulos atualizados (com datação do evento no texto)**: 10 (impacto A — seção MCP, matriz, leitura executiva e **contrato de frescor renovado**); 02, 05, 06, 09 e 11 (impacto B — notas datadas; o argumento central do gate humano saiu *reforçado*: o padrão sobreviveu à reescrita da spec que o carrega).
- **Verificação**: fatos confirmados em fonte primária (blog oficial, changelog 2026-07-28, página de elicitation da spec nova, releases no GitHub); links relativos conferidos.
- **IA (A3)**: agente **Claude Code (Anthropic)**; gatilho reportado pelo humano; merge na `main` autorizado pelo humano em 2026-07-31.

### Edição 0.02 — 2026-07-30 · Fase 2: texto completo dos 12 capítulos (specs 004–016)

- **Spec 016**: bibliografia validada — 7 papers promovidos a ✓ com dupla evidência (arXiv + venue/repositório oficial); ⭐ atribuído aos âncoras dos caps. 00, 05, 07 e 08; convenção de menção-contexto registrada.
- **Specs 004–015 (fase 2)**: os 11 capítulos em estágio "estrutura" ganharam prosa integral, em três ondas (01–04; 06–09; 00, 10, 11), cada capítulo com evidência conferida por leitura direta nos laboratórios antes de entrar no texto. Caps. 00, 05, 07 e 08 com ciência ✓ sustentando o corpo.
- **Verificação**: duas revisões independentes em contexto fresco (onda 1: ~55 paths conferidos, 4 achados importantes; ondas 2–3: ~75 paths e ~50 trechos lidos, 4 achados importantes) — todos os achados corrigidos, incluindo dois de Princípio I (status ✓/⏳ inconsistente; afirmação sobre verificação de `context_hash` refutada pelo código e corrigida para "desenhado, não verificado" nos caps. 04/05/11). Pendências da edição 0.01 resolvidas (pergunta do objetivo 3 do cap. 10; siglas do cap. 02). Verificação mecânica: links relativos resolvem; nenhum banner de fase restante.
- **Achado novo da fase 2** (leitura direta): divergência tripla do `context_hash` no `nexxussai-monorepo` (cliente 8 hex × schema ≥16 × backend SHA-256[:16]) — registrada no Apêndice do cap. 04 e na L3 do cap. 11.
- **IA (A3)**: agente **Claude Code (Anthropic)**; orquestração e curadoria humanas (GHDaru); merge da edição 0.01 na `main` autorizado pelo humano em 2026-07-30.

### Edição 0.01 — 2026-07-30 · Fundação e estruturação do livro (specs 001–015)

- **Specs 001–003**: fundação do repositório (constituição v1.0.0, ADRs 0001–0003), pesquisa profunda registrada em `estudos/` (fonte-base em código dos dois laboratórios com paths; panorama da indústria com URLs; candidatos a bibliografia ⏳) e estrutura do livro (sumário com 12 capítulos e fronteiras explícitas, GUIA-CAPITULO, aparato do livro vivo).
- **Specs 004–015 (uma por capítulo, ADR 0002)**: os 12 capítulos entregues — caps. 00–04 e 06–11 na fase *estrutura* (esqueleto v3 com "O problema" redigido, fontes e Apêndice de evidência por path); **cap. 05 (Ações governadas) completo, como piloto do formato**.
- **Verificação**: conferência mecânica de links relativos (todos resolvem); revisão independente em contexto fresco contra constituição/GUIA/fronteiras (~60 paths conferidos por existência nos repositórios-fonte, citações conferidas verbatim) — 2 achados críticos de evidência e 6 secundários, todos corrigidos nesta edição; pendências registradas para a fase 2: pergunta dedicada ao objetivo 3 do cap. 10 e expansão de siglas discutíveis (REST/CDN/HTTP no cap. 02).
- **IA (A3)**: agente **Claude Code (Anthropic)**; orquestração e curadoria humanas (GHDaru); decisões em `adr/0001`–`0003`.
