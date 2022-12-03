import React from "react";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";
import { displayTime } from "./util";
import { ChinhLy } from "./ChinhLy";
import { ChinhLyKhongChuKy } from "./ChinhLyKhongChuKy";
import { ExportToCsv } from "export-to-csv";
// import { withNavigationFocus } from "@react-navigation";

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
  chinhLy(timeLap, timeCurrent, soLanQuanSat) {
    if (global.typeJob == 1) {
      if (timeLap.length < global.soChuKyMin) {
        alert("Chưa đủ số chu kỳ. Số chu kỳ tối thiểu là " + global.soChuKyMin);
      } else {
        let [resultQuanSat, arrayResult, sumArrayResult] = ChinhLy(
          this.state.timeLap,
          global.numEleJob,
          global.numObserve
        );
        console.log("arrayResult", arrayResult, sumArrayResult, resultQuanSat);
        if (resultQuanSat != 0) {
          global.resultAllQuanSat = resultQuanSat + global.resultAllQuanSat;
          global.dataExportCSV = Object.assign(
            {
              name: "Quan sat lan " + this.state.numObserveCurrent,
              arrayResult: arrayResult,
              sumArrayResult: sumArrayResult,
            },
            global.dataExportCSV
          );
        } else {
          alert("Vui lòng thu thập thêm dữ liệu");
          //convert laij thanh giay
          resultCovertTime = this.covertTime(arrayResult);
          this.setState({
            timeLap: resultCovertTime,
          });
        }
        console.log("global.numObserve", global.numObserve, timeCurrent);
        this.setState({
          numObserveCurrent: this.state.numObserveCurrent + 1,
          timeLap: [],
        });
        global.numEleJobCurrent += 1;
        console.log("global.dataExportCSV", global.dataExportCSV);
        if (timeCurrent == global.numObserve) {
          let HaoPhi = soLanQuanSat / global.resultAllQuanSat;
          console.log("global.resultAllQuanSat", global.resultAllQuanSat);
          console.log("so lan quan sat", soLanQuanSat);
          console.log("HaoPhi", HaoPhi);
          alert("Hao phí là: " + HaoPhi.toFixed(2) + " s");
          global.estTime = 0;
          global.numEleJobCurrent = global.numEleJobCurrent + 1;
          global.nameEleJob = "";
          global.numObserve = 0;
          this.props.navigation.push("InputTypeJob");
          return HaoPhi;
          // this.exportCSV(global.dataExportCSV);
        }
      }
    } else {
      if (timeLap.length < soLanQuanSat) {
        alert("Chưa đủ số chu kỳ. Số chu kỳ tối thiểu là " + soLanQuanSat);
      } else {
        let [resultQuanSat, arrayResult] = ChinhLyKhongChuKy(timeLap);

        global.dataExportCSV = Object.assign(
          {
            name: global.nameEleJob,
            arrayResult: arrayResult,
            sumArrayResult: "",
            resultQuanSat: resultQuanSat,
          },
          global.dataExportCSV
        );

        let HaoPhi = resultQuanSat.toFixed(2);
        alert("Kết quả là : " + HaoPhi + " s");
        // this.exportCSV(global.dataExportCSV);

        this.setState({
          numObserveCurrent: this.state.numObserveCurrent + 1,
          timeLap: [],
        });
        global.numEleJobCurrent = global.numEleJobCurrent + 1;
        global.nameEleJob = "";
        global.numObserve = 0;
        this.props.navigation.push("InputTypeJob");

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
