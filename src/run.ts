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
  make_UTCtime,
  concat_nums,
} from "./time.ts";

export enum Kind {
  Clock,
  Counter,
}

const TIME_WIDTH = 39;
const TIME_HEIGHT = 5;

const NEW_SCREEN = new TextEncoder().encode("\x1b[?1049h");
const HIDE_CURSOR = new TextEncoder().encode("\x1b[?25l");
const SHOW_CURSOR = new TextEncoder().encode("\x1b[?25h");
const RESTORE_SCREEN = new TextEncoder().encode("\x1b[?1049l");

export const run = async (kind: Kind) => {
  const start = new Date().getTime();
  const config = await get_config(CONFIG_PATH).catch(async (_) => {
    await make_config();
    return config_example;
  });

  const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
  const start_x = Math.floor((columns - TIME_WIDTH) / 2);
  const start_y = Math.floor((rows - TIME_HEIGHT) / 2);

  Deno.setRaw(Deno.stdin.rid, true); //Enter raw mode
  const c = new Uint8Array(1);

  await Deno.stdout.write(NEW_SCREEN); //Enter new screen
  await Deno.stdout.write(HIDE_CURSOR); //Hide cursor

  let rain: string[] = [];
  let txt: string[] = [];
  const interval_rainID = setInterval(async () => {
    if (kind === Kind.Clock) {
      txt = generate_string_array(concat_nums(make_time(new Date())));
    } else {
      const now = new Date().getTime();
      const diff = new Date(now - start);
      txt = generate_string_array(concat_nums(make_UTCtime(diff)));
    }
    await Deno.stdout.write(new TextEncoder().encode("\x1b[1;1f")); //Go to home position
    rain = call_rain(rain, columns, rows, config);
    for (let i = 1; i < rain.length; i++) {
      if (i >= start_y && i < start_y + 5) {
        continue;
      }
      const move = "\x1b[" + i.toString() + ";" + "1f";
      await Deno.stdout.write(new TextEncoder().encode(move)); //Go to each rain-start position
      console.log("%c" + rain[i], "color: " + config.raincolor);
    }
    for (let i = 0; i < 5; i++) {
      const move =
        "\x1b[" + (start_y + i).toString() + ";" + start_x.toString() + "f";
      await Deno.stdout.write(new TextEncoder().encode(move)); //Go to time-start position
      console.log("%c" + txt[i], "color: " + config.timecolor);
    }
  }, config.interval);

  await Deno.stdin.read(c);
  clearInterval(interval_rainID);
  await Deno.stdout.write(SHOW_CURSOR); //Show cursor
  await Deno.stdout.write(RESTORE_SCREEN); //Restore main screen
  Deno.setRaw(Deno.stdin.rid, false); //Exit raw mode
  return;
};
