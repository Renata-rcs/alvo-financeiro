import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, FlatList } from "react-native";
import { Text, Button, Card, ProgressBar, Avatar, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_USUARIO = "@perfil";
const CHAVE_METAS = "@metas";

export default function PerfilScreen({ navigation }) {
  const [perfil, setPerfil] = useState(null);
  const [metas, setMetas] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      const usuarioArmazenado = await AsyncStorage.getItem(CHAVE_USUARIO);
      if (usuarioArmazenado) {
        setPerfil(JSON.parse(usuarioArmazenado));
      } else {
        const perfilInicial = {
          nome: "Nome do Usuário",
          email: "usuario@email.com",
          senha: "senha123",
          imagemPerfil: null,
          idade: "",
          ocupacao: "",
          localizacao: "",
        };
        await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(perfilInicial));
        setPerfil(perfilInicial);
      }
      const metasArmazenadas = await AsyncStorage.getItem(CHAVE_METAS);
      if (metasArmazenadas) {
        setMetas(JSON.parse(metasArmazenadas));
      }
    };
    carregarDados();
  }, []);

  if (!perfil) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF7F00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {perfil.imagemPerfil ? (
          <Image source={{ uri: perfil.imagemPerfil }} style={styles.imagemPerfil} />
        ) : (
          <Avatar.Icon icon="account" size={80} style={styles.imagemPlaceholder} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{perfil.nome}</Text>
          <Text style={styles.email}>✉ {perfil.email}</Text>
        </View>
      </View>

      <View style={styles.dadosContainer}>
        <Text style={styles.info}><Text style={styles.label}>✔ Idade:</Text> {perfil.idade || "Não informado"}</Text>
        <Text style={styles.info}><Text style={styles.label}>💼 Ocupação:</Text> {perfil.ocupacao || "Não informado"}</Text>
        <Text style={styles.info}><Text style={styles.label}>📍 Localização:</Text> {perfil.localizacao || "Não informado"}</Text>
      </View>

      <Button
        style={styles.button}
        mode="contained"
        onPress={() => navigation.navigate("PerfilForm", perfil)}
        buttonColor="#FF7F00"
      >
        Editar Perfil
      </Button>

      <View style={styles.metasContainer}>
        <Text style={styles.tituloResumo}>Minhas Metas</Text>

        {metas.length === 0 ? (
          <Text style={styles.semMetas}>Nenhuma meta cadastrada.</Text>
        ) : (
          <FlatList
            data={metas}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.linhaCards}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.metaNome}>{item.nome}</Text>
                  <Text style={styles.metaData}>Data: {item.prazo}</Text>
                  <ProgressBar progress={item.progresso / 100} color="#FF7F00" style={styles.progresso} />
                  <Text style={styles.porcentagem}>{item.progresso}%</Text>
                </Card.Content>
              </Card>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  imagemPerfil: {
    width: 100,
    height: 100,
    borderRadius: 40,
    marginRight: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  imagemPlaceholder: {
    backgroundColor: "#ddd",
    marginRight: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  infoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#37474F",
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
  dadosContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#37474F",
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 5,
  },
  metasContainer: {
    flex: 1,
    marginTop: 30,
  },
  tituloResumo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF7F00",
  },
  linhaCards: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginRight: 15,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    elevation: 3,
    padding: 12,
  },
  metaNome: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#37474F",
  },
  metaData: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  progresso: {
    height: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  porcentagem: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    color: "#FF7F00",
  },
  semMetas: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
});
