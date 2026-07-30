# Spec 013 — Capítulo 09: Federação e composição

**Status**: Implementada (texto completo) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar a **estrutura** (fase 1 do `livro/GUIA-CAPITULO.md`, §"Estrutura antes do conteúdo") do capítulo `livro/capitulos/09-federacao-composicao.md`. Tese do capítulo: o protocolo app↔IA se estende naturalmente a aplicações de terceiros porque **o contrato de integração de uma aplicação federada é o mesmo contrato que a IA já usa — manifesto + snapshot + catálogo; não há um segundo protocolo a inventar**. A decisão estruturante é negativa e explícita no ghdaru (`docs/adr/0003-modelos-integracao-aplicacoes.md`: alternativa "protocolo de integração novo, separado" descartada), materializada em três níveis de integração (interno/federado/headless), no Manifesto de Aplicação com JSON Schema validável (`docs/integration/manifesto-aplicacao.md`, `docs/integration/manifest.schema.json`) e no handshake postMessage `ghd.*`. O Model Context Protocol (MCP) entra como a **projeção do catálogo para fora** (ghdaru: catálogo "desenhado para virar tools MCP"; nexxussai: roadmap fase 6), e MCP Apps/MCP-UI como o movimento inverso da indústria — UI embutida em hosts de agente pela mesma mecânica (iframe sandboxado + postMessage).

## Por quê

Os capítulos 04–06 mostraram a aplicação conversando com o *seu* agente; este capítulo mostra que o mesmo contrato escala para aplicações de terceiros — a federação é a prova de generalidade do protocolo. As duas bases-laboratório exibem lacunas espelhadas em direções opostas (ghdaru: federação inteiramente especificada, sem código; nexxussai: código MCP embrionário, sem especificação de federação), e a indústria acaba de padronizar o movimento inverso (MCP Apps, SEP-1865) com mecânica idêntica ao handshake `ghd.*` — a convergência que sustenta a tese. Sem esta estrutura aprovada, a fase 2 (prosa integral) não tem contrato.

## Critérios de aceite

- [x] **CA-1**: `livro/capitulos/09-federacao-composicao.md` existe com cabeçalho datado (captura 2026-07, revisão 2026-07-30) e todas as seções do esqueleto v3 na ordem normativa do `GUIA-CAPITULO.md`; "O problema" está **redigido** (não esqueleto) e fecha com as restrições em tensão (abertura a terceiros × superfície de ataque × custo de conformidade × unicidade do contrato).
- [x] **CA-2**: o estado da arte tem H3 planejados (2–4 frases cada) cobrindo no mínimo: os três níveis de integração (todo terceiro começa no nível 3/headless); o Manifesto de Aplicação (5 elementos + JSON Schema draft 2020-12 com `actions[]`/`risk`/`input_schema`, `endpoints.mcp_card`, `capabilities_required`); o handshake `ghd.*` com sua segurança específica (`event.origin` nos dois lados, token via `/auth/introspect`); a decisão "um contrato, não dois" (ADR 0003); MCP como projeção do catálogo; MCP Apps/MCP-UI como movimento inverso; instruções de construção/conformidade. A Leitura executiva está rascunhada.
- [x] **CA-3**: "Fundamentos científicos" declara explicitamente a ausência de ciência validada para federação (nenhuma entrada ✓ sustenta afirmação; lacuna registrada em `estudos/candidatos-bibliografia.md`); "Fontes da indústria" traz fichas com URL verificável no formato "tradução para decisão".
- [x] **CA-4**: o Apêndice tem `### ghdaru` e `### nexxussai-monorepo` populados com paths em backticks — incluindo as **lacunas declaradas** (ghdaru: handshake `ghd.*` e MCP server sem código; nexxussai: FastMCP desconectado em `apps/api/app/mcp/server.py`, registry vazio) — e um `### Divergências` comparando as lacunas espelhadas.
- [x] **CA-5**: fronteiras respeitadas — o catálogo em si é remetido ao cap. 05; a avaliação comparativa dos protocolos externos, ao cap. 10 (aqui MCP/MCP Apps entram só como extensão da federação); a segurança geral do protocolo, ao cap. 07 (aqui só a segurança específica do handshake).
- [x] **CA-6**: siglas por extenso na 1ª ocorrência; exemplos/payloads com valores fictícios evidentes; cada pergunta de Verificação testa um objetivo de aprendizagem; nenhum arquivo fora dos 4 desta spec é editado.

## Fora de escopo

O **texto completo** do capítulo (prosa integral das seções do estado da arte) é a fase 2, em entrega posterior sobre a estrutura aprovada — inclui a revalidação das URLs de indústria e a eventual busca de ciência (HCI/mixed-initiative) para a lacuna declarada. Também fora: a mecânica do Catálogo de Ações e a FSM de propostas (cap. 05), a matriz comparativa dos protocolos externos (cap. 10), o modelo de ameaça completo (cap. 07), e a edição de `livro/README.md`, `livro/glossario.md`, `livro/bibliografia.md`, `CHANGELOG.md` e `HISTORICO.md` (feitos pelo orquestrador no fechamento do lote).
