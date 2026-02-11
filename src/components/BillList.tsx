import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, Users, Wallet, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { useBillStore } from '../stores/billStore';
import { formatCurrency } from '../utils/calculateSettlement';
import Big from 'big.js';

interface BillListProps {
  onCreateBill: () => void;
  onViewBill?: (billId: string) => void;
  onEditBill?: (billId: string) => void;
}

export const BillList: React.FC<BillListProps> = ({ onCreateBill, onViewBill, onEditBill }) => {
  const { bills, setCurrentBill, deleteBill } = useBillStore();

  const handleViewBill = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      setCurrentBill(bill);
      setTimeout(() => onViewBill?.(billId), 0);
    }
  };

  const handleEditBill = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      setCurrentBill(bill);
      setTimeout(() => onEditBill?.(billId), 0);
    }
  };

  const handleDeleteBill = (e: React.MouseEvent, billId: string) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa bill này?')) {
      deleteBill(billId);
    }
  };

  const calculateBillTotal = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return '0';
    return bill.expenses.reduce((sum, exp) => sum.plus(new Big(exp.amount)), new Big(0)).round(0).toFixed(0);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {bills.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-2">Chưa có bill nào</p>
            <p className="text-white/40 text-sm">Tạo bill mới để bắt đầu</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bills.map((bill) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card
                className="cursor-pointer hover:border-purple-500/50 transition-all group"
                onClick={() => handleViewBill(bill.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{bill.name}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(bill.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {bill.people.length}
                        </div>
                        <div className="flex items-center gap-1">
                          <Wallet className="w-4 h-4" />
                          {formatCurrency(calculateBillTotal(bill.id))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBill(bill.id);
                        }}
                        className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-all"
                        title="Sửa bill"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteBill(e, bill.id)}
                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Xóa bill"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                {bill.expenses.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {bill.expenses.slice(0, 3).map((exp) => (
                        <span
                          key={exp.id}
                          className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                        >
                          {exp.name}
                        </span>
                      ))}
                      {bill.expenses.length > 3 && (
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/60">
                          +{bill.expenses.length - 3} nữa
                        </span>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Button onClick={onCreateBill} className="w-full mt-6" size="lg">
        <Wallet className="w-5 h-5 mr-2" />
        Tạo Bill mới
      </Button>
    </div>
  );
};
