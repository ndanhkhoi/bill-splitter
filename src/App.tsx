import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Container } from './components/layout/Container';
import { StepIndicator } from './components/StepIndicator';
import { PersonList } from './components/PersonList';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SettlementReport } from './components/SettlementReport';
import { BillList } from './components/BillList';
import { useBillStore } from './stores/billStore';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';
import { Sparkles } from 'lucide-react';

type Screen = 'home' | 'setup' | 'expenses' | 'report';

function App() {
  const { currentBill, bills, createBill, clearCurrentBill, setCurrentBill } = useBillStore();
  const [screen, setScreen] = React.useState<Screen>('home');
  const [billName, setBillName] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const steps = ['Nhóm', 'Chi tiêu', 'Báo cáo'];
  const stepIndex: Record<Screen, number> = {
    home: -1,
    setup: 0,
    expenses: 1,
    report: 2,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <Header
        title={currentBill?.name || 'Chia Bill'}
        showBackButton={screen !== 'home'}
        onBack={handleBack}
      />

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
                <StepIndicator
                  currentStep={stepIndex[screen]}
                  totalSteps={3}
                  steps={steps}
                />
                <div className="space-y-6">
                  <PersonList />
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
                <StepIndicator
                  currentStep={stepIndex[screen]}
                  totalSteps={3}
                  steps={steps}
                />
                <SettlementReport onFinish={() => setScreen('home')} />
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
              className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Tạo Bill mới</h2>
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
    </div>
  );
}

export default App;
