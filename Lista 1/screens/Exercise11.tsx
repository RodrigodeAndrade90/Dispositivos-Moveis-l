import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import fatecImage from '../assets/fatec.png'; // Certifique-se de ter esta imagem na pasta assets

export default function Exercise11() {
  const navigation = useNavigation();

  const exercises = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image source={fatecImage} style={styles.logo} />
        <Text style={styles.title}>HOME</Text>
        <View style={styles.buttonGrid}>
          {exercises.map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.button}
              onPress={() => navigation.navigate(`Exercise${number}`)}
            >
              <Text style={styles.buttonText}>Exercício {number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#dbdbda',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  frame: {
    borderWidth: 2,
    borderColor: '#909396',
    padding: 15, // Reduzido de 20 para 15
    width: 280,  // Reduzido de 320 para 280
    backgroundColor: '#dbdbda',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 140,  // Reduzido de 140 para 120
    height: 140, // Reduzido de 140 para 120
    marginBottom: 15, // Reduzido de 20 para 15
    resizeMode: 'contain',
  },
  title: {
    color: '#3c3e36',
    fontSize: 22,  // Reduzido de 24 para 22
    fontWeight: 'bold',
    marginBottom: 15, // Reduzido de 20 para 15
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: 'yellow',
    padding: 12,  // Reduzido de 15 para 12
    marginVertical: 6, // Reduzido de 8 para 6
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCC00',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12, // Reduzido de 14 para 12
  },
});