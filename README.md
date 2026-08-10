# Protocolo de Comunicação Aplicação ↔ Harness — o livro

> *"A aplicação conversando com a IA. E a IA conversando com a aplicação."*

Livro vivo sobre a fronteira entre uma aplicação de produto e o agente de IA
embutido nela: como a aplicação se descreve (contexto de tela, catálogo de ações)
e como a IA age de volta (eventos tipados, ações governadas, comandos de UI).
Datado por construção — ver [`livro/HISTORICO.md`](livro/HISTORICO.md).

**Comece por**: [o sumário](livro/README.md) · [glossário](livro/glossario.md) ·
[histórico e registro de expiração](livro/HISTORICO.md)

## A especificação vive em outro repositório

A parte **normativa** — o Padrão APH, o Anexo A (wire format), os JSON Schemas e a
suíte de conformidade executável — mora em [`GHDaru/protocolos`](https://github.com/GHDaru/protocolos).
O livro *fundamenta* o padrão com evidência; o padrão é o que se implementa.
A divisão e seus motivos estão no [ADR 0004](https://github.com/GHDaru/protocolos/blob/main/adr/0004-divisao-em-dois-repositorios.md).

## Como publicar

```bash
cd publicar && npm install && node build.mjs   # gera docs/, falha em link quebrado
```
