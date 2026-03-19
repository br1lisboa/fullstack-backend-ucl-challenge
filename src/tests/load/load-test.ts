import autocannon from "autocannon";
import { createServer } from "http";
import app from "../../../app.js";

const PORT = 8099;
const BASE = `http://localhost:${PORT}`;

interface TestScenario {
  name: string;
  method?: string;
  path: string;
  duration?: number;
  connections?: number;
}

const scenarios: TestScenario[] = [
  {
    name: "GET /health",
    path: "/health",
    duration: 5,
    connections: 10,
  },
  {
    name: "GET /matches (default pagination)",
    path: "/matches",
    duration: 5,
    connections: 10,
  },
  {
    name: "GET /matches?teamId=1",
    path: "/matches?teamId=1",
    duration: 5,
    connections: 10,
  },
  {
    name: "GET /matches?matchDay=3&limit=50",
    path: "/matches?matchDay=3&limit=50",
    duration: 5,
    connections: 10,
  },
  {
    name: "GET /matches (high concurrency)",
    path: "/matches?limit=100",
    duration: 5,
    connections: 50,
  },
  {
    name: "GET /teams",
    path: "/teams",
    duration: 5,
    connections: 10,
  },
  {
    name: "GET /draw",
    path: "/draw",
    duration: 5,
    connections: 10,
  },
  {
    name: "GET /draw/statistics",
    path: "/draw/statistics",
    duration: 5,
    connections: 10,
  },
];

async function runScenario(scenario: TestScenario): Promise<autocannon.Result> {
  return new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url: `${BASE}${scenario.path}`,
        method: (scenario.method as any) || "GET",
        duration: scenario.duration || 5,
        connections: scenario.connections || 10,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    autocannon.track(instance, { renderProgressBar: false });
  });
}

function printResult(name: string, result: autocannon.Result) {
  console.log(`\n── ${name} ──`);
  console.log(`  Requests/sec:  ${result.requests.average}`);
  console.log(`  Latency avg:   ${result.latency.average} ms`);
  console.log(`  Latency p99:   ${result.latency.p99} ms`);
  console.log(`  Throughput:    ${(result.throughput.average / 1024).toFixed(1)} KB/s`);
  console.log(`  Total reqs:    ${result.requests.total}`);
  console.log(`  Errors:        ${result.errors}`);
  console.log(`  Timeouts:      ${result.timeouts}`);
}

async function main() {
  const server = createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(PORT, resolve);
  });

  console.log(`Server running on port ${PORT}`);
  console.log("Creating draw for load tests...\n");

  const drawRes = await fetch(`${BASE}/draw`, { method: "POST" });
  if (drawRes.status === 201) {
    console.log("Draw created (201)");
  } else if (drawRes.status === 409) {
    console.log("Draw already exists (409)");
  }

  console.log(`\nRunning ${scenarios.length} load test scenarios...\n`);

  const results: Array<{ name: string; result: autocannon.Result }> = [];

  for (const scenario of scenarios) {
    process.stdout.write(`Running: ${scenario.name}...`);
    const result = await runScenario(scenario);
    results.push({ name: scenario.name, result });
    console.log(" done");
  }

  console.log("\n════════════════════════════════════════");
  console.log("  LOAD TEST RESULTS");
  console.log("════════════════════════════════════════");

  for (const { name, result } of results) {
    printResult(name, result);
  }

  console.log("\n════════════════════════════════════════");
  console.log("  SUMMARY");
  console.log("════════════════════════════════════════\n");

  console.log(
    `${"Endpoint".padEnd(40)} ${"Req/s".padStart(8)} ${"Avg(ms)".padStart(8)} ${"p99(ms)".padStart(8)} ${"Errors".padStart(8)}`
  );
  console.log("─".repeat(72));

  for (const { name, result } of results) {
    console.log(
      `${name.padEnd(40)} ${String(result.requests.average).padStart(8)} ${String(result.latency.average).padStart(8)} ${String(result.latency.p99).padStart(8)} ${String(result.errors).padStart(8)}`
    );
  }

  server.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Load test failed:", err);
  process.exit(1);
});
