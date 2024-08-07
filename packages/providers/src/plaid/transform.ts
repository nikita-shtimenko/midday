import {
  formatAmountForAsset,
  getType,
} from "@midday/engine/src/utils/account";
import { capitalCase } from "change-case";
import type { Transaction, TransactionCode } from "plaid";
import type {
  Account as BaseAccount,
  Balance as BaseBalance,
  Transaction as BaseTransaction,
} from "../types";
import type {
  TransformAccount,
  TransformAccountBalance,
  TransformTransaction,
} from "./types";

export const mapTransactionMethod = (type?: TransactionCode | null) => {
  switch (type) {
    case "bill payment":
      return "payment";
    case "purchase":
      return "card_purchase";
    case "atm":
      return "card_atm";
    case "transfer":
      return "transfer";
    case "interest":
      return "interest";
    case "bank charge":
      return "fee";
    default:
      return "other";
  }
};

type MapTransactionCategory = {
  transaction: Transaction;
  amount: number;
};

export const mapTransactionCategory = ({
  transaction,
  amount,
}: MapTransactionCategory) => {
  if (transaction.personal_finance_category?.primary === "INCOME") {
    return "income";
  }

  if (
    transaction.transaction_code === "transfer" ||
    transaction.personal_finance_category?.primary === "TRANSFER_IN" ||
    transaction.personal_finance_category?.primary === "TRANSFER_OUT"
  ) {
    return "transfer";
  }

  if (amount > 0) {
    return "income";
  }

  if (
    transaction.transaction_code === "bank charge" ||
    transaction.personal_finance_category?.primary === "BANK_FEES"
  ) {
    return "fees";
  }

  if (transaction.personal_finance_category?.primary === "FOOD_AND_DRINK") {
    return "meals";
  }

  if (
    transaction.personal_finance_category?.primary === "TRANSPORTATION" ||
    transaction.personal_finance_category?.primary === "TRAVEL"
  ) {
    return "travel";
  }

  if (
    transaction.personal_finance_category?.detailed ===
    "GENERAL_SERVICES_OTHER_GENERAL_SERVICES"
  ) {
    return "software";
  }

  if (
    transaction.personal_finance_category?.detailed ===
      "RENT_AND_UTILITIES_GAS_AND_ELECTRICITY" ||
    transaction.personal_finance_category?.detailed ===
      "RENT_AND_UTILITIES_SEWAGE_AND_WASTE_MANAGEMENT" ||
    transaction.personal_finance_category?.detailed ===
      "RENT_AND_UTILITIES_WATER" ||
    transaction.personal_finance_category?.detailed ===
      "RENT_AND_UTILITIES_OTHER_UTILITIES"
  ) {
    return "facilities-expenses";
  }

  if (
    transaction.personal_finance_category?.detailed ===
    "RENT_AND_UTILITIES_RENT"
  ) {
    return "rent";
  }

  if (
    transaction.personal_finance_category?.detailed ===
      "RENT_AND_UTILITIES_INTERNET_AND_CABLE" ||
    transaction.personal_finance_category?.detailed ===
      "RENT_AND_UTILITIES_TELEPHONE"
  ) {
    return "internet-and-telephone";
  }

  if (transaction.personal_finance_category?.primary === "HOME_IMPROVEMENT") {
    return "office-supplies";
  }

  if (transaction.personal_finance_category?.primary === "ENTERTAINMENT") {
    return "activity";
  }

  return null;
};

export const transformTransaction = ({
  transaction,
  accountType,
  bankAccountId,
  teamId,
}: TransformTransaction): BaseTransaction => {
  const method = mapTransactionMethod(transaction?.transaction_code);

  const amount = formatAmountForAsset({
    amount: transaction.amount,
    type: accountType,
  });

  return {
    date: transaction.date,
    name: transaction.name,
    description: transaction?.original_description
      ? capitalCase(transaction.original_description)
      : null,
    method,
    internal_id: `${teamId}_${transaction.transaction_id}`,
    amount,
    team_id: teamId,
    bank_account_id: bankAccountId,
    currency:
      transaction.iso_currency_code ||
      transaction.unofficial_currency_code ||
      "USD",
    category: mapTransactionCategory({ transaction, amount }),
    balance: null,
    status: transaction.pending ? "pending" : "posted",
  };
};

export const transformAccount = ({
  account_id,
  name,
  institution,
  balances,
  type,
}: TransformAccount): BaseAccount => {
  return {
    id: account_id,
    name,
    currency:
      balances.iso_currency_code || balances.unofficial_currency_code || "USD",
    institution,
    provider: "plaid",
    type: getType(type),
  };
};

export const transformAccountBalance = (
  balances?: TransformAccountBalance
): BaseBalance => ({
  currency:
    balances?.iso_currency_code || balances?.unofficial_currency_code || "USD",
  amount: balances?.available ?? 0,
});
