import { run, Kind } from "./run.ts";

const arg = Deno.args[0];
if (arg === "-c") {
  await run(Kind.Counter);
} else {
  await run(Kind.Clock);
}
