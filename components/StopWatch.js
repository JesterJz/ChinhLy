// import React, { useState, useRef, useCallback } from "react";
// import { StyleSheet, SafeAreaView, Text, View, Platform } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import Constants from "expo-constants";
// import Result from "./Result";
// import Control from "./Control";
// import { displayTime } from "./util";
// import MyHeader from "./Header";

// export default function StopWatch() {
//   const [time, setTime] = useState(0);
//   const [isRunning, setRunning] = useState(false);
//   const [results, setResults] = useState([]);
//   const timer = useRef(null);

//   // https://reactjs.org/docs/hooks-reference.html#usecallback
//   const handleLeftButtonPress = useCallback(() => {
//     console.log("handleLeftButtonPress", isRunning, time);
//     if (isRunning) {
//       setResults((previousResults) => [time, ...previousResults]);
//     } else {
//       setResults([]);
//       setTime(0);
//     }
//   }, [isRunning, time]);

//   const handleRightButtonPress = useCallback(() => {
//     if (!isRunning) {
//       const interval = setInterval(() => {
//         setTime((previousTime) => previousTime + 1);
//       }, 1);

//       timer.current = interval;
//     } else {
//       clearInterval(timer.current);
//     }

//     setRunning((previousState) => !previousState);
//   }, [isRunning]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <MyHeader />
//       <StatusBar style="light" />

//       <View style={styles.display}>
//         <Text style={styles.displayText}>{displayTime(time)}</Text>
//       </View>

//       <View style={styles.control}>
//         <Control
//           isRunning={isRunning}
//           handleLeftButtonPress={handleLeftButtonPress}
//           handleRightButtonPress={handleRightButtonPress}
//         />
//       </View>

//       <View style={styles.result}>
//         <Result results={results} />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//     paddingTop: Constants.statusBarHeight,
//   },
//   display: {
//     flex: 3 / 5,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   displayText: {
//     color: "#fff",
//     fontSize: 70,
//     fontWeight: "200",
//     fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : null,
//   },
//   control: {
//     height: 70,
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   result: { flex: 2 / 5 },
// });
import React, { useState } from "react";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from "react-native";
import { Button } from "react-native-paper";
const App = () => {
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [timerDuration, setTimerDuration] = useState(90000);
  const [resetTimer, setResetTimer] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [timeCurrent, setTimeCurrent] = useState();
  const [time1, setTime1] = useState();
  const getTime1 = (time) => {
    setTime1(time);
  };
  const getTime = (time1) => {
    setTimeCurrent(time1);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.sectionStyle}>
          <Stopwatch
            laps
            msecs
            start={isStopwatchStart}
            reset={resetStopwatch}
            options={options}
            getTime={(time) => {
              getTime1(time);
            }}
          />
          <TouchableHighlight
            onPress={() => {
              setIsStopwatchStart(!isStopwatchStart);
              setResetStopwatch(false);
            }}
          >
            <Text style={styles.buttonText}>
              {!isStopwatchStart ? "START" : "STOP"}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              setIsStopwatchStart(false);
              setResetStopwatch(true);
            }}
          >
            <Text style={styles.buttonText}>RESET</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              getTime(time1);
            }}
          >
            <Text style={styles.buttonText}>Laps</Text>
          </TouchableHighlight>
          <Text style={styles.buttonText}>{timeCurrent}</Text>
        </View>
        {/* <View style={styles.sectionStyle}> */}
        {/* <Timer
            totalDuration={timerDuration}
            msecs
            start={isTimerStart}
            reset={resetTimer}
            options={options}
            handleFinish={() => {
              alert("Custom Completion Function");
            }}
            getTime={(time) => {
              console.log(time);
            }}
          /> */}
        {/* <TouchableHighlight
            onPress={() => {
              setIsTimerStart(!isTimerStart);
              setResetTimer(false);
            }}
          >
            <Text style={styles.buttonText}>
              {!isTimerStart ? "START" : "STOP"}
            </Text>
          </TouchableHighlight> */}
        {/* <TouchableHighlight
            onPress={() => {
              setIsTimerStart(false);
              setResetTimer(true);
            }}
          >
            <Text style={styles.buttonText}>RESET</Text>
          </TouchableHighlight> */}
        {/* </View> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  sectionStyle: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    marginTop: 10,
  },
});

const options = {
  container: {
    backgroundColor: "#FF0000",
    padding: 5,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    color: "#FFF",
    marginLeft: 7,
  },
};

export default App;
