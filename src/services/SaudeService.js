import AsyncStorage from '@react-native-async-storage/async-storage';

async function listar() {
  const jsonValue = await AsyncStorage.getItem('@saudes');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(saude) {
  saude.id = new Date().getTime();
  const saudes = await listar();
  saudes.push(saude);
  await AsyncStorage.setItem('@saudes', JSON.stringify(saudes));
}

async function buscar(id) {
  const saudes = await listar();
  return saudes.find(saude => saude.id === id);
}

async function remover(id) {
  const saudes = await listar();
  const novaLista = saudes.filter(saude => saude.id !== id);
  await AsyncStorage.setItem('@saudes', JSON.stringify(novaLista));
}

async function atualizar(novaSaude) {
  const saudes = await listar();
  const novaLista = saudes.map(saude => saude.id === novaSaude.id ? novaSaude : saude);
  await AsyncStorage.setItem('@saudes', JSON.stringify(novaLista));
}

async function calcularTotal() {
  const saudes = await listar();
  console.log("Lista de gastos para soma:", saudes);

  const total = saudes.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Aviso: O item ${item.id} não tem um valor definido.`);
      return acc;
    }

    // Remove pontos de milhares, "R$", e troca vírgula por ponto
    let valorStr = String(item.valor)
      .replace(/\./g, '') // remove pontos de milhares, ex: 1.234 -> 1234
      .replace("R$", "")
      .trim()
      .replace(",", ".");

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
  const saudes = await listar();

  // Filtrar apenas os gastos do mês e ano selecionados, validando o formato da data
  const gastosDoMes = saudes.filter(item => {
    if (!item.data) return false;
    const partes = item.data.split('/');
    if (partes.length !== 3) return false;
    const [dia, mes, ano] = partes;
    return parseInt(mes) === mesSelecionado && parseInt(ano) === anoSelecionado;
  });

  console.log(`Gastos do mês ${mesSelecionado}/${anoSelecionado}:`, gastosDoMes);

  const total = gastosDoMes.reduce((acc, item) => {
    let valorStr = String(item.valor)
      .replace(/\./g, '') // remove pontos de milhares
      .replace("R$", "")
      .trim()
      .replace(",", ".");
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
