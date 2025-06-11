import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import UsuarioService from '../../services/UsuarioService';

export default function Cadastro({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função para validar o email com regex simples
  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Função para validar senha (mínimo 6 caracteres)
  function validarSenha(senha) {
    return senha.length >= 6;
  }

  const handleSalvar = async () => {
    if (!nome || !email || !senha) {
      alert('Preencha todos os campos!');
      return;
    }

    if (!validarEmail(email)) {
      alert('Email inválido! Por favor, informe um email válido.');
      return;
    }

    if (!validarSenha(senha)) {
      alert('Senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
     await UsuarioService.salvarUsuario({ nome, email, senha });
      alert('Cadastro realizado com sucesso!');
      navigation.replace('Login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
       <Image
               source={require('../../../assets/logo.png')} 
               style={styles.logo}
            />
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  input: { 
    width: '80%', 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 15 
  },
  botao: { 
    backgroundColor: '#FF7F00', // laranja
    padding: 15, 
    borderRadius: 8, 
    width: '80%', 
    alignItems: 'center' 
  },
  textoBotao: { 
    color: '#fff', 
    fontSize: 16 
  },
  link: { 
    marginTop: 15,
    textDecorationLine: 'underline'
  },
  logo: {
    width: 350,
    height:105,
    margin: 50,
  }
});
