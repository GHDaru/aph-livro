# Spec 022 — Publicação no Vercel

**Status**: Implementada · **Data**: 2026-07-31 · **Raia**: infra (reversível — desconectar o projeto no Vercel despublica)

## O quê

Trocar o alvo de publicação do site do livro do GitHub Pages para o **Vercel** (integração Git): `vercel.json` na raiz roda os mesmos dois gates (wire format + build com verificação de links) e serve `docs/`; os gates permanecem também num workflow de CI próprio (independente do provedor de hospedagem); o workflow do Pages vira alternativa manual (`workflow_dispatch`), sem ruído de falha a cada push.

## Por quê

Decisão do Accountable (2026-07-31) após a confirmação de que o Pages **não está ativo**: o token do CI não pode criar o site ("Resource not accessible by integration") e o repositório é privado — no plano gratuito do GitHub, Pages exige repositório público. No Vercel (plano Hobby), **repositório privado com site público** funciona, e o deploy é automático a cada push na `main` após uma única importação manual.

## Critérios de aceite

- [x] **CA-1**: `vercel.json` na raiz com `buildCommand` executando o gate do wire format e o build (falha em schema/exemplo/link quebrado ⇒ deploy falha), `outputDirectory: docs` e `cleanUrls`.
- [x] **CA-2**: `.github/workflows/ci.yml` roda os dois gates em todo push/PR — o enforcement do Maestro não depende do provedor de hospedagem.
- [x] **CA-3**: `.github/workflows/publicar.yml` (Pages) só dispara manualmente, com o racional comentado — sem X vermelho a cada push enquanto o Pages não for habilitado.
- [x] **CA-4** (etapa do Accountable, concluída em 2026-07-31): projeto importado em vercel.com e primeiro deploy verde — site no ar em https://protocolos-livid.vercel.app/ (verificado: home, Padrão APH, Anexo A e cap. 05 respondendo 200 com títulos corretos).

## Fora de escopo

Domínio próprio; token do Vercel no CI (a integração Git dispensa); despublicação do Pages (nunca chegou a existir).
