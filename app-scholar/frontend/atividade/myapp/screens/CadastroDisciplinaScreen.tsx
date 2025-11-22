import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Modal,
  FlatList,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroDisciplinaScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [carga, setCarga] = useState('');
  const [professores, setProfessores] = useState<any[]>([]);
  const [professorSelecionado, setProfessorSelecionado] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.listProfessores();
        setProfessores(res.data || []);
      } catch (err) {
        console.error(err);
        Alert.alert('Erro', 'Falha ao carregar professores');
      }
    };
    load();
  }, []);

  const handleSalvar = async () => {
    if (!nome || !carga || !professorSelecionado) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      const payload = { 
        nome, 
        carga_horaria: carga, 
        professor_id: professorSelecionado.id 
      };
      await api.createDisciplina(payload);
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao cadastrar disciplina');
    } finally {
      setLoading(false);
    }
  };

  const ProfessorItem = ({ professor }: any) => (
    <TouchableOpacity
      style={[
        styles.professorItem,
        professorSelecionado?.id === professor.id && styles.professorSelecionado
      ]}
      onPress={() => {
        setProfessorSelecionado(professor);
        setModalVisible(false);
      }}
    >
      <View style={styles.professorAvatar}>
        <Ionicons name="person" size={20} color="#4A6572" />
      </View>
      <View style={styles.professorInfo}>
        <Text style={styles.professorNome}>{professor.nome}</Text>
        <Text style={styles.professorDetalhes}>
          {professor.titulacao} • {professor.tempo_docencia} anos
        </Text>
      </View>
      {professorSelecionado?.id === professor.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4A6572" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nova Disciplina</Text>
        <Text style={styles.headerSubtitle}>Preencha os dados da disciplina</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome da Disciplina *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="book-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              value={nome} 
              onChangeText={setNome} 
              style={styles.input} 
              placeholder="Ex: Programação Mobile I"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Carga Horária *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              value={carga} 
              onChangeText={setCarga} 
              style={styles.input} 
              keyboardType="numeric" 
              placeholder="Ex: 80"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Professor Responsável *</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.selectorContent}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={professorSelecionado ? styles.selectorText : styles.selectorPlaceholder}>
                {professorSelecionado ? professorSelecionado.nome : 'Selecione um professor'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {professorSelecionado && (
          <View style={styles.professorCard}>
            <View style={styles.professorCardHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#38A169" />
              <Text style={styles.professorCardTitle}>Professor Selecionado</Text>
            </View>
            <Text style={styles.professorCardName}>{professorSelecionado.nome}</Text>
            <Text style={styles.professorCardDetails}>
              {professorSelecionado.titulacao} • {professorSelecionado.tempo_docencia} anos de experiência
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!nome || !carga || !professorSelecionado) && styles.saveButtonDisabled
          ]}
          onPress={handleSalvar}
          disabled={!nome || !carga || !professorSelecionado || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Cadastrar Disciplina</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal para seleção de professor */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Professor</Text>
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
                <Text style={styles.emptySubtext}>
                  Cadastre professores primeiro para associá-los a disciplinas
                </Text>
              </View>
            ) : (
              <FlatList
                data={professores}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <ProfessorItem professor={item} />}
                showsVerticalScrollIndicator={false}
                style={styles.professorsList}
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
  professorCard: {
    backgroundColor: '#F0FFF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9AE6B4',
    marginTop: 8,
  },
  professorCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  professorCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38A169',
    marginLeft: 8,
  },
  professorCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  professorCardDetails: {
    fontSize: 14,
    color: '#718096',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A6572',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
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
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
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
  professorsList: {
    padding: 16,
  },
  professorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F7FAFC',
  },
  professorSelecionado: {
    backgroundColor: '#EDF2F7',
    borderWidth: 1,
    borderColor: '#4A6572',
  },
  professorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  professorInfo: {
    flex: 1,
  },
  professorNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 2,
  },
  professorDetalhes: {
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