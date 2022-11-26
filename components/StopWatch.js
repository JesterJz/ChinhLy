import React from "react";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";
import { displayTime } from "./util";
import { ChinhLy } from "./ChinhLy";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";

export default class StopWatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStopwatchStart: false,
      resetStopwatch: false,
      timeCurrent: "",
      timeLap: [],
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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", marginTop: 40 }}>
          <Button
            style={{ flex: 1, justifyContent: "flex-start" }}
            onPress={() => {}}
          >
            Export CSV
          </Button>
          <Button
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
            onPress={() => {
              ChinhLy(this.state.timeLap);
            }}
          >
            Bắt đầu chỉnh lý
          </Button>
        </View>
        <View style={styles.container}>
          <View style={styles.sectionStyle}>
            <Stopwatch
              laps
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
