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
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function CadastroCursoScreen({ navigation, route }: any) {
  const { curso: cursoEditavel } = route.params || {};
  
  const [nome, setNome] = useState(cursoEditavel?.nome || '');
  const [sigla, setSigla] = useState(cursoEditavel?.sigla || '');
  const [area, setArea] = useState(cursoEditavel?.area || '');
  const [duracao, setDuracao] = useState(cursoEditavel?.duracao_meses?.toString() || '');
  const [professores, setProfessores] = useState<any[]>([]);
  const [coordenadorId, setCoordenadorId] = useState(cursoEditavel?.coordenador_id || null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAreasVisible, setModalAreasVisible] = useState(false);

  const areasComuns = [
    'Tecnologia da Informação',
    'Engenharia',
    'Administração',
    'Saúde',
    'Direito',
    'Educação',
    'Ciências Humanas',
    'Ciências Exatas',
    'Ciências Biológicas',
    'Artes'
  ];

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      const response = await api.listProfessores();
      setProfessores(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar professores:', err);
    }
  };

  const getCoordenadorSelecionado = () => {
    return professores.find(p => p.id === coordenadorId);
  };

  const validarCampos = () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Nome do curso é obrigatório');
      return false;
    }
    
    if (!sigla.trim()) {
      Alert.alert('Atenção', 'Sigla do curso é obrigatória');
      return false;
    }
    
    if (!area.trim()) {
      Alert.alert('Atenção', 'Área do curso é obrigatória');
      return false;
    }
    
    if (!duracao.trim()) {
      Alert.alert('Atenção', 'Duração do curso é obrigatória');
      return false;
    }
    
    const duracaoNum = parseInt(duracao);
    if (isNaN(duracaoNum) || duracaoNum < 6 || duracaoNum > 60) {
      Alert.alert('Atenção', 'Duração deve ser entre 6 e 60 meses');
      return false;
    }
    
    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);
      
      const payload = {
        nome: nome.trim(),
        sigla: sigla.trim().toUpperCase(),
        area: area.trim(),
        duracao_meses: parseInt(duracao),
        coordenador_id: coordenadorId || null
      };

      if (cursoEditavel) {
        // Atualizar curso existente
        await api.updateCurso(cursoEditavel.id, payload);
        Alert.alert('Sucesso', 'Curso atualizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        // Criar novo curso
        await api.createCurso(payload);
        Alert.alert('Sucesso', 'Curso cadastrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setNome('');
              setSigla('');
              setArea('');
              setDuracao('');
              setCoordenadorId(null);
              navigation.goBack();
            }
          }
        ]);
      }
    } catch (err: any) {
      console.error('Erro ao salvar curso:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao salvar curso';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderProfessorItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        coordenadorId === item.id && styles.itemSelecionado
      ]}
      onPress={() => {
        setCoordenadorId(item.id);
        setModalVisible(false);
      }}
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={20} color="#4A6572" />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>
          {item.titulacao} • {item.tempo_docencia} anos
        </Text>
      </View>
      {coordenadorId === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4A6572" />
      )}
    </TouchableOpacity>
  );

  const renderAreaItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.areaItem}
      onPress={() => {
        setArea(item);
        setModalAreasVisible(false);
      }}
    >
      <Text style={styles.areaText}>{item}</Text>
      <Ionicons name="chevron-forward" size={16} color="#718096" />
    </TouchableOpacity>
  );

  const formatarDuracaoPreview = () => {
    const meses = parseInt(duracao) || 0;
    if (meses === 0) return '';
    
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
        <Text style={styles.headerTitle}>
          {cursoEditavel ? 'Editar Curso' : 'Novo Curso'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {cursoEditavel ? 'Atualize os dados do curso' : 'Cadastre um novo curso no sistema'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Curso *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="school-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={nome}
              onChangeText={setNome}
              style={styles.input}
              placeholder="Ex: Desenvolvimento de Software Multiplataforma"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sigla *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="code-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={sigla}
              onChangeText={(text) => setSigla(text.toUpperCase())}
              style={styles.input}
              placeholder="Ex: DSM, ADS, ES"
              placeholderTextColor="#999"
              maxLength={10}
            />
          </View>
          <Text style={styles.helperText}>
            Sigla única de identificação (máx. 10 caracteres)
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Área *</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setModalAreasVisible(true)}
          >
            <View style={styles.selectorContent}>
              <Ionicons name="business-outline" size={20} color="#666" />
              <Text style={area ? styles.selectorText : styles.selectorPlaceholder}>
                {area || 'Selecione uma área'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duração (meses) *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={duracao}
              onChangeText={setDuracao}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Ex: 24"
              placeholderTextColor="#999"
              maxLength={3}
            />
          </View>
          <Text style={styles.helperText}>
            Duração total em meses (6 a 60)
            {duracao && (
              <Text style={styles.previewText}> • {formatarDuracaoPreview()}</Text>
            )}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Coordenador (Opcional)</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.selectorContent}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={coordenadorId ? styles.selectorText : styles.selectorPlaceholder}>
                {coordenadorId ? getCoordenadorSelecionado()?.nome : 'Selecione um coordenador'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Professor responsável pela coordenação do curso
          </Text>
        </View>

        {(nome || sigla || area || duracao) && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Pré-visualização</Text>
            
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Curso:</Text>
              <Text style={styles.previewValue}>{nome || 'Não informado'}</Text>
            </View>
            
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Sigla:</Text>
              <Text style={styles.previewValue}>{sigla || 'Não informado'}</Text>
            </View>
            
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Área:</Text>
              <Text style={styles.previewValue}>{area || 'Não informado'}</Text>
            </View>
            
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Duração:</Text>
              <Text style={styles.previewValue}>{formatarDuracaoPreview() || 'Não informado'}</Text>
            </View>
            
            {coordenadorId && (
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Coordenador:</Text>
                <Text style={styles.previewValue}>{getCoordenadorSelecionado()?.nome}</Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!nome || !sigla || !area || !duracao) && styles.saveButtonDisabled
          ]}
          onPress={handleSalvar}
          disabled={!nome || !sigla || !area || !duracao || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {cursoEditavel ? 'Atualizar Curso' : 'Cadastrar Curso'}
              </Text>
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

      {/* Modal para seleção de coordenador */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Coordenador</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#4A6572" />
              </TouchableOpacity>
            </View>

            {professores.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color="#CBD5E0" />
                <Text style={styles.emptyText}>Nenhum professor cadastrado</Text>
              </View>
            ) : (
              <FlatList
                data={professores}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderProfessorItem}
                ListHeaderComponent={
                  <TouchableOpacity
                    style={[styles.listItem, !coordenadorId && styles.itemSelecionado]}
                    onPress={() => {
                      setCoordenadorId(null);
                      setModalVisible(false);
                    }}
                  >
                    <View style={styles.avatar}>
                      <Ionicons name="close-circle" size={20} color="#718096" />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemNome}>Sem coordenador</Text>
                      <Text style={styles.itemDetalhes}>
                        O curso não terá um coordenador designado
                      </Text>
                    </View>
                    {!coordenadorId && (
                      <Ionicons name="checkmark-circle" size={24} color="#4A6572" />
                    )}
                  </TouchableOpacity>
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Modal para seleção de área */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAreasVisible}
        onRequestClose={() => setModalAreasVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Área</Text>
              <TouchableOpacity 
                onPress={() => setModalAreasVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#4A6572" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={areasComuns}
              keyExtractor={(item) => item}
              renderItem={renderAreaItem}
              ListHeaderComponent={
                <View style={styles.areaInputContainer}>
                  <TextInput
                    value={area}
                    onChangeText={setArea}
                    style={styles.areaInput}
                    placeholder="Ou digite uma área personalizada"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    style={styles.areaInputButton}
                    onPress={() => {
                      if (area.trim()) {
                        setModalAreasVisible(false);
                      }
                    }}
                  >
                    <Text style={styles.areaInputButtonText}>Usar</Text>
                  </TouchableOpacity>
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
  previewText: {
    fontWeight: '600',
    color: '#4A6572',
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
  previewCard: {
    backgroundColor: '#EDF2F7',
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  previewLabel: {
    fontSize: 14,
    color: '#718096',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    flex: 1,
    textAlign: 'right',
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
  // Modal de áreas
  areaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  areaText: {
    fontSize: 16,
    color: '#2D3748',
  },
  areaInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  areaInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    backgroundColor: '#F7FAFC',
  },
  areaInputButton: {
    backgroundColor: '#4A6572',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  areaInputButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});