import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';

export default function Exercise6() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [display, setDisplay] = useState('');

  const handleSave = () => {
    setDisplay(`${name} - ${age}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>SALVAR</Text>
        </TouchableOpacity>
        <Text style={styles.display}>{display}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    width: '100%',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#000',
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  display: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
    textAlign: 'left',
  },
});