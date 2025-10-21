import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './atividade/myapp/screens/Home';
import Home1 from './atividade/myapp/screens/Home1';
import LoginScreen from './atividade/myapp/screens/LoginScreen';
import Principal from './atividade/myapp/screens/Principal';
import CadastroAlunoScreen from './atividade/myapp/screens/CadastroAlunoScreen';
import CadastroDisciplinaScreen from './atividade/myapp/screens/CadastroDisciplinaScreen';
import CadastroProfessorScreen from './atividade/myapp/screens/CadastroProfessorScreen';
import BoletimScreen from './atividade/myapp/screens/BoletimScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Home1" component={Home1} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Principal" component={Principal} options={{ headerShown: false }} />
        <Stack.Screen name="CadastroAluno" component={CadastroAlunoScreen} options={{ title: 'Cadastro de Aluno' }} />
        <Stack.Screen name="CadastroDisciplina" component={CadastroDisciplinaScreen} options={{ title: 'Cadastro de Disciplina' }} />
        <Stack.Screen name="CadastroProfessor" component={CadastroProfessorScreen} options={{ title: 'Cadastro de Professor' }} />
        <Stack.Screen name="Boletim" component={BoletimScreen} options={{ title: 'Boletim Acadêmico' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}