import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

import Exercicio1 from "./screens/Exercise1";
import Exercicio2 from "./screens/Exercise2";
import Exercicio3 from "./screens/Exercise3";
import Exercicio4 from "./screens/Exercise4";
import Exercicio5 from "./screens/Exercise5";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Exercício 1"
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
          component={Exercicio1}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="phone-portrait" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 2"
          component={Exercicio2}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="swap-vertical" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 3"
          component={Exercicio3}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="color-palette" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 4"
          component={Exercicio4}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="layers" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Exercício 5"
          component={Exercicio5}
          options={{
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}