import React, { useState } from 'react';
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
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroUsuarioScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [perfil, setPerfil] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalPerfilVisible, setModalPerfilVisible] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);

  const perfis = [
    { 
      id: 'aluno', 
      nome: 'Aluno', 
      descricao: 'Acesso ao boletim acadêmico', 
      icon: 'school' as const, 
      color: '#38A169' 
    },
    { 
      id: 'professor', 
      nome: 'Professor', 
      descricao: 'Cadastro de notas e disciplinas', 
      icon: 'person' as const, 
      color: '#3182CE' 
    },
    { 
      id: 'admin', 
      nome: 'Administrador', 
      descricao: 'Acesso completo ao sistema', 
      icon: 'shield' as const, 
      color: '#E53E3E' 
    }
  ];

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha: string): boolean => {
    return senha.length >= 6;
  };

  const handleCadastrar = async () => {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha || !perfil) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Atenção', 'Digite um email válido');
      return;
    }

    if (!validarSenha(senha)) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,
        perfil: perfil
      };

      await api.register(payload);
      
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            setNome('');
            setEmail('');
            setSenha('');
            setConfirmarSenha('');
            setPerfil('');
            navigation.goBack();
          }
        }
      ]);
    } catch (err: any) {
      console.error('Erro ao cadastrar usuário:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao cadastrar usuário';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPerfilItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.perfilItem,
        perfil === item.id && styles.perfilSelecionado
      ]}
      onPress={() => {
        setPerfil(item.id);
        setModalPerfilVisible(false);
      }}
    >
      <View style={[styles.perfilIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.perfilInfo}>
        <Text style={styles.perfilNome}>{item.nome}</Text>
        <Text style={styles.perfilDescricao}>{item.descricao}</Text>
      </View>
      {perfil === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={item.color} />
      )}
    </TouchableOpacity>
  );

  const getPerfilSelecionado = () => {
    return perfis.find(p => p.id === perfil);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Novo Usuário</Text>
        <Text style={styles.headerSubtitle}>Crie uma nova conta no sistema</Text>
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
          <Text style={styles.label}>Email *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="exemplo@email.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              secureTextEntry={secureText}
            />
            <TouchableOpacity 
              onPress={() => setSecureText(!secureText)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={secureText ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar Senha *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              style={styles.input}
              placeholder="Digite a senha novamente"
              placeholderTextColor="#999"
              secureTextEntry={secureTextConfirm}
            />
            <TouchableOpacity 
              onPress={() => setSecureTextConfirm(!secureTextConfirm)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={secureTextConfirm ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Perfil *</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setModalPerfilVisible(true)}
          >
            <View style={styles.selectorContent}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={perfil ? styles.selectorText : styles.selectorPlaceholder}>
                {perfil ? getPerfilSelecionado()?.nome : 'Selecione um perfil'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {perfil && (
          <View style={styles.perfilCard}>
            <View style={styles.perfilCardHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#38A169" />
              <Text style={styles.perfilCardTitle}>Perfil Selecionado</Text>
            </View>
            <Text style={styles.perfilCardName}>{getPerfilSelecionado()?.nome}</Text>
            <Text style={styles.perfilCardDetails}>
              {getPerfilSelecionado()?.descricao}
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!nome || !email || !senha || !confirmarSenha || !perfil) && styles.saveButtonDisabled
          ]}
          onPress={handleCadastrar}
          disabled={!nome || !email || !senha || !confirmarSenha || !perfil || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="person-add" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Cadastrar Usuário</Text>
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

      {/* Modal de Seleção de Perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPerfilVisible}
        onRequestClose={() => setModalPerfilVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Perfil</Text>
              <TouchableOpacity 
                onPress={() => setModalPerfilVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#4A6572" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={perfis}
              keyExtractor={(item) => item.id}
              renderItem={renderPerfilItem}
              style={styles.perfilList}
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
  eyeIcon: {
    padding: 4,
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
  perfilCard: {
    backgroundColor: '#F0FFF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9AE6B4',
    marginTop: 8,
    marginBottom: 24,
  },
  perfilCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  perfilCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38A169',
    marginLeft: 8,
  },
  perfilCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  perfilCardDetails: {
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
  perfilList: {
    padding: 16,
  },
  perfilItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F7FAFC',
  },
  perfilSelecionado: {
    backgroundColor: '#EDF2F7',
    borderWidth: 1,
    borderColor: '#4A6572',
  },
  perfilIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  perfilInfo: {
    flex: 1,
  },
  perfilNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 2,
  },
  perfilDescricao: {
    fontSize: 12,
    color: '#718096',
  },
});