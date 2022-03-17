const ONE = [
  [0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0],
];

const TWO = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0],
  [1, 1, 1, 1, 1],
];

const THREE = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1],
];

const FOUR = [
  [1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
];

const FIVE = [
  [1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1],
];

const SIX = [
  [1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1],
];

const SEVEN = [
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
];

const EIGHT = [
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1],
];

const NINE = [
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1],
];

const ZERO = [
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1],
];

const COLON = [
  [0, 0, 0],
  [0, 2, 0],
  [0, 0, 0],
  [0, 2, 0],
  [0, 0, 0],
];

const TIME_WIDTH = 25;
const TIME_HEIGHT = 5;
const INTERVAL = 500;

const generate_string_array = (num: number[][]): string[] => {
  const result: string[] = [];
  num.forEach((nums) => {
    let line = "";
    nums.forEach((num) => {
      if (num == 1) {
        line = line + "█";
      } else if (num == 2) {
        line = line + "■";
      } else {
        line = line + " ";
      }
    });
    result.push(line);
  });
  return result;
};

const concat_nums = ([num1, num2, num3, num4]: number[][][]): number[][] => {
  const result: number[][] = [];
  for (let i = 0; i < 5; i++) {
    const first = [...num1[i], 0];
    const third = [...num3[i], 0];
    const line = first.concat(num2[i], COLON[i], third, num4[i]);
    result.push(line);
  }
  return result;
};

const make_time = (): number[][][] => {
  const time = new Date();
  const hour = time.getHours();
  const min = time.getMinutes();
  const first = Math.floor(hour / 10);
  const second = hour - first * 10;
  const third = Math.floor(min / 10);
  const fourth = min - third * 10;
  return [first, second, third, fourth].map((item) => num_to_arrays(item));
};

const num_to_arrays = (num: number): number[][] => {
  switch (num) {
    case 1:
      return ONE;
    case 2:
      return TWO;
    case 3:
      return THREE;
    case 4:
      return FOUR;
    case 5:
      return FIVE;
    case 6:
      return SIX;
    case 7:
      return SEVEN;
    case 8:
      return EIGHT;
    case 9:
      return NINE;
    default:
      return ZERO;
  }
};

const call_rain = (rain: string, column: number, row: number): string => {
  const lines = rain.split(/\n/).length + 1;
  if (lines < row) {
    let new_rain = "│".repeat(column);
    new_rain = new_rain + "\n" + rain;
    return new_rain;
  } else {
    return rain;
  }
};

const main = async () => {
  const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
  const start_x = Math.floor((columns - TIME_WIDTH) / 2) - 1;
  const start_y = Math.floor((rows - TIME_HEIGHT) / 2) - 1;
  Deno.setRaw(Deno.stdin.rid, true); //Enter raw mode
  const c = new Uint8Array(1);
  await Deno.stdout.write(new TextEncoder().encode("\x1b[?1049h")); //Enter new screen
  await Deno.stdout.write(new TextEncoder().encode("\x1b[?25l")); //Hide cursor
  for (let i = 0; i < 5; i++) {
    const txt = generate_string_array(concat_nums(make_time()));
    const move =
      "\x1b[" + (start_y + i).toString() + ";" + start_x.toString() + "f";
    await Deno.stdout.write(new TextEncoder().encode(move)); //Go to home position
    console.log(txt[i]);
  }
  let rain = "";
  const intervalID = setInterval(async () => {
    await Deno.stdout.write(new TextEncoder().encode("\x1b[1;1f")); //Go to home position
    rain = call_rain(rain, columns, rows);
    console.log(rain);
    for (let i = 0; i < 5; i++) {
      const txt = generate_string_array(concat_nums(make_time()));
      const move =
        "\x1b[" + (start_y + i).toString() + ";" + start_x.toString() + "f";
      await Deno.stdout.write(new TextEncoder().encode(move)); //Go to home position
      console.log(txt[i]);
    }
  }, INTERVAL);
  await Deno.stdin.read(c);
  clearInterval(intervalID);
  await Deno.stdout.write(new TextEncoder().encode("\x1b[?25h")); //Show cursor
  await Deno.stdout.write(new TextEncoder().encode("\x1b[?1049l")); //Restore main screen
  Deno.setRaw(Deno.stdin.rid, false); //Exit raw mode
  return;
};

await main();
