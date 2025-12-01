import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function TransferirAlunosScreen({ navigation, route }: any) {
  const { curso } = route.params;
  const [cursos, setCursos] = useState<any[]>([]);
  const [cursoDestino, setCursoDestino] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alunosTransferidos, setAlunosTransferidos] = useState<number>(0);

  useEffect(() => {
    carregarCursos();
  }, []);

  const carregarCursos = async () => {
    try {
      const response = await api.listCursos();
      // Filtrar o curso atual da lista
      const outrosCursos = response.data.filter((c: any) => c.id !== curso.id);
      setCursos(outrosCursos);
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
      Alert.alert('Erro', 'Falha ao carregar cursos');
    }
  };

  const handleTransferir = async () => {
    if (!cursoDestino) {
      Alert.alert('Atenção', 'Selecione um curso de destino');
      return;
    }

    Alert.alert(
      'Confirmar Transferência',
      `Transferir todos os alunos do curso "${curso.nome}" para "${cursoDestino.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Transferir',
          style: 'destructive',
          onPress: realizarTransferencia
        }
      ]
    );
  };

  const realizarTransferencia = async () => {
    try {
      setLoading(true);
      const response = await api.transferirAlunos(curso.id, {
        novo_curso_id: cursoDestino.id
      });
      
      setAlunosTransferidos(response.data.alunos_transferidos);
      Alert.alert(
        'Sucesso',
        `${response.data.alunos_transferidos} alunos transferidos com sucesso!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (err: any) {
      console.error('Erro ao transferir alunos:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao transferir alunos';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderCursoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        cursoDestino?.id === item.id && styles.itemSelecionado
      ]}
      onPress={() => {
        setCursoDestino(item);
        setModalVisible(false);
      }}
    >
      <View style={styles.cursoIcon}>
        <Ionicons name="school" size={24} color="#4A6572" />
      </View>
      <View style={styles.cursoInfo}>
        <Text style={styles.cursoNome}>{item.nome}</Text>
        <Text style={styles.cursoDetalhes}>
          {item.sigla} • {item.area} • {item.total_alunos || 0} alunos
        </Text>
      </View>
      {cursoDestino?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4A6572" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transferir Alunos</Text>
        <Text style={styles.headerSubtitle}>Mova alunos entre cursos</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#3182CE" />
          <Text style={styles.infoText}>
            Esta ação transferirá TODOS os alunos do curso selecionado para outro curso.
            Apenas alunos serão transferidos; disciplinas e notas permanecem inalteradas.
          </Text>
        </View>

        <View style={styles.cursoOrigemCard}>
          <Text style={styles.sectionTitle}>Curso de Origem</Text>
          <View style={styles.cursoCard}>
            <View style={styles.cursoHeader}>
              <Text style={styles.cursoNomeLarge}>{curso.nome}</Text>
              <View style={styles.cursoSiglaBadge}>
                <Text style={styles.cursoSiglaText}>{curso.sigla}</Text>
              </View>
            </View>
            <Text style={styles.cursoDetalhesLarge}>
              {curso.area} • {curso.total_alunos || 0} alunos matriculados
            </Text>
          </View>
        </View>

        <View style={styles.cursoDestinoSection}>
          <Text style={styles.sectionTitle}>Curso de Destino</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.selectorContent}>
              <Ionicons name="school-outline" size={20} color="#666" />
              <Text style={cursoDestino ? styles.selectorText : styles.selectorPlaceholder}>
                {cursoDestino ? cursoDestino.nome : 'Selecione o curso de destino'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          {cursoDestino && (
            <View style={styles.cursoSelecionadoCard}>
              <View style={styles.cursoSelecionadoHeader}>
                <Ionicons name="checkmark-circle" size={20} color="#38A169" />
                <Text style={styles.cursoSelecionadoTitle}>Curso Selecionado</Text>
              </View>
              <Text style={styles.cursoSelecionadoNome}>{cursoDestino.nome}</Text>
              <Text style={styles.cursoSelecionadoDetalhes}>
                {cursoDestino.sigla} • {cursoDestino.area} • {cursoDestino.total_alunos || 0} alunos
              </Text>
            </View>
          )}
        </View>

        {cursoDestino && (
          <View style={styles.resumoCard}>
            <Text style={styles.resumoTitle}>Resumo da Transferência</Text>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>De:</Text>
              <Text style={styles.resumoValue}>{curso.nome}</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Para:</Text>
              <Text style={styles.resumoValue}>{cursoDestino.nome}</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Alunos:</Text>
              <Text style={styles.resumoValue}>
                {curso.total_alunos || 0} alunos serão transferidos
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.transferButton,
            (!cursoDestino || loading) && styles.transferButtonDisabled
          ]}
          onPress={handleTransferir}
          disabled={!cursoDestino || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
              <Text style={styles.transferButtonText}>Transferir Alunos</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#4A6572" />
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para seleção de curso destino */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Curso de Destino</Text>
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
                <Text style={styles.emptyText}>Nenhum outro curso disponível</Text>
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
    padding: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EBF8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BEE3F8',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: '#2C5282',
    fontSize: 14,
    lineHeight: 20,
  },
  cursoOrigemCard: {
    marginBottom: 24,
  },
  cursoDestinoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  cursoCard: {
    backgroundColor: '#EDF2F7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cursoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cursoNomeLarge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
  },
  cursoSiglaBadge: {
    backgroundColor: '#4A6572',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cursoSiglaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cursoDetalhesLarge: {
    fontSize: 14,
    color: '#718096',
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
    marginTop: 12,
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
    marginBottom: 4,
  },
  cursoSelecionadoDetalhes: {
    fontSize: 14,
    color: '#718096',
  },
  resumoCard: {
    backgroundColor: '#EDF2F7',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  resumoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  resumoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  resumoLabel: {
    fontSize: 14,
    color: '#718096',
  },
  resumoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3182CE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#3182CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  transferButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  transferButtonText: {
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
  cursoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
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
});