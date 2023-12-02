import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewsScreen from "../screens/NewsScreen";
import MainScreen from "../screens/MainScreen";
import HomeScreen from "../screens/HomeScreen";



const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="NewsDetail"
        component={NewsScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;