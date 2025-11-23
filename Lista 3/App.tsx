import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

import Um from "./screens/Exercise1";
import Dois from "./screens/Exercise2";
import Tres from "./screens/Exercise3";
import Quatro from "./screens/Exercise4";
import Cinco from "./screens/Exercise5";
import Seis from "./screens/Exercise6";
import Sete from "./screens/Exercise7";
import Oito from "./screens/Exercise8";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Um"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#ffffff',
            width: 280,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
          drawerActiveTintColor: '#6366f1',
          drawerInactiveTintColor: '#64748b',
        }}
      >
        <Drawer.Screen
          name="Exercício 1"
          component={Um}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="play-circle" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 2"
          component={Dois}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="call" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 3"
          component={Tres}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="logo-instagram" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 4"
          component={Quatro}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 5"
          component={Cinco}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 6"
          component={Seis}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="camera" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 7"
          component={Sete}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="images" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 8"
          component={Oito}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="trash" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}