# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chia Bill is a Vietnamese bill splitting application for groups with a modern glassmorphism UI. Users can create bills, manage participants, track expenses, calculate optimal settlements, and view/edit saved bills. All data persists locally using localStorage via Zustand's persist middleware.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Technology Stack

- **Frontend**: React 19.2.0 + TypeScript with Vite 7.3.1
- **Styling**: TailwindCSS v4 with glassmorphism design system
- **State Management**: Zustand 5.0.11 with persist middleware for localStorage
- **Animations**: Framer Motion 12.34.0 for screen transitions
- **Financial Calculations**: big.js 7.0.1 for precise decimal math (avoids floating-point errors)
- **Icons**: Lucide React 0.563.0

## Architecture

### Application Flow

The app follows a multi-screen pattern managed by `App.tsx` with screen state:

- **Home** (`home`): Bill list - view, create, edit, or delete saved bills
- **Setup** (`setup`): Add participants to the group
- **Expenses** (`expenses`): Add individual expenses with payer/participant selection
- **Report** (`report`): View settlement calculations

Navigation state is tracked via `screen` state ('home' | 'setup' | 'expenses' | 'report') with Framer Motion AnimatePresence for slide transitions.

### State Management

All state lives in `src/stores/billStore.ts` using Zustand with persistence:

```typescript
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
}
```

The store automatically persists to localStorage with key `'bill-storage'`. Use `saveCurrentBillToList()` helper to save the current bill to the bills array.

### Financial Calculation Logic

Located in `src/utils/calculateSettlement.ts`:

- Uses `big.js` for all currency operations to avoid floating-point precision issues
- Currency amounts stored as strings (e.g., "100000") and parsed with `new Big()`
- **Important**: `Big.min()` is not available - use comparison: `amount1.lt(amount2) ? amount1 : amount2`
- Calculates individual balances: positive = needs to receive, negative = needs to pay
- Implements greedy algorithm in `optimizeTransactions()` to minimize transaction count
- **Currency formatting**: Vietnamese đồng (₫) with dot separators, 0 decimal places (e.g., "100.000₫")
- Helper functions: `formatCurrency()` and `parseCurrencyInput()`

### Type System

All types defined in `src/types/index.ts`:

```typescript
interface Person {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  name: string;
  amount: string; // String for precision
  payerId: string;
  participantIds: string[];
}

interface Bill {
  id: string;
  name: string;
  date: string;
  people: Person[];
  expenses: Expense[];
}

interface Settlement {
  personId: string;
  personName: string;
  amountOwed: string; // Positive: needs to receive, Negative: needs to pay
}

interface Transaction {
  from: string; // person name
  to: string; // person name
  amount: string;
}
```

### Component Structure

```
src/components/
├── ui/              # Reusable UI primitives (Button, Card, Input, Select, Checkbox)
│   └── Card.tsx     # IMPORTANT: CardProps extends React.HTMLAttributes for onClick support
├── layout/          # Header and Container wrappers
├── StepIndicator.tsx
├── PersonList.tsx
├── ExpenseForm.tsx
├── ExpenseList.tsx
├── SettlementReport.tsx
└── BillList.tsx     # Handles bill viewing, editing, and deletion
```

UI components use glassmorphism styling: `backdrop-blur-xl bg-white/10 border border-white/20`.

### Bill Management Flow

1. **Create Bill**: From home screen, click "Tạo Bill mới" → enter name → goes to Setup
2. **View Bill**: Click on bill card → goes directly to Report screen
3. **Edit Bill**: Click edit icon (pencil) → goes to Setup screen
4. **Delete Bill**: Click delete icon (trash) → confirms → removes from list
5. **Save Bill**: Automatic via `saveCurrentBillToList()` when finishing

### Styling Conventions

- TailwindCSS v4 with `@import "tailwindcss"` in `src/index.css`
- Glassmorphism theme with gradient background (`from-slate-900 via-purple-900 to-slate-900`)
- Custom scrollbar styling in index.css
- Mobile-first responsive design
- Framer Motion for screen transitions (slide left/right with fade)
- Buttons use `inline-flex items-center justify-center gap-2` for proper icon+text alignment

### TypeScript Configuration

- Target: ES2022 with strict mode enabled
- `jsx: "react-jsx"` for React 19
- Module resolution: "bundler" for Vite
- `verbatimModuleSyntax: true`
- Linting rules: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

## Key Patterns

1. **Currency Handling**: Always use `big.js` for financial calculations. Store amounts as strings to preserve precision.
2. **ID Generation**: Use `Date.now()` + random for unique IDs (e.g., `person-${Date.now()}-${Math.random()}`)
3. **Screen Transitions**: Use Framer Motion's AnimatePresence with slide animations for screen changes
4. **State Updates**: Use Zustand's `set` with functional updates for derived state changes
5. **Person Removal**: When removing a person, update expenses to reassign their payerId and remove from participantIds
6. **Bill Navigation**: Pass callbacks to child components (BillList) rather than managing navigation in components
7. **Big.js Comparison**: Use `.lt()` (less than) method instead of `Big.min()` for finding minimum values

## Common Issues

- **Card onClick not working**: Ensure Card component props extend `React.HTMLAttributes<HTMLDivElement>` and spread `...props` to the div
- **Big.js errors**: Remember that `Big.min()` doesn't exist - use comparison operators instead
- **Screen navigation timing**: Use `setTimeout(..., 0)` when setting state before navigation to ensure state updates are processed
