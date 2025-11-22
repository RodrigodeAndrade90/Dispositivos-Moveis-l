import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function BoletimCompletoScreen() {
  const [alunoNome, setAlunoNome] = useState('');
  const [boletimData, setBoletimData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const buscarBoletim = async () => {
    if (!alunoNome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do aluno para consultar o boletim.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.boletimByAlunoNome(alunoNome);
      setBoletimData(res.data);
    } catch (err: any) {
      console.error('Erro ao buscar boletim:', err);
      Alert.alert('Erro', err?.response?.data?.message || 'Falha ao buscar boletim. Verifique o nome do aluno.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (media: number) => {
    if (media >= 7) return '#38A169';
    if (media >= 5) return '#D69E2E';
    return '#E53E3E';
  };

  const getStatusText = (media: number) => {
    if (media >= 7) return 'Aprovado';
    if (media >= 5) return 'Recuperação';
    return 'Reprovado';
  };

  const formatarNota = (nota: any): string => {
    if (nota === undefined || nota === null) return '0.0';
    const notaNumber = typeof nota === 'number' ? nota : parseFloat(nota);
    return isNaN(notaNumber) ? '0.0' : notaNumber.toFixed(1);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.materia}>{item.disciplina_nome}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.media) }]}>
          <Text style={styles.statusText}>{getStatusText(item.media)}</Text>
        </View>
      </View>
      
      <View style={styles.gradesContainer}>
        <View style={styles.gradeItem}>
          <Text style={styles.gradeLabel}>Nota 1</Text>
          <Text style={styles.gradeValue}>{formatarNota(item.nota1)}</Text>
        </View>
        <View style={styles.gradeItem}>
          <Text style={styles.gradeLabel}>Nota 2</Text>
          <Text style={styles.gradeValue}>{formatarNota(item.nota2)}</Text>
        </View>
        <View style={styles.gradeItem}>
          <Text style={styles.gradeLabel}>Média</Text>
          <Text style={[styles.gradeValue, styles.mediaValue]}>{formatarNota(item.media)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boletim Acadêmico</Text>
        <Text style={styles.headerSubtitle}>Consulte o desempenho do aluno</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.label}>Nome do Aluno</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            value={alunoNome}
            onChangeText={setAlunoNome}
            style={styles.input}
            placeholder="Digite o nome completo do aluno"
            placeholderTextColor="#999"
            autoCapitalize="words"
          />
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={buscarBoletim}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>Buscar Boletim</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {boletimData && (
        <View style={styles.resultsContainer}>
          <View style={styles.alunoInfoCard}>
            <View style={styles.alunoAvatar}>
              <Ionicons name="person" size={24} color="#4A6572" />
            </View>
            <View style={styles.alunoInfo}>
              <Text style={styles.alunoNome}>{boletimData.aluno.nome}</Text>
              <Text style={styles.alunoDetalhes}>
                {boletimData.aluno.matricula} • {boletimData.aluno.curso}
              </Text>
            </View>
          </View>

          <Text style={styles.resultsTitle}>Disciplinas Cursadas</Text>
          <FlatList
            data={boletimData.boletim}
            keyExtractor={(item) => String(item.disciplina_id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {!loading && boletimData === null && alunoNome !== '' && (
        <View style={styles.emptyState}>
          <Ionicons name="school-outline" size={64} color="#CBD5E0" />
          <Text style={styles.emptyText}>Nenhum boletim encontrado</Text>
          <Text style={styles.emptySubtext}>
            Verifique o nome do aluno e tente novamente
          </Text>
        </View>
      )}

      {!loading && boletimData === null && alunoNome === '' && (
        <View style={styles.placeholder}>
          <Ionicons name="document-text-outline" size={80} color="#E2E8F0" />
          <Text style={styles.placeholderText}>
            Informe o nome do aluno para visualizar o boletim
          </Text>
        </View>
      )}
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
  searchContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  label: { 
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3748',
  },
  searchButton: {
    backgroundColor: '#4A6572',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A6572',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  alunoInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  alunoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alunoInfo: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  alunoDetalhes: {
    fontSize: 14,
    color: '#718096',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4A6572',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  materia: { 
    fontWeight: '700', 
    fontSize: 16,
    color: '#2D3748',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  gradesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeItem: {
    alignItems: 'center',
  },
  gradeLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  gradeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  mediaValue: {
    fontSize: 18,
    color: '#4A6572',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#718096',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 8,
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 16,
    textAlign: 'center',
  },
});