# Spec 027 — A suíte contra o laboratório: perfis de adaptação e a primeira medição do ghdaru

**Status**: Implementada · **Data**: 2026-08-06 · **Raia**: plena (feature de código + medição registrada)

## O quê

Fazer a suíte de conformidade (spec 026) sair do servidor de referência e medir uma aplicação real. Três entregas:

1. **Camada de perfis de adaptação** (`conformidade/perfis/`): o padrão permite paths próprios (DEVERIA, §A.2) e nomes locais (PODE, §A.0/§A.8) — um perfil traduz **endereço e vocabulário** do alvo para o canônico (operações, campo do identificador de sessão, nomes de campo do corpo, nomes de `kind`, formato da lista de replay, autenticação). Fecha a limitação declarada da v1 da suíte.
2. **Regra de integridade do perfil, provada por teste**: perfil traduz, **nunca isenta**. Duas defesas mecânicas — não existe campo de isenção (operação `null` faz o check falhar) e o mapa de nomes é validado na carga (roubar o nome de um tipo canônico ou fundir dois tipos num nome é recusado) — mais uma de transparência (toda tradução aplicada sai no relatório). O autoteste prova **quatro** propriedades: que a camada **traduz**, que é **necessária**, que **não isenta no eixo das operações** e que **não isenta no eixo do vocabulário**. O limite fica declarado: perfil que minta sobre campos do próprio produto é declaração falsa, sem remédio mecânico de fora.
3. **Primeira medição de uma aplicação real** (`conformidade/execucoes/2026-08-06-ghdaru.md`): a API do ghdaru subida localmente com o adapter fake de LLM, exercitada pela suíte com o perfil `perfis/ghdaru.json`, e o relatório registrado com a receita de reprodução. O roteiro de conformidade (spec 023) ganha a seção "medição executável", confrontando a auditoria por leitura com a medição por execução.

## Por quê

Pedido do Accountable (2026-08-06, "sim" à recomendação de roadmap). É o passo que amarra três fios: dá o caso de uso real que justifica o mapeamento configurável (a limitação declarada da suíte v1), submete o padrão ao seu laboratório principal, e transforma o roteiro do Nível 2 de documento em medição repetível. Também é o primeiro teste de fogo da própria suíte: até aqui ela só tinha visto um alvo escrito para passar nela.

## Critérios de aceite

- [x] **CA-1**: a suíte roda contra o ghdaru real (não simulado), com relatório registrado e **receita de reprodução completa** — o leitor consegue repetir a medição.
- [x] **CA-2**: o repositório `ghdaru` permanece **byte a byte intacto** (`git status --porcelain` vazio ao fim): ambiente virtual fora do repositório, sem escrita de bytecode, sem arquivo de configuração adicionado.
- [x] **CA-3**: nenhuma credencial em arquivo versionado — o perfil referencia **nomes** de variáveis de ambiente; o token obtido nunca é impresso nem gravado.
- [x] **CA-4**: perfil não afrouxa conformidade nos eixos em que isso é detectável de fora (operações e vocabulário), provado no autoteste pelas quatro propriedades, **com tentativa de ataque a cada execução**; o limite não-mecanizável (declaração falsa sobre campos próprios) está escrito no README e no cabeçalho da suíte. *Este CA reprovou na primeira revisão independente — o ataque `{"done": "content"}` fazia um alvo sem terminador passar 11/11 — e a guarda de nomes nasceu daí.*
- [x] **CA-5**: cada falha e aviso medidos tem a **causa apontada por path** no ghdaru (leitura do código), e o resultado é confrontado com a auditoria por leitura da spec 023 — convergências e divergências explicadas.
- [x] **CA-6**: nada de normativo muda (padrão v0.3, Anexo A v0.2, schemas intocados); revisão independente em contexto fresco **que refez a medição do zero pela receita e atacou a suíte** — 1 achado crítico (CA-4 falsificado), 2 importantes e 4 menores, todos corrigidos antes do registro; CHANGELOG + HISTORICO (edição 0.09); publicado no site.

## Fora de escopo

Corrigir o ghdaru (repositório somente leitura — o resultado alimenta o handoff existente); suíte dos Níveis 2–3; medir o `nexxussai-monorepo` (decisão vigente: não mexer); rodar a suíte no CI contra o laboratório (exige subir a API de outro repositório no pipeline — o Gate 3 segue com o servidor de referência).
