import React, { useState } from 'react';
import Select from 'react-select';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { useBillStore } from '../stores/billStore';
import { CreditCard, Info, ChevronDown } from 'lucide-react';

interface BankOption {
  value: string;
  label: string;
}

// Danh sách ngân hàng Việt Nam - chỉ có tên
const BANK_OPTIONS: BankOption[] = [
  { value: 'ICB', label: 'VietinBank' },
  { value: 'VCB', label: 'Vietcombank' },
  { value: 'BIDV', label: 'BIDV' },
  { value: 'VBA', label: 'Agribank' },
  { value: 'OCB', label: 'OCB' },
  { value: 'MB', label: 'MBBank' },
  { value: 'TCB', label: 'Techcombank' },
  { value: 'ACB', label: 'ACB' },
  { value: 'VPB', label: 'VPBank' },
  { value: 'TPB', label: 'TPBank' },
  { value: 'STB', label: 'Sacombank' },
  { value: 'HDB', label: 'HDBank' },
  { value: 'VCCB', label: 'VietCapitalBank' },
  { value: 'SCB', label: 'SCB' },
  { value: 'VIB', label: 'VIB' },
  { value: 'SHB', label: 'SHB' },
  { value: 'EIB', label: 'Eximbank' },
  { value: 'MSB', label: 'MSB' },
  { value: 'CAKE', label: 'CAKE' },
  { value: 'Ubank', label: 'Ubank' },
  { value: 'VTLMONEY', label: 'ViettelMoney' },
  { value: 'TIMO', label: 'Timo' },
  { value: 'VNPTMONEY', label: 'VNPTMoney' },
  { value: 'SGICB', label: 'SaigonBank' },
  { value: 'BAB', label: 'BacABank' },
  { value: 'momo', label: 'MoMo' },
  { value: 'PVDB', label: 'PVcomBank Pay' },
  { value: 'PVCB', label: 'PVcomBank' },
  { value: 'MBV', label: 'MBV' },
  { value: 'NCB', label: 'NCB' },
  { value: 'SHBVN', label: 'ShinhanBank' },
  { value: 'ABB', label: 'ABBANK' },
  { value: 'VAB', label: 'VietABank' },
  { value: 'NAB', label: 'NamABank' },
  { value: 'PGB', label: 'PGBank' },
  { value: 'VIETBANK', label: 'VietBank' },
  { value: 'BVB', label: 'BaoVietBank' },
  { value: 'SEAB', label: 'SeABank' },
  { value: 'COOPBANK', label: 'COOPBANK' },
  { value: 'LPB', label: 'LPBank' },
  { value: 'KLB', label: 'KienLongBank' },
  { value: 'KBank', label: 'KBank' },
  { value: 'MAFC', label: 'MAFC' },
  { value: 'HLBVN', label: 'HongLeong' },
  { value: 'KEBHANAHN', label: 'KEBHANAHN' },
  { value: 'KEBHANAHCM', label: 'KEBHanaHCM' },
  { value: 'CITIBANK', label: 'Citibank' },
  { value: 'CBB', label: 'CBBank' },
  { value: 'CIMB', label: 'CIMB' },
  { value: 'DBS', label: 'DBSBank' },
  { value: 'Vikki', label: 'Vikki' },
  { value: 'VBSP', label: 'VBSP' },
  { value: 'GPB', label: 'GPBank' },
  { value: 'KBHCM', label: 'KookminHCM' },
  { value: 'KBHN', label: 'KookminHN' },
  { value: 'WVN', label: 'Woori' },
  { value: 'VRB', label: 'VRB' },
  { value: 'HSBC', label: 'HSBC' },
  { value: 'IBK - HN', label: 'IBKHN' },
  { value: 'IBK - HCM', label: 'IBKHCM' },
  { value: 'IVB', label: 'IndovinaBank' },
  { value: 'UOB', label: 'UnitedOverseas' },
  { value: 'NHB HN', label: 'Nonghyup' },
  { value: 'SCVN', label: 'StandardChartered' },
  { value: 'PBVN', label: 'PublicBank' },
];

// Custom styles cho react-select - Dark theme
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    border: '1px solid rgba(39, 39, 42, 1)',
    borderRadius: '0.75rem',
    padding: '4px',
    minHeight: '52px',
    cursor: 'pointer',
    '&:hover': {
      borderColor: 'rgba(6, 182, 212, 0.5)',
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0 12px',
    color: '#fafafa',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#fafafa',
    margin: '0',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#71717a',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#fafafa',
    fontWeight: '500',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#18181b',
    borderRadius: '0.75rem',
    border: '1px solid #27272a',
    marginTop: '8px',
    zIndex: 50,
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: '8px',
    borderRadius: '0.75rem',
    maxHeight: '300px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
    color: state.isFocused ? '#fafafa' : '#a1a1aa',
    padding: '12px 16px',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
    },
    '&:active': {
      backgroundColor: 'rgba(6, 182, 212, 0.3)',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#71717a',
    padding: '8px',
    '&:hover': {
      color: '#a1a1aa',
    },
  }),
  noOptionsMessage: (provided: any) => ({
    ...provided,
    color: '#71717a',
  }),
};

const DropdownIndicator = () => (
  <ChevronDown className="w-5 h-5 text-zinc-500 mr-2" />
);

export const BankInfoForm: React.FC = () => {
  const { currentBill, updateBankInfo } = useBillStore();
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(
    currentBill?.bankCode
      ? BANK_OPTIONS.find(b => b.value === currentBill.bankCode) || null
      : null
  );
  const [accountNumber, setAccountNumber] = useState(currentBill?.accountNumber || '');

  const handleBankChange = (option: BankOption | null) => {
    setSelectedBank(option);
    updateBankInfo(option?.value, accountNumber || undefined);
  };

  const handleAccountChange = (value: string) => {
    setAccountNumber(value);
    updateBankInfo(selectedBank?.value, value || undefined);
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-zinc-100">Thông tin nhận tiền</h2>
            <p className="text-xs text-zinc-500">Tùy chọn - Hiển thị QR ở báo cáo</p>
          </div>
        </div>

        <div className="flex gap-2 items-start p-3 bg-sky-500/10 rounded-xl border border-sky-500/20">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400">
            Nếu bạn là người đại diện thu tiền, hãy thêm thông tin ngân hàng để mọi người có thể quét QR chuyển tiền dễ dàng hơn.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-2 block">
              Ngân hàng
            </label>
            <Select
              value={selectedBank}
              onChange={handleBankChange}
              options={BANK_OPTIONS}
              placeholder="Tìm kiếm ngân hàng..."
              styles={customStyles}
              isSearchable
              isClearable
              components={{ DropdownIndicator }}
              noOptionsMessage={() => 'Không tìm thấy ngân hàng'}
            />
          </div>

          <Input
            label="Số tài khoản"
            placeholder="Nhập số tài khoản..."
            value={accountNumber}
            onChange={(e) => handleAccountChange(e.target.value)}
          />
        </div>

        {(selectedBank || accountNumber) && (
          <div className="text-center pt-2">
            <p className="text-sm text-zinc-400">
              {selectedBank && accountNumber
                ? 'Đã sẵn sàng nhận chuyển tiền'
                : 'Vui lòng điền đầy đủ thông tin'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
