import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
  PermissionsAndroid,
  RefreshControl,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { ScrollView } from "react-native-gesture-handler";
import { checkInput } from "./CheckInput";
import { covertTime } from "./ConvertTime";
import * as generateData from "./GenerateData";
import { FormatTime, exportExcel } from "./index";

let camera = Camera;

export default function App({ navigation }) {
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [flashMode, setFlashMode] = React.useState("off");
  const [timeLapse, setTimeLapse] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [numObserveCurrent, setNumObserveCurrent] = React.useState(1);
  const [cameraType, setCameraType] = React.useState(
    Camera.Constants.Type.back
  );

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status === "granted") {
      // start the camera
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const __savePhoto = async (photo) => {
    console.log("photo", photo);
    const asset = await MediaLibrary.createAssetAsync(photo.uri);
    console.log("asset", asset);
    let dateTime = new Date(asset.modificationTime);
    console.log("asset", dateTime.getTime());
    let result = MediaLibrary.saveToLibraryAsync(asset.uri);

    console.log("result", result);
    setStartCamera(false);
    setPreviewVisible(false);
  };

  const __takePicture = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
      if (!camera) return;
      const photo = await camera.takePictureAsync({ exif: true });
      console.log(photo);
      setPreviewVisible(true);
      setCapturedImage(photo);
    } else {
      console.log("Camera permission denied");
    }
  };

  const CameraPreview = ({ photo, retakePicture, savePhoto }: any) => {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <ImageBackground
          source={{ uri: photo && photo.uri }}
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              padding: 20,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={__retakePicture}
                style={{
                  width: 130,
                  height: 40,
                  backgroundColor: "yellow",
                  alignItems: "center",
                  borderRadius: 9,
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    padding: 5,
                    fontSize: 20,
                  }}
                >
                  Re-take
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  __savePhoto(photo);
                }}
                style={{
                  width: 130,
                  height: 40,
                  backgroundColor: "yellow",
                  alignItems: "center",
                  borderRadius: 9,
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    padding: 5,
                    fontSize: 20,
                  }}
                >
                  Save Image
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };

  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };

  const __switchCamera = () => {
    if (cameraType === "back") {
      setCameraType("front");
    } else {
      setCameraType("back");
    }
  };

  const __chooseImage = () => {
    Alert.alert(
      "",
      "Chọn tuần tự từng ảnh bắt đầu và kết thực để có được thời gian cho 1 lần quan trắt",
      [
        {
          Enter: () => console.log("Cancel Pressed"),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => pickImage() },
      ]
    );
  };

  const pickImage = async () => {
    let ArrayImage = [];
    for (let index = 0; index < 2; index++) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsEditing: false,
        exif: true,
      });
      if (!result.canceled && result.assets[0].exif.DateTimeOriginal) {
        const date = result.assets[0].exif.DateTimeOriginal.split(
          " "
        )[0].replace(/:/g, "-");
        const time = result.assets[0].exif.DateTimeOriginal.split(" ")[1];
        const dateTime = new Date(date + " " + time + " GMT+0700");
        ArrayImage.push(dateTime);
      }
    }
    let total = ArrayImage[1].getTime() - ArrayImage[0].getTime();
    if (total < 0) {
      total = total * -1;
    }
    timeLapse.push(total / 1000);
    timeLapse.map((item) => {
      console.log("item", item);
    });
    setRefreshing(true);
    setRefreshing(false);
    return total / 1000;
  };

  const calculatesTimeLapse = () => {
    if (global.typeJob == 1) {
      if (timeLapse.length < global.soChuKyMin) {
        alert("Chưa đủ số chu kỳ. Số chu kỳ tối thiểu là " + global.soChuKyMin);
      } else {
        const [chuKy, Kod, arrayResult, resultQuanSat, sumArrayResult] =
          checkInput(timeLapse, global.numObserve);
        if (resultQuanSat != 0) {
          global.resultAllQuanSat = resultQuanSat + global.resultAllQuanSat;
          console.log("chuky export", chuKy);
          generateData.coChuKy(
            chuKy,
            Kod,
            arrayResult,
            sumArrayResult,
            resultQuanSat
          );
        } else {
          alert("Vui lòng thu thập thêm dữ liệu");
          const resultCovertTime = covertTime(arrayResult);
          setTimeLapse(resultCovertTime);
        }
        setNumObserveCurrent(numObserveCurrent + 1);
        setTimeLapse([]);
        if (numObserveCurrent == global.numObserve) {
          // ket thuc 1 phan tu
          let HaoPhi = global.numObserve / global.resultAllQuanSat;
          console.log("global.resultAllQuanSat", global.resultAllQuanSat);
          console.log("so lan quan sat", global.numObserve);
          console.log("HaoPhi", HaoPhi);
          global.dataExportCSV = Object.assign(
            {
              HaoPhi: HaoPhi.toFixed(2),
            },
            global.dataExportCSV
          );
          Alert.alert(
            "Kết quả",
            "Hao phí là của phần từ thứ " +
              global.numEleJobCurrent +
              " là: " +
              HaoPhi.toFixed(2) +
              " s",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Ok",
                onPress: () => {
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
                        onPress: () => exportExcel(global.dataExportCSV),
                      },
                    ]);
                    navigation.push("InputName");
                  } else {
                    global.numEleJobCurrent = global.numEleJobCurrent + 1;
                    global.estTime = 0;
                    global.nameEleJob = "";
                    global.numObserve = 0;
                    global.typeJob = 0;
                    navigation.push("InputTypeJob");
                  }
                },
              },
            ]
          );
          return HaoPhi;
        }
      }
    } else {
      if (timeLapse.length < global.numObserve) {
        alert("Chưa đủ số chu kỳ. Số chu kỳ tối thiểu là " + global.numObserve);
      } else {
        const [chuKy, Kod, arrayResult, resultQuanSat, sumArrayResult] =
          checkInput(timeLapse, global.numObserve);
        if (resultQuanSat != 0) {
          generateData.khongChuKy(resultQuanSat, arrayResult, sumArrayResult);
        }
        setNumObserveCurrent(numObserveCurrent + 1);
        setTimeLapse([]);
        let HaoPhi = resultQuanSat.toFixed(2);
        alert("Kết quả là : " + HaoPhi + " s");
        Alert.alert(
          "Kết quả",
          "Hao phí là của phần từ thứ " +
            global.numEleJobCurrent +
            " là: " +
            HaoPhi +
            " s",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Ok",
              onPress: () => {
                if (global.numEleJob == global.numEleJobCurrent) {
                  Alert.alert("Kết thúc", "Đã hoàn thành công việc", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Export CSV",
                      onPress: () => exportExcel(global.dataExportCSV),
                    },
                  ]);
                  navigation.push("InputName");
                } else {
                  global.numEleJobCurrent = global.numEleJobCurrent + 1;
                  global.nameEleJob = "";
                  global.numObserve = 0;
                  navigation.push("InputTypeJob");
                }
              },
            },
          ]
        );
        return HaoPhi;
      }
    }
  };
  const __checkTitle = () => {
    if (global.typeJob) {
      if (numObserveCurrent < global.numObserve) {
        return "Kết thúc quan sát lần: " + numObserveCurrent;
      } else if (numObserveCurrent == global.numObserve) {
        return "Bắt đầu chỉnh lý";
      }
    } else {
      return "Bắt đầu chỉnh lý";
    }
  };
  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={__savePhoto}
              retakePicture={__retakePicture}
            />
          ) : (
            <Camera
              type={cameraType}
              flashMode={flashMode}
              style={{ flex: 1 }}
              ref={(r) => {
                camera = r;
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  backgroundColor: "transparent",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: "5%",
                    top: "10%",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={__handleFlashMode}
                    style={{
                      backgroundColor: flashMode === "off" ? "#000" : "#fff",
                      borderRadius: 50,
                      height: 25,
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      ⚡️
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={__switchCamera}
                    style={{
                      marginTop: 20,
                      borderRadius: 50,
                      height: 25,
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      {cameraType === "front" ? "🤳" : "📷"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    flexDirection: "row",
                    flex: 1,
                    width: "100%",
                    padding: 20,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      alignSelf: "center",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={__takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: "#fff",
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
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
            onPress={__startCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
              bottom: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
                fontFamily: "Roboto",
              }}
            >
              Chụp ảnh
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={__chooseImage}
            style={{
              top: 20,
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
              Chọn hình ảnh
            </Text>
          </TouchableOpacity>
          <View style={styles.result}>
            <ScrollView
              refreshControl={<RefreshControl refreshing={refreshing} />}
            >
              <View style={styles.resultItem} />

              {timeLapse.map((item, index) => (
                <View key={index} style={styles.resultItem}>
                  <Text style={styles.resultItemText}>Lap {index + 1}</Text>
                  <Text style={styles.resultItemText}>{item} s</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <TouchableOpacity
            onPress={calculatesTimeLapse}
            style={{
              width: 130,
              top: 120,
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
              {__checkTitle()}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  result: {
    top: 80,
    width: "100%",
    flex: 3 / 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#313131",
    backgroundColor: "#fff",
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#313131",
    height: 50,
    paddingHorizontal: 15,
    top: 0,
  },
  resultItemText: { color: "#000" },
});
