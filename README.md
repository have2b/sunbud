<p align="center">
  <img src="/public/logo.svg" alt="Sunbud Logo" width="120" />
</p>

<h1 align="center">🌻 Sunbud – Modern E-commerce Platform</h1>

<p align="center">
  <b>Beautiful, robust, and accessible shopping experience for everyone.</b>
</p>

---

## 🛒 System Overview

Sunbud is a full-featured e-commerce solution designed for both shoppers and admins:

- 🛍️ Product catalog with detailed pages
- 🛒 Shopping cart with real-time stock validation
- 🔐 User authentication & profile management
- 🚚 Order processing with multiple delivery methods
- 🛠️ Admin dashboard for product, category, and order management
- 📱 Responsive, accessible design

---

## ⚡ Technology Stack

- **Frontend:**

  - Next.js 15 (App Router)
  - TypeScript
  - TailwindCSS (utility-first styling)
  - Shadcn UI & Radix UI (modern, accessible components)

- **State Management:**

  - Zustand (with persist middleware for cart)
  - React Context

- **Backend/API:**

  - Next.js API routes (REST architecture)
  - Prisma ORM (database access)

- **Other:**
  - LocalStorage for cart persistence
  - Toast notifications for user feedback

---

## ✨ Key Features

- **Product Management:** Create, edit, and delete products (admin)
- **Stock Management:** Real-time stock tracking & validation
- **Shopping Cart:** Add, update, and remove items (with stock checks)
- **User Accounts:** Register, login, manage profiles
- **Checkout:** Multiple delivery methods, address validation
- **Admin Dashboard:** Comprehensive management tools
- **Order Management:** Process, track, and update orders

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or newer
- Bun.js
- npm or yarn
- Database (see `.env.example` for config)

### Installation

```bash
git clone https://github.com/yourusername/sunbud.git
cd sunbud
bun install
```

### Environment Setup

- Copy `.env.example` to `.env` and fill in your database/config values.

### Database Setup

```bash
bunx prisma generate
bunx prisma db push
# (Optional) Seed with:
bun run seed
```

---

## 🏃 Running the Application

### Development

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production

```bash
bun run build && bun run start
```

---

## 👤 Admin Access

- Go to [http://localhost:3000/admin](http://localhost:3000/admin)
- Use your admin credentials to log in

---

## 📂 Project Structure

- `src/app` – Next.js app & API routes
- `src/components` – Reusable UI components
- `src/lib` – Utility functions
- `src/db` – Database schema/config
- `public` – Static assets (logo, images)

---

## 📝 Usage Guidance

### For Shoppers

1. **Browse** products and categories
2. **Add to Cart** (with real-time stock validation)
3. **View Cart** and adjust quantities (cannot exceed available stock)
4. **Checkout**:
   - Choose delivery method
   - Enter address (if shipping)
   - Confirm and place your order
5. **Track Orders** via your profile

### For Admins

1. **Log in** at `/admin`
2. **Manage Products**: create, edit, delete, adjust stock
3. **Manage Categories**: organize your catalog
4. **Process Orders**: update order status, view customer info

---

## ♿ Accessibility & UX

- All UI components use accessible patterns (keyboard navigation, ARIA labels, focus management)
- Responsive design for mobile & desktop
- Modern look and feel with TailwindCSS, Shadcn, and Radix
- Toast notifications for instant user feedback

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue or PR to discuss improvements.

---

## 📄 License

[MIT License](LICENSE)
