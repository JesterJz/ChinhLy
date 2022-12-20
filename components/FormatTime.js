import { displayTime } from "./util";

export const FormatTime = (timeInput) => {
  let chuKy = [];
  console.log("arrayResult", timeInput);
  timeInput.forEach((element) => {
    element = displayTime(element);
    chuKy.push(element);
  });
  return chuKy;
};
