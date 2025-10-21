import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.login({ email, senha });
      ApiService.setToken(response.token);
      
      Alert.alert('Sucesso', `Bem-vindo, ${response.nome}!`);
      navigation.navigate('Principal' as never);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image source={require('../../../assets/fatec.png')} style={styles.logo} />
        <Text style={styles.title}>LOGIN</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.buttonText}>LOGAR</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.credentials}>
          Credenciais de teste:{'\n'}
          👨‍💼 Admin: admin@app.com / 1234{'\n'}
          👨‍🏫 Professor: professor@app.com / 1234{'\n'}
          👨‍🎓 Aluno: aluno@app.com / 1234
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCCC00',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  credentials: {
    marginTop: 50,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoginScreen;