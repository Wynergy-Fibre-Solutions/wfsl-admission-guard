#!/usr/bin/env node

import { runAdmission } from "./engine.js";
import { resolve } from "node:path";

function parseArgs() {
  const args = process.argv.slice(2);
  const out: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      out[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }
  return out;
}

const args = parseArgs();
const root = args.root ? resolve(args.root) : process.cwd();

const result = runAdmission(root);

console.log("WFSL Admission Guard v0.1");
console.log(`Root: ${root}`);
console.log(`Outcome: ${result.admitted ? "ADMITTED" : "REFUSED"}`);

if (!result.admitted) {
  for (const r of result.reasons) {
    console.log(`- ${r}`);
  }
}

console.log(`Evidence: ${result.evidencePath}`);

process.exit(result.admitted ? 0 : 1);
