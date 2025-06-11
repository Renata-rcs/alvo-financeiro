import { useState } from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { Button, Text, TextInput } from 'react-native-paper'
import AlimentacaoService from '../../services/AlimentacaoService'

export default function AlimentacaoForm({ navigation, route }) {

  const gastoAntigo = route.params || {}

  const [nome, setNome] = useState(gastoAntigo.nome || "")
  const [valor, setValor] = useState(gastoAntigo.valor || "")
  const [descricao, setDescricao] = useState(gastoAntigo.descricao || "")
  const [data, setData] = useState(gastoAntigo.data || "")
  const [local, setLocal] = useState(gastoAntigo.local || "")

  async function salvar() {
    let gasto = {
      nome,
      valor,
      descricao,
      data,
      local
    }

    if (!gasto.nome || !gasto.valor || !gasto.descricao || !gasto.data || !gasto.local) {
      alert('Preencha todos os campos!')
      return
    }

    if (gastoAntigo.id) {
      gasto.id = gastoAntigo.id
      await AlimentacaoService.atualizar(gasto)
      alert("Gasto alterado com sucesso!")
      navigation.reset({
        index: 0,
        routes: [{ name: 'AlimentacaoLista' }]
      })
    } else {
      await AlimentacaoService.salvar(gasto)
      alert("Gasto cadastrado com sucesso!")
      navigation.reset({
        index: 0,
        routes: [{ name: 'AlimentacaoLista' }]
      })
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant='titleLarge' style={styles.title}>Informe os dados:</Text>
        <Text variant='titleMedium' style={styles.subtitle}>ID Gasto: {gastoAntigo.id || 'NOVO'}</Text>

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Nome"
          placeholder='Informe o nome do gasto'
          value={nome}
          onChangeText={setNome}
          autoCapitalize='words'
        />

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Valor"
          placeholder='Informe o valor'
          value={valor}
          onChangeText={setValor}
          keyboardType='numeric'
          render={(props) => (
            <TextInputMask
              {...props}
              type={'money'}
              options={{
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$ ',
              }}
            />
          )}
        />

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Descrição"
          placeholder='Informe a descrição'
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
        />

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Data"
          placeholder='Informe a data'
          value={data}
          onChangeText={setData}
          keyboardType='numeric'
          render={(props) => (
            <TextInputMask
              {...props}
              type={'datetime'}
              options={{
                format: 'DD/MM/YYYY'
              }}
            />
          )}
        />

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Local"
          placeholder='Informe o local'
          value={local}
          onChangeText={setLocal}
          autoCapitalize='words'
        />

        <Button
          style={styles.button}
          mode='contained'
          onPress={salvar}
          buttonColor="#FF7F00"
          contentStyle={{ paddingVertical: 8 }}
        >
          Salvar
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
})
