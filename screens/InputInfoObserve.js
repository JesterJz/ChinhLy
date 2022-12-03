import { View, Text } from "react-native";
import React, { useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";

export default function InputInfoObserve({ navigation }) {
  const [estTime, onChangeEst] = useState(0);
  const [numObserve, onChangeNumObserve] = useState(0);
  const [numObserveError, onChangeNumObserveError] = useState("");
  const [estTimeError, onChangeEstTimeError] = useState("");

  global.numObserve = numObserve;

  const CheckChukyMin = () => {
    if (global.typeJob) {
      global.estTime = estTime;
      estTime == 0
        ? ""
        : estTime <= 1
        ? (global.soChuKyMin = 21)
        : estTime <= 2
        ? (global.soChuKyMin = 15)
        : estTime <= 5
        ? (global.soChuKyMin = 10)
        : estTime <= 10
        ? (global.soChuKyMin = 7)
        : (global.soChuKyMin = 5);
      return (
        <TextInput
          label="Thời gian ước tính một chu kỳ"
          returnKeyType="next"
          onChangeText={onChangeEst}
          value={estTime}
          autoCapitalize="none"
          error={estTimeError}
          errorText={estTimeError}
          keyboardType="numeric"
        />
      );
    } else {
      return "";
    }
  };
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Thông tin quan sát</Header>
      <TextInput
        label="Số  lần quan sát"
        returnKeyType="next"
        onChangeText={onChangeNumObserve}
        value={numObserve}
        autoCapitalize="none"
        error={numObserveError}
        errorText={numObserveError}
        keyboardType="numeric"
      />
      <CheckChukyMin />
      <Button
        mode="contained"
        onPress={() => {
          numObserve === 0
            ? onChangeNumObserveError("Hãy nhập số lần quan sát")
            : onChangeNumObserveError("");
          global.typeJob && estTime === 0
            ? onChangeEstTimeError("Hãy nhập thời gian ước tính một chu kỳ")
            : onChangeEstTimeError("");
          if (numObserve !== 0) {
            navigation.navigate("Tabs");
          }
        }}
      >
        Bắt đầu
      </Button>
    </Background>
  );
}
