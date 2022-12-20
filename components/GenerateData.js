export function coChuKy(
  chuKy,
  Kod,
  arrayResult,
  sumArrayResult,
  resultQuanSat
) {
  global.dataExportCSV.eleJob[global.numEleJobCurrent - 1].QS.push({
    soChuky: chuKy.length,
    Kod: Kod.toFixed(2),
    arrayBeforeChinhLy: chuKy,
    arrayAfterChinhLy: arrayResult,
    sumArrayAfterResult: sumArrayResult,
    resultQuanSat: resultQuanSat.toFixed(2),
  });
}
export function khongChuKy(resultQuanSat, arrayResult, sumArrayResult) {
  global.dataExportCSV.eleJob[global.numEleJobCurrent - 1].QS.push({
    soChuky: arrayResult.length,
    Kod: null,
    arrayBeforeChinhLy: arrayResult,
    arrayAfterChinhLy: arrayResult,
    sumArrayAfterResult: sumArrayResult,
    resultQuanSat: resultQuanSat.toFixed(2),
  });
}
