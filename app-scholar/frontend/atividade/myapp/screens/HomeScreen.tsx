import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation, route }: any) {
  const perfil = route.params?.perfil || 'aluno';

  const getPerfilName = () => {
    switch(perfil) {
      case 'admin': return 'Administrador';
      case 'professor': return 'Professor';
      default: return 'Aluno';
    }
  };

  const getPerfilColor = () => {
    switch(perfil) {
      case 'admin': return '#E53E3E';
      case 'professor': return '#3182CE';
      default: return '#38A169';
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('@token');
          await AsyncStorage.removeItem('@perfil');

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        },
      },
    ]);
  };

  const MenuCard = ({ title, description, icon, onPress, color = '#4A6572' }: any) => (
    <TouchableOpacity style={styles.menuCard} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2D3748" barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: getPerfilColor() }]}>
            <Ionicons name="person" size={28} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.welcome}>Bem-vindo</Text>
            <View style={styles.perfilContainer}>
              <Text style={styles.perfilText}>{getPerfilName()}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Menu Principal</Text>
        
        <MenuCard 
          title="Visualizar Boletim" 
          description="Consulte suas notas e desempenho acadêmico"
          icon="bar-chart" 
          color="#38A169"
          onPress={() => navigation.navigate('BoletimCompleto')} 
        />

        {(perfil === 'admin' || perfil === 'professor') && (
          <MenuCard 
            title="Cadastrar Notas" 
            description="Adicione novas notas aos alunos"
            icon="document-text" 
            color="#3182CE"
            onPress={() => navigation.navigate('CadastroNotas')} 
          />
        )}

        {(perfil === 'admin' || perfil === 'professor') && (
          <MenuCard 
            title="Cadastrar Disciplina" 
            description="Adicione novas disciplinas ao sistema"
            icon="book" 
            color="#3182CE"
            onPress={() => navigation.navigate('CadastroDisciplina')} 
          />
        )}

        {perfil === 'admin' && (
          <>
            <MenuCard 
              title="Cadastrar Aluno" 
              description="Adicione novos alunos ao sistema"
              icon="people" 
              color="#DD6B20"
              onPress={() => navigation.navigate('CadastroAluno')} 
            />
            <MenuCard 
              title="Cadastrar Professor" 
              description="Adicione novos professores ao sistema"
              icon="person-add" 
              color="#E53E3E"
              onPress={() => navigation.navigate('CadastroProfessor')} 
            />
            <MenuCard 
              title="Cadastrar Usuário" 
              description="Adicione novos usuários ao sistema"
              icon="person-add" 
              color="#9B59B6"
              onPress={() => navigation.navigate('CadastroUsuario')} 
            />
            <MenuCard 
              title="Lista de Alunos" 
              description="Visualize todos os alunos cadastrados"
              icon="list" 
              color="#3498DB"
              onPress={() => navigation.navigate('ListaAlunos')} 
            />
          </>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    backgroundColor: '#2D3748',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  welcome: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  perfilContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  perfilText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 20,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E53E3E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#E53E3E',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});