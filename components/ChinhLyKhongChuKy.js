import { displayTime } from "./util";

export const ChinhLyKhongChuKy = (timeInput) => {
  let chuKy = [];

  timeInput.forEach((element) => {
    element = displayTime(element);
    chuKy.push(element);
  });
  chuKy.sort();
  const sum = chuKy.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  let result = sum / chuKy.length;
  return [result, chuKy];
};
