import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Receipt } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { useBillStore } from '../stores/billStore';
import { formatCurrency } from '../utils/calculateSettlement';
import type { Expense } from '../types';
import Big from 'big.js';

interface ExpenseItemProps {
  expense: Expense;
  payerName: string;
  participantNames: string[];
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, payerName, participantNames }) => {
  const { removeExpense } = useBillStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 group"
    >
      {/* Main info row */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
          <Receipt className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-zinc-100 font-medium truncate">{expense.name}</h4>
          <p className="text-zinc-500 text-sm">{payerName} đã trả</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-zinc-100">{formatCurrency(expense.amount)}</p>
          <p className="text-xs text-zinc-500">
            {formatCurrency(new Big(expense.amount).div(participantNames.length).toFixed())} /người
          </p>
        </div>
        <button
          onClick={() => removeExpense(expense.id)}
          className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chia: row - full width */}
      <div className="flex items-center gap-2 mt-3 ml-11 flex-wrap">
        <span className="text-xs text-zinc-600">Chia:</span>
        {participantNames.map((name, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-zinc-800 rounded-lg text-zinc-400">
            {name}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export const ExpenseList: React.FC = () => {
  const { currentBill } = useBillStore();

  const getPayerName = (payerId: string) => {
    return currentBill?.people.find(p => p.id === payerId)?.name || 'Unknown';
  };

  const getParticipantNames = (participantIds: string[]) => {
    return participantIds.map(id => currentBill?.people.find(p => p.id === id)?.name || 'Unknown');
  };

  const total = currentBill?.expenses.reduce((sum, expense) => {
    return sum.plus(new Big(expense.amount));
  }, new Big(0)) || new Big(0);

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Danh sách chi tiêu</h2>
          </div>
          {currentBill?.expenses && currentBill.expenses.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-zinc-500">Tổng cộng</p>
              <p className="text-lg font-bold text-zinc-100">{formatCurrency(total.toFixed())}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {currentBill?.expenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                payerName={getPayerName(expense.payerId)}
                participantNames={getParticipantNames(expense.participantIds)}
              />
            ))}
          </AnimatePresence>

          {currentBill?.expenses.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có khoản chi nào</p>
              <p className="text-sm">Thêm khoản chi đầu tiên để bắt đầu</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
