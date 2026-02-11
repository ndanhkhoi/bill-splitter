import Big from 'big.js';
import type {Bill, Settlement, Transaction} from '../types';

export function calculateSettlement(bill: Bill): { settlements: Settlement[], transactions: Transaction[], total: string, perPerson: string } {
  if (bill.people.length === 0 || bill.expenses.length === 0) {
    return { settlements: [], transactions: [], total: '0', perPerson: '0' };
  }

  // Tính tổng bill
  const total = bill.expenses.reduce((sum, expense) => {
    return sum.plus(new Big(expense.amount));
  }, new Big(0));

  // Tính trung bình mỗi người
  const perPerson = total.div(bill.people.length);

  // Tính total paid và total share cho mỗi person
  const balances: Map<string, Big> = new Map();

  // Khởi tạo balance = 0
  bill.people.forEach(person => {
    balances.set(person.id, new Big(0));
  });

  // Tính balance cho mỗi person
  bill.expenses.forEach(expense => {
    const amount = new Big(expense.amount);
    const payerId = expense.payerId;
    const participantCount = expense.participantIds.length;

    if (participantCount > 0) {
      const sharePerPerson = amount.div(participantCount);

      // Người trả tiền: +amount
      const currentPaid = balances.get(payerId) || new Big(0);
      balances.set(payerId, currentPaid.plus(amount));

      // Mỗi người tham gia: -share
      expense.participantIds.forEach(participantId => {
        const currentShare = balances.get(participantId) || new Big(0);
        balances.set(participantId, currentShare.minus(sharePerPerson));
      });
    }
  });

  // Chuyển thành Settlement array
  const settlements: Settlement[] = bill.people.map(person => {
    const balance = balances.get(person.id) || new Big(0);
    return {
      personId: person.id,
      personName: person.name,
      amountOwed: balance.round(0, Big.roundHalfUp).toFixed(0), // Dương: cần nhận, Âm: cần trả
    };
  });

  // Tối ưu hóa transactions
  const transactions = optimizeTransactions(settlements);

  return {
    settlements,
    transactions,
    total: total.round(0, Big.roundHalfUp).toFixed(0),
    perPerson: perPerson.round(0, Big.roundHalfUp).toFixed(0),
  };
}

function optimizeTransactions(settlements: Settlement[]): Transaction[] {
  const transactions: Transaction[] = [];

  // Tách người cần trả và người cần nhận
  const debtors: Array<{ name: string; amount: Big }> = [];
  const creditors: Array<{ name: string; amount: Big }> = [];

  settlements.forEach(s => {
    const amount = new Big(s.amountOwed);
    if (amount.lt(0)) {
      // Cần trả (số âm)
      debtors.push({ name: s.personName, amount: amount.abs() });
    } else if (amount.gt(0)) {
      // Cần nhận (số dương)
      creditors.push({ name: s.personName, amount });
    }
  });

  // Greedy algorithm: ghép người cần trả với người cần nhận
  let i = 0; // debtor index
  let j = 0; // creditor index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    // Use the smaller of the two amounts
    const amount = debtor.amount.lt(creditor.amount) ? debtor.amount : creditor.amount;

    if (amount.gt(0)) {
      const roundedAmount = amount.round(0, Big.roundHalfUp);
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: roundedAmount.toFixed(0),
      });
    }

    debtor.amount = debtor.amount.minus(amount);
    creditor.amount = creditor.amount.minus(amount);

    if (debtor.amount.eq(0)) i++;
    if (creditor.amount.eq(0)) j++;
  }

  return transactions;
}

// Helper function để format currency
export function formatCurrency(amount: string | number): string {
  // Làm tròn lên 0 chữ số thập phân
  const rounded = new Big(amount).round(0, Big.roundHalfUp);
  // Format với dấu chấm phân cách nghìn
  const withCommas = rounded.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return withCommas + '₫';
}

// Helper function để parse input
export function parseCurrencyInput(value: string): string {
  // Xóa tất cả ký tự không phải số
  const numbersOnly = value.replace(/[^\d]/g, '');
  if (!numbersOnly) return '0';
  return new Big(numbersOnly).toFixed(2);
}
