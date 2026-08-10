# Protocolo de Comunicação Aplicação ↔ Harness — Sumário

> *"A aplicação conversando com a IA. E a IA conversando com a aplicação."*
>
> Livro vivo · estado da arte capturado em 2026-07 · [histórico e registro de expiração](HISTORICO.md)

Como escrever um capítulo: [`GUIA-CAPITULO.md`](GUIA-CAPITULO.md) · Termos: [`glossario.md`](glossario.md) · Fontes científicas: [`bibliografia.md`](bibliografia.md) · Pesquisa de base: [`../estudos/`](../estudos/)

## Sumário

| # | Capítulo | Tese em uma linha | Fonte-base principal | Spec |
|---|----------|-------------------|----------------------|------|
| 00 | [Introdução — a fronteira aplicação↔IA](capitulos/00-introducao.md) | Existe um protocolo natural entre a aplicação e o agente embutido, duas bases o descobriram de forma independente, e o mercado ainda não o padronizou. | convergência ghdaru × nexxussai; caps. 13/15/17 do livro-mãe | 004 |
| 01 | [Fundamentos e vocabulário](capitulos/01-fundamentos.md) | As duas direções (app→IA descreve; IA→app age por eventos) e os sete conceitos que todo o resto compõe: snapshot, catálogo, evento, proposta, comando de UI, risco, traço. | linguagem ubíqua das duas bases | 005 |
| 02 | [Transporte e sessão](capitulos/02-transporte-sessao.md) | SSE sobre POST venceu WebSocket nas duas bases; `seq`+replay e cancelamento cooperativo são as duas metades de uma sessão robusta. | `chat_router.py` (ghdaru) · `active_streams.py` (nexxussai) | 006 |
| 03 | [A voz da IA: eventos tipados](capitulos/03-eventos-tipados.md) | A IA fala com a aplicação por um vocabulário fechado e versionado de eventos — conteúdo, raciocínio, artefatos, citações, erros — e a normalização multi-provider protege esse vocabulário. | `models.py` (ghdaru) · `stream_event.py` + `provider_stream_normalizer.py` (nexxussai) | 007 |
| 04 | [A voz da aplicação: contexto de tela](capitulos/04-contexto-de-tela.md) | A aplicação se descreve (snapshot em níveis, screen registry, camada semântica) — a IA nunca infere a UI, e o que é sensível nunca chega ao modelo (sanitização). | `snapshot.md` + `sanitize.py` (ghdaru) · `screen_context_sanitizer.py` (nexxussai) | 008 |
| 05 | [Ações governadas](capitulos/05-acoes-governadas.md) | O catálogo declarado é a única superfície executável; toda ação percorre a máquina de estados proposta→confirmação→execução→resultado, com idempotência e traço. | `catalog.py` + FSM (ghdaru) · `action_proposal.py` + `idempotency_key`/`context_hash` (nexxussai) | 009 |
| 06 | [Comandos de UI e slot filling](capitulos/06-comandos-de-ui.md) | A IA muda a interface por comandos declarativos (`ui.navigate`, `form.patch`, `user.input.required`) — nunca por cliques simulados ou DOM. | specs 001 (ghdaru) e 014 (nexxussai) | 010 |
| 07 | [Segurança do protocolo](capitulos/07-seguranca.md) | Prompt injection se combate na arquitetura: separação de camadas, sanitização em profundidade, autorização sempre fora do LLM, auditoria por traço. | Constituição P.IV (ghdaru) · sanitizers e políticas (ambas) | 011 |
| 08 | [A porta do modelo e o tool calling](capitulos/08-porta-do-modelo.md) | Uma porta única normaliza qualquer provedor em chunks tipados; a lacuna comum das duas bases — catálogo pronto para tools sem usar tools — é a ponte a atravessar. | `ai_gateway` (ghdaru) · `ai_orchestration` + `ILLMCompletion` spec (nexxussai) | 012 |
| 09 | [Federação e composição](capitulos/09-federacao-composicao.md) | O contrato de integração de uma app externa é o mesmo contrato da IA (manifesto + snapshot + catálogo); MCP é a projeção desse catálogo para fora. | `docs/integration/` (ghdaru) · roadmap fase 6 (nexxussai) | 013 |
| 10 | [O estado da arte externo](capitulos/10-estado-da-arte-externo.md) | AG-UI, MCP (apps/elicitation), ACP, Vercel AI SDK e OpenAI Apps SDK atacam a mesma fronteira; a matriz comparativa mostra o que já padronizou e o que segue aberto. | `estudos/panorama-industria.md` | 014 |
| 11 | [Convergências — o protocolo unificado](capitulos/11-convergencias.md) | Síntese normativa: o que as duas bases + a indústria permitem afirmar como núcleo do protocolo app↔harness, as lacunas, e o roadmap de adoção. | todos os anteriores | 015 |

