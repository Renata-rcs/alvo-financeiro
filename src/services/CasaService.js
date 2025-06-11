import AsyncStorage from '@react-native-async-storage/async-storage';

async function listar() {
  const jsonValue = await AsyncStorage.getItem('@casas');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(casa) {
  casa.id = new Date().getTime();
  const casas = await listar();
  casas.push(casa);
  await AsyncStorage.setItem('@casas', JSON.stringify(casas));
}

async function buscar(id) {
  const casas = await listar();
  return casas.find(casa => casa.id === id);
}

async function remover(id) {
  const casas = await listar();
  const novaLista = casas.filter(casa => casa.id !== id);
  await AsyncStorage.setItem('@casas', JSON.stringify(novaLista));
}

async function atualizar(novaCasa) {
  const casas = await listar();
  const novaLista = casas.map(casa => (casa.id === novaCasa.id ? novaCasa : casa));
  await AsyncStorage.setItem('@casas', JSON.stringify(novaLista));
}

async function calcularTotal() {
  const casas = await listar();
  console.log("Lista de gastos para soma:", casas);

  const total = casas.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Aviso: O item ${item.id} não tem um valor definido.`);
      return acc;
    }

    // Remove pontos, remove "R$", substitui vírgula por ponto
    let valorStr = String(item.valor)
      .replace(/\./g, '')    // remove separadores de milhar
      .replace("R$", "")     // remove símbolo R$
      .replace(",", ".")     // vírgula vira ponto decimal
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
  const casas = await listar();

  // Filtrar apenas os gastos do mês e ano selecionados
  const gastosDoMes = casas.filter(item => {
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
      .replace(/\./g, '')   // remove pontos
      .replace("R$", "")    // remove símbolo
      .replace(",", ".")    // vírgula para ponto
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
