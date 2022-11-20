import { StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Tabs from "./components/Tabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
// import Dashboard from "./screens/Dashboard";
import StartScreen from "./screens/StartScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync()
  .then((result) =>
    console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`)
  )
  .catch(console.warn);

export default function App() {
  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 2000);
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StartScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
