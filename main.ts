// Weirdest Job Title — Blind Judge Showdown (v2 resubmission).
//
// The entry is a single job title: a senior-sounding chief whose entire
// remit is saying sorry to the pigeons in the town square. One line,
// nothing else. The judge reads titles two at a time and picks the
// weirder, funnier one — so the title has to land on its own.

const fs = require("node:fs");
const path = require("node:path");

// The title is assembled from its words so each word is visible on its
// own line; joining with a single space reproduces the entry exactly.
const TITLE_WORDS = [
  "Chief",
  "Apologizer",
  "to",
  "Pigeons",
  "in",
  "the",
  "Town",
  "Square",
];

const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 60;

function buildTitle(words) {
  for (const word of words) {
    if (typeof word !== "string" || word.length === 0 || /\s/.test(word)) {
      throw new Error("title word list is malformed");
    }
  }
  return words.join(" ");
}

function gateCheck(title) {
  const problems = [];
  if (title.length < GATE_MIN_CHARS) problems.push("empty");
  if (title.length > GATE_MAX_CHARS) problems.push(`too long (${title.length} chars)`);
  if (title.includes("\n") || title.includes("\r")) problems.push("not a single line");
  if (title !== title.trim()) problems.push("leading/trailing whitespace");
  if (problems.length > 0) {
    throw new Error(`entry fails the 1-60 char gate: ${problems.join("; ")}`);
  }
}

function resolveOutputDir() {
  const fromHarness = process.env.MAKEFUN_OUTPUT_DIR;
  if (typeof fromHarness === "string" && fromHarness.length > 0) {
    return fromHarness;
  }
  return process.cwd();
}

function main() {
  const title = buildTitle(TITLE_WORDS);
  gateCheck(title);

  const outDir = resolveOutputDir();
  fs.mkdirSync(outDir, { recursive: true });

  // Write the entry byte-exact: no trailing newline in the file.
  const target = path.join(outDir, "entry.txt");
  const fd = fs.openSync(target, "w");
  try {
    const bytes = Buffer.from(title, "utf8");
    const written = fs.writeSync(fd, bytes);
    if (written !== bytes.length) {
      throw new Error(`short write: ${written} of ${bytes.length} bytes`);
    }
  } finally {
    fs.closeSync(fd);
  }

  // Stdout may carry a trailing newline; the file must not.
  console.log(title);
}

main();
