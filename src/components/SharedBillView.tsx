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
    <div className="space-y-6">
      <div className="space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium mb-4">
            <Receipt className="w-4 h-4" />
            Được chia sẻ bởi bạn bè
          </div>
          <h1 className="text-3xl font-bold text-white">{bill.name}</h1>
          <p className="text-white/60">{dateStr}</p>
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
      </div>

      <div className="flex gap-3">
        <Button variant="primary" onClick={onGoHome} className="w-full">
          <Home className="w-5 h-5 mr-2" />
          Tạo bill của bạn
        </Button>
      </div>
    </div>
  );
};
