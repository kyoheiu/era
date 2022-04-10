import {
  get_config,
  make_config,
  config_example,
  Config,
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

// 2D dimention.
interface Dimention<Type> {
  width(): Type;
  height(): Type;
}

// A point in 2D dimention.
interface Point<Type> {
  x(): Type;
  y(): Type;
}

// A origin point to render time.
class TimerPoint implements Point<number> {
  private start_x: number;
  private start_y: number;

  constructor(lines: number, columns: number) {
    this.start_x = Math.floor(saturating_sub(columns, TIME_WIDTH) / 2);
    this.start_y = Math.floor(saturating_sub(lines, TIME_HEIGHT) / 2);
  }

  x = (): number => {
    return this.start_x;
  };

  y = (): number => {
    return this.start_y;
  };
}

// A terminal window.
class TermWindow implements Dimention<number>, Point<number> {
  private lines: number;
  private columns: number;
  private point: Point<number>;

  constructor(lines: number, columns: number) {
    this.lines = lines;
    this.columns = columns;
    this.point = new TimerPoint(lines, columns);
  }

  width = (): number => {
    return this.columns;
  };

  height = (): number => {
    return this.lines;
  };

  x = (): number => {
    return this.point.x();
  };

  y = (): number => {
    return this.point.y();
  };

  // Create a terminal window for a console.
  static make_window = (rid: number): TermWindow => {
    const { columns, rows } = Deno.consoleSize(rid);

    return new TermWindow(rows, columns);
  };
}

class Rain {
  private buffer: string[] = [];

  raindrops = () => {
    return this.buffer;
  };

  // Update the internal rain buffer.
  fall = (grid: Dimention<number>, config: Config) => {
    this.buffer = call_rain(this.buffer, grid.width(), grid.height(), config);
  };
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

  const rid = Deno.stdout.rid;
  let term = TermWindow.make_window(rid);

  const rain = new Rain();

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

    rain.fall(term, config);

    Deno.stdout.writeSync(GOTO_ORIGIN); //Go to home position

    for (let i = 1; i < term.height(); i++) {
      // Must overwrite with spaces until line ends even if the line content's
      // length is shorter than the terminal line length because some old
      // contents may remain on a terminal grid when the terminal window size
      // is changed.
      if (i >= term.y() && i < term.y() + TIME_HEIGHT) {
        const s = (" ".repeat(saturating_sub(term.x(), 1)) + txt[i - term.y()])
          .padEnd(term.width(), " ")
          .slice(0, term.width());
        console.log("%c" + s, "color: " + config.timecolor);
      } else if (i < rain.raindrops().length) {
        const s = rain.raindrops()[i]
          .padEnd(term.width(), " ")
          .slice(0, term.width());
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
      const old_height = term.height();

      // Create a terminal window for the resized window.
      term = TermWindow.make_window(rid);

      // Fall new rain to keep previous raindrops surrounded the timer text.
      const n = Math.floor(saturating_sub(term.height(), old_height) / 2);
      [...Array(n)].forEach((_) => {
        rain.fall(term, config);
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
