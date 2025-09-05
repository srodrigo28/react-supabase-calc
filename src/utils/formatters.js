export const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);

export const formatDate = (date) =>
  date ? new Intl.DateTimeFormat("pt-BR").format(new Date(date)) : "";

export const formatCurrencyInput = (valorDigitado) => {
  const somenteNumeros = valorDigitado.replace(/\D/g, "");
  let numero = Number.parseFloat(somenteNumeros) / 100;
  if (isNaN(numero)) numero = 0;
  return {
    exibicao: numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    numero,
  };
};