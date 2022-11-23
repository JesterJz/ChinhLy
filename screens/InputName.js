import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";

export default function LoginScreen({ navigation }) {
  const [nameJob, onChangeNameJob] = useState("");
  const [numEleJob, onChangeNumEleJob] = useState();
  const [estTime, onChangeEst] = useState();
  const [period, onChangePeriod] = useState(0);
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
        returnKeyType="next"
        onChangeText={onChangeNumEleJob}
        value={numEleJob}
        autoCapitalize="none"
      />
      <TextInput
        label="Thời gian ước tính"
        returnKeyType="next"
        onChangeText={onChangeEst}
        value={estTime}
        autoCapitalize="none"
      />
      <TextInput
        label="Số chu kỳ công việc"
        returnKeyType="next"
        onChangeText={onChangePeriod}
        value={period}
        autoCapitalize="none"
      />
      <Button mode="contained" onPress={() => navigation.navigate("Tabs")}>
        Bắt đầu
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({});
