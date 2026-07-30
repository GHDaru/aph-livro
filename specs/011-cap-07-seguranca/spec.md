# Spec 011 — Capítulo 07: Segurança do protocolo

**Status**: Implementada (estrutura) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar a **estrutura** (fase 1 do `livro/GUIA-CAPITULO.md`, §"Estrutura antes do conteúdo") do capítulo 07 em `livro/capitulos/07-seguranca.md`: cabeçalho datado, objetivos de aprendizagem, "O problema" redigido por completo com o **modelo de ameaça** da fronteira aplicação↔IA, fundamentos científicos candidatos (⏳), fontes da indústria com URL, esqueleto de H3 do estado da arte organizado nas **quatro camadas de defesa** (separação de camadas de confiança, sanitização em profundidade, autorização fora do LLM, auditoria por traço), rascunho da Leitura executiva, perguntas de verificação e Apêndice de evidência por laboratório populado com paths.

## Por quê

A tese do capítulo é o pino de segurança de todo o livro: **prompt injection não se resolve com prompt — se resolve com arquitetura**, e o protocolo app↔IA é exatamente onde essa arquitetura mora. As quatro camadas de defesa estão presentes (ou declaradas como lacuna) nos dois laboratórios, e a indústria convergiu para o mesmo desenho (OWASP LLM01/LLM06; proposta de ação como estado de primeira classe em quatro ecossistemas independentes). Sem essa estrutura aprovada, a fase 2 (prosa integral) não tem contrato — e os capítulos 04, 05 e 09 não têm a quem delegar o modelo de ameaça que justifica seus mecanismos.

## Critérios de aceite

- [x] **CA-1**: `livro/capitulos/07-seguranca.md` contém todas as seções do esqueleto v3 na ordem do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 — "O problema" redigido com o modelo de ameaça (4–6 parágrafos, fechando com as restrições em tensão); estado da arte como esqueleto de H3 com 2–4 frases por seção, cobrindo as quatro camadas de defesa; Leitura executiva rascunhada.
- [x] **CA-2**: o Apêndice traz `### ghdaru` e `### nexxussai-monorepo` populados com paths em backticks e fatos concretos verificados — incluindo a separação de camadas (`handle_message.py`, snapshot como mensagem system rotulada), a sanitização em duas frentes (`sanitize.py` + `registry.ts`; `screen_context_sanitizer.py`), a autorização por capability (`authz.py`, `capabilities.py`, `access.py`) com o contra-exemplo instrutivo (`_DefaultPermissionPolicy` sempre-True em `lateral_chat_router.py`, lacuna declarada) e o traço (`manifesto-aplicacao.md` SC-004; `execution_trace.py`, `record_tool_result.py`).
- [x] **CA-3**: toda fonte externa citada tem URL verificável; papers (Greshake et al. arXiv 2302.12173, AgentDojo 2406.13352, ToolEmu 2309.15817) aparecem só como candidatos com ID arXiv e status ⏳, com a validação declarada como trabalho da fase 2 (nenhum sustenta afirmação do corpo).
- [x] **CA-4**: cada pergunta de `## Verificação` testa um objetivo de `## Objetivos de aprendizagem` (alinhamento 1:1, com dica entre parênteses).
- [x] **CA-5**: as fronteiras do sumário (`livro/README.md`) são respeitadas — a **mecânica** da sanitização do snapshot pertence ao cap. 04 (aqui entra o modelo de ameaça que a justifica); a confirmação humana como UX/FSM pertence ao cap. 05 (aqui entra apenas como controle de segurança); a segurança do handshake federado (verificação de `origin`, token introspection) pertence ao cap. 09.
- [x] **CA-6**: siglas por extenso na 1ª ocorrência; exemplos/payloads (se houver) com valores fictícios evidentes; nenhum arquivo fora dos 4 desta spec é editado (em particular: `CHANGELOG.md`, `HISTORICO.md`, `livro/README.md`, `livro/glossario.md`, `livro/bibliografia.md` intocados).

## Fora de escopo

O **texto completo** do capítulo (prosa integral das seções do estado da arte) é a fase 2, em spec de continuação — inclui a validação dupla dos papers candidatos (⏳ → ✓ em `livro/bibliografia.md`) e a revalidação das URLs de indústria antes de sustentar afirmações no corpo. Também fora: atualização de `CHANGELOG.md`/`HISTORICO.md` (feita pelo orquestrador no fechamento do lote); qualquer edição em `livro/README.md`, `livro/glossario.md` ou `livro/bibliografia.md`; e o detalhamento dos mecanismos delegados aos caps. 04 (sanitização do snapshot), 05 (FSM de confirmação) e 09 (handshake federado).
