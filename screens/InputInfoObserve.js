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

  global.estTime = estTime;
  global.numObserve = numObserve;
  estTime <= 1
    ? (global.soChuKyMin = 21)
    : estTime <= 2
    ? (global.soChuKyMin = 15)
    : estTime <= 5
    ? (global.soChuKyMin = 10)
    : estTime <= 10
    ? (global.soChuKyMin = 7)
    : (global.soChuKyMin = 5);

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Thông tin của lần quan sát</Header>
      <TextInput
        label="Số  lần quan sát"
        returnKeyType="next"
        onChangeText={onChangeNumObserve}
        value={numObserve}
        autoCapitalize="none"
      />
      <TextInput
        label="Thời gian ước tính một chu kỳ"
        returnKeyType="next"
        onChangeText={onChangeEst}
        value={estTime}
        autoCapitalize="none"
      />
      <Button mode="contained" onPress={() => navigation.navigate("Tabs")}>
        {/* <Button mode="contained" onPress={Tabs()}> */}
        Bắt đầu
      </Button>
    </Background>
  );
}
