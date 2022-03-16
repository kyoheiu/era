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

const print_number = (num: number[][], indent: number) => {
  let result = "";
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
    result = result + " ".repeat(indent) + line + "\n";
  });
  console.log(result);
};

const concat_nums = ([num1, num2, num3, num4]: number[][][]): number[][] => {
  let result: number[][] = [];
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

const main = async () => {
  const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
  const start_x = Math.floor((columns - TIME_WIDTH) / 2) - 1;
  const start_y = Math.floor((rows - TIME_HEIGHT) / 2) - 1;
  Deno.setRaw(Deno.stdin.rid, true);
  const c = new Uint8Array(1);
  console.log("\x1b[?1049h"); //Enter new screen
  console.log("\x1b[?25l"); //Hide cursor
  console.log("\x1b[1;1f"); //Go to home position
  for (let i = 0; i < start_y; i++) {
    console.log();
  }
  print_number(concat_nums(make_time()), start_x);
  const intervalID = setInterval(() => {
    console.log("\x1b[1;1f"); //Go to home position
    for (let i = 0; i < start_y; i++) {
      console.log();
    }
    print_number(concat_nums(make_time()), start_x);
  }, 5000);
  await Deno.stdin.read(c);
  clearInterval(intervalID);
  console.log("\x1b[?25h"); //Show cursor
  console.log("\x1b[?1049l");
  Deno.setRaw(Deno.stdin.rid, false);
  return;
};

await main();
