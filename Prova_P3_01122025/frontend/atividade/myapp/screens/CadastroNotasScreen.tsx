import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
  RefreshControl
} from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroNotasScreen({ navigation }: any) {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<any>(null);
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [modalAlunoVisible, setModalAlunoVisible] = useState(false);
  const [modalDisciplinaVisible, setModalDisciplinaVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [resAlunos, resDisciplinas] = await Promise.all([
        api.getProfessorAlunos(),
        api.getProfessorDisciplinas()
      ]);
      
      setAlunos(resAlunos.data || []);
      setDisciplinas(resDisciplinas.data || []);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      Alert.alert('Erro', 'Falha ao carregar alunos e disciplinas');
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const carregarNotasExistentes = async () => {
    if (!alunoSelecionado || !disciplinaSelecionada) return;

    try {
      const res = await api.getNotas(alunoSelecionado.id, disciplinaSelecionada.id);
      const notas = res.data;
      setNota1(notas.nota1?.toString() || '');
      setNota2(notas.nota2?.toString() || '');
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('Erro ao carregar notas:', err);
      }
      setNota1('');
      setNota2('');
    }
  };

  useEffect(() => {
    carregarNotasExistentes();
  }, [alunoSelecionado, disciplinaSelecionada]);

  const validarNota = (nota: string): boolean => {
    if (nota === '') return true;
    const valor = parseFloat(nota);
    return !isNaN(valor) && valor >= 0 && valor <= 10;
  };

  const handleSalvarNotas = async () => {
    if (!alunoSelecionado || !disciplinaSelecionada) {
      Alert.alert('Atenção', 'Selecione um aluno e uma disciplina');
      return;
    }

    if (!validarNota(nota1) || !validarNota(nota2)) {
      Alert.alert('Atenção', 'As notas devem ser números entre 0 e 10');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        aluno_id: alunoSelecionado.id,
        disciplina_id: disciplinaSelecionada.id,
        nota1: nota1 === '' ? 0 : parseFloat(nota1),
        nota2: nota2 === '' ? 0 : parseFloat(nota2)
      };

      await api.saveNotas(payload);
      
      Alert.alert('Sucesso', 'Notas salvas com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            navigation.goBack();
          }
        }
      ]);
    } catch (err: any) {
      console.error('Erro ao salvar notas:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao salvar notas';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calcularMedia = (): string => {
    const n1 = nota1 === '' ? 0 : parseFloat(nota1);
    const n2 = nota2 === '' ? 0 : parseFloat(nota2);
    const media = (n1 + n2) / 2;
    return isNaN(media) ? '0.0' : media.toFixed(1);
  };

  const getSituacao = (): string => {
    const media = parseFloat(calcularMedia());
    return media >= 6 ? 'Aprovado' : 'Reprovado';
  };

  const getSituacaoColor = (): string => {
    return getSituacao() === 'Aprovado' ? '#38A169' : '#E53E3E';
  };

  const handleCadastrarNovoAluno = () => {
    navigation.navigate('CadastroAluno');
  };

  const renderAlunoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        alunoSelecionado?.id === item.id && styles.itemSelecionado
      ]}
      onPress={() => {
        setAlunoSelecionado(item);
        setModalAlunoVisible(false);
      }}
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={20} color="#4A6572" />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>
          {item.matricula} • {item.curso}
        </Text>
      </View>
      {alunoSelecionado?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4A6572" />
      )}
    </TouchableOpacity>
  );

  const renderDisciplinaItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        disciplinaSelecionada?.id === item.id && styles.itemSelecionado
      ]}
      onPress={() => {
        setDisciplinaSelecionada(item);
        setModalDisciplinaVisible(false);
      }}
    >
      <View style={styles.avatar}>
        <Ionicons name="book" size={20} color="#4A6572" />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>
          {item.carga_horaria}h
        </Text>
      </View>
      {disciplinaSelecionada?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4A6572" />
      )}
    </TouchableOpacity>
  );

  if (carregando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A6572" />
        <Text style={styles.loadingText}>Carregando alunos e disciplinas...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastrar Notas</Text>
        <Text style={styles.headerSubtitle}>Lançamento de notas AV1 e AV2</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aluno *</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setModalAlunoVisible(true)}
          >
            <View style={styles.selectorContent}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={alunoSelecionado ? styles.selectorText : styles.selectorPlaceholder}>
                {alunoSelecionado ? alunoSelecionado.nome : 'Selecione um aluno'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Disciplina *</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setModalDisciplinaVisible(true)}
          >
            <View style={styles.selectorContent}>
              <Ionicons name="book-outline" size={20} color="#666" />
              <Text style={disciplinaSelecionada ? styles.selectorText : styles.selectorPlaceholder}>
                {disciplinaSelecionada ? disciplinaSelecionada.nome : 'Selecione uma disciplina'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {(alunoSelecionado && disciplinaSelecionada) && (
          <View style={styles.notasContainer}>
            <Text style={styles.notasTitle}>Lançamento de Notas</Text>
            
            <View style={styles.alunoSelecionadoInfo}>
              <Ionicons name="person" size={16} color="#4A6572" />
              <Text style={styles.alunoSelecionadoText}>
                {alunoSelecionado.nome} • {disciplinaSelecionada.nome}
              </Text>
            </View>
            
            <View style={styles.notasRow}>
              <View style={styles.notaInputContainer}>
                <Text style={styles.notaLabel}>AV1</Text>
                <TextInput
                  value={nota1}
                  onChangeText={setNota1}
                  style={[
                    styles.notaInput,
                    !validarNota(nota1) && styles.inputError
                  ]}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                  placeholderTextColor="#999"
                  maxLength={4}
                />
              </View>

              <View style={styles.notaInputContainer}>
                <Text style={styles.notaLabel}>AV2</Text>
                <TextInput
                  value={nota2}
                  onChangeText={setNota2}
                  style={[
                    styles.notaInput,
                    !validarNota(nota2) && styles.inputError
                  ]}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                  placeholderTextColor="#999"
                  maxLength={4}
                />
              </View>
            </View>

            <View style={styles.previewContainer}>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Média</Text>
                <Text style={styles.previewValue}>{calcularMedia()}</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Situação</Text>
                <Text style={[styles.previewValue, { color: getSituacaoColor() }]}>
                  {getSituacao()}
                </Text>
              </View>
            </View>

            <Text style={styles.helpText}>
              💡 Digite notas de 0 a 10. Média mínima para aprovação: 6.0
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.novoAlunoButton}
          onPress={handleCadastrarNovoAluno}
        >
          <Ionicons name="person-add" size={20} color="#4A6572" />
          <Text style={styles.novoAlunoText}>Cadastrar Novo Aluno</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!alunoSelecionado || !disciplinaSelecionada || loading) && styles.saveButtonDisabled
          ]}
          onPress={handleSalvarNotas}
          disabled={!alunoSelecionado || !disciplinaSelecionada || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Salvar Notas</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#4A6572" />
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Seleção de Aluno */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAlunoVisible}
        onRequestClose={() => setModalAlunoVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Aluno</Text>
              <TouchableOpacity 
                onPress={() => setModalAlunoVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#4A6572" />
              </TouchableOpacity>
            </View>

            {alunos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color="#CBD5E0" />
                <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
                <Text style={styles.emptySubtext}>
                  Cadastre alunos primeiro para lançar notas
                </Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={handleCadastrarNovoAluno}
                >
                  <Text style={styles.emptyButtonText}>Cadastrar Aluno</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={alunos}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderAlunoItem}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Disciplina */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDisciplinaVisible}
        onRequestClose={() => setModalDisciplinaVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Disciplina</Text>
              <TouchableOpacity 
                onPress={() => setModalDisciplinaVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#4A6572" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={disciplinas}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderDisciplinaItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="book-outline" size={48} color="#CBD5E0" />
                  <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7FAFC'
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
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: { 
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
    fontSize: 16,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    fontSize: 16,
    color: '#2D3748',
    marginLeft: 12,
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: '#999',
    marginLeft: 12,
  },
  notasContainer: {
    backgroundColor: '#EDF2F7',
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  notasTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  alunoSelecionadoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  alunoSelecionadoText: {
    fontSize: 14,
    color: '#4A6572',
    fontWeight: '500',
    marginLeft: 4,
  },
  notasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  notaInputContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  notaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  notaInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#2D3748',
    textAlign: 'center',
    width: '100%',
  },
  inputError: {
    borderColor: '#E53E3E',
  },
  previewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  previewItem: {
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6572',
  },
  helpText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  novoAlunoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A6572',
    marginBottom: 16,
  },
  novoAlunoText: {
    color: '#4A6572',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A6572',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#4A6572',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A6572',
  },
  cancelButtonText: {
    color: '#4A6572',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#718096',
    fontSize: 16,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  closeButton: {
    padding: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  itemSelecionado: {
    backgroundColor: '#EDF2F7',
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
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 2,
  },
  itemDetalhes: {
    fontSize: 12,
    color: '#718096',
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
  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4A6572',
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});