import { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal, FlatList, ScrollView } from "react-native";
import { Text, Card } from "react-native-paper";

// Import dos serviços
import AlimentacaoService from "../../services/AlimentacaoService";
import CasaService from "../../services/CasaService";
import TransporteService from "../../services/TransporteService";
import EducacaoService from "../../services/EducacaoService";
import LazerService from "../../services/LazerService";
import SaudeService from "../../services/SaudeService";
import SaldoService from "../../services/SaldoService";

// Anos para seleção (2020 a 2030)
const anos = Array.from({ length: 2030 - 2020 + 1 }, (_, i) => 2020 + i);

// Meses para seleção
const meses = [
  { id: 1, nome: "Janeiro" },
  { id: 2, nome: "Fevereiro" },
  { id: 3, nome: "Março" },
  { id: 4, nome: "Abril" },
  { id: 5, nome: "Maio" },
  { id: 6, nome: "Junho" },
  { id: 7, nome: "Julho" },
  { id: 8, nome: "Agosto" },
  { id: 9, nome: "Setembro" },
  { id: 10, nome: "Outubro" },
  { id: 11, nome: "Novembro" },
  { id: 12, nome: "Dezembro" },
];

export default function TransacoesScreen() {
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1
  );
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );

  const [totalAlimentacaoMes, setTotalAlimentacaoMes] = useState(0);
  const [totalCasaMes, setTotalCasaMes] = useState(0);
  const [totalTransporteMes, setTotalTransporteMes] = useState(0);
  const [totalEducacaoMes, setTotalEducacaoMes] = useState(0);
  const [totalLazerMes, setTotalLazerMes] = useState(0);
  const [totalSaudeMes, setTotalSaudeMes] = useState(0);
  const [totalSaldoMes, setTotalSaldoMes] = useState(0);

  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (mesSelecionado && anoSelecionado) {
      calcularTotalPorMes();
    }
  }, [mesSelecionado, anoSelecionado]);

  async function calcularTotalPorMes() {
    setTotalSaldoMes(
      (await SaldoService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0
    );
    setTotalAlimentacaoMes(
      (await AlimentacaoService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0
    );
    setTotalCasaMes(
      (await CasaService.calcularTotalPorMes(mesSelecionado, anoSelecionado)) ||
        0
    );
    setTotalTransporteMes(
      (await TransporteService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0
    );
    setTotalEducacaoMes(
      (await EducacaoService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0
    );
    setTotalLazerMes(
      (await LazerService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0
    );
    setTotalSaudeMes(
      (await SaudeService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => setMostrarModal(true)}
        style={styles.botao}
      >
        <Text style={styles.botaoTexto}>
          Selecionar: {meses.find((m) => m.id === mesSelecionado)?.nome}{" "}
          {anoSelecionado}
        </Text>
      </TouchableOpacity>

      <Modal visible={mostrarModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Selecionar Mês e Ano</Text>

            <View style={styles.pickersContainer}>
              <FlatList
                data={meses}
                keyExtractor={(item) => item.id.toString()}
                style={styles.flatList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const selecionado = item.id === mesSelecionado;
                  return (
                    <TouchableOpacity
                      onPress={() => setMesSelecionado(item.id)}
                      style={[
                        styles.item,
                        selecionado && styles.itemSelecionado,
                      ]}
                    >
                      <Text
                        style={[
                          styles.itemTexto,
                          selecionado && styles.itemTextoSelecionado,
                        ]}
                      >
                        {item.nome}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />

              <FlatList
                data={anos}
                keyExtractor={(item) => item.toString()}
                style={styles.flatList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const selecionado = item === anoSelecionado;
                  return (
                    <TouchableOpacity
                      onPress={() => setAnoSelecionado(item)}
                      style={[
                        styles.item,
                        selecionado && styles.itemSelecionado,
                      ]}
                    >
                      <Text
                        style={[
                          styles.itemTexto,
                          selecionado && styles.itemTextoSelecionado,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => setMostrarModal(false)}
              style={styles.botaoFechar}
            >
              <Text style={styles.botaoFecharTexto}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {[
        { nome: "Saldo", total: totalSaldoMes, estilo: styles.cardSaldo },
        {
          nome: "Alimentação",
          total: totalAlimentacaoMes,
          estilo: styles.cardAli,
        },
        { nome: "Casa", total: totalCasaMes, estilo: styles.cardCasa },
        {
          nome: "Transporte",
          total: totalTransporteMes,
          estilo: styles.cardTransporte,
        },
        {
          nome: "Educação",
          total: totalEducacaoMes,
          estilo: styles.cardEducacao,
        },
        { nome: "Lazer", total: totalLazerMes, estilo: styles.cardLazer },
        { nome: "Saúde", total: totalSaudeMes, estilo: styles.cardSaude },
      ].map((categoria, index) => (
        <Card key={index} style={categoria.estilo}>
          <Card.Content>
            <Text style={styles.cardTitulo}>
              {categoria.nome === "Saldo"
                ? "Saldo Total"
                : `Total de Gastos em ${categoria.nome}`}
            </Text>
            <Text style={styles.cardValor}>
              R${" "}
              {Number(categoria.total).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 40,
    backgroundColor: "#FFFFFF", // fundo branco
  },

  botao: {
    backgroundColor: "#FFA500", // laranja vibrante
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: "95%",
  },

  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center'
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // texto escuro neutro
  },

  cardValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFA500", // destaque em laranja
    marginTop: 10,
  },

  // Estilo base para todos os cards
  cardAli: {
    width: "95%",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF8C00", // laranja escuro
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 10,
  },

  cardCasa: {
    width: "95%",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A0522D", // marrom
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 10,
  },

  cardTransporte: {
    width: "95%",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D3D3D3", // cinza claro
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 10,
  },

  cardEducacao: {
    width: "95%",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DAA520", // dourado puxado pro laranja
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 10,
  },

  cardLazer: {
    width: "95%",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B8860B", // marrom dourado
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 10,
  },

  cardSaude: {
    width: "95%",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CD5C5C", // marrom avermelhado
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 10,
  },

  cardSaldo: {
    width: "95%",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#708090", // cinza azulado
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxHeight: "70%",
    alignItems: "center",
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#A0522D", // marrom
  },

  pickersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  flatList: {
    width: "45%",
    maxHeight: 200,
  },

  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },

  itemSelecionado: {
    backgroundColor: "#FFA500", // laranja
    borderRadius: 8,
  },

  itemTexto: {
    fontSize: 16,
    color: "#333",
  },

  itemTextoSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },

  botaoFechar: {
    marginTop: 20,
    backgroundColor: "#808080", // cinza
    padding: 10,
    borderRadius: 8,
    width: "60%",
  },

  botaoFecharTexto: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});



