import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_USUARIOS = "@usuarios";
const CHAVE_PERFIL = "@perfilUsuario";

// Funções de Usuário
async function listarUsuarios() {
  const dados = await AsyncStorage.getItem(CHAVE_USUARIOS);
  return dados ? JSON.parse(dados) : [];
}

async function salvarUsuario(usuario) {
  usuario.id = new Date().getTime();
  const usuarios = await listarUsuarios();

  const existe = usuarios.find((u) => u.email === usuario.email);
  if (existe) {
    throw new Error("Email já cadastrado");
  }

  usuarios.push(usuario);
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

async function autenticar(email, senha) {
  const usuarios = await listarUsuarios();
  const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

  if (!usuario) {
    throw new Error("Email ou senha inválidos");
  }

  return usuario;
}

// Funções de Perfil
async function salvarPerfil(perfil) {
  await AsyncStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}

async function obterPerfil() {
  const perfil = await AsyncStorage.getItem(CHAVE_PERFIL);
  return perfil ? JSON.parse(perfil) : null;
}

async function atualizarPerfil(novoPerfil) {
  await AsyncStorage.setItem(CHAVE_PERFIL, JSON.stringify(novoPerfil));
}

// Exportando as funções
export default {
  listarUsuarios,
  salvarUsuario,
  autenticar,
  salvarPerfil,
  obterPerfil,
  atualizarPerfil,
};
