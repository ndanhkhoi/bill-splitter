import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { ScreenHeader } from './components/layout/ScreenHeader';
import { Container } from './components/layout/Container';
import { StepIndicator } from './components/StepIndicator';
import { PersonList } from './components/PersonList';
import { BankInfoForm } from './components/BankInfoForm';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SettlementReport } from './components/SettlementReport';
import { BillList } from './components/BillList';
import { SharedBillView } from './components/SharedBillView';
import { useBillStore } from './stores/billStore';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';
import { Sparkles, Heart } from 'lucide-react';
import { parseSharedBillFromUrl } from './utils/shareBill';
import type { Bill } from './types';

type Screen = 'home' | 'setup' | 'expenses' | 'report' | 'shared';

function App() {
  const currentYear = new Date().getFullYear();
  const { currentBill, bills, createBill, clearCurrentBill, setCurrentBill } = useBillStore();
  const [screen, setScreen] = React.useState<Screen>('home');
  const [billName, setBillName] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [sharedBill, setSharedBill] = React.useState<Bill | null>(null);

  // Parse URL on mount to check for shared bill
  React.useEffect(() => {
    const bill = parseSharedBillFromUrl();
    if (bill) {
      setSharedBill(bill);
      setScreen('shared');
    }
  }, []);

  const steps = ['Nhóm', 'Chi tiêu', 'Báo cáo'];
  const stepIndex: Record<Screen, number> = {
    home: -1,
    setup: 0,
    expenses: 1,
    report: 2,
    shared: -1,
  };

  const handleCreateBill = () => {
    if (billName.trim()) {
      createBill(billName.trim());
      setBillName('');
      setShowCreateModal(false);
      setScreen('setup');
    }
  };

  const handleGoToExpenses = () => {
    if (currentBill && currentBill.people.length >= 2) {
      setScreen('expenses');
    }
  };

  const handleGoToReport = () => {
    if (currentBill && currentBill.expenses.length > 0) {
      setScreen('report');
    }
  };

  const handleBack = () => {
    if (screen === 'setup') {
      clearCurrentBill();
      setScreen('home');
    } else if (screen === 'expenses') {
      setScreen('setup');
    } else if (screen === 'report') {
      setScreen('expenses');
    }
  };

  const handleGoHome = () => {
    clearCurrentBill();
    setScreen('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      {/* Background decorative elements - Dark modern theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      <Header onHome={handleGoHome} />

      <main className="relative z-10 pb-20">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Container>
                <BillList
                  onCreateBill={() => setShowCreateModal(true)}
                  onViewBill={(billId) => {
                    const bill = bills.find(b => b.id === billId);
                    if (bill) {
                      setCurrentBill(bill);
                      setScreen('report');
                    }
                  }}
                  onEditBill={(billId) => {
                    const bill = bills.find(b => b.id === billId);
                    if (bill) {
                      setCurrentBill(bill);
                      setScreen('setup');
                    }
                  }}
                />
              </Container>
            </motion.div>
          )}

          {screen === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Container>
                <ScreenHeader
                  title={currentBill?.name}
                  showBackButton={true}
                  onBack={handleBack}
                />
                <StepIndicator
                  currentStep={stepIndex[screen]}
                  totalSteps={3}
                  steps={steps}
                />
                <div className="space-y-6">
                  <PersonList />
                  <BankInfoForm />
                  <Button
                    onClick={handleGoToExpenses}
                    disabled={!currentBill || currentBill.people.length < 2}
                    className="w-full"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Tiếp tục: Thêm chi tiêu
                  </Button>
                </div>
              </Container>
            </motion.div>
          )}

          {screen === 'expenses' && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Container>
                <ScreenHeader
                  title={currentBill?.name}
                  showBackButton={true}
                  onBack={handleBack}
                />
                <StepIndicator
                  currentStep={stepIndex[screen]}
                  totalSteps={3}
                  steps={steps}
                />
                <div className="space-y-6">
                  <ExpenseForm />
                  <ExpenseList />
                  <Button
                    onClick={handleGoToReport}
                    disabled={!currentBill || currentBill.expenses.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Xem báo cáo chia tiền
                  </Button>
                </div>
              </Container>
            </motion.div>
          )}

          {screen === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Container>
                <ScreenHeader
                  title={currentBill?.name}
                  showBackButton={true}
                  onBack={handleBack}
                />
                <StepIndicator
                  currentStep={stepIndex[screen]}
                  totalSteps={3}
                  steps={steps}
                />
                <SettlementReport onFinish={() => setScreen('home')} />
              </Container>
            </motion.div>
          )}

          {screen === 'shared' && sharedBill && (
            <motion.div
              key="shared"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Container>
                <SharedBillView
                  bill={sharedBill}
                  onGoHome={() => setScreen('home')}
                />
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Bill Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-dark rounded-2xl shadow-2xl shadow-black/50 p-6"
            >
              <h2 className="text-2xl font-bold text-zinc-100 mb-6">Tạo Bill mới</h2>
              <div className="space-y-4">
                <Input
                  label="Tên buổi chơi / nhóm"
                  placeholder="Ví dụ: Ăn trưa team, Cafe cuối tuần..."
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleCreateBill}
                    disabled={!billName.trim()}
                    className="flex-1"
                  >
                    Tạo Bill
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-zinc-500 text-xs inline-flex items-center gap-1">
          © {currentYear} | Một sản phẩm của <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> <span className="text-zinc-400 font-medium">Khôi đẹp trai</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
