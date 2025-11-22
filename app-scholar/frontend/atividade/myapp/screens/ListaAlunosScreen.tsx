import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function ListaAlunosScreen({ navigation }: any) {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarAlunos = async () => {
    try {
      const response = await api.listAlunos();
      setAlunos(response.data || []);
    } catch (err: any) {
      console.error('Erro ao carregar alunos:', err);
      Alert.alert('Erro', 'Falha ao carregar lista de alunos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    carregarAlunos();
  };

  const renderAluno = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.alunoCard}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={20} color="#4A6572" />
      </View>
      <View style={styles.alunoInfo}>
        <Text style={styles.alunoNome}>{item.nome}</Text>
        <Text style={styles.alunoDetalhes}>
          Matrícula: {item.matricula} • Curso: {item.curso}
        </Text>
        <Text style={styles.alunoData}>
          Cadastrado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A6572" />
        <Text style={styles.loadingText}>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lista de Alunos</Text>
        <Text style={styles.headerSubtitle}>Visualize todos os alunos cadastrados</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CadastroAluno')}
        >
          <Ionicons name="person-add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Novo Aluno</Text>
        </TouchableOpacity>

        <FlatList
          data={alunos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderAluno}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#CBD5E0" />
              <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
              <Text style={styles.emptySubtext}>
                Clique em "Novo Aluno" para cadastrar o primeiro aluno
              </Text>
            </View>
          }
          contentContainerStyle={alunos.length === 0 && styles.emptyList}
        />
      </View>
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
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CBD5E0',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38A169',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#38A169',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alunoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alunoInfo: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  alunoDetalhes: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 2,
  },
  alunoData: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#718096',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});