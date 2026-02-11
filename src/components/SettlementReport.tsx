import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { useBillStore, saveCurrentBillToList } from '../stores/billStore';
import { calculateSettlement } from '../utils/calculateSettlement';
import { calculatePersonDetails } from '../utils/calculatePersonDetails';
import { generateShareUrl } from '../utils/shareBill';
import { BillSummary } from './BillSummary';
import { SettlementDetailsCard } from './SettlementDetailsCard';
import { BankQRCode } from './BankQRCode';
import { OptimalTransactions } from './OptimalTransactions';
import { BillFooter } from './BillFooter';

interface SettlementReportProps {
  onFinish?: () => void;
}

export const SettlementReport: React.FC<SettlementReportProps> = ({ onFinish }) => {
  const { currentBill, clearCurrentBill } = useBillStore();
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState(false);

  const handleFinish = () => {
    saveCurrentBillToList();
    clearCurrentBill();
    onFinish?.();
  };

  const handleShare = async () => {
    if (!currentBill) return;

    saveCurrentBillToList();

    try {
      const shareUrl = generateShareUrl(currentBill);
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShareError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy share link:', error);
      setShareError(true);
      setTimeout(() => setShareError(false), 3000);
    }
  };

  const personDetailsMap = useMemo(() => {
    if (!currentBill) return new Map();
    const map = new Map<string, ReturnType<typeof calculatePersonDetails>>();
    currentBill.people.forEach(person => {
      map.set(person.id, calculatePersonDetails(person.id, currentBill));
    });
    return map;
  }, [currentBill]);

  if (!currentBill) return null;

  const { settlements, transactions, total } = calculateSettlement(currentBill);

  const dateStr = new Date(currentBill.date).toLocaleDateString('vi-VN', {
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
        <h1 className="text-xl sm:text-2xl font-bold text-white px-4">{currentBill.name}</h1>
        <p className="text-white/60 text-sm px-4">{dateStr}</p>
      </motion.div>

      <BillSummary total={total} peopleCount={currentBill.people.length} />
      <SettlementDetailsCard
        settlements={settlements}
        personDetailsMap={personDetailsMap}
        peopleCount={currentBill.people.length}
      />

      {currentBill.bankCode && currentBill.accountNumber && (
        <BankQRCode bankCode={currentBill.bankCode} accountNumber={currentBill.accountNumber} variant="compact" />
      )}

      <OptimalTransactions transactions={transactions} />
      <BillFooter dateStr={dateStr} />

      <div className="grid grid-cols-2 gap-3 px-4 sm:px-0">
        <Button variant="secondary" onClick={handleFinish}>
          <span className="text-sm sm:text-base">Lưu bill</span>
        </Button>
        <Button variant="primary" onClick={handleShare}>
          {copied ? (
            <>
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Đã copy!</span>
            </>
          ) : shareError ? (
            <>
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Thử lại</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Chia sẻ</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
