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

const topics = [
  {
    id: "selic",
    title: "Taxa Selic",
    description:
      "A Taxa Selic é a taxa básica de juros da economia brasileira, usada pelo Banco Central para controlar a inflação e influenciar o custo do dinheiro. É referência para os juros de empréstimos, financiamentos e para os investimentos de renda fixa.",
    videoId: "FlwQ8WbkWdk", // [O que é Taxa Selic explicado em 3 minutos](https://www.youtube.com/watch?v=FlwQ8WbkWdk)
  },
  {
    id: "ipca",
    title: "IPCA (Índice de Preços ao Consumidor Amplo)",
    description:
      "O IPCA é o índice oficial que mede a inflação no Brasil. Ele calcula a variação dos preços de uma cesta de produtos e serviços consumidos pela população. É usado para reajustar salários, contratos e também serve como referência para o Banco Central no controle da inflação.",
    videoId: "NqS5I1-yCyU", // [IPCA: O que É? Como Funciona?](https://www.youtube.com/watch?v=NqS5I1-yCyU)
  },
  {
    id: "cdi",
    title: "CDI (Certificado de Depósito Interbancário)",
    description:
      "O CDI é a taxa média dos empréstimos diários realizados entre bancos. É muito usada como referência para investimentos de renda fixa, como CDBs e fundos DI, pois representa o custo do dinheiro no mercado interbancário.",
    videoId: "zKQJYEmNJiY", // [CDI: O QUE É E COMO FUNCIONA?](https://www.youtube.com/watch?v=zKQJYEmNJiY)
  },
  {
    id: "fundos",
    title: "Fundos de investimento",
    description:
      "Os fundos de investimento permitem que vários investidores apliquem juntos em uma carteira diversificada de ativos, gerida por um gestor profissional. Eles oferecem a vantagem de diversificação, gestão especializada e acesso a investimentos que podem ser difíceis de realizar individualmente.",
    videoId: "PIYgRE8YJDw", // [FUNDOS DE INVESTIMENTOS: O GUIA COMPLETO](https://www.youtube.com/watch?v=PIYgRE8YJDw)
  },
  {
    id: "tesouro",
    title: "Tesouro direto",
    description:
      "Investimento em títulos públicos emitidos pelo governo, geralmente considerados de baixo risco e com retornos previsíveis. É uma alternativa segura para quem busca preservar o capital e obter rendimentos acima da poupança.",
    videoId: "xVWPaIbh2AY", // [TESOURO DIRETO: Como investir a partir de R$10](https://www.youtube.com/watch?v=xVWPaIbh2AY)
  },
  {
    id: "renda",
    title: "Renda variável",
    description:
      "Inclui ações, fundos imobiliários e outros ativos cujo retorno pode variar ao longo do tempo. Esses investimentos têm potencial de maior retorno, mas também maior risco, sendo indicado para investidores com perfil moderado a arrojado.",
    videoId: "xBFhvYnMU3g", // [O que é RENDA VARIÁVEL e como começar a investir](https://www.youtube.com/watch?v=xBFhvYnMU3g)
  },
  {
    id: "gastos",
    title: "Como organizar os gastos",
    description:
      "Dicas e estratégias para manter um orçamento equilibrado, controlar despesas, evitar dívidas e alcançar suas metas financeiras pessoais e familiares com mais facilidade e segurança.",
    videoId: "SJ7-ImU4UYc", // [PLANILHA DE ORGANIZAÇÃO FINANCEIRA GRÁTIS](https://www.youtube.com/watch?v=SJ7-ImU4UYc)
  },
  {
    id: "previdencia",
    title: "Previdência privada",
    description:
      "A previdência privada é um investimento de longo prazo que visa complementar a aposentadoria oficial. Entenda os diferentes tipos de planos, vantagens fiscais e como escolher o melhor para o seu perfil.",
    videoId: "-Cov6AUHr4w", // [APOSENTADORIA, R$ 500,00 por mês na previdência privada, é suficiente?](https://www.youtube.com/watch?v=-Cov6AUHr4w)
  },
  {
    id: "educacao-financeira",
    title: "Educação financeira básica",
    description:
      "Fundamentos da educação financeira, incluindo como criar uma reserva de emergência, importância do controle financeiro e hábitos para alcançar a independência financeira ao longo da vida.",
    videoId: "vSqOWhzHDts", // [Educação Financeira do Zero: Como Investir](https://www.youtube.com/watch?v=vSqOWhzHDts)
  },
  {
    id: "imoveis",
    title: "Investimento em imóveis",
    description:
      "Conheça as vantagens e desafios de investir em imóveis, seja para aluguel ou valorização, e como esse tipo de investimento pode fazer parte de uma carteira diversificada.",
    videoId: "k-k-QBKCwFY", // [TUDO O QUE EU APRENDI INVESTINDO EM IMÓVEIS](https://www.youtube.com/watch?v=k-k-QBKCwFY)
  },
  {
    id: "diversificacao",
    title: "Diversificação de investimentos",
    description:
      "Aprenda a importância de distribuir seus recursos em diferentes tipos de ativos para reduzir riscos e melhorar a estabilidade dos seus investimentos a longo prazo.",
    videoId: "DNCysiWu1oY", // [Diversificação de investimentos: entenda a importância e como fazer](https://www.youtube.com/watch?v=DNCysiWu1oY)
  },
];

export default function AjudaScreen() {
  const [openTopicId, setOpenTopicId] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleTopic = (id) => {
    if (openTopicId === id) {
      setOpenTopicId(null);
    } else {
      setLoading(true);
      setOpenTopicId(id);
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Texto de introdução */}
        <View style={styles.introBox}>
          <Text style={styles.introText}>
            Nesta seção, você encontra conteúdos selecionados para entender
            melhor o mundo dos investimentos, organização financeira e
            planejamento para o futuro. Cada tópico traz uma explicação simples
            e um vídeo para você aprender no seu ritmo. Use esse espaço para
            tirar dúvidas, ampliar seu conhecimento e tomar decisões financeiras
            mais conscientes e seguras.
          </Text>
        </View>

        {topics.map(({ id, title, description, videoId }) => (
          <Card key={id} style={styles.card}>
            <List.Item
              title={title}
              titleStyle={{ fontWeight: "700", color: "#333" }}
              right={(props) => (
                <IconButton
                  {...props}
                  icon={openTopicId === id ? "chevron-up" : "chevron-down"}
                  onPress={() => toggleTopic(id)}
                />
              )}
              onPress={() => toggleTopic(id)}
            />

            {openTopicId === id && (
              <Surface style={styles.surface}>
                {loading ? (
                  <ActivityIndicator animating={true} size="large" />
                ) : (
                  <>
                    <Text style={styles.description}>{description}</Text>
                    <YoutubePlayer
                      height={200}
                      play={false}
                      videoId={videoId}
                    />
                    <Button
                      mode="contained"
                      style={styles.button}
                      icon="youtube"
                      onPress={() =>
                        Linking.openURL(
                          `https://www.youtube.com/watch?v=${videoId}`
                        )
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
  introBox: {
    backgroundColor: "#FFF3E0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  introText: {
    fontSize: 16,
    color: "#6E4B00",
    lineHeight: 22,
    textAlign: "justify",
  },
  card: {
    backgroundColor: "#FFA500",
    marginBottom: 15,
    elevation: 4,
    width: "100%",
  },
  surface: {
    padding: 16,
    backgroundColor: "#fff",
  },
  description: {
    marginBottom: 15,
    fontSize: 16,
    color: "#444",
  },
  button: {
    marginTop: 15,
    backgroundColor: "#A0522D",
  },
});
