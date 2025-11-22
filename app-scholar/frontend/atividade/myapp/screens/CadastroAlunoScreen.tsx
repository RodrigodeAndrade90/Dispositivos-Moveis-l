import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function CadastroAlunoScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome || !matricula || !curso) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      const payload = { nome, matricula, curso };
      await api.createAluno(payload);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso');
      navigation.goBack();
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
          <View style={styles.inputContainer}>
            <Ionicons name="school-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              value={curso} 
              onChangeText={setCurso} 
              style={styles.input} 
              placeholder="Ex: DSM, ADS, ENG"
              placeholderTextColor="#999"
            />
          </View>
          <Text style={styles.helperText}>
            Sigla ou nome completo do curso
          </Text>
        </View>

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
            <Text style={styles.summaryValue}>{curso || 'Não informado'}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!nome || !matricula || !curso) && styles.saveButtonDisabled
          ]}
          onPress={handleSalvar}
          disabled={!nome || !matricula || !curso || loading}
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
});