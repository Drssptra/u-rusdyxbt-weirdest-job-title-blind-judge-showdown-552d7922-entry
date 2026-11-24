// The entry: one weird job title, nothing else.
const ENTRY = "Regional Manager of Sighing Loudly in Shared Offices";

const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

// The harness points at its output directory with MAKEFUN_OUTPUT_DIR
// ("/output" in the grader); fall back to the current directory.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || process.cwd();
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY + "\n", "utf8");

// Print exactly the entry text and nothing else.
process.stdout.write(ENTRY + "\n");
