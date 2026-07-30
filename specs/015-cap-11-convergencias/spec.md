# Spec 015 — Capítulo 11: Convergências — o protocolo unificado

**Status**: Implementada (texto completo) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar a **estrutura** (fase 1 do `livro/GUIA-CAPITULO.md`, §"Estrutura antes do conteúdo") do capítulo 11 em `livro/capitulos/11-convergencias.md`: cabeçalho datado, objetivos de aprendizagem, "O problema" redigido por completo, fundamentos científicos candidatos (⏳), fontes da indústria com URL, esqueleto de H3 do estado da arte — o núcleo comum (com a versão consolidada em uma tabela da matriz do cap. 10), as lacunas nomeadas, o roadmap de adoção e "o que este livro aposta" (amarrado ao registro de expiração E1/E2 do `livro/HISTORICO.md`) — com rascunho da Leitura executiva, perguntas de verificação e Apêndice populado com o **roadmap de lacunas de cada laboratório, com paths**.

## Por quê

O capítulo 11 é a síntese normativa do livro: cruzando as duas bases-laboratório com os cinco ecossistemas externos, já é possível afirmar um **núcleo** do protocolo aplicação↔harness — duas direções assimétricas; streaming de eventos tipados com vocabulário fechado e versionado sobre SSE; toda ação nasce proposta e percorre uma máquina de estados com confirmação humana proporcional ao risco; autorização fora do modelo; traço auditável de ponta a ponta; declarativo sempre, DOM nunca — e nomear o que segue **aberto** (contexto de tela, taxonomia de risco, traço interoperável, ponte catálogo→tools). Sem essa estrutura aprovada, a fase 2 não tem contrato — e o livro termina sem responder à pergunta de quem constrói hoje: o que adotar, em que ordem.

## Critérios de aceite

- [x] **CA-1**: `livro/capitulos/11-convergencias.md` contém todas as seções do esqueleto v3 na ordem do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 — "O problema" redigido; estado da arte como esqueleto de H3 com 1–2 frases (mais tabelas) por seção; Leitura executiva rascunhada.
- [x] **CA-2**: o estado da arte tem exatamente os H3 da tese: núcleo comum (com os seis elementos e a matriz consolidada laboratórios × indústria em **uma** tabela), lacunas nomeadas (as quatro), roadmap de adoção (ordem: tool calling → slot filling → MCP como projeção → protocolo externo quando consolidar) e "o que este livro aposta" (amarrado a E1/E2 do `livro/HISTORICO.md`).
- [x] **CA-3**: o capítulo **não introduz conteúdo novo** — só compõe o que os caps. 01–10 estabelecem, citando-os por número; a matriz detalhada permanece no cap. 10 (aqui só a versão consolidada em uma tabela).
- [x] **CA-4**: o Apêndice traz `### ghdaru` e `### nexxussai-monorepo` populados como **roadmap consolidado de lacunas** de cada laboratório, com paths em backticks extraídos de `estudos/fonte-base-codigo.md` (§2.5 e §3.4).
- [x] **CA-5**: toda afirmação tem path (`ghdaru`/`nexxussai-monorepo`), URL verificável ou marca ⏳; papers aparecem só como candidatos ⏳ com a validação declarada como trabalho da fase 2; cada pergunta de Verificação testa um objetivo (1:1, com dica).
- [x] **CA-6**: siglas por extenso na 1ª ocorrência; exemplos (se houver) com valores fictícios evidentes; nenhum arquivo fora dos 4 desta spec é criado ou editado (em particular: `CHANGELOG.md`, `HISTORICO.md`, `livro/README.md`, `livro/glossario.md`, `livro/bibliografia.md` e arquivos de outros capítulos/specs intocados).

## Fora de escopo

O **texto completo** do capítulo (prosa integral das seções do estado da arte) é a fase 2, em spec de continuação — inclui a validação dupla dos papers candidatos (⏳ → ✓ em `livro/bibliografia.md`) e a revalidação das URLs de indústria. Também fora: atualização de `CHANGELOG.md`/`HISTORICO.md` (feita pelo orquestrador no fechamento do lote), qualquer pontuação efetiva de E1/E2 (o capítulo só as referencia; pontuar é rito de edição do HISTORICO) e qualquer edição na matriz detalhada do cap. 10.
