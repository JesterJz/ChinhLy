import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportExcel = async (dataExportCSV) => {
  console.log("dataExportCSV: " + JSON.stringify(dataExportCSV));
  let rows = [["Tên công việc", dataExportCSV.nameJob], ["Kết quả thu thập"]];
  for (const key in dataExportCSV.eleJob) {
    if (Object.hasOwnProperty.call(dataExportCSV.eleJob, key)) {
      const element = dataExportCSV.eleJob[key];
      const lengthBefore = element.QS[0].arrayBeforeChinhLy.length;
      rows.push(["Tên phần tử công việc", element.name]);
      rows.push(["Loại công việc", element.type]);
      const rowTitleTemp = [...Array(lengthBefore + 1).keys()].slice(1);
      rowTitleTemp.unshift("Lần quan sát", "Số chu kỳ");
      rows.push(rowTitleTemp);
      for (const keyQS in element.QS) {
        if (Object.hasOwnProperty.call(element.QS, keyQS)) {
          const elementQS = element.QS[keyQS];
          let rowTemp = [
            parseInt(keyQS) + 1,
            elementQS.arrayBeforeChinhLy.length,
            ...elementQS.arrayBeforeChinhLy,
          ];
          rows.push(rowTemp);
        }
      }
    }
  }
  rows.push(["Kết quả chỉnh lý"]);
  for (const key in dataExportCSV.eleJob) {
    if (Object.hasOwnProperty.call(dataExportCSV.eleJob, key)) {
      const element = dataExportCSV.eleJob[key];
      const lengthBefore = element.QS[0].arrayBeforeChinhLy.length;
      rows.push(["Tên phần tử công việc", element.name]);
      rows.push(["Loại công việc", element.type]);
      const rowTitleTemp = [...Array(lengthBefore + 1).keys()].slice(1);
      rowTitleTemp.unshift("Lần quan sát", "Số chu kỳ", "Kod", "Hao phí");
      rows.push(rowTitleTemp);
      for (const keyQS in element.QS) {
        if (Object.hasOwnProperty.call(element.QS, keyQS)) {
          const elementQS = element.QS[keyQS];
          let rowTemp = [
            parseInt(keyQS) + 1,
            elementQS.soChuky,
            elementQS.Kod,
            elementQS.resultQuanSat,
            ...elementQS.arrayAfterChinhLy,
          ];
          rows.push(rowTemp);
        }
      }
    }
  }
  rows.push(["Kết quả hao phí", dataExportCSV.HaoPhi]);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates", true);
  worksheet["!cols"] = [{ wch: 15 }];
  if (!worksheet["!merges"]) worksheet["!merges"] = [];
  worksheet["!merges"].push(XLSX.utils.decode_range("A2:E2"));
  const base64 = XLSX.write(workbook, {
    type: "base64",
    bookType: "xlsx",
  });
  const fileName = "myExcel.xlsx";
  const filePath = FileSystem.cacheDirectory + fileName;
  console.log("filePath: " + filePath);
  FileSystem.writeAsStringAsync(filePath, base64, {
    encoding: FileSystem.EncodingType.Base64,
  }).then(() => {
    Sharing.shareAsync(filePath);
  });
  return;
};
