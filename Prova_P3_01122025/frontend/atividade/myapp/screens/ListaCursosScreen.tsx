import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function ListaCursosScreen({ navigation }: any) {
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const carregarCursos = async () => {
    try {
      const response = await api.listCursos();
      setCursos(response.data || []);
    } catch (err: any) {
      console.error('Erro ao carregar cursos:', err);
      Alert.alert('Erro', 'Falha ao carregar lista de cursos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarCursos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    carregarCursos();
  };

  const handleExcluirCurso = (curso: any) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o curso "${curso.nome}" (${curso.sigla})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirCurso(curso.id)
        }
      ]
    );
  };

  const excluirCurso = async (cursoId: number) => {
    try {
      await api.deleteCurso(cursoId);
      Alert.alert('Sucesso', 'Curso excluído com sucesso');
      carregarCursos();
    } catch (err: any) {
      console.error('Erro ao excluir curso:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao excluir curso';
      Alert.alert('Erro', errorMessage);
    }
  };

  const showDetalhesCurso = (curso: any) => {
    setCursoSelecionado(curso);
    setModalVisible(true);
  };

  const renderCurso = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.cursoCard}
      onPress={() => showDetalhesCurso(item)}
      onLongPress={() => navigation.navigate('EditarCurso', { curso: item })}
    >
      <View style={[styles.cursoIcon, { backgroundColor: getCursoColor(item.area) }]}>
        <Ionicons name="school" size={24} color="#FFFFFF" />
      </View>
      
      <View style={styles.cursoInfo}>
        <View style={styles.cursoHeader}>
          <Text style={styles.cursoNome}>{item.nome}</Text>
          <View style={styles.cursoSiglaBadge}>
            <Text style={styles.cursoSiglaText}>{item.sigla}</Text>
          </View>
        </View>
        
        <Text style={styles.cursoDetalhes}>
          {item.area} • {item.duracao_meses} meses
        </Text>
        
        {item.coordenador_nome && (
          <Text style={styles.cursoCoordenador}>
            Coordenador: {item.coordenador_nome}
          </Text>
        )}
        
        <View style={styles.cursoStats}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={14} color="#718096" />
            <Text style={styles.statText}>{item.total_alunos || 0} alunos</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cursoActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditarCurso', { curso: item })}
        >
          <Ionicons name="create-outline" size={20} color="#4A6572" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleExcluirCurso(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#E53E3E" />
        </TouchableOpacity>
      </View>
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A6572" />
        <Text style={styles.loadingText}>Carregando cursos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cursos da Instituição</Text>
        <Text style={styles.headerSubtitle}>Gerencie os cursos acadêmicos</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CadastroCurso')}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Novo Curso</Text>
        </TouchableOpacity>

        <FlatList
          data={cursos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCurso}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="school-outline" size={48} color="#CBD5E0" />
              <Text style={styles.emptyText}>Nenhum curso cadastrado</Text>
              <Text style={styles.emptySubtext}>
                Clique em "Novo Curso" para cadastrar o primeiro curso
              </Text>
            </View>
          }
          contentContainerStyle={cursos.length === 0 && styles.emptyList}
        />
      </View>

      {/* Modal de Detalhes do Curso */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {cursoSelecionado && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalIcon, { backgroundColor: getCursoColor(cursoSelecionado.area) }]}>
                    <Ionicons name="school" size={32} color="#FFFFFF" />
                  </View>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>{cursoSelecionado.nome}</Text>
                    <View style={styles.modalSiglaBadge}>
                      <Text style={styles.modalSiglaText}>{cursoSelecionado.sigla}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color="#4A6572" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.detailItem}>
                    <Ionicons name="business" size={20} color="#718096" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Área</Text>
                      <Text style={styles.detailValue}>{cursoSelecionado.area}</Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="time" size={20} color="#718096" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Duração</Text>
                      <Text style={styles.detailValue}>
                        {formatarDuracao(cursoSelecionado.duracao_meses)}
                      </Text>
                    </View>
                  </View>

                  {cursoSelecionado.coordenador_nome && (
                    <View style={styles.detailItem}>
                      <Ionicons name="person" size={20} color="#718096" />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Coordenador</Text>
                        <Text style={styles.detailValue}>{cursoSelecionado.coordenador_nome}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.detailItem}>
                    <Ionicons name="people" size={20} color="#718096" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Total de Alunos</Text>
                      <Text style={styles.detailValue}>{cursoSelecionado.total_alunos || 0}</Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={20} color="#718096" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Data de Criação</Text>
                      <Text style={styles.detailValue}>
                        {new Date(cursoSelecionado.created_at).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.modalEditButton}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate('EditarCurso', { curso: cursoSelecionado });
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.modalEditButtonText}>Editar Curso</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  cursoCard: {
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
  cursoIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cursoInfo: {
    flex: 1,
  },
  cursoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cursoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    marginRight: 8,
  },
  cursoSiglaBadge: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  cursoSiglaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A6572',
  },
  cursoDetalhes: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  cursoCoordenador: {
    fontSize: 12,
    color: '#4A6572',
    marginBottom: 8,
  },
  cursoStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
  cursoActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  deleteButton: {
    marginLeft: 4,
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  modalSiglaBadge: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  modalSiglaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A6572',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  modalEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A6572',
    padding: 16,
    borderRadius: 12,
  },
  modalEditButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});