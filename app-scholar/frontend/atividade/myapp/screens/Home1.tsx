import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

export default function Home1() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image source={require('../../../assets/fatec.png')} style={styles.logo} />
        <Text style={styles.title}>APP SCHOLAR</Text>
        <Text style={styles.subtitle}>Sistema de Gestão Acadêmica</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Desenvolvido para a disciplina de{'\n'}Programação para Dispositivos Móveis I
        </Text>
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
    padding: 20,
    width: 320,
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
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    color: '#3c3e36',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'yellow',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCC00',
    marginBottom: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 16,
  },
});