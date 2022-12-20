import { ChinhLy } from "./ChinhLy";
import { ChinhLyKhongChuKy } from "./ChinhLyKhongChuKy";

export function checkInput(timeLap, soLanQuanSat) {
  //co chu ky
  if (global.typeJob == 1) {
    const [chuKy, Kod, arrayResult, resultQuanSat, sumArrayResult] = ChinhLy(
      timeLap,
      global.numEleJob,
      global.numObserve
    );
    return [chuKy, Kod, arrayResult, resultQuanSat, sumArrayResult];
    //khong chu ky
  } else {
    const [resultQuanSat, arrayResult, sumArrayResult] =
      ChinhLyKhongChuKy(timeLap);
    return [0, 0, arrayResult, resultQuanSat, sumArrayResult];
  }
}
