# ADR 0007 — Sincronização obrigatória entre a norma e o livro

**Data**: 2026-08-13 · **Status**: aceita · **Emenda**: constituição v1.1.0, Princípio VIII · **Origem**: spec 035 de `GHDaru/protocolos`

## Contexto

O [ADR 0004](0004-divisao-em-dois-repositorios.md) separou a especificação do livro. A separação era certa: os dois têm públicos, ritmos e critérios de qualidade diferentes. O que ela não previu foi como manter os dois contando a mesma história.

A resposta veio pelo pior caminho, que é a medição. Entre as specs 032 e 034, o normativo mudou quatro vezes:

- a v0.6 do padrão **corrigiu** um requisito publicado (o APH-9.2 prescrevia o impossível);
- o APH-9.4 nasceu, foi declarado ✅ e depois virou ⚗️, quando uma revisão mostrou que a maturidade estava invertida;
- o Anexo B apareceu do zero e já foi para a v0.2;
- a matriz de obrigações e a suíte da federação entraram.

O livro não foi tocado nenhuma vez. Na verificação feita nesta entrega, ele ainda anunciava o "Padrão APH v0.5" e não mencionava o Anexo B, a matriz nem a suíte da federação. Nada disso estava errado quando foi escrito. Ficou errado depois, em silêncio.

## Decisão

**A sincronização vira princípio constitucional, não convenção.** O Princípio VIII obriga três coisas:

1. **Mudança no normativo obriga a verificar o livro**, como parte da Definition of Done da entrega que muda `padrao/`. O resultado da verificação é registrado mesmo quando for "nada a mudar", porque a diferença entre "verificamos e não havia nada" e "não verificamos" é toda a diferença.
2. **O livro não contradiz a norma.** Onde os dois falam do mesmo termo ou requisito, a norma manda. O livro explica, contextualiza e critica em voz alta; não descreve como vigente o que a norma já mudou.
3. **Deriva encontrada e não corrigida vira dívida com data**, no CHANGELOG e no HISTORICO. Deriva não registrada é falha de processo.

A obrigação também vive em `protocolos/CLAUDE.md`, como regra 8. Não é redundância: quem trabalha na especificação lê o CLAUDE.md daquele repositório, e não a constituição deste.

## Alternativas avaliadas

- **Deixar como convenção, ou como item de checklist de PR.** Recusada porque já era isso, informalmente, e produziu quatro mudanças sem eco. Convenção que ninguém percebe estar quebrando não é controle.
- **Gate automático de deriva no CI.** Recusada nesta versão, por honestidade sobre o que é possível: o CI de um repositório não tem o outro. Um gate que buscasse o arquivo remoto dependeria de rede e de credencial para repositório privado, e um gate frágil que às vezes passa por indisponibilidade é pior que a ausência declarada. Existe um verificador que roda contra um clone local, passado por argumento, e o seu limite está escrito onde alguém suporia o contrário.
- **Gerar o livro a partir da norma.** Recusada: o livro não é uma projeção da especificação. Ele fundamenta, discute alternativas recusadas e às vezes discorda. Gerar um do outro apagaria justamente a parte que faz o livro valer.
- **Fundir os dois repositórios de novo.** Recusada: desfaria o ADR 0004 por um problema que uma regra resolve. Os motivos da divisão continuam válidos.

## Consequências

- Toda entrega normativa fica um pouco mais cara, com um passo de verificação a mais. É o preço de dois repositórios que precisam concordar.
- A primeira aplicação da regra aconteceu no mesmo dia em que ela entrou, e encontrou quatro edições de atraso. Estão registradas como as edições 0.13 a 0.16 do HISTORICO.
- Fica declarado o que **não** existe: verificação automática de deriva no CI. Enquanto for assim, a regra depende de disciplina e de revisão, e dizer isso é parte de cumpri-la.
