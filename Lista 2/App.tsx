import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { CepProvider } from "./src/contexts/cepContext";

import React from "react";
import Um from "./src/screens/Exercise1";
import Dois from "./src/screens/Exercise2";
import Tres from "./src/screens/Exercise3";
import Quatro from "./src/screens/Exercise4";
import Cinco from "./src/screens/Exercise5";
import Seis from "./src/screens/Exercise6";
import Sete from "./src/screens/Exercise7";
import Oito from "./src/screens/Exercise8";
import Nove from "./src/screens/Exercise9";
import Dez from "./src/screens/Exercise10";
import viaCep from "./src/screens/viaCepPages";
import consultaCep from "./src/screens/consultaCEP"

//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <CepProvider>
        <Drawer.Navigator initialRouteName="Um">
          <Drawer.Screen
            name="Exercício 1"
            component={Um}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="print" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Exercício 2"
            component={Dois}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="map" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Exercício 3"
            component={Tres}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="medal" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Exercício 4"
            component={Quatro}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="radio" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Exercício 5"
            component={Cinco}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="wifi" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Exercício 6"
            component={Seis}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="school" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Exercício 7"
            component={Sete}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="apps" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Exercício 8"
            component={Oito}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="settings" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Exercício 9"
            component={Nove}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="thunderstorm" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Exercício 10"
            component={Dez}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="today" size={size} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="viaCep"
            component={viaCep}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="pin" size={size} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="Consultas de CEP"
            component={consultaCep}
            options={{
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />
        </Drawer.Navigator>
      </CepProvider>
    </NavigationContainer>
  );
}