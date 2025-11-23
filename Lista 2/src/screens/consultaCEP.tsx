import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useCep } from "../hooks/useCep";

export default function ConsultasScreen() {
  const { consultas } = useCep();

  return (
    <ScrollView style={styles.container}>
      {consultas.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.text}>Logradouro: {item.logradouro}</Text>
          <Text style={styles.text}>Bairro: {item.bairro}</Text>
          <Text style={styles.text}>Localidade: {item.localidade}</Text>
          <Text style={styles.text}>UF: {item.uf}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  text: { color: "#000" }
});
