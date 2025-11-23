import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getCep } from "../services/viaCep";
import { useCep } from "../hooks/useCep";

export default function ViaCepScreen() {
  const [cep, setCep] = useState("");
  const [erro, setErro] = useState(false);
  const { data, setData, adicionarConsulta } = useCep();

  async function handleSearch() {
    setErro(false);

    try {
      const response = await getCep(cep);

      if (response.erro) {
        setErro(true);
        setData(null);
        return;
      }

      setData(response);
      adicionarConsulta(response);
    } catch (error) {
      console.log("Erro ao buscar CEP", error);
      setErro(true);
      setData(null);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CEP</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cep}
        onChangeText={setCep}
        placeholder="Digite o CEP"
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Obter</Text>
      </TouchableOpacity>

      {erro && <Text style={styles.error}>CEP inválido</Text>}

      {data && (
        <View style={styles.result}>
          <Text>Logradouro: {data.logradouro}</Text>
          <Text>Bairro: {data.bairro}</Text>
          <Text>Localidade: {data.localidade}</Text>
          <Text>UF: {data.uf}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  label: { color: "#fff", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "yellow",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { fontWeight: "bold" },
  error: { color: "red", marginTop: 10 },
  result: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
});
