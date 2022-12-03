import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import SelectDropdown from "react-native-select-dropdown";

export default function InputTypeJob({ navigation }) {
  const [nameEleJob, onChangeNameEleJob] = useState("");
  const [typeJob, onChangeTypeJob] = useState(100);
  const [nameEleJobError, onChangeNameEleJobError] = useState("");
  const [typeJobError, onChangeTypeJobError] = useState("");

  global.nameEleJob = nameEleJob;
  global.typeJob = typeJob;
  console.log("global.numEleJobCurrent", global.numEleJobCurrent);
  const countries = ["Không chu kỳ", "Có chu kỳ"];
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Phần tử công việc {global.numEleJobCurrent}</Header>
      <TextInput
        label="Tên phần tử công việc"
        returnKeyType="next"
        onChangeText={(val) => {
          onChangeNameEleJob(val);
        }}
        value={nameEleJob}
        autoCapitalize="none"
        error={nameEleJobError}
        errorText={nameEleJobError}
      />
      <View style={styles.dropdownsRow}>
        <SelectDropdown
          data={countries}
          onSelect={(selectedItem, index) => {
            onChangeTypeJob(index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          defaultButtonText={"Chọn loại công việc"}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
          error={typeJobError}
          errorText={typeJobError}
        />
      </View>
      {!!{ typeJobError } && (
        <Text style={{ color: "red", paddingVertical: 8 }}>{typeJobError}</Text>
      )}
      <Button
        mode="contained"
        onPress={() => {
          nameEleJob.trim() === ""
            ? onChangeNameEleJobError("Hãy nhập tên phần tử công việc")
            : onChangeNameEleJobError("");
          typeJob === 100
            ? onChangeTypeJobError("Hãy chọn loại công việc")
            : onChangeTypeJobError("");
          if (nameEleJob.trim() !== "" && typeJob !== 100) {
            console.log("nameEleJob: " + nameEleJob);
            navigation.navigate("InputInfoObserve");
          }
        }}
      >
        Bắt đầu
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  dropdownsRow: {
    flexDirection: "row",
    width: "100%",
  },

  dropdown1BtnStyle: {
    flex: 1,
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 0.9,
    borderColor: "#000",
  },
  dropdown1BtnTxtStyle: {
    color: "#444",
    textAlign: "left",
  },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    height: 50,
    borderRadius: 8,
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
    height: 25,
  },
  dropdown1RowTxtStyle: {
    fontSize: 21,
  },
});
