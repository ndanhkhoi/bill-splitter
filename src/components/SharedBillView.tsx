import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Home, Calendar } from 'lucide-react';
import { Button } from './ui/Button';
import { calculateSettlement } from '../utils/calculateSettlement';
import { calculatePersonDetails } from '../utils/calculatePersonDetails';
import { BillSummary } from './BillSummary';
import { SettlementDetailsCard } from './SettlementDetailsCard';
import { OptimalTransactions } from './OptimalTransactions';
import type { Bill } from '../types';

interface SharedBillViewProps {
  bill: Bill;
  onGoHome: () => void;
}

export const SharedBillView: React.FC<SharedBillViewProps> = ({ bill, onGoHome }) => {
  const personDetailsMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculatePersonDetails>>();
    bill.people.forEach(person => {
      map.set(person.id, calculatePersonDetails(person.id, bill));
    });
    return map;
  }, [bill]);

  const { settlements, transactions, total } = calculateSettlement(bill);

  // Sắp xếp settlements: từ người âm nhiều nhất (cần trả nhiều nhất) đến dương nhiều nhất (cần nhận nhiều nhất)
  const sortedSettlements = [...settlements].sort((a, b) => {
    const amountA = parseFloat(a.amountOwed);
    const amountB = parseFloat(b.amountOwed);
    return amountA - amountB; // Tăng dần: âm -> dương
  });

  const dateStr = new Date(bill.date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium">
          <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Được chia sẻ bởi bạn bè</span>
          <span className="sm:hidden">Được chia sẻ</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs sm:text-sm font-medium">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          {dateStr}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 px-4">{bill.name}</h1>
      </motion.div>

      <BillSummary
        total={total}
        peopleCount={bill.people.length}
        expenseCount={bill.expenses.length}
      />
      <SettlementDetailsCard
        settlements={sortedSettlements}
        personDetailsMap={personDetailsMap}
        peopleCount={bill.people.length}
        bankCode={bill.bankCode}
        accountNumber={bill.accountNumber}
        billName={bill.name}
      />
      <OptimalTransactions transactions={transactions} />

      <div className="flex gap-3 px-4 sm:px-0">
        <Button variant="primary" onClick={onGoHome} className="w-full">
          <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="text-sm sm:text-base">Tạo bill của bạn</span>
        </Button>
      </div>
    </div>
  );
};
