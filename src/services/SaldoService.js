import AsyncStorage from '@react-native-async-storage/async-storage';

async function listar() {
  const jsonValue = await AsyncStorage.getItem('@saldos');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(saldo) {
  saldo.id = new Date().getTime(); // Gera ID único
  const saldos = await listar();
  saldos.push(saldo);
  await AsyncStorage.setItem('@saldos', JSON.stringify(saldos));
}

async function buscar(id) {
  const saldos = await listar();
  return saldos.find(saldo => saldo.id === id);
}

async function remover(id) {
  const saldos = await listar();
  const novaLista = saldos.filter(saldo => saldo.id !== id);
  await AsyncStorage.setItem('@saldos', JSON.stringify(novaLista));
}

async function atualizar(novoSaldo) {
  const saldos = await listar();
  const novaLista = saldos.map(saldo =>
    saldo.id === novoSaldo.id ? novoSaldo : saldo
  );
  await AsyncStorage.setItem('@saldos', JSON.stringify(novaLista));
}


function somarSaldos(saldos) {
  const total = saldos.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Aviso: Item sem valor definido.`);
      return acc;
    }

    let valorStr = String(item.valor)
      .replace(/\./g, '')      // remove separadores de milhar
      .replace("R$", "")       // remove símbolo R$
      .replace(",", ".")       // vírgula vira ponto decimal
      .trim();

    const valorConvertido = parseFloat(valorStr);

    if (isNaN(valorConvertido)) {
      console.warn(`Erro: Valor inválido no item: "${valorStr}"`);
      return acc;
    }

    return acc + valorConvertido;
  }, 0);

  return total;
}


async function calcularTotal() {
  const saldos = await listar();
  console.log("Lista de saldos para soma:", saldos);
  const total = somarSaldos(saldos);
  console.log("Total calculado:", total);
  return total;
}

/**
 * Calcula o total dos saldos para um mês e ano específicos.
 * @param {number} mesSelecionado - Mês (1-12)
 * @param {number} anoSelecionado - Ano (ex: 2025)
 * @returns {Promise<number>} Total somado para o mês e ano selecionados
 */
async function calcularTotalPorMes(mesSelecionado, anoSelecionado) {
  const saldos = await listar();

  const saldosDoMes = saldos.filter(item => {
    if (!item.data) {
      console.warn(`Aviso: Item ${item.id} sem data definida.`);
      return false;
    }

    const partesData = item.data.split('/');
    if (partesData.length !== 3) {
      console.warn(`Aviso: Formato de data inválido no item ${item.id}: ${item.data}`);
      return false;
    }

    const [dia, mes, ano] = partesData.map(Number);
    return mes === mesSelecionado && ano === anoSelecionado;
  });

  console.log(`Saldos do mês ${mesSelecionado}/${anoSelecionado}:`, saldosDoMes);

  const total = somarSaldos(saldosDoMes);

  console.log(`Total de saldos para ${mesSelecionado}/${anoSelecionado}: R$ ${total}`);
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
  somarSaldos,
};
