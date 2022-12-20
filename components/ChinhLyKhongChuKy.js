import { displayTime } from "./util";

export const ChinhLyKhongChuKy = (timeInput) => {
  timeInput.sort();
  const sum = timeInput.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  let result = sum / timeInput.length;
  return [result, timeInput, sum];
};
