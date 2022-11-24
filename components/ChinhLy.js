import { displayTime } from "./util";
export const ChinhLy = (input) => {
  let result = [];
  let m = result.length;
  let K = 0;
  input.forEach((element) => {
    element = displayTime(element);
    result.push(element);
  });
  result.sort();
  aMax = Math.max(...result);
  aMin = Math.min(...result);
  K = console.log(aMax / aMin);
  if (K <= 1.3) {
    const sum = result.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    return sum;
  } else if (1.3 < K <= 2) {
    // lim a max  atb1  k (a max  a min )
    // lay het day so tru so lon nhat
    var cloneArray = result.slice();
    var i = aMax;
    cloneArray.splice(i, 1);
    const sum = cloneArray.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    atb1 = sum / (cloneArray.length - 1);

    // lim a min  atb 2  k (a max  a min )
  } else if (2 < K) {
    // chỉnh lý theo phương pháp độ lệch quân phương.
  }
  return result;
};
