# ADR 0004 — Divisão em dois repositórios: a especificação e o livro

**Status**: Aceito · **Data**: 2026-08-06 · **Decisor**: GHDaru (Accountable) · **Spec**: 028

## Contexto

O repositório `protocolos` acumulou duas naturezas diferentes sob o mesmo teto:

1. **A especificação do Padrão APH** — a parte normativa (o padrão, o Anexo A, os JSON Schemas) e o que é necessário para usá-la (suíte de conformidade, perfis de adaptação, servidor de referência, handoffs de adoção). Público: quem vai *implementar* o protocolo.
2. **O livro vivo** — 12 capítulos, estudos, bibliografia, glossário, o histórico das 27 specs e o motor de publicação. Público: quem quer *entender* a fronteira app↔harness.

As duas têm ritmos e critérios incompatíveis. O livro é datado por construção, revisado por captura e governado pela constituição editorial (esqueleto v3, evidência por path, registro de expiração). A especificação precisa de estabilidade, versionamento SemVer próprio e gates de máquina — quem adota o padrão não deveria precisar acompanhar edições editoriais para saber o que é normativo.

Há também um sinal concreto de que a mistura já custava: o Anexo A referencia os schemas por URL de um GitHub Pages que **não existe mais** (`ghdaru.github.io/protocolos/...`, resquício da tentativa abandonada na spec 022) — um artefato normativo com endereço inválido porque sua casa nunca foi decidida de propósito.

## Decisão

Dividir em dois repositórios:

- **`protocolos` (fica)** — passa a ser **a especificação do Padrão APH**. Mantém o nome, o histórico e os remotes; o README declara a nova identidade.
- **`aph-livro` (novo)** — recebe o livro vivo, com o histórico preservado (extração por `git-filter-repo`, não cópia).

### Alocação

| Artefato | Vai para | Por quê |
|---|---|---|
| `padrao-aph.md`, `anexo-a-wire-format.md`, `schemas/`, `exemplos.json` | **especificação** (`padrao/`) | é a norma e sua projeção executável |
| `conformidade/` (suíte, perfis, servidor de referência, execuções) | **especificação** | é o que verifica a norma — modelo spec + test-suite |
| `valida-wire.mjs` (hoje em `publicar/`) | **especificação** (`conformidade/`) | gate dos schemas; segue os schemas |
| `handoffs/` | **especificação** | orientação de adoção aplicada a um time real |
| `livro/` (capítulos, glossário, bibliografia, HISTORICO) | **livro** | o livro vivo, incluindo o glossário didático |
| `estudos/`, `specs/`, `adr/0001–0003` | **livro** | o registro de como o livro foi feito |
| `publicar/build.mjs`, `vercel.json` | **livro** | publica o livro |
| `.specify/memory/constitution.md` | **livro** | é a constituição **editorial** do livro vivo |
| `CHANGELOG.md` | **ambos** | história compartilhada até a divisão; cada um continua a sua a partir daí |

### O acoplamento, resolvido

Havia uma única dependência de código entre as metades: `conformidade/suite.mjs` e `publicar/valida-wire.mjs` liam os schemas de `livro/padrao/schemas/`. A regra aplicada foi a do Accountable: *"Por que o livro precisa? Ele não pode linkar?"*

**Os schemas ficam com a especificação.** O livro passa a referenciá-los por URL — que é o que o Anexo A já fazia. O acoplamento vira unidirecional e fraco (livro → especificação, só por link); nenhum código atravessa a fronteira. Se algum dia o livro precisar validá-los no próprio build, a saída é duplicar **com gate de deriva** (CI falha se divergirem), nunca criar dependência de runtime.

O glossário segue a mesma régua, invertida: fica no **livro** (é artefato didático, edição 0.05), e a especificação o referencia por URL — ela já define seus termos em §2 e no Anexo A.

## Alternativas avaliadas

- **Livro fica, especificação sai** — preservaria a URL publicada e o deploy sem mexer. Recusada pelo Accountable: o repositório `protocolos` é onde o protocolo deve morar.
- **Dois repositórios novos, `protocolos` arquivado** — mais limpo conceitualmente, mas joga fora a continuidade de nome e obriga a reconfigurar dois deploys.
- **Schemas no livro, kit vendoriza com gate de deriva** — mantém a norma junto da prosa, ao custo de dependência de código cruzando a fronteira. Recusada: inverte a direção do acoplamento e deixa a suíte refém do repositório do livro.
- **Monorepo com workspaces** — resolveria o acoplamento sem dividir, mas não resolve o problema real, que é de *público e ritmo*, não de build.

## Consequências

**Boas**: quem adota o padrão clona um repositório pequeno, sem 12 capítulos junto; o livro volta a ser só livro, governado pela constituição editorial; os schemas ganham casa definitiva e endereço válido; a suíte deixa de depender de um diretório do livro.

**Custos, explícitos**:
- **O deploy do Vercel precisa ser reapontado.** O site `protocolos-livid.vercel.app` é hoje alimentado por `protocolos` via integração Git. Como o livro sai, o projeto do Vercel deve passar a apontar para `aph-livro` — **reapontar o projeto existente preserva a URL**, e é o caminho recomendado, porque os dois handoffs já entregues ao time do ghdaru contêm links absolutos para ela.
- A especificação fica temporariamente sem site próprio (acesso por GitHub) até ganhar o seu — trabalho futuro.
- O histórico das specs 026–027 (que criaram a suíte) fica no repositório do livro junto das demais; no repositório da especificação ele permanece acessível pelo `git log`, já que `protocolos` mantém a história.
- A divisão só é segura na ordem: **primeiro o livro nasce e o Vercel é reapontado; só então o livro é removido de `protocolos`**. Inverter a ordem tira o livro do ar.
