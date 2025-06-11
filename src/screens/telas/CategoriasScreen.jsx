import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AlimentacaoLista from '../listas/AlimentacaoLista'
import EducacaoLista from '../listas/EducacaoLista'
import LazerLista from '../listas/LazerLista'
import MetasLista from '../listas/MetasLista'
import SaldoLista from '../listas/SaldoLista'
import SaudeLista from '../listas/SaudeLista'
import TransporteLista from '../listas/TransporteLista'
import CasaLista from '../listas/CasaLista'

const categoriasFixas = [
  { id: '9', nome: 'Saldo', cor: '#708090', icone: 'wallet', tela: 'SaldoLista' },          // cinza azulado
  { id: '1', nome: 'Casa', cor: '#A0522D', icone: 'home', tela: 'CasaLista' },              // marrom
  { id: '2', nome: 'Transporte', cor: '#D3D3D3', icone: 'car', tela: 'TransporteLista' },   // cinza claro
  { id: '3', nome: 'Alimentação', cor: '#FF8C00', icone: 'fast-food', tela: 'AlimentacaoLista' }, // laranja escuro
  { id: '4', nome: 'Lazer', cor: '#B8860B', icone: 'happy', tela: 'LazerLista' },           // marrom dourado
  { id: '5', nome: 'Educação', cor: '#DAA520', icone: 'book', tela: 'EducacaoLista' },      // dourado
  { id: '6', nome: 'Saúde', cor: '#CD5C5C', icone: 'medkit', tela: 'SaudeLista' },          // marrom avermelhado
  { id: '7', nome: 'Metas', cor: '#FFA500', icone: 'flag', tela: 'MetasLista' },            // laranja vibrante
];


export default function CategoriasScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={categoriasFixas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoriaItem, { backgroundColor: item.cor }]}
            onPress={() => {
              if (item.tela) {
                navigation.navigate(item.tela);
              }
            }}
          >
            <Ionicons name={item.icone} size={28} color="white" style={styles.icone} />
            <Text style={styles.nome}>{item.nome}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  lista: {
    paddingBottom: 20,
  },
  categoriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icone: {
    marginRight: 16,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
