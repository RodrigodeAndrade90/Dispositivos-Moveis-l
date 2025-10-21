import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

export default function Principal() {
  const navigation = useNavigation();

  const buttons = [
    { title: 'Cadastro Aluno', screen: 'CadastroAluno' },
    { title: 'Cadastro Disciplina', screen: 'CadastroDisciplina' },
    { title: 'Cadastro Professor', screen: 'CadastroProfessor' },
    { title: 'Boletim', screen: 'Boletim' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image source={require('../../../assets/fatec.png')} style={styles.logo} />
        <Text style={styles.title}>MENU PRINCIPAL</Text>
        <Text style={styles.subtitle}>App Scholar</Text>
        
        <View style={styles.buttonGrid}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => navigation.navigate(button.screen as never)}
            >
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Home1' as never)}
        >
          <Text style={styles.logoutButtonText}>SAIR</Text>
        </TouchableOpacity>
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
    padding: 15,
    width: 280,
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
    width: 120,
    height: 120,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    color: '#3c3e36',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'yellow',
    padding: 12,
    marginVertical: 6,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCC00',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cc0000',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});