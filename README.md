# Digemart Frontend - Digital Marketplace Platform

A modern Next.js e-commerce frontend enabling multi-tenant stores with dynamic subdomains, blockchain wallet integration, and comprehensive vendor/customer management.

## 🚀 Project Overview

Digemart Frontend is a full-featured marketplace interface built with Next.js 15, featuring:

- **Multi-tenant Architecture**: Dynamic store subdomains with custom themes
- **Web3 Integration**: Crypto wallet authentication (Base, Coinbase Wallet)
- **Vendor Dashboard**: Complete store management, products, orders, analytics
- **Customer Experience**: Shopping cart, wishlist, checkout, order tracking, reviews
- **Payment Integration**: Support for multiple payment gateways (Paystack, Flutterwave, BasePay)
- **Modern UI**: Responsive design with shadcn/ui components

## 📁 Project Structure

```
digemart-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Public routes (marketing, landing)
│   │   ├── api/                # API route handlers
│   │   ├── auth/               # Authentication pages (signin, signup)
│   │   ├── checkout/           # Checkout flow & payment (base smart contract)
│   │   ├── findyourplug/       # Vendor dashboard routes
│   │   │   ├── dashboard/      # Store analytics & overview
│   │   │   ├── products/       # Product management
│   │   │   ├── orders/         # Order management
│   │   │   ├── customers/      # Customer management
│   │   │   └── settings/       # Store settings & theme
│   │   ├── orders/             # Customer order tracking
│   │   └── store/              # Dynamic store pages
│   │       └── [subdomain]/    # Store-specific routes
│   ├── components/             # Reusable React components
│   │   ├── cart/               # Shopping cart components
│   │   ├── checkout/           # Checkout wizard, payment modal
│   │   ├── dashboard/          # Vendor dashboard components
│   │   ├── products/           # Product display & management
│   │   ├── store/              # Store-specific components
│   │   └── ui/                 # shadcn/ui components
│   ├── contexts/               # React Context providers
│   │   ├── CheckoutContext.tsx # Checkout state management
│   │   └── StoreContext.tsx    # Store data context
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   │   ├── api/                # API client & hooks
│   │   │   └── hooks/          # React Query hooks
│   │   └── utils/              # Helper functions
│   │       └── store-auth-context.ts  # Domain-based auth cookies
│   ├── services/               # Business logic services
│   ├── types/                  # TypeScript type definitions
│   ├── auth.ts                 # NextAuth configuration
│   └── middleware.ts           # Next.js middleware (subdomain routing)
├── public/                     # Static assets
│   └── _images/                # Image resources
├── docs/                       # Frontend documentation
├── package.json
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── eslint.config.mjs           # ESLint configuration
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Query (TanStack Query v5)
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js v5 (OAuth, Credentials, Wallet)
- **Web3**: Coinbase Wallet SDK, Base Account Kit
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see backend repository)

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API endpoint and configuration
```

### Environment Variables

Create a `.env.local` file with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Web3 Configuration (Optional)
NEXT_PUBLIC_COINBASE_PROJECT_ID=
```

### Development

```bash
# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📋 Key Features

### For Vendors
- **Store Management**: Create and customize your store with themes
- **Product Catalog**: Full CRUD with variants, images, inventory tracking
- **Order Management**: Track orders, update status, manage fulfillment
- **Customer Insights**: View customer data, purchase history
- **Analytics Dashboard**: Sales metrics, revenue tracking, performance charts
- **Task Management**: Organize store operations and to-dos

### For Customers
- **Browse & Search**: Discover products across multiple stores
- **Shopping Experience**: Cart management, wishlist, product reviews
- **Secure Checkout**: Multi-step checkout with multiple payment methods
- **Order Tracking**: Real-time order status updates
- **User Accounts**: Profile management, order history
- **Web3 Login**: Connect with crypto wallets (Coinbase, Base)

### Platform Features
- **Multi-tenant**: Each store gets a custom subdomain (store.digemart.com)
- **Theme System**: Pre-built templates with customization options
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Server-side rendering for better search visibility
- **Performance**: Optimized images, code splitting, lazy loading

## 🔧 Development Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📚 Documentation

- [Frontend Implementation Guide](./docs/FRONTEND-IMPLEMENTATION-COMPLETE.md)
- [Checkout & Payment Flow](./docs/CHECKOUT-AND-PAYMENT-FLOW.md)

## 🏗️ Architecture Highlights

### Routing Strategy
- **App Router**: Next.js 13+ app directory structure
- **Dynamic Routes**: `[subdomain]` for multi-tenant stores
- **Route Groups**: `(public)` for marketing pages
- **API Routes**: `/api` for backend proxy and server actions

### State Management
- **React Query**: Server state caching and synchronization
- **Context API**: Global state for checkout and store data
- **Local Storage/Cookies**: Persistent data with domain-based sharing

### Authentication Flow
- **NextAuth.js**: Unified authentication with multiple providers
- **Session Management**: JWT-based sessions with refresh tokens
- **Protected Routes**: Middleware-based route protection
- **Web3 Integration**: Wallet-based authentication for crypto users

## 🤝 Contributing

For team members:

1. Create a feature branch from `vendor_dash`
2. Make your changes following the existing patterns
3. Run linting: `npm run lint`
4. Test your changes locally
5. Submit a pull request with clear description
6. Get code review approval before merging

## 📄 License

UNLICENSED - Private project

---

Built with ❤️ by the Digemart team
