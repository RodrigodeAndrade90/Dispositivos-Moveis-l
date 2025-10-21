import { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const Home = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home1');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.frame}>
        <Image source={require('../../../assets/fatec.png')} style={styles.logo} />
        <Text style={styles.title}>App Scholar</Text>
        <Text style={styles.subtitle}>Sistema de Gestão Acadêmica</Text>
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    </SafeAreaView>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  loading: {
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default Home;