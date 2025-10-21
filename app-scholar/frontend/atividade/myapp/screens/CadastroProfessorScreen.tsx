import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CadastroProfessorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Professor</Text>
      <Text style={styles.text}>Funcionalidade em desenvolvimento para a Entrega 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});