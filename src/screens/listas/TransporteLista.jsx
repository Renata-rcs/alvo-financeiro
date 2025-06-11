import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import TransporteService from "../../services/TransporteService";

export default function TransporteLista({ navigation }) {
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    buscarGastos();
  }, []);

  async function buscarGastos() {
    const listaGastos = await TransporteService.listar();
    setGastos(listaGastos);
  }

  async function removerGasto(id) {
    await TransporteService.remover(id);
    alert("Gasto excluído com sucesso!");
    buscarGastos();
  }

  return (
    <View>
      <Button
        style={{ marginTop: 10, backgroundColor: "#37474F" }}
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate("TransporteForm")}
      >
        Cadastrar
      </Button>

      <FlatList
        data={gastos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
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
                <Text style={styles.tituloNegrito}>Valor: </Text>
                R$ {item.valor}
              </Text>
              <Text>
                <Text style={styles.tituloNegrito}>Data: </Text>
                {item.data}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                icon="pencil"
                mode="outlined"
                textColor="#37474F"
                style={{ borderColor: "#37474F", borderWidth: 1 }}
                onPress={() => navigation.navigate("TransporteForm", item)}
              >
                Editar
              </Button>
              <Button
                icon="delete"
                buttonColor="#37474F"
                onPress={() => removerGasto(item.id)}
              >
                Excluir
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tituloNegrito: {
    fontWeight: "bold",
  },
});
