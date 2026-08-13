# Constituição — Protocolo de Comunicação Aplicação ↔ Harness

**Versão 1.1.0** · Ratificada em 2026-07-30 · Última emenda em 2026-08-13 (Princípio VIII, spec 035 de `GHDaru/protocolos`) · Emendas via ADR e SemVer (MAJOR: remoção ou redefinição de princípio · MINOR: princípio novo · PATCH: clarificação)

Este repositório abriga o livro vivo **"Protocolo de Comunicação Aplicação ↔ Harness"** — *"a aplicação conversando com a IA, e a IA conversando com a aplicação"*. A constituição é a fonte de verdade: em conflito com qualquer pedido pontual, ela prevalece ou o conflito é explicitado ao humano antes de agir.

## Princípios

### I. Evidência acima de retórica (NÃO-NEGOCIÁVEL)

Nenhuma afirmação entra no corpo do livro sem evidência verificável:

- afirmação sobre implementação exige **caminho de arquivo** em backticks no repositório-fonte (`ghdaru` ou `nexxussai-monorepo`), com o repositório identificado;
- citação científica exige entrada em `livro/bibliografia.md` com **status ✓ validada** (ID↔título confirmado por fonte independente); não confirmada é marcada ⏳ e não sustenta afirmação do corpo;
- fonte da indústria exige **URL verificável**, no formato "tradução para decisão" (o vendor recomenda X porque Y — e isso implica Z para o protocolo).

READMEs prometem; código e fontes primárias entregam.

### II. A fonte-base é o código

O livro nasce da leitura do código real das duas implementações-laboratório — **`ghdaru`** (Snapshot de Contexto, Catálogo de Ações, eventos tipados, Manifesto de Aplicação) e **`nexxussai-monorepo`** (ScreenRegistry, ScreenContextSnapshot, ActionProposal, vocabulário SSE canônico). Ciência e indústria **contextualizam**, não substituem. A convergência independente das duas bases é a espinha empírica do livro; a evidência por path vive nos apêndices/estruturas de capítulo, o corpo recebe o estado da arte sintetizado. Os repositórios-fonte são **somente leitura** — nada é escrito ou commitado neles.

### III. Método pedagógico e esqueleto v3

Cada capítulo segue o **esqueleto v3** herdado do livro Engenharia de Harness (Backward Design + 4C/ID + Diátaxis + Carga Cognitiva), nesta ordem: cabeçalho datado → Objetivos de aprendizagem (verbos de Bloom) → O problema → Fundamentos científicos → Fontes da indústria → O estado da arte (fechando com Leitura executiva / "o que roubar") → Verificação → Apêndice de evidência por repositório (com paths). Tabelas para fatos enumeráveis; explicação na prosa. Toda sigla por extenso na 1ª ocorrência. Uma ideia nova por vez.

### IV. Livro vivo (datação e expiração)

Todo capítulo declara no cabeçalho a **data de captura do estado da arte**. Toda edição atualiza `livro/HISTORICO.md` (incluindo o registro de expiração e a versão do agente de IA usada). Reavaliar = nova rodada, nunca sobrescrever a história. Afirmações sensíveis ao tempo ficam sob a data de captura; evitar absolutos atemporais.

### V. Segurança

Nenhum segredo (token, chave, credencial) em arquivo, commit ou texto. Exemplos de payload usam valores fictícios evidentes. Credenciais reais só em `.env` gitignored — e este repositório não deve precisar de nenhuma.

### VI. Neutralidade e acessibilidade

Vendor-agnóstico: protocolos e padrões são avaliados por adoção medida e governança, não por marketing. Prosa em português; termos técnicos consagrados (*harness*, *tool*, *prompt*, *streaming*, *tool calling*) sem tradução forçada.

### VII. Spec-driven com metodologia Maestro (NÃO-NEGOCIÁVEL)

Todo trabalho segue o fluxo Maestro na raia adequada:

- **Uma spec por capítulo, no mínimo** (`specs/NNN-nome/` com `spec.md` → `plan.md` com Constitution Check → `tasks.md` → implement). Feature grande abre spec própria.
- **Raia leve** (typo, link quebrado, ajuste de formatação): o commit descritivo é o artefato — sem spec, mas nunca sem revisão.
- **DoD verificável ("prove, não declare")**: capítulo pronto = critérios de aceite da spec conferidos + links válidos + evidência com paths presente + entrada no CHANGELOG e no HISTORICO. Verde declarado sem evidência não é verde.
- **Decisão vira ADR** (`adr/`): contexto → decisão → alternativas → consequências. ADRs são imutáveis (superados, nunca editados no mérito).
- **CHANGELOG como forcing function**: toda entrega adiciona entrada em `[Unreleased]`.
- **Gates humanos proporcionais ao risco**: decisões reversíveis são registradas (ADR) e seguem sem bloquear; decisões irreversíveis ou de escopo (merge para main, publicação, mudança de tese do livro) exigem aprovação humana explícita.
- **Revisão independente em contexto fresco** antes de dar um lote por pronto.

### VIII. Dois repositórios, uma norma (NÃO-NEGOCIÁVEL)

A especificação do Padrão APH vive em [`GHDaru/protocolos`](https://github.com/GHDaru/protocolos) e este livro a fundamenta. A divisão (ADR 0004) separou os artefatos, e não a verdade: **os dois precisam contar a mesma história**.

Daí a obrigação, nos dois sentidos:

- **Mudança no normativo obriga a verificar este livro.** Nenhuma entrega que altere `padrao/` em `GHDaru/protocolos` (padrão, anexos, schemas ou glossário) fecha sem uma verificação explícita de quais capítulos, glossário ou estudos ficaram desatualizados. A verificação é parte da Definition of Done da entrega, e o seu resultado é registrado, mesmo quando ele for "nada a mudar".
- **O livro não contradiz a norma.** Onde os dois falam do mesmo termo ou do mesmo requisito, a norma manda. O livro explica, contextualiza e discorda em voz alta quando for o caso, e nunca descreve como vigente um requisito que a norma já mudou.
- **Deriva é dívida com data.** Divergência encontrada e não corrigida na hora vira entrada no `CHANGELOG` e no `HISTORICO`, com o que ficou pendente. Divergência não registrada é falha de processo, não descuido.

A razão de isto ser princípio, e não convenção: entre as specs 032 e 034 o normativo mudou quatro vezes, e o livro não foi tocado nenhuma. A divergência ainda era pequena quando foi notada. Esta regra existe para que a próxima seja notada do mesmo tamanho.

## Governança

- A constituição prevalece sobre práticas ad hoc; emendas exigem ADR e sobem a versão.
- O humano (GHDaru) é o Accountable de todas as entregas; agentes executam e verificam sob os gates acima.
- Rastreabilidade mínima por entrega: spec ↔ commit(s) ↔ CHANGELOG ↔ HISTORICO.
