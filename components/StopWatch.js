import React, { useState } from "react";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";
import { displayTime } from "./util";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
const StopWatch = () => {
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [timeCurrent, setTimeCurrent] = useState();
  const [timeLap, setTimeLap] = useState([]);

  const getTimeCurrent = (time) => {
    setTimeCurrent(time);
  };
  const getTimeLap = (t) => {
    setTimeLap((previousResults) => [t, ...previousResults]);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.sectionStyle}>
          <Stopwatch
            laps
            start={isStopwatchStart}
            reset={resetStopwatch}
            options={options}
            getTime={(time) => {
              getTimeCurrent(time);
            }}
          />
        </View>
        <View style={styles.control}>
          <TouchableOpacity
            style={[
              styles.controlButtonBorder,
              { backgroundColor: isStopwatchStart ? "#363636" : "#000" },
            ]}
            onPress={() => {
              getTimeLap(timeCurrent);
              setIsStopwatchStart(!isStopwatchStart);
              setResetStopwatch(true);
            }}
          >
            <View style={styles.controlButton}>
              <Text style={{ color: isStopwatchStart ? "#fff" : "#9d9ca2" }}>
                {!isStopwatchStart ? "Reset" : "Lap"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controlButtonBorder,
              { backgroundColor: isStopwatchStart ? "#340e0d" : "#0a2a12" },
            ]}
            onPress={() => {
              setResetStopwatch(false);
              setIsStopwatchStart(!isStopwatchStart);
            }}
          >
            <View style={styles.controlButton}>
              <Text style={{ color: isStopwatchStart ? "#ea4c49" : "#37d05c" }}>
                {!isStopwatchStart ? "Start" : "Stop"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.result}>
          <ScrollView>
            <View style={styles.resultItem} />

            {timeLap.map((item, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultItemText}>
                  Lap {timeLap.length - index}
                </Text>
                <Text style={styles.resultItemText}>{displayTime(item)} s</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
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
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
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
    fontSize: 70,
    fontWeight: "200",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : null,
  },
};
export default StopWatch;
