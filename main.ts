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

const concat_nums = (
  num1: number[][],
  num2: number[][],
  num3: number[][],
  num4: number[][]
): number[][] => {
  let result: number[][] = [];
  for (let i = 0; i < 5; i++) {
    const first = [...num1[i], 0];
    const third = [...num3[i], 0];
    const line = first.concat(num2[i], COLON[i], third, num4[i]);
    result.push(line);
  }
  return result;
};

const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
const start_x = Math.floor((columns - TIME_WIDTH) / 2) - 1;
const start_y = Math.floor((rows - TIME_HEIGHT) / 2) - 1;
// const cursor_move = "\x1b[1;" + start_y.toString() + "h";
// console.log("\x1b[?1049h");
// console.log(cursor_move);
print_number(concat_nums(TWO, TWO, THREE, FOUR), start_x);
// setTimeout(() => {
//   console.log("\x1b[?1049l");
// }, 1000);
