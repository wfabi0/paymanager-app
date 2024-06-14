import { CurrencyCode } from "./types/type";

export function formatMoney(amount: number, currency: CurrencyCode = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    notation: "standard",
    maximumFractionDigits: 2,
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatThousands(amount: number, lang: string = "pt-BR") {
  return new Intl.NumberFormat(lang, {
    notation: "standard",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getStartOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day;

  return new Date(date.setDate(diff));
}

function getEndOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + 6;

  return new Date(date.setDate(diff));
}

function isPaymentCreatedThisWeek(paymentTime: string | number) {
  const paymentDate = new Date(paymentTime);
  const startOfWeek = getStartOfWeek();
  const endOfWeek = getEndOfWeek();

  endOfWeek.setHours(23, 59, 59, 999);

  return paymentDate >= startOfWeek && paymentDate <= endOfWeek;
}

function isPaymentCreatedThisMonth(paymentTime: string | number) {
  const paymentDate = new Date(paymentTime);
  const currentDate = new Date();

  return (
    paymentDate.getMonth() === currentDate.getMonth() &&
    paymentDate.getFullYear() === currentDate.getFullYear()
  );
}

export const timeModules = {
  getStartOfWeek,
  getEndOfWeek,
  isPaymentCreatedThisWeek,
  isPaymentCreatedThisMonth,
};
