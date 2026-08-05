# Plan — Spec 026 (Suíte de conformidade Nível 1)

## Como

1. **`conformidade/`** (novo diretório, pacote Node próprio com `ajv`/`ajv-formats`, mesmas versões do motor):
   - `suite.mjs` exporta `rodarSuite(baseUrl)` e é executável (`node suite.mjs <url>`): cria sessões na superfície de referência (§A.2), consome SSE com parser próprio (frames `data: {json}\n\n`, `TextDecoder {stream:true}`), e roda os checks; carrega os schemas reais de `../livro/padrao/schemas/` via ajv (como `valida-wire.mjs`).
   - Checks executáveis (id → requisito): `superficie-sessao`→A.2 · `transporte-sse`→APH-1.1/A.1 · `seq-monotonico`→APH-1.2 · `vocabulario-schema`→APH-2.1 (kinds conhecidos validados contra `evento.schema.json`; desconhecidos ignorados e reportados — APH-2.2 praticado) · `terminador`→APH-2.1 · `replay-integral`→APH-1.3 (replay == stream, sem perda/duplicação; `?after=N`; `?after=último`=[]) · `replay-reconexao`→APH-1.3 (aborta a conexão no 1º evento e reconstrói por replay) · `cancelamento`→APH-1.4 (DELETE no meio do stream → 204 + `error` com `STREAM_CANCELLED`, último evento) · `erro-envelope`→APH-1.5/A.7 (sessão inexistente → `{"error":{code,message}}` validado contra `erro.schema.json`) · `snapshot-aceito`→APH-3.2/A.4 · `snapshot-fechado`→APH-3.5 (campo `senha_vazada` → rejeição com `INVALID_CONTEXT`; aceite = AVISO, é DEVERIA).
   - DECLARADO 📋 (não testável caixa-preta, com o porquê): APH-2.2 lado consumidor · APH-2.3 normalizador · APH-2.5 render · APH-3.1 registry compartilhado · APH-3.3 sanitização server-side · APH-7.1 separação de camadas · APH-7.3 conteúdo é dado.
   - `servidor-referencia.mjs` exporta `iniciar({porta, sabotagem})` (porta 0 = efêmera): sessões em memória, emissão com atraso quando o texto pede (`"lento"`), replay por log, cancelamento cooperativo, validação do snapshot na borda. Sabotagens por parâmetro: `seq-duplicado`, `replay-perde-evento`, `cancelamento-silencioso`, `evento-malformado`, `erro-sem-codigo`, `content-type-errado`.
   - `autoteste.mjs`: íntegro → zero falhas/avisos; cada sabotagem → o check alvo falha. Exit ≠ 0 em qualquer desvio.
2. **CI**: Gate 3 no `ci.yml` (install + `node autoteste.mjs` em `conformidade/`).
3. **Livro**: `conformidade/README.md` (página publicada — o quê/como/limites); padrão §0 (limitação atualizada), §7 (ponteiro para a suíte), §8 (item restrito a Níveis 2–3); linha na Parte normativa do `livro/README.md`; entrada de navegação no `build.mjs`; glossário (caixa-preta, servidor de referência, sabotagem/teste de mutação); HISTORICO edição 0.08; CHANGELOG.

## Constitution Check

- **P.I (evidência)**: a suíte é a evidência executável — o autoteste no CI prova que ela detecta o que diz detectar (sabotagens); o relatório separa VERIFICADO de DECLARADO em vez de fingir cobertura.
- **P.II (fonte-base)**: nenhum laboratório alterado; o servidor de referência é deste repositório, não simula nenhum produto.
- **P.III/IV (esqueleto/livro vivo)**: nenhuma mudança de estrutura de capítulo; edição 0.08 registrada; README da suíte datado.
- **P.V (segredos)**: servidor em memória, sem credencial; nada de rede externa nos testes.
- **P.VI (vendor-agnóstico)**: a suíte testa a superfície de referência do Anexo A, não um produto; Node puro + ajv (mesma dependência já usada pelo gate de wire).
- **P.VII (spec-driven)**: esta spec; DoD = autoteste + wire + build verdes no CI; revisão independente antes do registro; merge na `main` publica.

## Decisões (reversíveis, registradas aqui)

- **Padrão permanece v0.3**: a suíte verifica requisitos, não os muda — as edições no padrão são de status (limitação do §0, ponteiros §7/§8). Se a escrita dos checks tivesse revelado requisito ambíguo, a emenda seria spec própria — não revelou (o Anexo A §A.2/A.7 já dava paths e códigos exatos).
- **Vercel não roda o autoteste**: o buildCommand segue com wire + links (publicação rápida); o autoteste roda no CI (Gate 3), que já bloqueia todo push. Evita duplicar tempo de build no deploy.
- **Paths de referência apenas na v1**: o §A.2 diz que paths são DEVERIA — um alvo com paths próprios precisaria de mapeamento configurável; fica para quando houver um alvo real que precise (YAGNI).
- **Aceitar `{"session_id"}` e `{"id"}`** na criação de sessão (a renomeação do ghdaru está documentada no §A.2); o relatório informa qual veio.
- **Código de erro próprio `SESSION_NOT_FOUND`** no servidor de referência para sessão inexistente: o registro do §A.7 é mínimo e extensível ("PODE adicionar os seus"); a suíte exige envelope válido e código estável em maiúsculas, não um código específico para esse caso.
- **Nomes canônicos apenas na v1** (apontado pela revisão independente): o padrão permite nomes locais de `kind` (§A.0/§A.8 — PODE), e uma aplicação conforme com `finished` reprovaria nesta v1. Decisão: a suíte v1 testa os nomes canônicos e **declara a limitação com destaque** no README (seção "Como rodar" + "Limites") — traduzir nomes exige o mapeamento configurável, mesma fatia futura dos paths (o experimento da revisão é o caso de uso que a justificará). A suíte não inventa norma: ela recompensa a canonicidade que o Anexo A já promete.
- **Comentários SSE são ignorados** (apontado pela revisão): linhas `:` (keepalive) são gramática padrão do SSE; o parser da suíte as ignora em vez de reprová-las, e o servidor de referência passou a emitir uma para manter o caso exercitado.
- **`erro-envelope` exige HTTP ≥ 400** para sessão inexistente: o Anexo A não fixa o status desse caso; é inferência declarada (erro sinalizado como erro HTTP), registrada aqui — um alvo que sinalize erro com 200 reprovaria, e o caso reabriria esta decisão.
- **Cobertura completa de sabotagens** (apontado pela revisão): subiu de 6 para 11 — todo check executável tem sabotagem que o derruba (um check regredido para "sempre-ok" é flagrado pelo gate) e o caminho AVISO é exercitado de ponta a ponta (`snapshot-aberto`: check vira 🟡 e o veredito permanece APTO).
