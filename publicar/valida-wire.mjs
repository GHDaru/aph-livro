// Gate do wire format (spec 021): valida os schemas do Anexo A e os exemplos
// de livro/padrao/schemas/exemplos.json. Roda no CI antes do build do site —
// se um schema quebrar ou um exemplo divergir, a publicação FALHA.
// Uso: node valida-wire.mjs

import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../livro/padrao/schemas");
const ajv = new Ajv2020.default({ strict: false, allErrors: true });
addFormats.default(ajv);

// registra todos os schemas (permite $ref entre arquivos, ex.: evento -> erro)
const arquivos = readdirSync(DIR).filter((f) => f.endsWith(".schema.json"));
for (const f of arquivos) ajv.addSchema(JSON.parse(readFileSync(join(DIR, f), "utf8")), f);

const exemplos = JSON.parse(readFileSync(join(DIR, "exemplos.json"), "utf8"));
let falhas = 0, ok = 0;
for (const [schema, grupos] of Object.entries(exemplos)) {
  if (schema.startsWith("_")) continue;
  const valida = ajv.getSchema(schema);
  if (!valida) { console.error(`schema não registrado: ${schema}`); falhas++; continue; }
  (grupos.validos || []).forEach((ex, i) => {
    if (valida(ex)) ok++;
    else { falhas++; console.error(`FALHA ${schema} válido#${i} rejeitado:`, JSON.stringify(valida.errors, null, 1)); }
  });
  (grupos.invalidos || []).forEach((ex, i) => {
    if (!valida(ex)) ok++;
    else { falhas++; console.error(`FALHA ${schema} inválido#${i} foi ACEITO (deveria ser rejeitado): ${JSON.stringify(ex)}`); }
  });
}
if (falhas) { console.error(`\nwire format: ${falhas} falha(s)`); process.exit(1); }
console.log(`wire format ok: ${arquivos.length} schemas carregados, ${ok} casos de exemplo verificados (válidos aceitos, inválidos rejeitados)`);
