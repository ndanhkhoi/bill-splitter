import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Wallet, Users, Receipt } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { useBillStore, saveCurrentBillToList } from '../stores/billStore';
import { calculateSettlement, formatCurrency } from '../utils/calculateSettlement';

interface SettlementReportProps {
  onFinish?: () => void;
}

export const SettlementReport: React.FC<SettlementReportProps> = ({ onFinish }) => {
  const { currentBill, clearCurrentBill } = useBillStore();

  if (!currentBill) return null;

  const { settlements, transactions, total, perPerson } = calculateSettlement(currentBill);

  const handleFinish = () => {
    saveCurrentBillToList();
    clearCurrentBill();
    onFinish?.();
  };

  const dateStr = new Date(currentBill.date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Report Content */}
      <div className="space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-white">{currentBill.name}</h1>
          <p className="text-white/60">{dateStr}</p>
        </motion.div>

        {/* Summary */}
        <Card>
          <CardContent className="py-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-white/60 mb-1">Tổng chi tiêu</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-white/60 mb-1">Số người</p>
                <p className="text-2xl font-bold text-white">{currentBill.people.length}</p>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-white/60 mb-1">Trung bình</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(perPerson)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settlement Details */}
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Chi tiết công nợ
            </h3>

            <div className="space-y-3">
              {settlements.map((settlement) => {
                const amount = parseFloat(settlement.amountOwed);
                const isOwed = amount > 0;

                return (
                  <motion.div
                    key={settlement.personId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                        ${isOwed
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                          : amount < 0
                            ? 'bg-gradient-to-r from-red-500 to-pink-600'
                            : 'bg-white/20'
                        }`}
                      >
                        {settlement.personName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{settlement.personName}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold
                        ${isOwed
                          ? 'text-green-400'
                          : amount < 0
                            ? 'text-red-400'
                            : 'text-white/60'
                        }`}
                      >
                        {isOwed ? '+' : ''}{formatCurrency(settlement.amountOwed)}
                      </p>
                      <p className="text-xs text-white/40">
                        {isOwed ? 'Cần nhận lại' : amount < 0 ? 'Cần trả thêm' : 'Đã cân bằng'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        {transactions.length > 0 && (
          <Card>
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
        )}

        {/* Footer */}
        <div className="text-center text-white/40 text-sm pt-4">
          <p>Được tạo bởi Chia Bill App</p>
          <p className="text-xs mt-1">{dateStr}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleFinish} className="flex-1">
          Lưu và về trang chủ
        </Button>
      </div>
    </div>
  );
};
