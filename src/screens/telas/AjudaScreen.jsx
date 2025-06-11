import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import {
  Button,
  Card,
  List,
  Divider,
  IconButton,
  Surface,
  Provider as PaperProvider,
  ActivityIndicator,
} from "react-native-paper";
import { Linking } from "react-native";

const topicos = [
  {
    id: "selic",
    titulo: "Taxa Selic",
    descricao:
      "A Taxa Selic é a taxa básica de juros da economia brasileira, usada pelo Banco Central para controlar a inflação e influenciar o custo do dinheiro. É referência para os juros de empréstimos, financiamentos e para os investimentos de renda fixa.",
    idVideo: "FlwQ8WbkWdk",
  },
  {
    id: "ipca",
    titulo: "IPCA (Índice de Preços ao Consumidor Amplo)",
    descricao:
      "O IPCA é o índice oficial que mede a inflação no Brasil. Ele calcula a variação dos preços de uma cesta de produtos e serviços consumidos pela população. É usado para reajustar salários, contratos e também serve como referência para o Banco Central no controle da inflação.",
    idVideo: "NqS5I1-yCyU",
  },
  {
    id: "cdi",
    titulo: "CDI (Certificado de Depósito Interbancário)",
    descricao:
      "O CDI é a taxa média dos empréstimos diários realizados entre bancos. É muito usada como referência para investimentos de renda fixa, como CDBs e fundos DI, pois representa o custo do dinheiro no mercado interbancário.",
    idVideo: "zKQJYEmNJiY",
  },
  {
    id: "fundos",
    titulo: "Fundos de investimento",
    descricao:
      "Os fundos de investimento permitem que vários investidores apliquem juntos em uma carteira diversificada de ativos, gerida por um gestor profissional. Eles oferecem a vantagem de diversificação, gestão especializada e acesso a investimentos que podem ser difíceis de realizar individualmente.",
    idVideo: "PIYgRE8YJDw",
  },
  {
    id: "tesouro",
    titulo: "Tesouro direto",
    descricao:
      "Investimento em títulos públicos emitidos pelo governo, geralmente considerados de baixo risco e com retornos previsíveis. É uma alternativa segura para quem busca preservar o capital e obter rendimentos acima da poupança.",
    idVideo: "xVWPaIbh2AY",
  },
  {
    id: "renda",
    titulo: "Renda variável",
    descricao:
      "Inclui ações, fundos imobiliários e outros ativos cujo retorno pode variar ao longo do tempo. Esses investimentos têm potencial de maior retorno, mas também maior risco, sendo indicado para investidores com perfil moderado a arrojado.",
    idVideo: "xBFhvYnMU3g",
  },
  {
    id: "gastos",
    titulo: "Como organizar os gastos",
    descricao:
      "Dicas e estratégias para manter um orçamento equilibrado, controlar despesas, evitar dívidas e alcançar suas metas financeiras pessoais e familiares com mais facilidade e segurança.",
    idVideo: "SJ7-ImU4UYc",
  },
  {
    id: "previdencia",
    titulo: "Previdência privada",
    descricao:
      "A previdência privada é um investimento de longo prazo que visa complementar a aposentadoria oficial. Entenda os diferentes tipos de planos, vantagens fiscais e como escolher o melhor para o seu perfil.",
    idVideo: "-Cov6AUHr4w",
  },
  {
    id: "educacao-financeira",
    titulo: "Educação financeira básica",
    descricao:
      "Fundamentos da educação financeira, incluindo como criar uma reserva de emergência, importância do controle financeiro e hábitos para alcançar a independência financeira ao longo da vida.",
    idVideo: "vSqOWhzHDts",
  },
  {
    id: "imoveis",
    titulo: "Investimento em imóveis",
    descricao:
      "Conheça as vantagens e desafios de investir em imóveis, seja para aluguel ou valorização, e como esse tipo de investimento pode fazer parte de uma carteira diversificada.",
    idVideo: "k-k-QBKCwFY",
  },
  {
    id: "diversificacao",
    titulo: "Diversificação de investimentos",
    descricao:
      "Aprenda a importância de distribuir seus recursos em diferentes tipos de ativos para reduzir riscos e melhorar a estabilidade dos seus investimentos a longo prazo.",
    idVideo: "DNCysiWu1oY",
  },
];

export default function TelaAjuda() {
  const [topicoAbertoId, setTopicoAbertoId] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const alternarTopico = (id) => {
    if (topicoAbertoId === id) {
      setTopicoAbertoId(null);
    } else {
      setCarregando(true);
      setTopicoAbertoId(id);
      setTimeout(() => setCarregando(false), 500);
    }
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={estilos.container}>
        <View style={estilos.introducao}>
          <Text style={estilos.textoIntroducao}>
            Nesta seção, você encontra conteúdos selecionados para entender
            melhor o mundo dos investimentos, organização financeira e
            planejamento para o futuro. Cada tópico traz uma explicação simples
            e um vídeo para você aprender no seu ritmo.
          </Text>
        </View>

        {topicos.map(({ id, titulo, descricao, idVideo }) => (
          <Card key={id} style={estilos.cartao}>
            <List.Item
              title={titulo}
              titleStyle={{ fontWeight: "700", color: "#333" }}
              right={(props) => (
                <IconButton
                  {...props}
                  icon={topicoAbertoId === id ? "chevron-up" : "chevron-down"}
                  onPress={() => alternarTopico(id)}
                />
              )}
              onPress={() => alternarTopico(id)}
            />

            {topicoAbertoId === id && (
              <Surface style={estilos.superficie}>
                {carregando ? (
                  <ActivityIndicator animating={true} size="large" />
                ) : (
                  <>
                    <Text style={estilos.descricao}>{descricao}</Text>
                    <YoutubePlayer height={200} play={false} videoId={idVideo} />
                    <Button
                      mode="contained"
                      style={estilos.botao}
                      icon="youtube"
                      onPress={() =>
                        Linking.openURL(`https://www.youtube.com/watch?v=${idVideo}`)
                      }
                    >
                      Assistir no YouTube
                    </Button>
                  </>
                )}
              </Surface>
            )}
            <Divider />
          </Card>
        ))}
      </ScrollView>
    </PaperProvider>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  introducao: {
    backgroundColor: "#FFF3E0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    width: "100%",
    elevation: 3,
  },
  textoIntroducao: {
    fontSize: 16,
    color: "#6E4B00",
    textAlign: "justify",
  },
  cartao: {
    backgroundColor: "#FFA500",
    marginBottom: 15,
    elevation: 4,
    width: "100%",
  },
  superficie: {
    padding: 16,
    backgroundColor: "#fff",
  },
  descricao: {
    marginBottom: 15,
    fontSize: 16,
    color: "#444",
  },
  botao: {
    marginTop: 15,
    backgroundColor: "#A0522D",
  },
});