## Parte normativa

| Documento | O que é | Spec |
|---|---|---|
| [Padrão APH v0.5](https://github.com/GHDaru/protocolos/blob/main/padrao/padrao-aph.md) | A proposta prescritiva do livro: o que uma aplicação DEVE adotar para conversar integralmente com o harness via chat — níveis de conformidade (Observador/Operador/Federado), requisitos com maturidade declarada, compatibilidade com a indústria e checklist. | 018 · 021 · 025 · 029 · 031 |
| [Anexo A — wire format](https://github.com/GHDaru/protocolos/blob/main/padrao/anexo-a-wire-format.md) | O formato exato das mensagens: JSON Schemas validáveis (evento, snapshot, catálogo, confirmação, erro), superfície HTTP de referência, códigos de erro e mapeamento para os laboratórios — com exemplos verificados por gate de CI. | 021 · 029 |
| [Suíte de conformidade — Nível 1](https://github.com/GHDaru/protocolos/blob/main/conformidade/README.md) | O examinador executável: testa de fora (caixa-preta) se uma aplicação cumpre o Nível 1 — 11 checks contra os schemas reais + lista do que autodeclarar; autotestada por sabotagens no CI (Gate 3). | 026 · 027 |
| [Skills de adoção](https://github.com/GHDaru/protocolos/blob/main/skills.md) | Duas skills para agentes de código que cobrem o que a caixa-preta não alcança: `aph-avaliar` (auditoria por leitura com evidência por path) e `aph-sugerir` (roteiro de mudança com critério de pronto verificável). | 030 |

## Fronteiras entre capítulos (o que entra onde)

- **02 × 03**: o cap. 02 trata do *canal* (HTTP, SSE, sessão, reconexão, cancelamento, erros de transporte); o cap. 03 trata do *vocabulário* que trafega no canal (tipos de evento e sua semântica). O envelope (`seq`, `kind`, `payload`) pertence ao 03; a entrega e reentrega dele, ao 02.
- **03 × 06**: `ui_command`/`action_*` aparecem no 03 apenas como membros do vocabulário; a semântica de agir sobre a UI é dos caps. 05–06.
- **04 × 07**: a sanitização aparece no 04 como parte do snapshot; o modelo de ameaça completo (prompt injection, separação de camadas) é do 07.
- **05 × 06**: o 05 governa *qualquer* ação (FSM, risco, confirmação); o 06 especializa a família de ações que muda a interface.
- **08 × 05**: o 08 explica *como* a intenção nasce (roteador determinístico → tool calling); o 05 explica o que acontece com a intenção depois que nasce.
- **09 × 10**: o 09 é a federação *deste* desenho (manifesto, handshake, MCP como projeção); o 10 é o mercado externo comparado.
- **10 × 17 do livro-mãe**: o cap. 17 do Engenharia de Harness cobre protocolos *entre harnesses* (MCP/A2A/ACP em geral); o 10 daqui cobre só a fronteira app↔agente, citando o livro-mãe.
