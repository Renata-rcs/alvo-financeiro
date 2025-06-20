import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Text, ProgressBar } from "react-native-paper";
import MetasService from "../../services/MetasService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


export default function MetasLista({ navigation }) {
  
  const [metas, setMetas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      buscarMetas();
    }, [])
  );

  async function buscarMetas() {
    const listaMetas = await MetasService.listar();
    setMetas(listaMetas);
  }

  async function removerMeta(id) {
    await MetasService.remover(id);
    alert("Meta excluída com sucesso!");
    buscarMetas();
  }

  // Função para transformar string de valor monetário em número float
  function parseMoney(str) {
    if (!str) return 0;
    return (
      parseFloat(
        str
          .toString()
          .replace(/[R$\s.]/g, "") // remove R$, espaços e pontos
          .replace(",", ".") // substitui vírgula por ponto decimal
      ) || 0
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Button
        style={{ marginTop: 10, backgroundColor: "#37474F" }}
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate("MetasForm")}
      >
        Cadastrar
      </Button>

      <FlatList
        data={metas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const valorTotal = parseMoney(item.valor);
          const valorJuntado = parseMoney(item.valorJuntado);
          const progresso = valorTotal > 0 ? Math.min(valorJuntado / valorTotal, 1) : 0;

          return (
            <Card style={{ margin: 10 }}>
              <Card.Content>
                <Text>
                  <Text style={styles.tituloNegrito}>ID: </Text>
                  {item.id}
                </Text>
                <Text>
                  <Text style={styles.tituloNegrito}>Nome: </Text>
                  {item.nome}
                </Text>
                <Text>
                  <Text style={styles.tituloNegrito}>Valor da Meta: </Text>
                  R$ {item.valor}
                </Text>
                <Text>
                  <Text style={styles.tituloNegrito}>Valor Juntado: </Text>
                  R$ {item.valorJuntado || "0,00"}
                </Text>
                <Text>
                  <Text style={styles.tituloNegrito}>Descrição: </Text>
                  {item.descricao}
                </Text>
                <Text>
                  <Text style={styles.tituloNegrito}>Prazo: </Text>
                  {item.prazo}
                </Text>

                <Text style={{ marginTop: 8, marginBottom: 4, fontWeight: "bold" }}>
                  Progresso: {(progresso * 100).toFixed(2)}%
                </Text>

                <ProgressBar
                  progress={progresso}
                  color="#FF7F00"c
                  style={{ height: 10, borderRadius: 5 }}
                />
              </Card.Content>
              <Card.Actions>
                <Button
                  icon="pencil"
                  mode="outlined"
                  textColor="#37474F"
                  style={{ borderColor: "#37474F", borderWidth: 1 }}
                  onPress={() => navigation.navigate("MetasForm", item)}
                >
                  Editar
                </Button>
                <Button
                  icon="delete"
                  buttonColor="#37474F"
                  onPress={() => removerMeta(item.id)}
                >
                  Excluir
                </Button>
              </Card.Actions>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tituloNegrito: {
    fontWeight: "bold",
  },
});
