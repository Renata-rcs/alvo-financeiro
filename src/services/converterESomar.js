export function converterESomar(lista) {
  console.log("Lista recebida para conversão:", lista);

  const soma = lista.reduce((acc, item) => {
    if (!item.valor) {
      console.warn(`Aviso: O item ${item.id} tem um valor inválido.`);
      return acc;
    }

    const valorConvertido = parseFloat(
      typeof item.valor === "string" ? item.valor.replace(",", ".").trim() : item.valor
    );

    if (isNaN(valorConvertido)) {
      console.warn(`Erro ao converter valor do item ${item.id}: "${item.valor}" não é um número válido.`);
      return acc;
    }

    console.log(`Processando item ${item.id}: Valor convertido =`, valorConvertido);
    return acc + valorConvertido;
  }, 0);

  console.log("Total calculado:", soma);
  return soma;
}
