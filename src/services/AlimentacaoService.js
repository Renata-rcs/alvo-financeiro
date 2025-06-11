import AsyncStorage from '@react-native-async-storage/async-storage';

async function listar() {
  const jsonValue = await AsyncStorage.getItem('@alimentacoes');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(alimentacao) {
  alimentacao.id = new Date().getTime();
  const alimentacoes = await listar();
  alimentacoes.push(alimentacao);
  await AsyncStorage.setItem('@alimentacoes', JSON.stringify(alimentacoes));
}

async function buscar(id) {
  const alimentacoes = await listar();
  return alimentacoes.find(alimentacao => alimentacao.id === id);
}

async function remover(id) {
  const alimentacoes = await listar();
  const novaLista = alimentacoes.filter(alimentacao => alimentacao.id !== id);
  await AsyncStorage.setItem('@alimentacoes', JSON.stringify(novaLista));
}

async function atualizar(novoAlimento) {
  const alimentacoes = await listar();
  const novaLista = alimentacoes.map(alimentacao =>
    alimentacao.id === novoAlimento.id ? novoAlimento : alimentacao
  );
  await AsyncStorage.setItem('@alimentacoes', JSON.stringify(novaLista));
}

async function calcularTotal() {
  const alimentacoes = await listar();
  console.log("Lista de gastos para soma:", alimentacoes);

  const total = alimentacoes.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Aviso: O item ${item.id} não tem um valor definido.`);
      return acc;
    }

    // Remove pontos, remove "R$", substitui vírgula por ponto
    let valorStr = String(item.valor)
      .replace(/\./g, '')      // remove separadores de milhar
      .replace("R$", "")       // remove símbolo R$
      .replace(",", ".")       // vírgula vira ponto decimal
      .trim();

    console.log(`Valor antes da conversão (item ${item.id}):`, valorStr);

    const valorConvertido = parseFloat(valorStr);

    if (isNaN(valorConvertido)) {
      console.warn(`Erro ao converter valor do item ${item.id}: "${valorStr}" não é um número válido.`);
      return acc;
    }

    console.log(`Processando item ${item.id}: Valor convertido =`, valorConvertido);
    return acc + valorConvertido;
  }, 0);

  console.log("Total calculado:", total);
  return total;
}

async function calcularTotalPorMes(mesSelecionado, anoSelecionado) {
  const alimentacoes = await listar();

  // Filtrar apenas os gastos do mês e ano selecionados
  const gastosDoMes = alimentacoes.filter(item => {
    if (!item.data) {
      console.warn(`Item ${item.id} sem data definida.`);
      return false;
    }

    const partesData = item.data.split('/');
    if (partesData.length !== 3) {
      console.warn(`Formato de data inválido no item ${item.id}: ${item.data}`);
      return false;
    }

    const [dia, mes, ano] = partesData.map(Number);
    return mes === mesSelecionado && ano === anoSelecionado;
  });

  console.log(`Gastos do mês ${mesSelecionado}/${anoSelecionado}:`, gastosDoMes);

  // Somar os valores do mês selecionado
  const total = gastosDoMes.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Item ${item.id} sem valor definido.`);
      return acc;
    }

    let valorStr = String(item.valor)
      .replace(/\./g, '')      // remove pontos
      .replace("R$", "")       // remove símbolo
      .replace(",", ".")       // vírgula para ponto
      .trim();

    const valorConvertido = parseFloat(valorStr);

    if (isNaN(valorConvertido)) {
      console.warn(`Erro ao converter valor do item ${item.id}: "${valorStr}"`);
      return acc;
    }

    return acc + valorConvertido;
  }, 0);

  console.log(`Total de gastos para ${mesSelecionado}/${anoSelecionado}: R$ ${total}`);
  return total;
}

export default {
  listar,
  salvar,
  buscar,
  atualizar,
  remover,
  calcularTotal,
  calcularTotalPorMes,
};
