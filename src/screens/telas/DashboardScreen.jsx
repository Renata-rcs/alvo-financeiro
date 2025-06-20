import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { Card } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";

import { ActivityIndicator } from "react-native";

// Importar TODOS os serviços de categorias (gastos e saldo/entradas)
import AlimentacaoService from "../../services/AlimentacaoService";
import CasaService from "../../services/CasaService";
import TransporteService from "../../services/TransporteService";
import EducacaoService from "../../services/EducacaoService";
import LazerService from "../../services/LazerService";
import SaudeService from "../../services/SaudeService";
import SaldoService from "../../services/SaldoService";

// Anos para seleção (2020 a 2030)
const anos = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

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

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1
  );
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );
  const [mostrarModal, setMostrarModal] = useState(false);
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [saldoLiquido, setSaldoLiquido] = useState(0);
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);

  const [indicadores, setIndicadores] = useState(null);
  const [carregandoIndicadores, setCarregandoIndicadores] = useState(false);
useEffect(() => {
  fetch("https://brasilapi.com.br/api/taxas/v1")
    .then((response) => response.json())
    .then((data) => {
      const selic = data.find((item) => item.nome === "Selic");
      const cdi = data.find((item) => item.nome === "CDI");
      const ipca = data.find((item) => item.nome === "IPCA");
      

      setIndicadores({
        selic: selic?.valor ?? null,
        cdi: cdi?.valor ?? null,
        ipca: ipca?.valor ?? null,
        // dolar: null,
        // euro: null,
      });
    });

  // Se quiser comentar tudo do fetch encadeado, comente assim:
  /*
  fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL")
    .then((res) => res.json())
    .then((data) => {
      const dolar = parseFloat(data.USDBRL.bid);
      const euro = parseFloat(data.EURBRL.bid);

      setIndicadores((prev) => ({
        ...prev,
        dolar,
        euro,
      }));
    })
    .catch((error) => {
      console.error("Erro ao buscar indicadores econômicos:", error);
    })
    .finally(() => {
      setCarregandoIndicadores(false);
    });
  */

}, []);


  useFocusEffect(
    useCallback(() => {
      calcularTotaisDashboard();
    }, [mesSelecionado, anoSelecionado])
  );

  async function calcularTotaisDashboard() {
    console.log(
      `[Dashboard] Calculando totais para: ${
        meses.find((m) => m.id === mesSelecionado)?.nome
      } ${anoSelecionado}`
    );

    const entradasMes =
      (await SaldoService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0;
    setTotalEntradas(entradasMes);

    const despesasAlimentacao =
      (await AlimentacaoService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0;
    const despesasCasa =
      (await CasaService.calcularTotalPorMes(mesSelecionado, anoSelecionado)) ||
      0;
    const despesasTransporte =
      (await TransporteService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0;
    const despesasEducacao =
      (await EducacaoService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0;
    const despesasLazer =
      (await LazerService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0;
    const despesasSaude =
      (await SaudeService.calcularTotalPorMes(
        mesSelecionado,
        anoSelecionado
      )) || 0;

    const totalDespesasCalculado =
      despesasAlimentacao +
      despesasCasa +
      despesasTransporte +
      despesasEducacao +
      despesasLazer +
      despesasSaude;
    setTotalDespesas(totalDespesasCalculado);

    const liquido = entradasMes - totalDespesasCalculado;
    setSaldoLiquido(liquido);

    const dadosGrafico = [
      // MUITO IMPORTANTE: Definir legendFontSize: 0 para esconder as labels internas do PieChart.
      // Isso garante que apenas a sua legenda customizada seja visível.
     
  {
    name: "Alimentação",
    population: despesasAlimentacao,
    color: "#FF8C00",  // laranja escuro
    legendFontColor: "#000",
    legendFontSize: 0,
  },
  {
    name: "Casa",
    population: despesasCasa,
    color: "#A0522D",  // marrom
    legendFontColor: "#000",
    legendFontSize: 0,
  },
  {
    name: "Transporte",
    population: despesasTransporte,
    color: "#D3D3D3",  // cinza claro
    legendFontColor: "#000",
    legendFontSize: 0,
  },
  {
    name: "Educação",
    population: despesasEducacao,
    color: "#DAA520",  // dourado
    legendFontColor: "#000",
    legendFontSize: 0,
  },
  {
    name: "Lazer",
    population: despesasLazer,
    color: "#B8860B",  // marrom dourado
    legendFontColor: "#000",
    legendFontSize: 0,
  },
  {
    name: "Saúde",
    population: despesasSaude,
    color: "#CD5C5C",  // marrom avermelhado
    legendFontColor: "#000",
    legendFontSize: 0,
  },
    ].filter((item) => item.population > 0);

    setGastosPorCategoria(dadosGrafico);
  }

  const nomeMesAtual = meses.find((m) => m.id === mesSelecionado)?.nome;

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => setMostrarModal(true)}
        style={styles.botaoSelecao}
      >
        <Text style={styles.botaoTexto}>
          {`Mês/Ano: ${nomeMesAtual} ${anoSelecionado}`}
        </Text>
      </TouchableOpacity>

      <Modal visible={mostrarModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Selecionar Período</Text>
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

      <Card style={styles.saldoGeralCard}>
        <Card.Content style={styles.saldoContent}>
          <Text style={styles.saldoGeralTitulo}>Saldo Total</Text>
          <Text
            style={[
              styles.saldoGeralValor,
              { color: saldoLiquido >= 0 ? "#28a745" : "#dc3545" },
            ]}
          >
            R${" "}
            {Number(saldoLiquido).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <View style={styles.saldoDetalhes}>
            <View style={styles.saldoItem}>
              <Text style={styles.saldoLabel}>Entradas</Text>
              <Text style={styles.saldoValorPositivo}>
                R${" "}
                {Number(totalEntradas).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={styles.saldoItem}>
              <Text style={styles.saldoLabel}>Despesas</Text>
              <Text style={styles.saldoValorNegativo}>
                R${" "}
                {Number(totalDespesas).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      {/* Gráfico de Pizza de Despesas - Ajustado para a imagem de referência */}
      {gastosPorCategoria.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Despesas por Categoria</Text>
          <View style={styles.chartAndLegendRow}>
            <PieChart
              data={gastosPorCategoria}
              width={(screenWidth - 40) * 0.55}
              height={200}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
              // Remove os rótulos do gráfico (para não ter texto duplicado)
              // A biblioteca deveria ignorar se legendFontSize: 0 no data, mas explicitamente desabilitar aqui também.
              // Esta prop 'hasLegend' controla a LEGEND padrão do chart-kit.
              hasLegend={false} // <--- MUITO IMPORTANTE: desabilita a legenda padrão do chart-kit
            />
            {/* Legenda Externa na lateral (coluna) */}
            <View style={styles.legendColumnContainer}>
              {gastosPorCategoria.map((item, index) => (
                <View key={index} style={styles.legendItemColumn}>
                  <View
                    style={[
                      styles.legendColorBox,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.legendTextColumn}>
                    {Number(item.population).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {item.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>
          Nenhum gasto registrado para o mês selecionado.
        </Text>
      )}

      {/* Indicadores Econômicos (Estilo com cards coloridos) */}
    <View style={styles.indicadoresContainer}>
      <Text style={styles.indicadoresTitulo}>Indicadores Econômicos</Text>

      {carregandoIndicadores ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : indicadores ? (
        <View style={styles.indicadoresCards}>
          <View style={[styles.indicadorCard, { backgroundColor: "#A0522D" }]}>
            <Text style={styles.indicadorCardTitulo}>SELIC</Text>
            <Text style={styles.indicadorCardValor}>
              {indicadores.selic !== null
                ? indicadores.selic.toFixed(2) + "%"
                : "N/A"}
            </Text>
          </View>

          <View style={[styles.indicadorCard, { backgroundColor: "#F6C046" }]}>
            <Text style={styles.indicadorCardTitulo}>IPCA</Text>
            <Text style={styles.indicadorCardValor}>
              {indicadores.ipca !== null
                ? indicadores.ipca.toFixed(2) + "%"
                : "N/A"}
            </Text>
          </View>

          <View style={[styles.indicadorCard, { backgroundColor: "#B8860B" }]}>
            <Text style={styles.indicadorCardTitulo}>CDI</Text>
            <Text style={styles.indicadorCardValor}>
              {indicadores.cdi !== null
                ? indicadores.cdi.toFixed(2) + "%"
                : "N/A"}
            </Text>
          </View>

          {/* <View style={[styles.indicadorCard, { backgroundColor: "#3B5998" }]}>
            <Text style={styles.indicadorCardTitulo}>DÓLAR (USD)</Text>
            <Text style={styles.indicadorCardValor}>
              {indicadores.dolar !== null
                ? "R$ " + indicadores.dolar.toFixed(2)
                : "N/A"}
            </Text>
          </View>

          <View style={[styles.indicadorCard, { backgroundColor: "#8B4513" }]}>
            <Text style={styles.indicadorCardTitulo}>EURO (EUR)</Text>
            <Text style={styles.indicadorCardValor}>
              {indicadores.euro !== null
                ? "R$ " + indicadores.euro.toFixed(2)
                : "N/A"}
            </Text>
          </View> */}
        </View>
      ) : (
        <Text style={styles.noDataText}>
          Não foi possível carregar os indicadores.
        </Text>
      )}
    </View>
  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF7F00",
    marginBottom: 20,
  },
  botaoSelecao: {
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  saldoGeralCard: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  saldoContent: {
    alignItems: "center",
  },
  saldoGeralTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  saldoGeralValor: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 15,
  },
  saldoDetalhes: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  saldoItem: {
    alignItems: "center",
    margin: 20
  },
  saldoLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  saldoValorPositivo: {
    fontSize: 18,
    fontWeight: "bold",
    color:'#FFA500',
  },
  saldoValorNegativo: {
    fontSize: 18,
    fontWeight: "bold",
    color:'#5D4037',
  },
  chartContainer: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    paddingLeft: 10,
    textAlign: "center",
  },
  chartAndLegendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  legendColumnContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  legendItemColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
  },
  legendColorBox: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 8,
  },
  legendTextColumn: {
    fontSize: 15,
    color: "#555",
    flexShrink: 1,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    width: "85%",
    maxHeight: "75%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#A0522D",
  },
  pickersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  flatList: {
    width: "48%",
    maxHeight: 250,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  itemSelecionado: {
    backgroundColor: "#FFA500",
  },
  itemTexto: {
    fontSize: 17,
    color: "#555",
  },
  itemTextoSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoFechar: {
    backgroundColor:  "#808080",
    padding: 12,
    borderRadius: 10,
    width: "70%",
    alignItems: "center",
  },
  botaoFecharTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  indicadoresContainer: {
    height: "auto",
    width:'95%',
    margin: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  indicadoresTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  indicadoresCards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  indicadorCard: {
    width: "30%",
    height: 120,
    marginBottom: 16, 
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicadorCardTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  indicadorCardValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 12,
    color: '#888',
  },
});
