# Protocolo de Comunicação Aplicação ↔ Harness

> *"A aplicação conversando com a IA. E a IA conversando com a aplicação."*
>
> 📖 **Leia online**: https://protocolos-livid.vercel.app/ (publicado automaticamente a cada merge na `main`)

Livro vivo sobre o protocolo da fronteira **aplicação ↔ agente de IA embutido**: como uma aplicação de produto descreve seu estado e suas capacidades ao agente (contexto de tela, catálogo de ações), e como o agente fala de volta (eventos tipados em streaming, propostas de ação governadas, comandos de UI declarativos) — com a segurança e a governança que essa fronteira exige.

Irmão do livro [Engenharia de Harness](https://github.com/GHDaru/harness_engineering) (que trata do que acontece *dentro* do harness e *entre* harnesses), este livro trata do que acontece **entre a aplicação e o harness**.

## Fonte-base

O livro nasce da leitura de duas implementações reais que convergiram de forma independente para o mesmo desenho:

- **ghdaru** — eventos tipados via SSE, Snapshot de Contexto em 3 níveis, Catálogo de Ações, FSM de proposta, Manifesto de Aplicação;
- **nexxussai-monorepo** — vocabulário SSE canônico, ScreenRegistry, ScreenContextSnapshot, ActionProposal com idempotência e `context_hash`.

Ciência e indústria (AG-UI, MCP, ACP, Vercel AI SDK, OpenAI Apps SDK…) contextualizam.

## Estrutura

- [`livro/`](livro/) — capítulos, histórico, bibliografia, glossário
- [`estudos/`](estudos/) — pesquisa registrada com fontes
- [`specs/`](specs/) — uma spec por capítulo (metodologia [Maestro](https://github.com/GHDaru/maestro))
- [`adr/`](adr/) — registros de decisão

Governança: [`.specify/memory/constitution.md`](.specify/memory/constitution.md) · Como contribuir: [`CLAUDE.md`](CLAUDE.md)
