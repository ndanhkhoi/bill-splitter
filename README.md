# Chia Bill - Ứng dụng chia tiền nhóm

<div align="center">

![Chia Bill Logo](public/favicon.svg)

**Ứng dụng chia tiền bill miễn phí với giao diện Glassmorphism hiện đại**

[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38BDF8)](https://tailwindcss.com/)

</div>

## ✨ Tính năng

- 📋 **Quản lý bill** - Tạo, xem, sửa, xóa bill dễ dàng
- 👥 **Quản lý nhóm** - Thêm/bỏ người tham gia linh hoạt
- 💰 **Theo dõi chi tiêu** - Thêm khoản chi, chọn người trả và người chia sẻ
- 🧮 **Tính toán chính xác** - Sử dụng `big.js` để tính toán chính xác tuyệt đối
- ⚡ **Tối ưu hóa thanh toán** - Tự động tính toán cách chia tiền để giảm số lần chuyển tiền
- 💾 **Lưu trữ cục bộ** - Dữ liệu được lưu trong localStorage, bảo mật, không cần server
- 📱 **Responsive** - Hoạt động mượt mà trên mọi thiết bị

## 🚀 Quick Start

### Cài đặt

```bash
# Clone repository
git clone <your-repo-url>

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

## 🛠️ Công nghệ

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

## 📁 Cấu trúc project

```
bill-splitter/
├── public/
│   └── favicon.svg          # Custom favicon
├── src/
│   ├── components/
│   │   ├── ui/              # UI components (Button, Card, Input, Select, Checkbox)
│   │   ├── layout/          # Layout components (Header, Container)
│   │   ├── StepIndicator.tsx
│   │   ├── PersonList.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── SettlementReport.tsx
│   │   └── BillList.tsx
│   ├── stores/
│   │   └── billStore.ts     # Zustand store với persist middleware
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── utils/
│   │   └── calculateSettlement.ts  # Logic tính toán chia tiền
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html               # Meta tags đầy đủ cho SEO
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 💡 Hướng dẫn sử dụng

1. **Tạo Bill mới**
   - Click "Tạo Bill mới"
   - Nhập tên buổi chơi/nhóm
   - Thêm người tham gia

2. **Thêm chi tiêu**
   - Chọn người trả tiền
   - Nhập số tiền và tên khoản chi
   - Chọn những người chia sẻ khoản đó

3. **Xem báo cáo**
   - Xem tổng chi tiêu, trung bình mỗi người
   - Xem chi tiết công nợ của mỗi người
   - Xem cách thanh toán tối ưu (giảm số lần chuyển)

4. **Quản lý bill cũ**
   - Click vào bill → Xem báo cáo
   - Click icon bút → Sửa bill
   - Click icon thùng rác → Xóa bill

## 🎨 Giao diện

App sử dụng phong cách **Glassmorphism** với:
- Background gradient tím-xanh dương
- Cards trong suốt với backdrop blur
- Animations mượt mà với Framer Motion
- Responsive design cho mobile và desktop

## 📄 License

MIT License - freely usable for personal and commercial projects.

## 🤝 Đóng góp

Contributions, issues and feature requests are welcome!

---

Made with ❤️ using React + TypeScript + TailwindCSS
