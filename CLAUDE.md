# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chia Bill is a Vietnamese bill splitting application for groups with a modern glassmorphism UI. Users can create bills, manage participants, track expenses, calculate optimal settlements, add bank information, generate individual QR codes for payments, and share bills via compressed URLs. All data persists locally using localStorage via Zustand's persist middleware.

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
- **Select Dropdown**: React Select 5.10.2 with custom glassmorphism styling
- **URL Compression**: LZString 1.5.0 for sharing bills via compressed URLs
- **QR Generation**: VietQR API for payment QR codes

## Architecture

### Application Flow

The app follows a multi-screen pattern managed by `App.tsx` with screen state:

- **Home** (`home`): Bill list - view, create, edit, or delete saved bills
- **Setup** (`setup`): Add participants and bank information
- **Expenses** (`expenses`): Add individual expenses with payer/participant selection
- **Report** (`report`): View settlement calculations with QR codes
- **Shared** (`shared`): View-only mode for shared bill links

Navigation state is tracked via `screen` state ('home' | 'setup' | 'expenses' | 'report' | 'shared') with Framer Motion AnimatePresence for slide transitions.

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
  updateBankInfo: (bankCode?: string, accountNumber?: string) => void;
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

### Person Details Calculation

Located in `src/utils/calculatePersonDetails.ts`:

- `calculatePersonDetails(personId, bill)` returns detailed transaction info for a person:
  - `totalPaid`: Total amount this person paid
  - `paidExpenses`: List of expenses this person paid
  - `participatedExpenses`: List of expenses this person participated in with their share

### Bill Sharing

Located in `src/utils/shareBill.ts`:

- Uses LZString compression to encode bill data into URL-safe strings
- `encodeBillToUrl(bill)`: Compresses bill to URL-safe string
- `decodeBillFromUrl(encoded)`: Decompresses and validates bill data
- `generateShareUrl(bill)`: Creates full shareable URL
- `parseSharedBillFromUrl()`: Extracts bill from current URL parameters

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
  bankCode?: string; // Optional: Bank code for receiving payments
  accountNumber?: string; // Optional: Account number for receiving payments
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
├── ui/              # Reusable UI primitives
│   ├── Button.tsx    # Glassmorphism styled button with variants (primary, secondary, ghost)
│   ├── Card.tsx      # IMPORTANT: CardProps extends React.HTMLAttributes for onClick support
│   ├── Input.tsx     # Floating label input with glassmorphism
│   ├── Select.tsx    # Custom select (not currently used, replaced by react-select)
│   └── Checkbox.tsx # Custom checkbox component
├── layout/          # Layout components
│   ├── Header.tsx    # App header with home button
│   ├── ScreenHeader.tsx  # Screen title with back button
│   └── Container.tsx    # Content container with max-width
├── StepIndicator.tsx    # Shows current step in bill creation flow
├── PersonList.tsx        # Add/remove participants
├── BankInfoForm.tsx      # Bank selection with react-select dropdown
├── ExpenseForm.tsx       # Add new expense form
├── ExpenseList.tsx        # List of added expenses
├── BillSummary.tsx        # Summary stats (total, per person, expense count)
├── SettlementDetailsCard.tsx  # Expandable cards showing each person's details + QR
├── OptimalTransactions.tsx    # Shows optimized payment transactions
├── SettlementReport.tsx   # Main report screen with share functionality
├── BillList.tsx          # Home screen bill list with edit/delete
├── SharedBillView.tsx     # View-only mode for shared bills
└── BillFooter.tsx         # Footer component (unused)
```

UI components use glassmorphism styling: `backdrop-blur-xl bg-white/10 border border-white/20`.

### Bill Management Flow

1. **Create Bill**: From home screen, click "Tạo Bill mới" → enter name → goes to Setup
2. **Setup**: Add participants (min 2) → optionally add bank info → continue to Expenses
3. **Expenses**: Add expenses with payer/participant selection → continue to Report
4. **Report**: View settlements, QR codes, optimized transactions → Save or Share
5. **View Bill**: Click on bill card → goes directly to Report screen
6. **Edit Bill**: Click edit icon (pencil) → goes to Setup screen
7. **Delete Bill**: Click delete icon (trash) → confirms → removes from list

### Bank Information & QR Codes

- Bank info is optional, stored in `Bill.bankCode` and `Bill.accountNumber`
- Bank selection uses React Select with custom glassmorphism styles
- Bank codes defined in `src/constants/bankNames.ts` (60+ Vietnamese banks)
- QR codes generated via VietQR API: `https://img.vietqr.io/image/{bankCode}-{accountNumber}-print.png?amount={amount}&addInfo={memo}`
- QR codes are individualized per person with specific amount and memo
- SettlementDetailsCard shows QR only for people who need to pay (negative balance)
- Download button allows saving QR image locally

### Share Functionality

- Click "Chia sẻ" button copies share URL to clipboard
- URL format: `{baseUrl}?data={compressedBillData}`
- Shared bills are view-only (no editing)
- SharedView mode shows same report but with "Tạo bill của bạn" button instead of save/share

### Styling Conventions

- TailwindCSS v4 with `@import "tailwindcss"` in `src/index.css`
- Glassmorphism theme with gradient background (`from-slate-900 via-purple-900 to-slate-900`)
- Custom scrollbar styling in index.css
- Mobile-first responsive design (use `sm:` prefix for tablet+)
- Framer Motion for screen transitions (slide left/right with fade)
- Buttons use `inline-flex items-center justify-center gap-2` for proper icon+text alignment
- React Select custom styles in `BankInfoForm.tsx` for glassmorphism appearance

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
8. **Settlement Sorting**: Sort settlements by amountOwed ascending (negative → positive) to show debtors first
9. **React Select Styles**: Define custom styles object for glassmorphism dropdown appearance
10. **QR Code Loading**: Handle image errors with fallback SVG for failed QR loads

## Common Issues

- **Card onClick not working**: Ensure Card component props extend `React.HTMLAttributes<HTMLDivElement>` and spread `...props` to the div
- **Big.js errors**: Remember that `Big.min()` doesn't exist - use comparison operators instead
- **Screen navigation timing**: Use `setTimeout(..., 0)` when setting state before navigation to ensure state updates are processed
- **React Select styling**: Custom styles must define all states (control, menu, option, etc.) for glassmorphism effect
- **QR Code not loading**: Add `onError` handler to img tag with fallback SVG
- **Share URL too long**: LZString should compress, but very large bills may still exceed URL limits
- **LocalStorage quota**: Bill data is compressed but many large bills may hit storage limits
