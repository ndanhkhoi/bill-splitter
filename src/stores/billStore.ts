import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {Bill, Person, Expense} from '../types';

interface BillStore {
  currentBill: Bill | null;
  bills: Bill[];
  createBill: (name: string) => void;
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  setCurrentBill: (bill: Bill | null) => void;
  deleteBill: (id: string) => void;
  clearCurrentBill: () => void;
  updateBankInfo: (bankCode?: string, accountNumber?: string) => void;
}

export const useBillStore = create<BillStore>()(
  persist(
    (set) => ({
      currentBill: null,
      bills: [],

      createBill: (name: string) => {
        const newBill: Bill = {
          id: Date.now().toString(),
          name,
          date: new Date().toISOString(),
          people: [],
          expenses: [],
        };
        set({ currentBill: newBill });
      },

      addPerson: (name: string) => {
        set((state) => {
          if (!state.currentBill) return state;

          const newPerson: Person = {
            id: `person-${Date.now()}-${Math.random()}`,
            name,
          };

          const updatedBill = {
            ...state.currentBill,
            people: [...state.currentBill.people, newPerson],
          };

          return { currentBill: updatedBill };
        });
      },

      removePerson: (id: string) => {
        set((state) => {
          if (!state.currentBill) return state;

          const updatedBill = {
            ...state.currentBill,
            people: state.currentBill.people.filter((p) => p.id !== id),
            expenses: state.currentBill.expenses.map((expense) => ({
              ...expense,
              payerId: expense.payerId === id ? state.currentBill!.people[0]?.id || '' : expense.payerId,
              participantIds: expense.participantIds.filter((pid) => pid !== id),
            })),
          };

          return { currentBill: updatedBill };
        });
      },

      addExpense: (expense: Omit<Expense, 'id'>) => {
        set((state) => {
          if (!state.currentBill) return state;

          const newExpense: Expense = {
            ...expense,
            id: `expense-${Date.now()}-${Math.random()}`,
          };

          const updatedBill = {
            ...state.currentBill,
            expenses: [...state.currentBill.expenses, newExpense],
          };

          return { currentBill: updatedBill };
        });
      },

      removeExpense: (id: string) => {
        set((state) => {
          if (!state.currentBill) return state;

          const updatedBill = {
            ...state.currentBill,
            expenses: state.currentBill.expenses.filter((e) => e.id !== id),
          };

          return { currentBill: updatedBill };
        });
      },

      setCurrentBill: (bill: Bill | null) => {
        set({ currentBill: bill });
      },

      clearCurrentBill: () => {
        set({ currentBill: null });
      },

      deleteBill: (id: string) => {
        set((state) => ({
          bills: state.bills.filter((b) => b.id !== id),
          currentBill: state.currentBill?.id === id ? null : state.currentBill,
        }));
      },

      updateBankInfo: (bankCode?: string, accountNumber?: string) => {
        set((state) => {
          if (!state.currentBill) return state;

          const updatedBill = {
            ...state.currentBill,
            bankCode: bankCode || undefined,
            accountNumber: accountNumber || undefined,
          };

          return { currentBill: updatedBill };
        });
      },
    }),
    {
      name: 'bill-storage',
      onRehydrateStorage: () => (state) => {
        // Xử lý sau khi rehydrate từ localStorage
        console.log('Rehydrated state:', state);
      },
    }
  )
);

// Selector để lưu bill vào danh sách
export function saveCurrentBillToList() {
  const state = useBillStore.getState();
  if (state.currentBill) {
    const existingIndex = state.bills.findIndex((b) => b.id === state.currentBill!.id);
    let updatedBills;

    if (existingIndex >= 0) {
      updatedBills = state.bills.map((b, i) =>
        i === existingIndex ? state.currentBill! : b
      );
    } else {
      updatedBills = [...state.bills, state.currentBill];
    }

    useBillStore.setState({ bills: updatedBills });
  }
}
