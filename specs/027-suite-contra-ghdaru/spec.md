# Spec 027 — A suíte contra o laboratório: perfis de adaptação e a primeira medição do ghdaru

**Status**: Em implementação · **Data**: 2026-08-06 · **Raia**: plena (feature de código + medição registrada)

## O quê

Fazer a suíte de conformidade (spec 026) sair do servidor de referência e medir uma aplicação real. Três entregas:

1. **Camada de perfis de adaptação** (`conformidade/perfis/`): o padrão permite paths próprios (DEVERIA, §A.2) e nomes locais (PODE, §A.0/§A.8) — um perfil traduz **endereço e vocabulário** do alvo para o canônico (operações, campo do identificador de sessão, nomes de campo do corpo, nomes de `kind`, formato da lista de replay, autenticação). Fecha a limitação declarada da v1 da suíte.
2. **Regra de integridade do perfil, provada por teste**: perfil traduz, **nunca isenta**. Declarar uma operação ausente (`null`) faz o check correspondente **falhar**, jamais ser pulado. O autoteste passa a provar três propriedades da camada: que ela **traduz** (alvo conforme em dialeto local passa 11/11), que ela é **necessária** (o mesmo alvo sem perfil reprova) e que ela **não isenta** (perfil sem cancelamento derruba o check APH-1.4).
3. **Primeira medição de uma aplicação real** (`conformidade/execucoes/2026-08-06-ghdaru.md`): a API do ghdaru subida localmente com o adapter fake de LLM, exercitada pela suíte com o perfil `perfis/ghdaru.json`, e o relatório registrado com a receita de reprodução. O roteiro de conformidade (spec 023) ganha a seção "medição executável", confrontando a auditoria por leitura com a medição por execução.

## Por quê

Pedido do Accountable (2026-08-06, "sim" à recomendação de roadmap). É o passo que amarra três fios: dá o caso de uso real que justifica o mapeamento configurável (a limitação declarada da suíte v1), submete o padrão ao seu laboratório principal, e transforma o roteiro do Nível 2 de documento em medição repetível. Também é o primeiro teste de fogo da própria suíte: até aqui ela só tinha visto um alvo escrito para passar nela.

## Critérios de aceite

- [ ] **CA-1**: a suíte roda contra o ghdaru real (não simulado), com relatório registrado e **receita de reprodução completa** — o leitor consegue repetir a medição.
- [ ] **CA-2**: o repositório `ghdaru` permanece **byte a byte intacto** (`git status --porcelain` vazio ao fim): ambiente virtual fora do repositório, sem escrita de bytecode, sem arquivo de configuração adicionado.
- [ ] **CA-3**: nenhuma credencial em arquivo versionado — o perfil referencia **nomes** de variáveis de ambiente; o token obtido nunca é impresso nem gravado.
- [ ] **CA-4**: perfil não afrouxa conformidade — provado no autoteste pelas três propriedades (traduz / é necessário / não isenta); o autoteste segue Gate 3 do CI.
- [ ] **CA-5**: cada falha e aviso medidos tem a **causa apontada por path** no ghdaru (leitura do código), e o resultado é confrontado com a auditoria por leitura da spec 023 — convergências e divergências explicadas.
- [ ] **CA-6**: nada de normativo muda (padrão v0.3, Anexo A v0.2, schemas intocados); revisão independente em contexto fresco; CHANGELOG + HISTORICO (edição 0.09); publicado no site.

## Fora de escopo

Corrigir o ghdaru (repositório somente leitura — o resultado alimenta o handoff existente); suíte dos Níveis 2–3; medir o `nexxussai-monorepo` (decisão vigente: não mexer); rodar a suíte no CI contra o laboratório (exige subir a API de outro repositório no pipeline — o Gate 3 segue com o servidor de referência).
