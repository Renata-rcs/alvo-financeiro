import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Button, Text, TextInput } from 'react-native-paper';
import MetasService from '../../services/MetasService';

export default function MetasForm({ navigation, route }) {

  const metaAntiga = route.params || {}

  const [nome, setNome] = useState(metaAntiga.nome || "")
  const [valor, setValor] = useState(metaAntiga.valor || "")  // Valor total da meta
  const [descricao, setDescricao] = useState(metaAntiga.descricao || "")
  const [prazo, setPrazo] = useState(metaAntiga.prazo || "")

  const [valorJuntado, setValorJuntado] = useState(metaAntiga.valorJuntado || "") // novo campo

  const [progresso, setProgresso] = useState(0) // calculado, não editável diretamente

  // Sempre que valor ou valorJuntado mudar, recalcula progresso %
  useEffect(() => {
    // Transformar valores monetários string "R$ 1.000,00" em número float 1000.00
    function parseMoney(str) {
      if (!str) return 0;
      return parseFloat(
        str
          .replace(/[R$\s.]/g, '') // remove R$, espaços, pontos
          .replace(',', '.')       // troca vírgula por ponto decimal
      ) || 0;
    }

    const total = parseMoney(valor);
    const juntado = parseMoney(valorJuntado);

    if (total > 0) {
      let calc = (juntado / total) * 100;
      if (calc > 100) calc = 100;
      setProgresso(calc.toFixed(2));
    } else {
      setProgresso(0);
    }
  }, [valor, valorJuntado]);

  async function salvar() {
    let meta = {
      nome,
      valor,
      descricao,
      prazo,
      valorJuntado,
      progresso: Number(progresso),
    }

    if (!meta.nome || !meta.valor || !meta.descricao || !meta.prazo) {
      alert('Preencha todos os campos!')
      return
    }

    if (Number(progresso) < 0 || Number(progresso) > 100) {
      alert('Progresso inválido')
      return
    }

    if (metaAntiga.id) {
      meta.id = metaAntiga.id
      await MetasService.atualizar(meta)
      alert("Meta alterada com sucesso!")
    } else {
      await MetasService.salvar(meta)
      alert("Meta cadastrada com sucesso!")
    }
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant='titleLarge' style={styles.title}>Informe os dados da meta:</Text>
        <Text variant='titleMedium' style={styles.subtitle}>ID Meta: {metaAntiga.id || 'NOVO'}</Text>

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Nome"
          placeholder='Informe o nome da meta'
          value={nome}
          onChangeText={setNome}
          autoCapitalize='words'
        />

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Valor da Meta"
          placeholder='Informe o valor da meta'
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
                suffixUnit: ''
              }}
            />
          )}
        />

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Valor Juntado"
          placeholder='Informe quanto já juntou para a meta'
          value={valorJuntado}
          onChangeText={setValorJuntado}
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
                suffixUnit: ''
              }}
            />
          )}
        />

        <Text variant='titleMedium' style={{ marginBottom: 15 }}>
          Progresso: {progresso}%
        </Text>

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Descrição"
          placeholder='Descreva sua meta'
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
        />

        <TextInput
          style={styles.input}
          mode='outlined'
          label="Prazo"
          placeholder='Prazo para atingir (ex: 10/12/2025)'
          value={prazo}
          onChangeText={setPrazo}
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
  );
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
});
