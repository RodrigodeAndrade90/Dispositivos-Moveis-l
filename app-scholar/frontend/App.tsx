import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './atividade/myapp/screens/Home';
import Home1 from './atividade/myapp/screens/Home1';
import LoginScreen from './atividade/myapp/screens/LoginScreen';
import HomeScreen from './atividade/myapp/screens/HomeScreen';
import BoletimCompletoScreen from './atividade/myapp/screens/BoletimCompletoScreen';
import CadastroAlunoScreen from './atividade/myapp/screens/CadastroAlunoScreen';
import CadastroProfessorScreen from './atividade/myapp/screens/CadastroProfessorScreen';
import CadastroDisciplinaScreen from './atividade/myapp/screens/CadastroDisciplinaScreen';
import CadastroNotasScreen from './atividade/myapp/screens/CadastroNotasScreen'; 
import ListaAlunosScreen from './atividade/myapp/screens/ListaAlunosScreen';
import CadastroUsuarioScreen from './atividade/myapp/screens/CadastroUsuarioScreen';

const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A6572',
    background: '#F7FAFC',
    card: '#FFFFFF',
    text: '#2D3748',
    border: '#E2E8F0',
    notification: '#E53E3E',
  },
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Home' | 'Login' | 'HomeScreen'>('Home');
  const [perfil, setPerfil] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        const perfilSalvo = await AsyncStorage.getItem('@perfil');
        if (token && perfilSalvo) {
          setInitialRoute('HomeScreen');
          setPerfil(perfilSalvo);
        } else {
          setInitialRoute('Home');
        }
      } catch (err) {
        console.error(err);
        setInitialRoute('Home');
      } finally {
        setLoading(false);
      }
    };

    verificarLogin();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar backgroundColor="#2D3748" barStyle="light-content" />
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2D3748',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleStyle: {
            fontSize: 14,
          },
          cardStyle: {
            backgroundColor: '#F7FAFC'
          }
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home1"
          component={Home1}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CadastroUsuario" 
          component={CadastroUsuarioScreen} 
          options={{ title: 'Cadastrar Usuário' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ 
            title: 'ScholarApp',
            headerBackTitle: 'Sair'
          }}
          initialParams={{ perfil }}
        />
        <Stack.Screen 
          name="BoletimCompleto" 
          component={BoletimCompletoScreen} 
          options={{ title: 'Boletim Acadêmico' }}
        />
        <Stack.Screen 
          name="CadastroAluno" 
          component={CadastroAlunoScreen} 
          options={{ title: 'Cadastrar Aluno' }}
        />
        <Stack.Screen 
          name="CadastroProfessor" 
          component={CadastroProfessorScreen} 
          options={{ title: 'Cadastrar Professor' }}
        />
        <Stack.Screen 
          name="CadastroDisciplina" 
          component={CadastroDisciplinaScreen} 
          options={{ title: 'Cadastrar Disciplina' }}
        />
         <Stack.Screen 
          name="CadastroNotas" 
          component={CadastroNotasScreen} 
          options={{ title: 'Cadastrar Notas' }}
        />
        <Stack.Screen 
          name="ListaAlunos" 
          component={ListaAlunosScreen} 
          options={{ title: 'Lista de Alunos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 