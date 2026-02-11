# Chia Bill - Ứng dụng chia tiền nhóm

<div align="center">

![Chia Bill Logo](public/favicon.svg)

**Ứng dụng chia tiền bill miễn phí với giao diện Glassmorphism hiện đại**

[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38BDF8)](https://tailwindcss.com/)

</div>

## Vấn đề & Giải pháp

### Vấn đề

Bạn đi ăn với nhóm bạn, mỗi người order món khác nhau, ai cũng chẳng nhớ mình phải trả bao nhiêu. Cuối cùng:

- Một người thanh toán hết rồi phải "đòi" tiền từng người
- Tính toán chia tiền thủ công, dễ sai sót
- Ai trả ít, ai trả nhiều dẫn đến chênh lệch công bằng
- Khó nhắc nhở mỗi người phải trả đúng số tiền
- Lưu thông tin ngân hàng của từng người rất lộn xộn

### Giải pháp

**Chia Bill** giải quyết tất cả vấn đề trên:

- Tự động tính toán ai phải trả, ai phải nhận bao nhiêu
- Tối ưu hóa số lần chuyển tiền (ít chuyển nhất có thể)
- Tạo QR Code riêng cho từng người với số tiền chính xác
- Chia sẻ bill qua link, không cần cài đặt app
- Lưu lại bill cũ để tra cứu khi cần
- Bảo mật - dữ liệu chỉ lưu trên thiết bị của bạn

### Tại sao lại tạo app này?

App được sinh ra từ nhu cầu thực tế của chính tác giả - mỗi lần đi chơi với bạn bè là phải tính toán chia tiền thủ công, rất bất tiện. Các app hiện tại thì:

- Quá nhiều bước, phức tạp
- Không hỗ trợ ngân hàng Việt Nam tốt
- Không tạo QR Code riêng cho từng người
- Cần tạo tài khoản, đăng nhập mới dùng

**Chia Bill** tập trung vào **đơn giản, nhanh chóng, và đúng với thói quen người Việt**.

## Tính năng

- **Quản lý bill** - Tạo, xem, sửa, xóa bill dễ dàng
- **Quản lý nhóm** - Thêm/bỏ người tham gia linh hoạt
- **Theo dõi chi tiêu** - Thêm khoản chi, chọn người trả và người chia sẻ
- **Tính toán chính xác** - Sử dụng `big.js` để tính toán chính xác tuyệt đối
- **Tối ưu hóa thanh toán** - Tự động tính toán cách chia tiền để giảm số lần chuyển tiền
- **Thông tin ngân hàng** - Hỗ trợ 60+ ngân hàng tại Việt Nam
- **QR Code riêng** - Tự động tạo QR chuyển khoản cho từng người cần trả tiền
- **Chia sẻ URL** - Chia sẻ bill qua link nén với LZString
- **Lưu trữ cục bộ** - Dữ liệu được lưu trong localStorage, bảo mật, không cần server
- **Responsive** - Hoạt động mượt mà trên mọi thiết bị

## Quick Start

### Cài đặt

```bash
# Clone repository
git clone https://github.com/ndanhkhoi/bill-splitter.git

# Di chuyển vào thư mục project
cd bill-splitter

# Cài đặt dependencies
npm install
```

### Chạy development server

```bash
npm run dev
```

App sẽ chạy tại [http://localhost:3000](http://localhost:3000)

### Build cho production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Công nghệ

| Thư viện | Phiên bản | Mục đích |
|----------|----------|----------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.1 | Build tool |
| TailwindCSS | 4.1.18 | Styling |
| Zustand | 5.0.11 | State management |
| Framer Motion | 12.34.0 | Animations |
| big.js | 7.0.1 | Xử lý số thập phân chính xác |
| Lucide React | 0.563.0 | Icons |
| React Select | 5.10.2 | Dropdown select |
| LZString | 1.5.0 | URL compression |

## Cấu trúc project

```
bill-splitter/
├── public/
│   └── favicon.svg          # Custom favicon
├── src/
│   ├── components/
│   │   ├── ui/              # UI components (Button, Card, Input, Select, Checkbox)
│   │   ├── layout/          # Layout components (Header, ScreenHeader, Container)
│   │   ├── StepIndicator.tsx
│   │   ├── PersonList.tsx
│   │   ├── BankInfoForm.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── BillSummary.tsx
│   │   ├── SettlementDetailsCard.tsx
│   │   ├── OptimalTransactions.tsx
│   │   ├── SettlementReport.tsx
│   │   ├── BillList.tsx
│   │   ├── SharedBillView.tsx
│   │   └── BillFooter.tsx
│   ├── stores/
│   │   └── billStore.ts     # Zustand store với persist middleware
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── utils/
│   │   ├── calculateSettlement.ts  # Logic tính toán chia tiền
│   │   ├── calculatePersonDetails.ts  # Chi tiết giao dịch mỗi người
│   │   └── shareBill.ts     # Encode/decode share URL
│   ├── constants/
│   │   └── bankNames.ts     # Danh sách 60+ ngân hàng VN
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Hướng dẫn sử dụng

### Tạo Bill mới

1. Click "Tạo Bill mới"
2. Nhập tên buổi chơi/nhóm
3. Thêm người tham gia (tối thiểu 2 người)
4. (Tùy chọn) Thêm thông tin ngân hàng để nhận tiền

### Thêm chi tiêu

1. Chọn người trả tiền
2. Nhập số tiền và tên khoản chi
3. Chọn những người chia sẻ khoản đó

### Xem báo cáo

- Tổng chi tiêu, trung bình mỗi người
- Chi tiết công nợ của mỗi người (đã chi, cần trả/cần nhận)
- QR Code chuyển khoản cho từng người cần trả
- Cách thanh toán tối ưu (giảm số lần chuyển)

### Chia sẻ bill

1. Click "Chia sẻ" ở màn hình báo cáo
2. Link sẽ được copy vào clipboard
3. Gửi link cho bạn bè để họ xem

### Quản lý bill cũ

- Click vào bill → Xem báo cáo
- Click icon bút → Sửa bill
- Click icon thùng rác → Xóa bill

## Giao diện

App sử dụng phong cách **Glassmorphism** với:
- Background gradient tím-xanh dương
- Cards trong suốt với backdrop blur
- Animations mượt mà với Framer Motion
- Responsive design cho mobile và desktop
- Custom QR Code từ VietQR API

## Credits

QR Code generation powered by [VietQR.io](https://vietqr.io) - API miễn phí tạo mã QR chuyển khoản ngân hàng Việt Nam.

## License

MIT License - freely usable for personal and commercial projects.

---

Made with [Heart](public/favicon.svg) using React + TypeScript + TailwindCSS
