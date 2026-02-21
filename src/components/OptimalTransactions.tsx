import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { formatCurrency } from '../utils/calculateSettlement';
import type { Transaction } from '../types';

interface OptimalTransactionsProps {
  transactions: Transaction[];
}

export const OptimalTransactions: React.FC<OptimalTransactionsProps> = ({ transactions }) => {
  if (transactions.length === 0) return null;

  return (
    <Card className="hidden">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl">
            <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-100">Cách thanh toán tối ưu</h3>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-sky-500/10 to-sky-600/10 rounded-xl border border-zinc-800"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  <span className="text-sm">{transaction.from.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-zinc-100 font-medium text-sm sm:text-base truncate">{transaction.from}</p>
                  <p className="text-xs text-zinc-500">chuyển cho</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 flex-shrink-0" />
                <div className="text-right">
                  <p className="text-base sm:text-lg font-bold text-zinc-100">{formatCurrency(transaction.amount)}</p>
                </div>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  <span className="text-sm">{transaction.to.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-zinc-100 font-medium text-sm sm:text-base truncate">{transaction.to}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <p className="text-center text-sm text-zinc-400">
            Chỉ cần <span className="font-bold text-zinc-200">{transactions.length}</span> lần chuyển tiền
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
