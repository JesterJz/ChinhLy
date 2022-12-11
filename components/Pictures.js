import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Camera } from "expo-camera";
export default class Pictures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startCamera: false,
      camera: Camera,
    };
  }
  // let camera: Camera
  // async componentDidMount() {
  // setStartCamera = async () => {
  //   const { status } = await Camera.requestCameraPermissionsAsync();
  //   if (status === "granted") {
  //     // start the camera
  //     this.setState({
  //       startCamera: true,
  //     });
  //   } else {
  //     Alert.alert("Access denied");
  //   }
  // };
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    return this.state.startCamera ? (
      <View style={{ flex: 1, width: "100%" }}>
        <Camera
          style={{ flex: 1, width: "100%" }}
          type={Camera.Constants.Type.back}
          ref={(ref) => {
            this.camera = ref;
          }}
        >
          <View style={styles.buttonContainer}>
            <Text>dfasdf</Text>
          </View>
        </Camera>
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={this.requestCameraPermission}
          style={{
            width: 130,
            borderRadius: 4,
            backgroundColor: "#14274e",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 40,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Take picture
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
