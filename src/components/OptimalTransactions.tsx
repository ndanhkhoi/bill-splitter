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
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ArrowDownUp className="w-5 h-5" />
          Cách thanh toán tối ưu
        </h3>

        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  {transaction.from.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{transaction.from}</p>
                  <p className="text-xs text-white/60">chuyển cho</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ArrowDownUp className="w-5 h-5 text-white/60" />
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{formatCurrency(transaction.amount)}</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                  {transaction.to.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{transaction.to}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-center text-sm text-white/60">
            Chỉ cần <span className="font-bold text-white">{transactions.length}</span> lần chuyển tiền
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
