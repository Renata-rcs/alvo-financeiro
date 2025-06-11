import AsyncStorage from '@react-native-async-storage/async-storage';

async function listar() {
  const jsonValue = await AsyncStorage.getItem('@metas');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(meta) {
  meta.id = new Date().getTime();
  const metas = await listar();
  metas.push(meta);
  await AsyncStorage.setItem('@metas', JSON.stringify(metas));
}

async function buscar(id) {
  const metas = await listar();
  return metas.find(meta => meta.id === id);
}

async function remover(id) {
  const metas = await listar();
  const novaLista = metas.filter(meta => meta.id !== id);
  await AsyncStorage.setItem('@metas', JSON.stringify(novaLista));
}

async function atualizar(novoAluno) {
  const metas = await listar();
  const novaLista = metas.map(meta => meta.id === novoAluno.id ? novoAluno : meta);
  await AsyncStorage.setItem('@metas', JSON.stringify(novaLista));
}

export default {
  listar,
  salvar,
  buscar,
  atualizar,
  remover
}