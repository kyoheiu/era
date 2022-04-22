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

// If the result of subtraction is lesser than 0, then returns 0, otherwise
// return the result.
const saturating_sub = (lhs: number, rhs: number): number => {
  if (lhs - rhs < 0) {
    return 0;
  } else {
    return lhs - rhs;
  }
};

const TIME_WIDTH = 39;
const TIME_HEIGHT = 5;

const NEW_SCREEN = new TextEncoder().encode("\x1b[?1049h");
const HIDE_CURSOR = new TextEncoder().encode("\x1b[?25l");
const SHOW_CURSOR = new TextEncoder().encode("\x1b[?25h");
const RESTORE_SCREEN = new TextEncoder().encode("\x1b[?1049l");
const GOTO_ORIGIN = new TextEncoder().encode("\x1b[1;1f");

export const run = async (kind: Kind) => {
  const start = new Date().getTime();
  const config = await get_config(CONFIG_PATH).catch(async (_) => {
    await make_config();
    return config_example;
  });

  // Return a timer origin point in a window.
  const timer_point = (rows: number, columns: number) => {
    const start_x = Math.floor(saturating_sub(columns, TIME_WIDTH) / 2) + 1;
    const start_y = Math.floor(saturating_sub(rows, TIME_HEIGHT) / 2) + 1;

    return { start_x, start_y };
  };

  let { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
  let { start_x, start_y } = timer_point(rows, columns);

  let rain: string[] = [];

  const render = () => {
    const txt = (() => {
      if (kind === Kind.Clock) {
        return generate_string_array(concat_nums(make_time(new Date())));
      } else {
        const now = new Date().getTime();
        const diff = new Date(now - start);
        return generate_string_array(concat_nums(make_UTCtime(diff)));
      }
    })();

    rain = call_rain(rain, columns, rows, config);

    Deno.stdout.writeSync(GOTO_ORIGIN); //Go to home position

    // Must not contains the last row because a terminal spawns scroll and the
    // terminal window flickers when "console.log()", which prints newline, is
    // called on the row. It makes sense if the row expresses the ground.
    for (let i = 1; i < rows; i++) {
      // Must overwrite with spaces until line ends even if the line content's
      // length is shorter than the terminal line length because some old
      // contents may remain on a terminal grid when the terminal window size
      // is changed.
      if (i >= start_y && i < start_y + TIME_HEIGHT) {
        const s = (" ".repeat(saturating_sub(start_x, 1)) + txt[i - start_y])
          .padEnd(columns, " ")
          .slice(0, columns);
        console.log("%c" + s, "color: " + config.timecolor);
      } else if (i < rain.length) {
        const s = rain[i]
          .padEnd(columns, " ")
          .slice(0, columns);
        console.log("%c" + s, "color: " + config.raincolor);
      } else {
        console.log();
      }
    }
  };

  Deno.setRaw(Deno.stdin.rid, true); //Enter raw mode
  Deno.stdout.writeSync(NEW_SCREEN); //Enter new screen
  Deno.stdout.writeSync(HIDE_CURSOR); //Hide cursor

  // "Deno.addSignalListener" is not yet implemented on Windows at least until
  // Deno version 1.20.5.
  //
  // https://doc.deno.land/deno/stable/~/Deno.addSignalListener
  // https://github.com/denoland/deno/issues/9995
  if (Deno.build.os !== "windows") {
    Deno.addSignalListener("SIGWINCH", () => {
      const old_rows = rows;

      ({ columns, rows } = Deno.consoleSize(Deno.stdout.rid));
      ({ start_x, start_y } = timer_point(rows, columns));

      // Fall new rain to keep previous raindrops surrounded the timer text.
      const n = Math.floor(saturating_sub(rows, old_rows) / 2);
      [...Array(n)].forEach((_) => {
        rain = call_rain(rain, columns, rows, config);
      });

      // Render contents right after the window size is changed.
      render();
    });
  }

  const interval_rainID = setInterval(render, config.interval);

  const c = new Uint8Array(1);
  await Deno.stdin.read(c);
  clearInterval(interval_rainID);
  Deno.stdout.writeSync(SHOW_CURSOR); //Show cursor
  Deno.stdout.writeSync(RESTORE_SCREEN); //Restore main screen
  Deno.setRaw(Deno.stdin.rid, false); //Exit raw mode
  return;
};
