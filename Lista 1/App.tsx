import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Exercise1 from './screens/Exercise1';
import Exercise2 from './screens/Exercise2';
import Exercise3 from './screens/Exercise3';
import Exercise4 from './screens/Exercise4';
import Exercise5 from './screens/Exercise5';
import Exercise6 from './screens/Exercise6';
import Exercise7 from './screens/Exercise7';
import Exercise8 from './screens/Exercise8';
import Exercise9 from './screens/Exercise9';
import Exercise10 from './screens/Exercise10';
import Exercise11 from './screens/Exercise11';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Exercise11">
        <Stack.Screen 
          name="Exercise1" 
          component={Exercise1}
          options={{ title: 'Exercício 1' }}
        />
        <Stack.Screen 
          name="Exercise2" 
          component={Exercise2}
          options={{ title: 'Exercício 2' }}
        />
        <Stack.Screen 
          name="Exercise3" 
          component={Exercise3}
          options={{ title: 'Exercício 3' }}
        />
        <Stack.Screen 
          name="Exercise4" 
          component={Exercise4}
          options={{ title: 'Exercício 4' }}
        />
        <Stack.Screen 
          name="Exercise5" 
          component={Exercise5}
          options={{ title: 'Exercício 5' }}
        />
        <Stack.Screen 
          name="Exercise6" 
          component={Exercise6}
          options={{ title: 'Exercício 6' }}
        />
        <Stack.Screen 
          name="Exercise7" 
          component={Exercise7}
          options={{ title: 'Exercício 7' }}
        />
        <Stack.Screen 
          name="Exercise8" 
          component={Exercise8}
          options={{ title: 'Exercício 8' }}
        />
        <Stack.Screen 
          name="Exercise9" 
          component={Exercise9}
          options={{ title: 'Exercício 9' }}
        />
        <Stack.Screen 
          name="Exercise10" 
          component={Exercise10}
          options={{ title: 'Exercício 10' }}
        />
        <Stack.Screen 
          name="Exercise11" 
          component={Exercise11}
          options={{ title: 'Exercício 11' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}