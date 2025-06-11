import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import PerfilService from "../../services/PerfilService";

export default function PerfilForm({ navigation, route }) {
  const { nome, email } = route.params;

  const [ocupacao, setOcupacao] = useState("");
  const [cep, setCep] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const [idade, setIdade] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      const dados = await PerfilService.buscarPerfil();
      if (dados) {
        setOcupacao(dados.ocupacao || "");
        setCep(dados.cep || "");
        setLocalizacao(dados.localizacao || "");
        setImagemPerfil(dados.imagemPerfil || null);
        setIdade(dados.idade || "");
      }
    }
    carregarPerfil();
  }, []);

  async function escolherImagem() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets?.[0]?.uri) {
      setImagemPerfil(resultado.assets[0].uri);
    }
  }

  async function buscarCEP(texto) {
    setCep(texto);
    if (texto.length === 8) {
      const localizacao = await PerfilService.buscarLocalizacao(texto);
      if (localizacao) setLocalizacao(localizacao);
      else Alert.alert("Erro", "CEP inválido.");
    }
  }

  async function salvarPerfil() {
    const perfilAtualizado = {
      nome,
      email,
      idade,
      ocupacao,
      cep,
      localizacao,
      imagemPerfil,
    };

    await PerfilService.salvarPerfil(perfilAtualizado);
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        {imagemPerfil && (
          <Image source={{ uri: imagemPerfil }} style={styles.imagemPerfil} />
        )}
        <Button mode="contained" onPress={escolherImagem} buttonColor="#FF7F00" style={styles.buttonFoto}>
          Escolher Foto
        </Button>

        <TextInput style={styles.input} mode="outlined" label="Nome" value={nome} disabled />
        <TextInput style={styles.input} mode="outlined" label="Email" value={email} disabled />
        <TextInput style={styles.input} mode="outlined" label="Idade" value={idade} keyboardType="numeric" onChangeText={setIdade} />
        <TextInput style={styles.input} mode="outlined" label="Ocupação" placeholder="Informe sua ocupação" value={ocupacao} onChangeText={setOcupacao} />
        <TextInput style={styles.input} mode="outlined" label="CEP" placeholder="Digite o CEP" value={cep} onChangeText={buscarCEP} keyboardType="numeric" />
        <TextInput style={styles.input} mode="outlined" label="Localização" placeholder="Sua cidade e estado" value={localizacao} onChangeText={setLocalizacao} />

        <Button style={styles.buttonSalvar} mode="contained" onPress={salvarPerfil} buttonColor="#FF7F00" contentStyle={{ paddingVertical: 10 }}>
          Salvar Perfil
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  imagemPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#FF7F00",
  },
  buttonFoto: {
    marginBottom: 20,
    width: "100%",
    borderRadius: 8,
  },
  buttonSalvar: {
    marginTop: 10,
    width: "100%",
    borderRadius: 8,
  },
});
