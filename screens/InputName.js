import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
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
  const [nameError, onChangeNameError] = useState("");
  const [numError, onChangeNumError] = useState("");

  global.nameJob = nameJob;
  global.numEleJob = numEleJob;
  global.numEleJobCurrent = 1;

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
        error={nameError}
        errorText={nameError}
      />
      <TextInput
        label="Số phần tử công việc"
        onChangeText={onChangeNumEleJob}
        value={numEleJob}
        error={numError}
        errorText={numError}
        keyboardType="numeric"
      />
      <Button
        mode="contained"
        onPress={() => {
          nameJob.trim() === ""
            ? onChangeNameError("Hãy nhập tên công việc")
            : onChangeNameError("");
          typeof Number(numEleJob) == "number" && numEleJob > 0
            ? onChangeNumError("")
            : onChangeNumError("Hãy nhập số phần tử công việc");
          if (
            nameJob.trim() !== "" &&
            typeof Number(numEleJob) == "number" &&
            numEleJob > 0
          ) {
            navigation.navigate("InputTypeJob");
          }
        }}
      >
        Bắt đầu
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({});
