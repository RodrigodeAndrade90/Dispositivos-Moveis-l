import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';

export default function Exercise9() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('manager');
  const [display, setDisplay] = useState('');

  const handleLogin = () => {
    setDisplay(`${email} - ${password} - ${confirmPassword} - ${role}`);
  };

  const handleRegister = () => {
    setDisplay('Cadastro solicitado');
  };

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Text style={styles.title}>CADASTRO</Text>
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#999"
          secureTextEntry={true}
          maxLength={8}
          value={password}
          onChangeText={setPassword}
        />
        
        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#999"
          secureTextEntry={true}
          maxLength={8}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        <Text style={styles.label}>Tipo de Usuário</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Administrador" value="admin" />
            <Picker.Item label="Gestor" value="manager" />
            <Picker.Item label="Usuário" value="user" />
          </Picker>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Cadastre-se</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Logar</Text>
          </TouchableOpacity>
        </View>
        
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 20,
    width: 270,
    backgroundColor: '#000',
  },
  title: {
    color: 'yellow',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 15,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    width: '100%',
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'yellow',
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  display: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
  },
});