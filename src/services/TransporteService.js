import AsyncStorage from '@react-native-async-storage/async-storage';

async function listar() {
  const jsonValue = await AsyncStorage.getItem('@transportes');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(transporte) {
  transporte.id = new Date().getTime();
  const transportes = await listar();
  transportes.push(transporte);
  await AsyncStorage.setItem('@transportes', JSON.stringify(transportes));
}

async function buscar(id) {
  const transportes = await listar();
  return transportes.find(transporte => transporte.id === id);
}

async function remover(id) {
  const transportes = await listar();
  const novaLista = transportes.filter(transporte => transporte.id !== id);
  await AsyncStorage.setItem('@transportes', JSON.stringify(novaLista));
}

async function atualizar(novoTransporte) {
  const transportes = await listar();
  const novaLista = transportes.map(transporte => transporte.id === novoTransporte.id ? novoTransporte : transporte);
  await AsyncStorage.setItem('@transportes', JSON.stringify(novaLista));
}

async function calcularTotal() {
  const transportes = await listar();
  console.log("Lista de gastos para soma:", transportes);

  const total = transportes.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Aviso: O item ${item.id} não tem um valor definido.`);
      return acc;
    }

    // Remove pontos de milhar, "R$", troca vírgula por ponto e trim
    let valorStr = String(item.valor)
      .replace(/\./g, '')
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
  const transportes = await listar();

  // Filtrar apenas os gastos do mês e ano selecionados
  const gastosDoMes = transportes.filter(item => {
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

  // Somar os valores do mês selecionado
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
