/* WFSL Admission Guard GitHub Action v1
   - Scans Next.js App Router routes under app/ and src/app/
   - Compares to wfsl.admission.json using core decideAdmission()
   - Deny-by-default: anything discovered but not admitted fails CI
*/

const core = require("@actions/core");
const fg = require("fast-glob");
const fs = require("node:fs");
const path = require("node:path");

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function normaliseRoutePath(p) {
  if (!p) return "/";
  if (!p.startsWith("/")) return `/${p}`;
  return p;
}

function hasDynamicSegment(routePath) {
  return routePath.includes("[") || routePath.includes("]");
}

function shouldIgnoreSegment(seg) {
  // Route groups (parentheses), parallel routes (@), underscore-private
  if (!seg) return true;
  if (seg.startsWith("(")) return true;
  if (seg.startsWith("@")) return true;
  if (seg.startsWith("_")) return true;
  return false;
}

function fileToRoute(file, appRootPosix) {
  // file is posix path. appRootPosix ends with "/app" or "/src/app"
  // Convert:
  //   app/page.tsx -> /
  //   app/chat/page.tsx -> /chat
  //   app/api/chat/route.ts -> /api/chat
  const rel = file.slice(appRootPosix.length).replace(/^\/+/, "");
  const parts = rel.split("/").filter(Boolean);

  if (parts.length === 0) return null;

  const leaf = parts[parts.length - 1];
  const dirParts = parts.slice(0, -1);

  // Ignore non-route files
  const isPage = leaf.startsWith("page.");
  const isRoute = leaf.startsWith("route.");
  if (!isPage && !isRoute) return null;

  const cleaned = [];
  for (const seg of dirParts) {
    if (shouldIgnoreSegment(seg)) continue;
    cleaned.push(seg);
  }

  const routePath = normaliseRoutePath(cleaned.join("/"));
  return {
    route: routePath === "/api" && isRoute ? "/api" : routePath,
    kind: isRoute ? "api" : "page",
    source: file
  };
}

async function discoverNextRoutes(projectRoot) {
  const root = path.resolve(projectRoot);

  const appRoots = [
    path.join(root, "app"),
    path.join(root, "src", "app")
  ].filter((p) => fs.existsSync(p) && fs.statSync(p).isDirectory());

  const discovered = [];

  for (const appRoot of appRoots) {
    const appRootPosix = toPosix(appRoot);

    const patterns = [
      toPosix(path.join(appRoot, "**", "page.{js,jsx,ts,tsx}")),
      toPosix(path.join(appRoot, "**", "route.{js,ts}"))
    ];

    const files = await fg(patterns, { dot: false, onlyFiles: true });

    for (const file of files) {
      const fposix = toPosix(path.resolve(file));
      // Ensure the file is under this app root
      if (!fposix.startsWith(appRootPosix)) continue;

      const mapped = fileToRoute(fposix, appRootPosix);
      if (!mapped) continue;

      // Normalise route groups removal already done; now map /api subtree for route.ts
      // If file path includes /api/.../route.ts, the dirParts include "api" then "chat" etc.
      // That becomes /api/chat automatically.
      discovered.push(mapped);
    }
  }

  // De-duplicate by route+kind
  const seen = new Set();
  const unique = [];
  for (const d of discovered) {
    const key = `${d.kind}:${d.route}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(d);
  }

  return unique.sort((a, b) => (a.route + a.kind).localeCompare(b.route + b.kind));
}

function readJsonFile(absPath) {
  const text = fs.readFileSync(absPath, "utf8");
  return JSON.parse(text);
}

async function main() {
  const rootInput = core.getInput("root") || ".";
  const manifestPathInput = core.getInput("manifest") || "wfsl.admission.json";
  const mode = (core.getInput("mode") || "strict").toLowerCase();
  const failOnDynamic = (core.getInput("fail_on_dynamic") || "true").toLowerCase() === "true";

  if (mode !== "strict") {
    core.setFailed(`Unsupported mode: ${mode}. v1 supports only "strict".`);
    return;
  }

  const projectRoot = path.resolve(rootInput);
  const manifestAbs = path.resolve(projectRoot, manifestPathInput);

  if (!fs.existsSync(manifestAbs)) {
    core.setFailed(`Admission manifest not found: ${manifestAbs}`);
    return;
  }

  // Import core engine (ESM) dynamically
  const coreEngine = await import(pathToFileUrl(path.resolve(process.cwd(), "dist", "index.js")).href);
  const decideAdmission = coreEngine.decideAdmission;

  const manifest = readJsonFile(manifestAbs);

  const discovered = await discoverNextRoutes(projectRoot);

  let admitted = 0;
  let refused = 0;

  const violations = [];
  const dynamicHits = [];

  for (const d of discovered) {
    if (hasDynamicSegment(d.route)) {
      dynamicHits.push(d);
      if (failOnDynamic) continue;
    }

    const method = d.kind === "api" ? "POST" : "GET";
    const result = decideAdmission(manifest, { pathname: d.route, method });

    if (result.ok && result.outcome === "ADMITTED") {
      admitted += 1;
    } else if (result.ok && result.outcome === "REFUSED") {
      refused += 1;
      violations.push({
        route: d.route,
        kind: d.kind,
        source: d.source,
        code: result.evidence.code,
        status: result.status
      });
    } else {
      refused += 1;
      violations.push({
        route: d.route,
        kind: d.kind,
        source: d.source,
        code: "ADMISSION_MANIFEST_INVALID",
        status: 500
      });
    }
  }

  if (dynamicHits.length > 0 && failOnDynamic) {
    const lines = dynamicHits.map((d) => `- ${d.kind.toUpperCase()} ${d.route} (${d.source})`);
    core.setFailed(
      `Dynamic routes detected (v1 does not support dynamic admission).\n` +
      `Either remove dynamic segments or do not use them in v1.\n\n` +
      lines.join("\n")
    );
    return;
  }

  core.setOutput("admitted", String(admitted));
  core.setOutput("refused", String(refused));

  if (violations.length > 0) {
    const lines = violations.map((v) => `- ${v.kind.toUpperCase()} ${v.route} [${v.code}] (${v.source})`);
    core.setFailed(
      `WFSL Admission Guard refused discovered routes.\n` +
      `Deny-by-default posture is active. Declare these surfaces in wfsl.admission.json to admit them.\n\n` +
      lines.join("\n")
    );
    return;
  }

  core.info(`WFSL Admission Guard: admitted ${admitted} routes. No refusals.`);
}

function pathToFileUrl(p) {
  let resolved = path.resolve(p);
  resolved = resolved.replace(/\\/g, "/");
  if (!resolved.startsWith("/")) resolved = "/" + resolved;
  return new URL("file://" + resolved);
}

main().catch((err) => {
  core.setFailed(`WFSL Admission Guard action failed: ${err?.message || String(err)}`);
});
