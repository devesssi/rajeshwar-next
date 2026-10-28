# Rajeshwar Infotech – Computer Parts & Micro Components

A modern, production-ready B2B and retail e-commerce platform for **Rajeshwar Infotech**, an industrial supplier of authentic computer hardware, laptop replacement panels, semiconductors, micro ICs, and networking equipment.

Built with **Next.js 15 (App Router)**, **Tailwind CSS**, **shadcn/ui**, **Clerk Authentication**, and **Turso Cloud Database (libSQL)**.

---

## 🚀 Key Features

### 1. Storefront & Dark PCB Aesthetic
- **PCB Circuit Theme**: Custom industrial dark palette (`#06100c` background, emerald tech green accents `#2ee59d`, and subtle PCB grid traces).
- **8-Section Landing Page (`/`)**:
  - **Hero**: Tagline, category shortcuts, search input with instant redirection to `/products?q=...`, and dual CTA buttons.
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

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components & Server Actions)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer, `tailwindcss-animate`
- **Component Primitives**: shadcn/ui, Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tabs`, `@radix-ui/react-slot`)
- **Icons**: Lucide React
- **Notifications**: Sonner toasts
- **Authentication**: Clerk (`@clerk/nextjs` v6)
- **Database**: Turso Cloud Database (`@libsql/client`) with local SQLite fallback (`file:data.db`)

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory (based on `.env.example`):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin Dashboard Access (comma-separated emails)
ADMIN_EMAILS=tiwaridevesh745@gmail.com, ashokcho2005@gmail.com

# Turso Cloud Database
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-turso-database-token
```

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open local application
http://localhost:3000
```

---

## 🚢 Deploying to Vercel

### Step 1: Push to GitHub
If you haven't pushed your repository to GitHub yet:

```bash
# Initialize git and stage files
git add .
git commit -m "feat: complete Rajeshwar Infotech platform"

# Create a new repo on GitHub (e.g. rajeshwar-infotech) and push:
git remote add origin https://github.com/<your-username>/rajeshwar-infotech.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your `rajeshwar-infotech` GitHub repository.
3. In **Environment Variables**, add the 5 variables from your `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `ADMIN_EMAILS`
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
4. Click **Deploy**. Vercel will build and assign your production URL (e.g., `https://rajeshwar-infotech.vercel.app`).

### Step 3: Configure Clerk for Production
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/) and select your application.
2. Under **Configure > Domains**, add your Vercel deployment domain:
   - `rajeshwar-infotech.vercel.app`
3. Under **Redirect URLs**, confirm allowed redirects:
   - `https://rajeshwar-infotech.vercel.app`
   - `https://rajeshwar-infotech.vercel.app/admin`
   - `https://rajeshwar-infotech.vercel.app/orders`

---

## 📞 Support & WhatsApp Ordering

- **Store Desk**: +91 93210 09638
- **Email**: sales@rajeshwarinfotech.com
- **Hub**: Electronics Market, Lamington Road, Mumbai, Maharashtra, India
