import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_USUARIO = "@perfil";

const PerfilService = {
  async buscarPerfil() {
    const usuarioArmazenado = await AsyncStorage.getItem(CHAVE_USUARIO);
    return usuarioArmazenado ? JSON.parse(usuarioArmazenado) : null;
  },

  async salvarPerfil(perfil) {
    await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(perfil));
  },

  async buscarLocalizacao(cepDigitado) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepDigitado}/json/`);
      const data = await response.json();
      
      if (data.erro) return null;

      return `${data.localidade} - ${data.uf}`;
    } catch (error) {
      return null;
    }
  }
};

export default PerfilService;
