# Plan 006 — Capítulo 02: Transporte e sessão

## Abordagem

Estrutura na fase 1 do `GUIA-CAPITULO.md`, montada a partir de três insumos já registrados: (1) `estudos/fonte-base-codigo.md` — a evidência por path das duas bases (ghdaru: `seq`+replay em `chat_router.py`, fixado em `test_chat_routes.py`; nexxussai: `ActiveStreams`+`AbortSignal`); (2) `estudos/panorama-industria.md` — o que a indústria usa como transporte (AG-UI transporte-agnóstico com SSE default; Vercel UI Message Stream sobre SSE; ACP sobre stdio JSON-RPC; Anthropic Messages API sobre SSE); (3) as decisões formais de transporte registradas nos repositórios-fonte (ghdaru `specs/001-fundacao-shell-chat/plan.md` e `docs/research/resultado-pesquisa-infra-avaliacao.md`; nexxussai `specs/014-chat-lateral-contexto/research.md`).

O corpo organiza a tese em cinco H3: a decisão de transporte (SSE × WebSocket × polling), as duas metades da sessão robusta (entrega confiável; cancelamento cooperativo), o envelope de erro como parte do protocolo, e sessão/reconexão como composição. Cada H3 nasce com 2–4 frases que fixam a tese da futura prosa; "O problema" já sai redigido porque ancora as tensões que todos os H3 resolvem. Paths verificados por leitura direta dos repositórios-laboratório antes da escrita (correção aplicada: o endpoint `DELETE /api/chat/stream/{stream_id}` do nexxussai vive em `chat_completions_router.py`, não no router lateral).

Fronteiras policiadas na escrita: entrega/reentrega aqui, semântica do envelope no cap. 03; cancelamento de stream aqui, cancelamento de ação no cap. 05.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Toda afirmação de implementação com path + repositório; indústria com URL "tradução para decisão"; sem ciência ✓ disponível, a seção declara ausência e nada do corpo se apoia nela. |
| II. Fonte-base é o código | ✅ Estrutura nasce dos paths de `estudos/fonte-base-codigo.md`, reverificados nos repositórios (somente leitura; nada escrito neles). |
| III. Esqueleto v3 | ✅ Ordem de seções do `GUIA-CAPITULO.md`; Bloom nos objetivos; siglas por extenso na 1ª ocorrência (SSE = Server-Sent Events); tabela só para fatos enumeráveis. |
| IV. Livro vivo | ✅ Cabeçalho com captura 2026-07 e revisão 2026-07-30; Leitura executiva rascunhada como contrato de frescor; HISTORICO atualizado pelo orquestrador no fechamento do lote. |
| V. Segurança | ✅ Nenhum segredo; exemplos de payload (quando houver na fase 2) com valores fictícios evidentes. |
| VI. Neutralidade | ✅ SSE × WebSocket × polling avaliados por adoção medida e restrições técnicas, não por vendor; português com termos técnicos (*streaming*, *polling*) sem tradução. |
| VII. Spec-driven (Maestro) | ✅ Spec própria (006) com CAs testáveis e fase 2 declarada fora de escopo; raia plena; CHANGELOG/commit a cargo do orquestrador do lote. |
