import AsyncStorage from '@react-native-async-storage/async-storage';

async function listar() {
  const jsonValue = await AsyncStorage.getItem('@lazeres');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(lazer) {
  lazer.id = new Date().getTime();
  const lazeres = await listar();
  lazeres.push(lazer);
  await AsyncStorage.setItem('@lazeres', JSON.stringify(lazeres));
}

async function buscar(id) {
  const lazeres = await listar();
  return lazeres.find(lazer => lazer.id === id);
}

async function remover(id) {
  const lazeres = await listar();
  const novaLista = lazeres.filter(lazer => lazer.id !== id);
  await AsyncStorage.setItem('@lazeres', JSON.stringify(novaLista));
}

async function atualizar(novoLazer) {
  const lazeres = await listar();
  const novaLista = lazeres.map(lazer => lazer.id === novoLazer.id ? novoLazer : lazer);
  await AsyncStorage.setItem('@lazeres', JSON.stringify(novaLista));
}

async function calcularTotal() {
  const lazeres = await listar();
  console.log("Lista de gastos para soma:", lazeres);

  const total = lazeres.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Aviso: O item ${item.id} não tem um valor definido.`);
      return acc;
    }

    // Remove pontos de milhar, "R$", e troca vírgula por ponto
    let valorStr = String(item.valor)
      .replace(/\./g, '') // remove pontos
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
  const lazeres = await listar();

  const gastosDoMes = lazeres.filter(item => {
    if (!item.data) {
      console.warn(`Item ${item.id} sem data.`);
      return false;
    }

    const partes = item.data.split('/');
    if (partes.length !== 3) {
      console.warn(`Data com formato inválido no item ${item.id}: ${item.data}`);
      return false;
    }

    const [dia, mes, ano] = partes.map(Number);
    return mes === mesSelecionado && ano === anoSelecionado;
  });

  console.log(`Gastos do mês ${mesSelecionado}/${anoSelecionado}:`, gastosDoMes);

  const total = gastosDoMes.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Item ${item.id} sem valor.`);
      return acc;
    }

    let valorStr = String(item.valor)
      .replace(/\./g, '')
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
