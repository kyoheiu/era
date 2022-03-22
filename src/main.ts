import { main } from "./clock.ts";
import { count } from "./count.ts";

const arg = Deno.args[0];
if (arg === "-c") {
  await count();
} else {
  await main();
}
