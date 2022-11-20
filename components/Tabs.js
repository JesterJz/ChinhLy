import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import Pictures from "./Pictures";
import Video from "./Video";
import Stopwatch from "./StopWatch";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Stopwatch") {
            iconName = focused ? "stopwatch" : "stopwatch-outline";
          } else if (route.name === "Pictures") {
            iconName = focused ? "aperture" : "aperture-outline";
          } else if (route.name === "Video") {
            iconName = focused ? "videocam" : "videocam-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Stopwatch" component={Stopwatch} />
      <Tab.Screen name="Pictures" component={Pictures} />
      <Tab.Screen name="Video" component={Video} />
    </Tab.Navigator>
  );
}
