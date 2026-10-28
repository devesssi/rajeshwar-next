# Rajeshwar Infotech – Computer Parts & Micro Components

A modern, production-ready B2B and retail e-commerce platform for **Rajeshwar Infotech**, an industrial supplier of authentic computer hardware, laptop replacement panels, semiconductors, micro ICs, and networking equipment.

Built with **Next.js 15 (App Router)**, **Tailwind CSS**, **shadcn/ui**, **Clerk Authentication**, and **Turso Cloud Database (libSQL)**.

---

## 📑 Table of Contents
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features](#-key-features)
- [Mobile Compatibility](#-mobile-compatibility)
- [Database Schema & Models](#-database-schema--models)
- [Environment Variables](#-environment-variables)
- [Local Development Guide](#-local-development-guide)
- [Step-by-Step GitHub Push](#-step-by-step-github-push)
- [Step-by-Step Vercel Deployment](#-step-by-step-vercel-deployment)
- [Clerk Production Configuration](#-clerk-production-configuration)
- [WhatsApp Ordering Workflow](#-whatsapp-ordering-workflow)
- [Troubleshooting & Common Questions](#-troubleshooting--common-questions)

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | React Server Components, Server Actions, Dynamic Routes |
| **Styling** | Tailwind CSS v3 + CSS Variables | Dark PCB circuit theme (`#06100c` background, emerald green `#2ee59d` accents) |
| **Component Primitives** | shadcn/ui + Radix UI | Buttons, Cards, Dialogs, Sheets, Tabs, Skeletons, Sonner Toasts |
| **Icons** | Lucide React | Modern vector icons tailored for hardware & electronics |
| **Database** | Turso Cloud Database (`@libsql/client`) | Serverless distributed SQLite with fallback to local `file:data.db` |
| **Authentication** | Clerk (`@clerk/nextjs` v6) | User management, session tokens, protected admin middleware |
| **Hosting & CI/CD** | Vercel | Edge optimization, serverless functions, automatic Git deployments |

---

## 🚀 Key Features

### 1. Storefront & Dark PCB Aesthetic
- **Industrial Aesthetic**: Built with dark theme tokens, emerald circuit glow effects, and PCB grid backgrounds.
- **8-Section Landing Page (`/`)**:
  - **Hero**: Tagline, category quick-jump chips, search input with instant redirection to `/products?q=...`, and dual CTA buttons.
  - **Trust Strip**: Genuine OEM parts, bulk wholesale quotes, technical component sourcing, and same-day dispatch.
  - **Categories Showcase**: Real-time category cards with icon previews and item counters.
  - **Featured Hardware (8 items)**: Spotlight cards with direct *Add to cart* capability.
  - **How It Works**: 3-step visual workflow (Search, Add to Cart, Quick Checkout).
  - **Authorized Brands**: Intel, AMD, Samsung, Kingston, TP-Link, Texas Instruments, STMicroelectronics, Western Digital, etc.
  - **Customer Testimonials & Interactive FAQ Accordion**: Real-world technician reviews and expandable answers.
  - **Call to Action Banner & Comprehensive Footer**: Quick links to About, Services, Contact, and WhatsApp support.

### 2. Catalogue & Inventory (`/products`)
- **42 Seeded Hardware Items**: Processors, DDR4/DDR5 RAM, NVMe SSDs, display panels, microcontrollers (ATmega328P, STM32), discrete passives, diodes, and switches.
- **Dynamic Filtering**: Filter simultaneously by category ID and search query.
- **Loading Skeletons**: Built with shadcn Skeleton for smooth transitions between filters.
- **Detailed Product Specifications (`/product/[id]`)**: Full datasheet specs table, stock availability tags, breadcrumb navigation, and related category items.

### 3. Shopping Cart & Dual Checkout
- **Slide-Over Cart Sheet**: Accessible from any page via the header cart button. Inspect items, increment/decrement quantities, and view live totals.
- **Demo Payment ("Pay now (demo)")**: Instant checkout workflow creating a `'Paid'` order record in the database.
- **WhatsApp Ordering**: Automatically opens WhatsApp (+91 93210 09638) with a pre-filled, formatted order template containing customer email, order number, line items, part numbers, and total amount.
- **Order Tracking (`/orders`)**: Signed-in customers can track order statuses and re-open WhatsApp conversations.

### 4. Admin Dashboard (`/admin`)
- **Protected by Clerk**: Only users with emails listed in `ADMIN_EMAILS` are granted access. Non-admins receive an *"Access Denied"* screen.
- **Real-Time KPIs**: Total active products, completed orders, gross revenue, and customer inquiries.
- **Tabbed Management**:
  - **Products**: Inline price and availability editing, plus delete actions protected by shadcn **Delete Confirmation Dialogs**.
  - **Orders**: Status management (WhatsApp Order, Paid, Packed, Shipped, Delivered, Cancelled).
  - **Add Product**: Form with server-side validation and immediate catalogue revalidation.
  - **Inquiries**: Review messages received through the `/contact` form.

### 5. Informational Pages
- **`/about`**: Company background, component authenticity guarantees, and supply chain standards.
- **`/services`**: Custom BOM kitting, obsolete semiconductor sourcing, and enterprise wholesale terms.
- **`/contact`**: Interactive form validating fields on client/server and persisting inquiries into the `messages` table.

---

## 📱 Mobile Compatibility

The entire platform is built with a **mobile-first responsive architecture**:

1. **Sticky Header & Mobile Sheet Drawer**:
   - On screens `< 1024px`, the navigation converts into a sliding drawer (via shadcn `Sheet`).
   - Mobile drawer includes navigation links with icons, contact options, and Clerk sign-in buttons.
2. **Slide-over Cart Drawer**:
   - Uses touch-friendly buttons (`+` / `-` stepper buttons) and compact line-item cards designed for small screens.
3. **Responsive Grids**:
   - Hero search: Stacks into vertical layout on mobile (`flex-col sm:flex-row`).
   - Trust strip: 2-column mobile layout (`grid-cols-2 md:grid-cols-4`).
   - Product catalogue: Adaptive grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`).
   - Category chips: Horizontal touch-scrolling (`overflow-x-auto pb-2 scrollbar-none`).
4. **Tables with Horizontal Scroll**:
   - Cart, Order history, and Admin tables are wrapped with responsive overflow containers (`overflow-x-auto`) to eliminate content clipping on small devices.
5. **Native Viewport Meta**:
   - `viewport` export configured in `app/layout.js` with `width: device-width`, `initialScale: 1`, and browser chrome theme color `#06100c`.

---

## 🗄️ Database Schema & Models

The application uses **Turso Cloud Database** via `@libsql/client`. Tables are auto-created and populated with default inventory upon initial connection.

### Tables

```sql
-- 1. Product Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  icon TEXT,
  blurb TEXT
);

-- 2. Hardware Inventory Products
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  name TEXT NOT NULL,
  brand TEXT,
  part_no TEXT,
  price REAL NOT NULL,
  availability TEXT DEFAULT 'In Stock',
  specs TEXT,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 3. Customer Orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  email TEXT,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'Pending',
  items TEXT,
  created DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Contact Inquiries & BOM Submissions
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in your project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin Access Control (comma-separated emails)
ADMIN_EMAILS=tiwaridevesh745@gmail.com, ashokcho2005@gmail.com

# Turso Cloud Database
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-turso-database-token
```

---

## 💻 Local Development Guide

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open local application
http://localhost:3000
```

> **Note**: If you ever see an `ENOENT: routes-manifest.json` error in your dev terminal, press `Ctrl + C` and restart `npm run dev` to refresh Next.js's webpack cache.

---

## 🐙 Step-by-Step GitHub Push

The repository is connected to GitHub:

```bash
# 1. Check current status
git status

# 2. Stage all modifications
git add .

# 3. Commit changes
git commit -m "feat: complete mobile-friendly design and comprehensive documentation"

# 4. Push to remote
git push -u origin master
git branch -M main
git push -u origin main
```

---

## 🚢 Step-by-Step Vercel Deployment

### Method 1: Using the Vercel Web Dashboard (Recommended)

1. Open [vercel.com/new](https://vercel.com/new) and log in.
2. Select your repository: **`devesssi/rajeshwar-next`**.
3. Under **Framework Preset**, Next.js will be detected automatically.
4. Expand **Environment Variables** and add all 5 variables from `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `ADMIN_EMAILS`
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
5. Click **Deploy**. Vercel will build the project and output your live production URL (e.g., `https://rajeshwar-next.vercel.app`).

### Method 2: Using Vercel CLI

```bash
# 1. Log in to Vercel
vercel login

# 2. Link and deploy
vercel --prod
```

---

## 🔐 Clerk Production Configuration

Once your Vercel deployment URL is live (e.g. `https://rajeshwar-next.vercel.app`):

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/).
2. Select your project and navigate to **Configure > Domains**.
3. Add your production domain: `rajeshwar-next.vercel.app`.
4. Under **Redirect URLs**, add:
   - `https://rajeshwar-next.vercel.app`
   - `https://rajeshwar-next.vercel.app/admin`
   - `https://rajeshwar-next.vercel.app/orders`

---

## 💬 WhatsApp Ordering Workflow

When a customer chooses **"Send order to WhatsApp"**:
1. An order record is saved with status `WhatsApp Order`.
2. The user is redirected to `https://wa.me/919321009638` with an automatic pre-filled template:

```text
🛒 *New Hardware Order - Rajeshwar Infotech*
*Order Number:* #1042
*Customer:* user@example.com
*Date:* 2026-10-29
────────────────────
*Items Ordered:*
1. *Intel Core i5-13400F* (BX8071513400F)
   Qty: 1 × ₹17,500 = ₹17,500
2. *Samsung 980 Pro 1TB NVMe* (MZ-V8P1T0B)
   Qty: 2 × ₹8,999 = ₹17,998
────────────────────
*Total Amount:* ₹35,498
*Payment Method:* WhatsApp Direct Confirmation
────────────────────
Hello Rajeshwar Infotech, please confirm stock availability and dispatch time. Thank you!
```

---

## ❓ Troubleshooting & Common Questions

### Q: Why did I see "Internal Server Error (500)" in terminal?
**Answer**: If a production build (`next build`) is triggered while the development server (`next dev`) is running, the dev server's in-memory references to files inside `.next/` get out of sync with the disk. To resolve it, simply stop the dev server (`Ctrl + C`) and run `npm run dev` again.

### Q: Does database persistence work on Vercel?
**Answer**: Yes! By using **Turso Cloud Database** (`libsql://...`), your data is stored in a serverless cloud database that persists across all Vercel deployments, redeployments, and edge regions.

---

## 📞 Business Contacts

- **Store Desk**: +91 93210 09638
- **Email**: ashokcho2005@gmail.com
- **Hub**: Electronics Market, Lamington Road, Mumbai, Maharashtra, India
