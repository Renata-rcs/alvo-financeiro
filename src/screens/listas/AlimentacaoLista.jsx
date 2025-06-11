import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import AlimentacaoService from "../../services/AlimentacaoService";

export default function AlimentacaoLista({ navigation }) {
  const [gastos, setGastos] = useState([]);
  
  useEffect(() => {
    buscarGastos();

  }, []);

  async function buscarGastos() {
    const listaGastos = await AlimentacaoService.listar();
    setGastos(listaGastos);
  }


  return (
    <View>
      <Button
        style={{ marginTop: 10, backgroundColor: "#37474F" }}  // marrom escuro
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate("AlimentacaoForm")}
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
                <Text style={styles.tituloNegrito}>Descrição: </Text>
                {item.descricao}
              </Text>
              <Text>
                <Text style={styles.tituloNegrito}>Data: </Text>
                {item.data}
              </Text>
              <Text>
                <Text style={styles.tituloNegrito}>Local: </Text>
                {item.local}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                icon="pencil"
                mode="outlined"
                textColor="#37474F"   // grafite escuro
                style={{ borderColor: "#37474F", borderWidth: 1 }}
                onPress={() => navigation.navigate("AlimentacaoForm", item)}
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
 
  totalTexto: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
