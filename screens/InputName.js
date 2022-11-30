import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import Tabs from "../components/Tabs";

export default function InputName({ navigation }) {
  const [nameJob, onChangeNameJob] = useState("");
  const [numEleJob, onChangeNumEleJob] = useState(0);

  global.nameJob = nameJob;
  global.numEleJob = numEleJob;

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Thông tin công việc</Header>
      <TextInput
        label="Tên công việc"
        returnKeyType="next"
        onChangeText={onChangeNameJob}
        value={nameJob}
        autoCapitalize="none"
      />
      <TextInput
        label="Số phần tử công việc"
        onChangeText={onChangeNumEleJob}
        value={numEleJob}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate("InputInfoObserve")}
      >
        {/* <Button mode="contained" onPress={Tabs()}> */}
        Bắt đầu
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({});
