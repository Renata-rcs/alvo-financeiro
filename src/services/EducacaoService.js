import AsyncStorage from '@react-native-async-storage/async-storage';

async function listar() {
  const jsonValue = await AsyncStorage.getItem('@educacoes');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(educacao) {
  educacao.id = new Date().getTime();
  const educacoes = await listar();
  educacoes.push(educacao);
  await AsyncStorage.setItem('@educacoes', JSON.stringify(educacoes));
}

async function buscar(id) {
  const educacoes = await listar();
  return educacoes.find(educacao => educacao.id === id);
}

async function remover(id) {
  const educacoes = await listar();
  const novaLista = educacoes.filter(educacao => educacao.id !== id);
  await AsyncStorage.setItem('@educacoes', JSON.stringify(novaLista));
}

async function atualizar(novaEducacao) {
  const educacoes = await listar();
  const novaLista = educacoes.map(educacao => educacao.id === novaEducacao.id ? novaEducacao : educacao);
  await AsyncStorage.setItem('@educacoes', JSON.stringify(novaLista));
}

async function calcularTotal() {
  const educacoes = await listar();
  console.log("Lista de gastos para soma:", educacoes);

  const total = educacoes.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Aviso: O item ${item.id} não tem um valor definido.`);
      return acc;
    }

    // Remove pontos (milhar), remove "R$", substitui vírgula por ponto decimal
    let valorStr = String(item.valor)
      .replace(/\./g, '')  // remove pontos de milhar
      .replace("R$", "")
      .replace(",", ".")
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
  const educacoes = await listar();

  const gastosDoMes = educacoes.filter(item => {
    if (!item.data) {
      console.warn(`Item ${item.id} sem data.`);
      return false;
    }

    const partesData = item.data.split('/');
    if (partesData.length !== 3) {
      console.warn(`Data com formato inválido no item ${item.id}: ${item.data}`);
      return false;
    }

    const [dia, mes, ano] = partesData.map(Number);
    return mes === mesSelecionado && ano === anoSelecionado;
  });

  console.log(`Gastos do mês ${mesSelecionado}/${anoSelecionado}:`, gastosDoMes);

  const total = gastosDoMes.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Item ${item.id} sem valor.`);
      return acc;
    }

    let valorStr = String(item.valor)
      .replace(/\./g, '')  // remove pontos de milhar
      .replace("R$", "")
      .replace(",", ".")
      .trim();

    let valorConvertido = parseFloat(valorStr);

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
