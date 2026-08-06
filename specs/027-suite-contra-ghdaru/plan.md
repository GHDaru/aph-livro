# Plan — Spec 027 (Perfis de adaptação + medição do ghdaru)

## Como

1. **`suite.mjs`**: `PERFIL_CANONICO` + `carregarPerfil(parcial)` (funde sobre o canônico e resolve headers de credencial a partir do ambiente) + `canonizar(evento, perfil)` (traduz `kind` e renomeia campos de payload na entrada, para que todos os checks continuem raciocinando em canônico) + `exigirOperacao()` (operação `null` lança erro explícito → o check falha) + `autenticar()` (login declarado no perfil, credenciais só do ambiente) + CLI `--perfil`.
2. **`servidor-referencia.mjs`**: modo `dialeto: "local"` — variante **conforme** (não é sabotagem) com prefixo `/chat`, campo `id` e nomes `thought`/`finished`, para exercitar a tradução de ponta a ponta.
3. **`autoteste.mjs`**: três provas novas da camada (traduz / é necessária / não isenta), somadas às 11 sabotagens.
4. **`perfis/ghdaru.json`**: derivado da leitura do código (paths, campos, nomes, auth), com `cancelar: null` e a nota de que ausência não é isenção.
5. **Medição**: venv em `/tmp/.../scratchpad` (fora do repo), `PYTHONDONTWRITEBYTECODE=1`, `PYTHONPATH` para o source do ghdaru, `NVIDIA_API_KEY` ausente (cai no `FakeLlmAdapter`), uvicorn na 8123; suíte com o perfil; duas execuções (determinismo) e `git status --porcelain` no ghdaru para provar que nada foi tocado.
6. **Registro**: `conformidade/execucoes/2026-08-06-ghdaru.md` (relatório + receita + causa por path de cada desvio + confronto com a spec 023); seção "medição executável" no handoff do roteiro; `conformidade/README.md` ganha a seção de perfis; CHANGELOG + HISTORICO 0.09.

## Constitution Check

- **P.I (evidência)**: a medição É a evidência — e cada desvio medido recebe a causa por path no laboratório, conferida por leitura. Nada de "provavelmente falha porque".
- **P.II (fonte-base somente leitura)**: CA-2 eleva isso a critério verificável (`git status --porcelain` vazio). O venv vive fora; o bytecode é desabilitado; nenhum arquivo entra no ghdaru.
- **P.III/IV**: nenhum capítulo muda de estrutura; a execução é datada e o HISTORICO registra a edição.
- **P.V (segredos)**: credenciais de demonstração do laboratório passam por variável de ambiente e **não entram em arquivo versionado**; o token não é impresso. O perfil versiona apenas os *nomes* das variáveis.
- **P.VI (vendor-agnóstico)**: a camada de perfis é genérica (qualquer alvo); o perfil do ghdaru é um exemplo, não um privilégio.
- **P.VII (spec-driven)**: esta spec; DoD = gates verdes + medição reproduzível + revisão independente.

## Decisões (reversíveis, registradas aqui)

- **Canonizar na entrada, não em cada check**: a tradução acontece no parser do stream e do replay; os checks seguem escritos em vocabulário canônico. Diff menor e impossível esquecer um check.
- **Perfil não pode declarar "não se aplica"**: só existe `null` = "operação ausente no alvo" → falha. Não há campo de isenção, por construção — é a propriedade que o autoteste protege.
- **O mapa de nomes é entrada validada, não entrada confiável** (decisão tomada *depois* da revisão independente, que falsificou a versão anterior): `validarKinds` recusa na carga o roubo de nome canônico e a fusão de dois tipos num nome. A lição — a suíte tratava o perfil como inócuo por construção enquanto o consumia sem validar — vale para as fatias seguintes: quando os Níveis 2–3 ganharem suíte, a superfície de perfil cresce (catálogo, risco, FSM) e a decisão a tomar lá é dar ao perfil **schema próprio validado**, em vez de remendar eixo a eixo. Registrado aqui como recomendação para a spec da suíte de Nível 2.
- **Gate 3 continua com o servidor de referência**: rodar o ghdaru no CI exigiria clonar e instalar outro repositório no pipeline; o valor (regressão da suíte) já é dado pelo servidor de referência e pelas provas da camada de perfis. A medição do laboratório é um **rito datado**, não um gate contínuo.
- **A falha do envelope de erro é reportada como uma só**: o ghdaru também não põe código no evento `error` do stream (`handle_message.py:87-89`), mas a suíte não força erro de provedor num alvo arbitrário; o desvio fica registrado na execução como observação de leitura, não como check.
- **Credenciais**: usadas as de demonstração seedadas no código do laboratório (`http/deps.py`), passadas por ambiente. O documento cita o path onde elas vivem, nunca os valores.
