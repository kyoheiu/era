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

const print_number = (num: number[][]) => {
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
    result = result + line + "\n";
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
    num1[i].push(0);
    num3[i].push(0);
    const line = num1[i].concat(num2[i], COLON[i], num3[i], num4[i]);
    result.push(line);
  }
  return result;
};

console.log("\x1b[?1049h");
print_number(concat_nums(ONE, TWO, THREE, FOUR));
setTimeout(() => {
  console.log("\x1b[?1049l");
}, 500);
