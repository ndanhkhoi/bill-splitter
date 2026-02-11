import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Home } from 'lucide-react';
import { Button } from './ui/Button';
import { calculateSettlement } from '../utils/calculateSettlement';
import { calculatePersonDetails } from '../utils/calculatePersonDetails';
import { BillSummary } from './BillSummary';
import { SettlementDetailsCard } from './SettlementDetailsCard';
import { BankQRCode } from './BankQRCode';
import { OptimalTransactions } from './OptimalTransactions';
import { BillFooter } from './BillFooter';
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
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs sm:text-sm font-medium mb-2 sm:mb-4">
          <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Được chia sẻ bởi bạn bè</span>
          <span className="sm:hidden">Được chia sẻ</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white px-4">{bill.name}</h1>
        <p className="text-white/60 text-sm px-4">{dateStr}</p>
      </motion.div>

      <BillSummary total={total} peopleCount={bill.people.length} />
      <SettlementDetailsCard
        settlements={settlements}
        personDetailsMap={personDetailsMap}
        peopleCount={bill.people.length}
      />
      <OptimalTransactions transactions={transactions} />

      {bill.bankCode && bill.accountNumber && (
        <BankQRCode bankCode={bill.bankCode} accountNumber={bill.accountNumber} variant="compact" />
      )}

      <BillFooter dateStr={dateStr} />

      <div className="flex gap-3 px-4 sm:px-0">
        <Button variant="primary" onClick={onGoHome} className="w-full">
          <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="text-sm sm:text-base">Tạo bill của bạn</span>
        </Button>
      </div>
    </div>
  );
};
