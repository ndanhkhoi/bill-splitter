import Big from 'big.js';
import type { Expense } from '../types';

export interface PersonDetails {
  totalPaid: string;
  paidExpenses: Array<{ expense: Expense; amount: string }>;
  participatedExpenses: Array<{ expense: Expense; share: string }>;
}

export function calculatePersonDetails(
  personId: string,
  bill: { expenses: Expense[] }
): PersonDetails {
  const paidExpenses: Array<{ expense: Expense; amount: string }> = [];
  const participatedExpenses: Array<{ expense: Expense; share: string }> = [];
  let totalPaid = new Big(0);

  bill.expenses.forEach(expense => {
    const amount = new Big(expense.amount);

    // Người này trả tiền
    if (expense.payerId === personId) {
      totalPaid = totalPaid.plus(amount);
      paidExpenses.push({ expense, amount: expense.amount });
    }

    // Người này tham gia
    if (expense.participantIds.includes(personId)) {
      const sharePerPerson = amount.div(expense.participantIds.length);
      participatedExpenses.push({
        expense,
        share: sharePerPerson.round(0, Big.roundHalfUp).toFixed(0),
      });
    }
  });

  return {
    totalPaid: totalPaid.round(0, Big.roundHalfUp).toFixed(0),
    paidExpenses,
    participatedExpenses,
  };
}
