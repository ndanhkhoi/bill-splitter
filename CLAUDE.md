# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Conventions

- **Minimal Emojis**: Use emojis sparingly in documentation and UI. Prefer clean, professional text over emoji-heavy content.
- **Vietnamese Language**: All user-facing text should be in Vietnamese. Technical documentation can be bilingual.
- **Privacy First**: All data stays in localStorage, no server-side storage.

## Project Overview

Chia Bill is a Vietnamese bill splitting application for groups with a modern dark mode UI featuring sky blue accents. Users can create bills, manage participants, track expenses, calculate optimal settlements, add bank information, generate individual QR codes for payments, preview QR codes in modal, and share bills via compressed URLs. All data persists locally using localStorage via Zustand's persist middleware.

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
- **Styling**: TailwindCSS v4 with dark mode design system
- **State Management**: Zustand 5.0.11 with persist middleware for localStorage
- **Animations**: Framer Motion 12.34.0 for screen transitions and modals
- **Financial Calculations**: big.js 7.0.1 for precise decimal math (avoids floating-point errors)
- **Icons**: Lucide React 0.563.0
- **Select Dropdown**: React Select 5.10.2 with custom dark theme styling
- **URL Compression**: LZString 1.5.0 for sharing bills via compressed URLs
- **QR Generation**: VietQR API for payment QR codes
- **Modals**: React Portal for rendering modals at document.body level

## Design System

### Color Palette (Dark Mode with Sky Blue)

**Primary Colors:**
- **Background**: `zinc-950`, `slate-950` - Very dark gradient background
- **Surface**: `zinc-900` - Card and input backgrounds
- **Border**: `zinc-800` - Default borders
- **Border Hover**: `zinc-700` - Hover state borders
- **Text Primary**: `zinc-100` - Headlines and important text
- **Text Secondary**: `zinc-400` - Labels and descriptions
- **Text Muted**: `zinc-500` - Placeholder and less important text
- **Text Disabled**: `zinc-700` - Disabled state text

**Accent Colors:**
- **Primary**: Sky Blue - Main accent color (CTAs, active states, focus rings)
  - `sky-500`: `rgb(14, 165, 233)` / `rgba(14, 165, 233, 0.2)`
  - `sky-600`: `rgb(2, 132, 199)` / `rgba(2, 132, 199, 0.3)`
- **Secondary**: Emerald - Success states (completed, positive balance)
  - `emerald-500`, `emerald-600`
- **Danger**: Rose - Error/delete states
  - `rose-500`, `rose-600`

**Button Variants:**
- **Primary**: Sky gradient `from-sky-500 to-sky-600` with shadow
- **Secondary**: Dark zinc background with zinc borders
- **Danger**: Rose gradient `from-rose-500 to-rose-600` with shadow
- **Ghost**: Transparent with hover state

### Styling Conventions

- **Dark Mode Base**: All backgrounds use dark zinc/slate colors
- **Glass Effect**: Used selectively with `backdrop-blur` and semi-transparent backgrounds
- **Borders**: `zinc-800` for default, `zinc-700` for hover
- **Shadows**: Colored shadows using accent colors (e.g., `shadow-sky-500/20`)
- **Radius**: `rounded-xl` for most elements, `rounded-lg` for smaller elements

### Interactive States

- **Focus**: Sky blue ring `ring-sky-500/50` with matching border
- **Hover**: Slightly lighter backgrounds or accent color highlights
- **Active**: Scale down effect `active:scale-[0.98]` for buttons
- **Disabled**: `opacity-50` with `cursor-not-allowed`

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

### QR Code Preview Modal

Located in `src/components/SettlementDetailsCard.tsx`:

