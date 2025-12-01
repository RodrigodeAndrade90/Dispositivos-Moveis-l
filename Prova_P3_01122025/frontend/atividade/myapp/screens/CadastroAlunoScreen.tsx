import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function CadastroAlunoScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cursos, setCursos] = useState<any[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    carregarCursos();
  }, []);

  const carregarCursos = async () => {
    try {
      const response = await api.listCursos();
      setCursos(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
      Alert.alert('Erro', 'Falha ao carregar cursos');
    }
  };

  const handleSalvar = async () => {
    if (!nome || !matricula || !cursoSelecionado) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      const payload = { 
        nome, 
        matricula, 
        curso_id: cursoSelecionado.id 
      };
      await api.createAluno(payload);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso', [
        {
          text: 'OK',
          onPress: () => {
            setNome('');
            setMatricula('');
            setCursoSelecionado(null);
            navigation.goBack();
          }
        }
      ]);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Falha ao cadastrar aluno';
      if (errorMessage.includes('Matrícula já cadastrada')) {
        Alert.alert('Erro', 'Esta matrícula já está em uso. Use outra matrícula.');
      } else {
        Alert.alert('Erro', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderCursoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        cursoSelecionado?.id === item.id && styles.itemSelecionado
      ]}
      onPress={() => {
        setCursoSelecionado(item);
        setModalVisible(false);
      }}
    >
      <View style={[styles.cursoAvatar, { backgroundColor: getCursoColor(item.area) }]}>
        <Ionicons name="school" size={20} color="#FFFFFF" />
      </View>
      <View style={styles.cursoInfo}>
        <Text style={styles.cursoNome}>{item.nome}</Text>
        <Text style={styles.cursoDetalhes}>
          {item.sigla} • {item.area} • {formatarDuracao(item.duracao_meses)}
        </Text>
      </View>
      {cursoSelecionado?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4A6572" />
      )}
    </TouchableOpacity>
  );

  const getCursoColor = (area: string) => {
    const colors: { [key: string]: string } = {
      'Tecnologia da Informação': '#3182CE',
      'Engenharia': '#DD6B20',
      'Administração': '#38A169',
      'Saúde': '#E53E3E',
      'Direito': '#805AD5',
      'Educação': '#D69E2E'
    };
    return colors[area] || '#4A6572';
  };

  const formatarDuracao = (meses: number) => {
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    
    if (anos === 0) {
      return `${meses} meses`;
    } else if (mesesRestantes === 0) {
      return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    } else {
      return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} meses`;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Novo Aluno</Text>
        <Text style={styles.headerSubtitle}>Cadastre um novo aluno no sistema</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              value={nome} 
              onChangeText={setNome} 
              style={styles.input} 
              placeholder="Ex: João Silva"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de Matrícula *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="id-card-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              value={matricula} 
              onChangeText={setMatricula} 
              style={styles.input} 
              placeholder="Ex: 2023001"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.helperText}>
            Número único de identificação do aluno
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Curso *</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.selectorContent}>
              <Ionicons name="school-outline" size={20} color="#666" />
              <Text style={cursoSelecionado ? styles.selectorText : styles.selectorPlaceholder}>
                {cursoSelecionado ? cursoSelecionado.nome : 'Selecione um curso'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Curso de graduação do aluno
          </Text>
        </View>

        {cursoSelecionado && (
          <View style={styles.cursoSelecionadoCard}>
            <View style={styles.cursoSelecionadoHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#38A169" />
              <Text style={styles.cursoSelecionadoTitle}>Curso Selecionado</Text>
            </View>
            <Text style={styles.cursoSelecionadoNome}>{cursoSelecionado.nome}</Text>
            <View style={styles.cursoDetalhesRow}>
              <View style={styles.cursoDetalheItem}>
                <Ionicons name="code" size={14} color="#718096" />
                <Text style={styles.cursoDetalheText}>{cursoSelecionado.sigla}</Text>
              </View>
              <View style={styles.cursoDetalheItem}>
                <Ionicons name="business" size={14} color="#718096" />
                <Text style={styles.cursoDetalheText}>{cursoSelecionado.area}</Text>
              </View>
              <View style={styles.cursoDetalheItem}>
                <Ionicons name="time" size={14} color="#718096" />
                <Text style={styles.cursoDetalheText}>
                  {formatarDuracao(cursoSelecionado.duracao_meses)}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo do Cadastro</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nome:</Text>
            <Text style={styles.summaryValue}>{nome || 'Não informado'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Matrícula:</Text>
            <Text style={styles.summaryValue}>{matricula || 'Não informado'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Curso:</Text>
            <Text style={styles.summaryValue}>
              {cursoSelecionado ? cursoSelecionado.nome : 'Não informado'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!nome || !matricula || !cursoSelecionado) && styles.saveButtonDisabled
          ]}
          onPress={handleSalvar}
          disabled={!nome || !matricula || !cursoSelecionado || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="person-add" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Cadastrar Aluno</Text>
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

      {/* Modal para seleção de curso */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Curso</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#4A6572" />
              </TouchableOpacity>
            </View>

            {cursos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="school-outline" size={48} color="#CBD5E0" />
                <Text style={styles.emptyText}>Nenhum curso cadastrado</Text>
                <Text style={styles.emptySubtext}>
                  Cadastre cursos primeiro para associar alunos
                </Text>
              </View>
            ) : (
              <FlatList
                data={cursos}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderCursoItem}
              />
            )}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  helperText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 6,
    marginLeft: 4,
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
  cursoSelecionadoCard: {
    backgroundColor: '#F0FFF4',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#9AE6B4',
  },
  cursoSelecionadoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cursoSelecionadoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38A169',
    marginLeft: 8,
  },
  cursoSelecionadoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  cursoDetalhesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cursoDetalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cursoDetalheText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
  summaryCard: {
    backgroundColor: '#EDF2F7',
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#718096',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38A169',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#38A169',
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
  cursoAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cursoInfo: {
    flex: 1,
  },
  cursoNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 2,
  },
  cursoDetalhes: {
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
});