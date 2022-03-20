import {
  get_config,
  make_config,
  config_example,
  CONFIG_PATH,
} from "./config.ts";
import {
  generate_string_array,
  call_rain,
  make_time,
  concat_nums,
} from "./time.ts";

const TIME_WIDTH = 39;
const TIME_HEIGHT = 5;

const main = async () => {
  const config = await get_config(CONFIG_PATH).catch(async (_) => {
    await make_config();
    return config_example;
  });

  const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
  const start_x = Math.floor((columns - TIME_WIDTH) / 2);
  const start_y = Math.floor((rows - TIME_HEIGHT) / 2);

  Deno.setRaw(Deno.stdin.rid, true); //Enter raw mode
  const c = new Uint8Array(1);

  await Deno.stdout.write(new TextEncoder().encode("\x1b[?1049h")); //Enter new screen
  await Deno.stdout.write(new TextEncoder().encode("\x1b[?25l")); //Hide cursor

  let rain: string[] = [];
  const interval_rainID = setInterval(async () => {
    await Deno.stdout.write(new TextEncoder().encode("\x1b[1;1f")); //Go to home position
    rain = call_rain(rain, columns, rows, config);
    for (let i = 1; i < rain.length; i++) {
      if (i >= start_y && i < start_y + 5) {
        continue;
      }
      const move = "\x1b[" + i.toString() + ";" + "1f";
      await Deno.stdout.write(new TextEncoder().encode(move)); //Go to each rain-start position
      console.log("%c" + rain[i], "color: #e0b0ff");
    }
    for (let i = 0; i < 5; i++) {
      const txt = generate_string_array(concat_nums(make_time()));
      const move =
        "\x1b[" + (start_y + i).toString() + ";" + start_x.toString() + "f";
      await Deno.stdout.write(new TextEncoder().encode(move)); //Go to time-start position
      console.log(txt[i]);
    }
  }, config.interval);

  await Deno.stdin.read(c);
  clearInterval(interval_rainID);
  await Deno.stdout.write(new TextEncoder().encode("\x1b[?25h")); //Show cursor
  await Deno.stdout.write(new TextEncoder().encode("\x1b[?1049l")); //Restore main screen
  Deno.setRaw(Deno.stdin.rid, false); //Exit raw mode
  return;
};

await main();