- Uses React Portal (`createPortal`) to render modal at document.body level
- Fixed positioning with `z-[9999]` to always appear on top
- Backdrop blur overlay with click-outside-to-close
- Modal renders directly to body to avoid parent container overflow/positioning issues

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
│   ├── Button.tsx    # Sky gradient primary, zinc secondary, rose danger, ghost variants
│   ├── Card.tsx      # Glass-dark effect with zinc borders
│   ├── Input.tsx     # Floating label input with sky focus states
│   ├── Select.tsx    # Native select with sky focus ring
│   └── Checkbox.tsx # Sky gradient when checked
├── layout/          # Layout components
│   ├── Header.tsx    # Logo with sky gradient, Receipt icon + accent dot
│   ├── ScreenHeader.tsx  # Screen title with back button
│   └── Container.tsx    # Content container with max-width
├── StepIndicator.tsx    # Sky gradient for active step, emerald for completed
├── PersonList.tsx        # Add/remove participants with sky avatar badges
├── BankInfoForm.tsx      # React Select with sky dropdown styles
├── ExpenseForm.tsx       # Add expense form with sky select
├── ExpenseList.tsx        # List of expenses with emerald/rose badges
├── BillSummary.tsx        # Summary cards with sky/emerald gradients
├── SettlementDetailsCard.tsx  # Expandable cards + QR preview modal (Portal)
├── OptimalTransactions.tsx    # Sky gradient header with zinc transaction cards
├── SettlementReport.tsx   # Sky accent badges for date
├── BillList.tsx          # Bill cards with sky edit icons
└── SharedBillView.tsx     # Sky/emerald badges for shared view
```

UI components use dark theme with zinc colors and sky blue accents:
- Cards: `glass-dark` utility class (backdrop-blur, zinc backgrounds)
- Buttons: Sky gradient primary with colored shadows
- Inputs: Zinc backgrounds with sky focus rings
- Interactive: Hover states with zinc-700, sky highlights

### Bill Management Flow

1. **Create Bill**: From home screen, click "Tạo Bill mới" → enter name → goes to Setup
2. **Setup**: Add participants (min 2) → optionally add bank info → continue to Expenses
3. **Expenses**: Add expenses with payer/participant selection → continue to Report
4. **Report**: View settlements, QR codes (click to preview), optimized transactions → Save or Share
5. **View Bill**: Click on bill card → goes directly to Report screen
6. **Edit Bill**: Click edit icon (pencil) → goes to Setup screen
7. **Delete Bill**: Click delete icon (trash) → confirms → removes from list

### Bank Information & QR Codes

- Bank info is optional, stored in `Bill.bankCode` and `Bill.accountNumber`
- Bank selection uses React Select with dark theme sky blue dropdown styles
- Bank codes defined in `src/constants/bankNames.ts` (60+ Vietnamese banks)
- QR codes generated via VietQR API: `https://img.vietqr.io/image/{bankCode}-{accountNumber}-print.png?amount={amount}&addInfo={memo}`
- QR codes are individualized per person with specific amount and memo
- SettlementDetailsCard shows QR only for people who need to pay (negative balance)
- Click QR to open preview modal (rendered via Portal to document.body)
- Download button allows saving QR image locally

### Share Functionality

- Click "Chia sẻ" button copies share URL to clipboard
- URL format: `{baseUrl}?data={compressedBillData}`
- Shared bills are view-only (no editing)
- SharedView mode shows same report but with "Tạo bill của bạn" button instead of save/share

### Styling Conventions

- **CSS Variables**: Defined in `src/index.css` with `@theme` directive
- **Dark Theme**: All colors use zinc/slate palette with sky blue accents
- **Glass Effect**: `backdrop-blur-xl bg-zinc-900/50 border-zinc-800` with subtle transparency
- **Gradients**: Use sky blue gradients for primary actions and accents
- **Borders**: Consistent zinc-800 default, zinc-700 for hover states
- **Typography**: TailwindCSS v4 with custom font pairing
- **Animations**: Framer Motion for transitions and micro-interactions
- **Responsive**: Mobile-first with `sm:` prefix for tablet+ breakpoints
- **React Select Custom Styles**:
  - Control: `rgba(24, 24, 27, 0.5)` background, sky blue hover borders
  - Dropdown: Dark background with zinc-800 borders and shadow
  - Options: Sky blue focus/hover/active states
  - Scrollbar: Dark themed with sky blue thumb
- **Buttons**: `inline-flex items-center justify-center gap-2` for proper icon+text alignment
- **Cursor States**: All interactive elements have `cursor-pointer`, disabled have `cursor-not-allowed`

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
9. **React Select Styles**: Define custom styles object with dark theme colors (zinc backgrounds, sky accents)
10. **QR Code Loading**: Handle image errors with fallback SVG for failed QR loads
11. **QR Preview Modal**: Use React Portal to render modal at document.body level for proper z-index layering
12. **Cursor States**: Add `cursor-pointer` to all interactive elements, `cursor-not-allowed` to disabled

## Common Issues

- **Card onClick not working**: Ensure Card component props extend `React.HTMLAttributes<HTMLDivElement>` and spread `...props` to the div
- **Big.js errors**: Remember that `Big.min()` doesn't exist - use comparison operators instead
- **Screen navigation timing**: Use `setTimeout(..., 0)` when setting state before navigation to ensure state updates are processed
- **React Select styling**: Custom styles must define all states (control, menu, option, etc.) for dark theme
- **QR Code not loading**: Add `onError` handler to img tag with fallback SVG
- **Share URL too long**: LZString should compress, but very large bills may still exceed URL limits
- **LocalStorage quota**: Bill data is compressed but many large bills may hit storage limits
- **Modal z-index issues**: Use React Portal to render modals at document.body level with z-[9999]
- **Select dropdown colors**: Ensure all hardcoded RGB values use sky blue (14, 165, 233) instead of cyan (6, 182, 212)
