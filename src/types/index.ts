export interface Person {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: string; // Sử dụng string để lưu số nguyên (làm tròn tới 1 đồng)
  payerId: string;
  participantIds: string[];
}

export interface Bill {
  id: string;
  name: string;
  date: string;
  people: Person[];
  expenses: Expense[];
  bankCode?: string; // Mã ngân hàng (tùy chọn)
  accountNumber?: string; // Số tài khoản người nhận (tùy chọn)
}

export interface Settlement {
  personId: string;
  personName: string;
  amountOwed: string; // Dương: cần nhận thêm, Âm: cần trả thêm
}

export interface Transaction {
  from: string; // person name
  to: string; // person name
  amount: string;
}
