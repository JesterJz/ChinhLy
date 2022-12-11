import React from "react";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";
import { displayTime } from "./util";
import { ChinhLy } from "./ChinhLy";
import { ChinhLyKhongChuKy } from "./ChinhLyKhongChuKy";
import { ExportToCsv } from "export-to-csv";
import { CSVLink, CSVDownload } from "react-csv";
import { PermissionsAndroid } from "react-native";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
} from "react-native-paper";
import { Asset } from "expo-asset";

export default class StopWatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStopwatchStart: false,
      resetStopwatch: false,
      timeCurrent: "",
      timeLap: [],
      timeLapTemp: {},
      timeLapAll: {},
      numObserveCurrent: 1,
    };
  }
  toggle(time) {
    this.state.timeCurrent = time;
  }

  getTimeLap(t) {
    this.setState((prevState) => ({
      timeLap: [...prevState.timeLap, t],
    }));
  }
  generateDataCoChuKy(chuKy, Kod, arrayResult, sumArrayResult, resultQuanSat) {
    global.dataExportCSV.eleJob[global.numEleJobCurrent - 1].QS.push({
      soChuky: chuKy.length,
      Kod: Kod.toFixed(2),
      arrayBeforeChinhLy: chuKy,
      arrayAfterChinhLy: arrayResult,
      sumArrayAfterResult: sumArrayResult,
      resultQuanSat: resultQuanSat.toFixed(2),
    });
  }
  generateDataKhongChuKy(resultQuanSat, arrayResult, sumArrayResult) {
    global.dataExportCSV.eleJob[global.numEleJobCurrent - 1].QS.push({
      soChuky: arrayResult.length,
      Kod: null,
      arrayBeforeChinhLy: arrayResult,
      arrayAfterChinhLy: arrayResult,
      sumArrayAfterResult: sumArrayResult,
      resultQuanSat: resultQuanSat.toFixed(2),
    });
  }
  chinhLy(timeLap, timeCurrent, soLanQuanSat) {
    //co chu ky
    if (global.typeJob == 1) {
      if (timeLap.length < global.soChuKyMin) {
        alert("Chưa đủ số chu kỳ. Số chu kỳ tối thiểu là " + global.soChuKyMin);
      } else {
        let [chuKy, Kod, arrayResult, resultQuanSat, sumArrayResult] = ChinhLy(
          this.state.timeLap,
          global.numEleJob,
          global.numObserve
        );
        if (resultQuanSat != 0) {
          global.resultAllQuanSat = resultQuanSat + global.resultAllQuanSat;
          this.generateDataCoChuKy(
            chuKy,
            Kod,
            arrayResult,
            sumArrayResult,
            resultQuanSat
          );
        } else {
          alert("Vui lòng thu thập thêm dữ liệu");
          resultCovertTime = this.covertTime(arrayResult);
          this.setState({
            timeLap: resultCovertTime,
          });
        }
        this.setState({
          numObserveCurrent: this.state.numObserveCurrent + 1,
          timeLap: [],
        });
        if (timeCurrent == global.numObserve) {
          // ket thuc 1 phan tu
          let HaoPhi = soLanQuanSat / global.resultAllQuanSat;
          console.log("global.resultAllQuanSat", global.resultAllQuanSat);
          console.log("so lan quan sat", soLanQuanSat);
          console.log("HaoPhi", HaoPhi);
          alert(
            "Hao phí là của phần từ thứ " +
              global.numEleJobCurrent +
              "là: " +
              HaoPhi.toFixed(2) +
              " s"
          );
          global.dataExportCSV = Object.assign(
            {
              HaoPhi: HaoPhi.toFixed(2),
            },
            global.dataExportCSV
          );
          if (global.numEleJob == global.numEleJobCurrent) {
            //ket thuc cong viec
            Alert.alert("Kết thúc", "Đã hoàn thành công việc", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Export CSV",
                onPress: () => this.ExportToCsv(global.dataExportCSV),
              },
            ]);
            this.props.navigation.push("InputName");
          } else {
            global.estTime = 0;
            global.numEleJobCurrent = global.numEleJobCurrent + 1;
            global.nameEleJob = "";
            global.numObserve = 0;
            this.props.navigation.push("InputTypeJob");
          }
          return HaoPhi;
        }
      }
      //khong chu ky
    } else {
      if (timeLap.length < soLanQuanSat) {
        alert("Chưa đủ số chu kỳ. Số chu kỳ tối thiểu là " + soLanQuanSat);
      } else {
        let [resultQuanSat, arrayResult, sumArrayResult] =
          ChinhLyKhongChuKy(timeLap);
        if (resultQuanSat != 0) {
          this.generateDataKhongChuKy(
            resultQuanSat,
            arrayResult,
            sumArrayResult
          );
        }
        let HaoPhi = resultQuanSat.toFixed(2);
        alert("Kết quả là : " + HaoPhi + " s");

        this.setState({
          numObserveCurrent: this.state.numObserveCurrent + 1,
          timeLap: [],
        });
        if (global.numEleJob == global.numEleJobCurrent) {
          Alert.alert("Kết thúc", "Đã hoàn thành công việc", [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Export CSV",
              onPress: () => this.ExportToCsv(global.dataExportCSV),
            },
          ]);
          this.props.navigation.push("InputName");
        } else {
          global.numEleJobCurrent = global.numEleJobCurrent + 1;
          global.nameEleJob = "";
          global.numObserve = 0;
          this.props.navigation.push("InputTypeJob");
        }
        return HaoPhi;
      }
    }
  }
  checkTitle() {
    if (global.typeJob) {
      if (this.state.numObserveCurrent < global.numObserve) {
        return "Kết thúc quan sát lần: " + this.state.numObserveCurrent;
      } else if (this.state.numObserveCurrent == global.numObserve) {
        return "Bắt đầu chỉnh lý";
      }
    } else {
      return "Bắt đầu chỉnh lý";
    }
  }
  covertTime(arrayResult) {
    for (const key in arrayResult) {
      if (Object.hasOwnProperty.call(arrayResult, key)) {
        const element = arrayResult[key];
        let time = new Date(element * 1000).toISOString().slice(11, 23);
        arrayResult[key] = time;
      }
    }
    return arrayResult;
  }
  // requestCameraPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: "Cool Photo App Camera Permission",
  //         message:
  //           "Cool Photo App needs access to your camera " +
  //           "so you can take awesome pictures.",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK",
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("You can use the camera");
  //     } else {
  //       console.log("Camera permission denied");
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };
  ExportToCsv = async (dataExportCSV) => {
    const permissionWriteExternalStorage = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    };
    if (Platform.OS === "android") {
      const permissionGranted = await permissionWriteExternalStorage();
      if (permissionGranted) {
        /* filter for the Presidents */
        // const prez = dataExportCSV.filter((row) =>
        //   row.terms.some((term) => term.type === "prez")
        // );
        //     /* flatten objects */
        //     const rows = prez.map((row) => ({
        //       name: row.name.first + " " + row.name.last,
        //       birthday: row.bio.birthday,
        //     }));
        let rows = [["Tên công việc", global.nameJob], ["Kết quả thu thập"]];
        rows.push(
          ["Tên phần tử công việc", dataExportCSV.eleJob[0].name],
          ["Loại công việc", dataExportCSV.eleJob[0].type]
        );
        const rowTitleTemp = [
          ...Array(
            dataExportCSV.eleJob[0].QS[0].arrayBeforeChinhLy.length
          ).keys(),
        ].slice(1);
        rowTitleTemp.unshift("Lần quan sát", "Số chu kỳ");
        rows.push(rowTitleTemp);

        // element.arrayBeforeChinhLy.forEach((key) => {
        //   rowTitleTemp.push(key);
        // });
        // rows.push(rowTitleTemp);
        // for (const key in element.arrayBeforeChinhLy) {
        //   let rowTemp = [key, elementTemp.length];
        //   elementTemp.forEach((key) => {
        //     rowTemp.push(key);
        //   });
        //   rows.push(rowTemp);
        // }

        //       // if (Object.hasOwnProperty.call(dataExportCSV, key)) {
        //       //   const element = dataExportCSV[key];
        //       //   rows.push([element.name, element.result]);
        //       // }
        //     }
        const worksheet = XLSX.utils.aoa_to_sheet(rows);
        //     //     console.log(typeof rows);
        //     //     /* generate worksheet and workbook */
        //     //     const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
        //     //     /* fix headers */
        //     // XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], {
        //     //   origin: "A1",
        //     // });
        /* calculate column width */
        const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
        worksheet["!cols"] = [{ wch: max_width }];
        if (!worksheet["!merges"]) worksheet["!merges"] = [];
        worksheet["!merges"].push(XLSX.utils.decode_range("A2:E2"));
        const base64 = XLSX.write(workbook, { type: "base64" });
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          return;
        }
        try {
          await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            "myExcel.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
            .then(async (uri) => {
              await FileSystem.writeAsStringAsync(uri, base64, {
                encoding: FileSystem.EncodingType.Base64,
              }).then(() => {
                alert("File Saved Successfully!");
              });
            })
            .catch((e) => {
              console.log(e);
            });
        } catch (e) {
          throw new Error(e);
        }
      }
      return;
    }
  };

  render() {
    global.resultAllQuanSat = 0;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Button
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
            onPress={() => {
              this.chinhLy(
                this.state.timeLap,
                this.state.numObserveCurrent,
                global.numObserve
              );
              // this.ExportToCsv(global.dataExportCSV);
            }}
          >
            {this.checkTitle()}
          </Button>
        </View>
        <View style={styles.container}>
          <View style={styles.sectionStyle}>
            <Stopwatch
              laps
              msecs
              start={this.state.isStopwatchStart}
              reset={this.state.resetStopwatch}
              options={options}
              getTime={(time) => this.toggle(time)}
            />
          </View>
          <View style={styles.control}>
            <TouchableOpacity
              style={[
                styles.controlButtonBorder,
                {
                  backgroundColor: this.state.isStopwatchStart
                    ? "#363636"
                    : "#000",
                },
              ]}
              onPress={() => {
                this.getTimeLap(this.state.timeCurrent);
                this.setState({
                  isStopwatchStart: !this.state.isStopwatchStart,
                  resetStopwatch: true,
                });
              }}
            >
              <View style={styles.controlButton}>
                <Text
                  style={{
                    color: this.state.isStopwatchStart ? "#fff" : "#9d9ca2",
                  }}
                >
                  {!this.state.isStopwatchStart ? "Reset" : "Lap"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.controlButtonBorder,
                {
                  backgroundColor: this.state.isStopwatchStart
                    ? "#340e0d"
                    : "#0a2a12",
                },
              ]}
              onPress={() => {
                this.setState({
                  isStopwatchStart: !this.state.isStopwatchStart,
                  resetStopwatch: false,
                });
              }}
            >
              <View style={styles.controlButton}>
                <Text
                  style={{
                    color: this.state.isStopwatchStart ? "#ea4c49" : "#37d05c",
                  }}
                >
                  {!this.state.isStopwatchStart ? "Start" : "Stop"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.result}>
            <ScrollView>
              <View style={styles.resultItem} />

              {this.state.timeLap.map((item, index) => (
                <View key={index} style={styles.resultItem}>
                  <Text style={styles.resultItemText}>Lap {index + 1}</Text>
                  <Text style={styles.resultItemText}>
                    {displayTime(item)} s
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const CENTER = {
  justifyContent: "center",
  alignItems: "center",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  sectionStyle: {
    flex: 3 / 5,
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...CENTER,
    fontSize: 20,
    marginTop: 10,
  },
  display: {
    flex: 3 / 5,
    justifyContent: "center",
    alignItems: "center",
  },
  control: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  controlButtonBorder: {
    ...CENTER,
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  controlButton: {
    ...CENTER,
    width: 95,
    height: 95,
    borderRadius: 95,
    borderColor: "#000",
    borderWidth: 1,
  },
  result: { flex: 2 / 5 },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#313131",
    height: 50,
    paddingHorizontal: 15,
  },
  resultItemText: { color: "#000" },
});

const options = {
  container: {
    flex: 3 / 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#000",
    fontSize: 40,
    fontWeight: "200",
  },
};
