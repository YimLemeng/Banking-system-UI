# 🏛️ TRUST BANK - Core Banking Terminal (Frontend)

Professional enterprise React.js web client for the Spring Boot Core Banking system, featuring a **Luxury Midnight Obsidian & Royal Cobalt/Sapphire** design, multi-currency display (USD & KHR), full Khmer (ភាសាខ្មែរ) & English localization, and complete REST API integration.

---

## 🎨 Color Palette & Design
Modeled after enterprise core banking terminals with a high-end corporate luxury theme (different from dark teal):
- **Primary Background**: Deep Midnight Obsidian (`#070a13`, `#080d1a`, `#0a101f`)
- **Primary Accent**: Royal Sapphire & Cobalt Blue (`#2563eb`, `#3b82f6`)
- **Financial Accents**: Warm Imperial Gold (`#f59e0b`) & Radiant Emerald (`#10b981`)
- **Theme Switcher**: Built-in 1-click accent switcher (Royal Sapphire, Imperial Emerald, Imperial Gold, Midnight Amethyst)

---

## 🚀 Key Features

### 1. Header & Live Indicator
- **Terminal Identifier**: Brand logo, `CORE BANKING TERMINAL` badge with live pulse.
- **API Status Indicator**: Displays `API Connected • Live` when connected to Spring Boot backend, with graceful offline fallback.
- **Theme Customizer**: Dynamic accent palette toggle.
- **Language Switcher**: Instant toggle between **English (EN)** and **ភាសាខ្មែរ (Khmer)**.
- **User Profile Pill**: System Administrator profile, `ADMIN` role badge, quick JWT login modal.

### 2. Teller Operations (Sidebar & Views)
- **Branch Overview (Dashboard)**:
  - Welcome Banner with terminal identifier (`Terminal #TB-0492`) and quick refresh.
  - 4 KPI Stat Cards: **USD Vault Balance**, **KHR Vault Balance**, **Customer Accounts**, **Registered Clients**.
  - 4 Counter Quick Action Cards:
    1. **Cash Deposit**: Credits funds to client account instantly.
    2. **Cash Withdrawal**: Debits funds with teller verification.
    3. **Account Transfer**: Inter-account funds movement (`sourceAccountNumber` ➡️ `targetAccountNumber`).
    4. **Open Client Account**: Generates new Savings or Checking account for customer.
  - Recent Customer Accounts Table with search, type filters, and one-click action shortcuts.
- **Teller Counter**: Dedicated teller workstation with quick dollar buttons (`+$20`, `+$50`, `+$100`, `+$500`, etc.) and instant printable receipt slips.
- **Customer Accounts**: Master ledger of all checking & savings accounts, balances, and statuses.
- **Account Statements**: Historical transaction search and exportable PDF statement view.

### 3. Branch Management
- **Customer KYC & Moderation**: Registry of verified client profiles, contact numbers, and one-click account onboarding.
- **Audit Trail**: Real-time monitor of Spring Boot `@Audited` events (`LOGIN`, `DEPOSIT`, `WITHDRAW`, `TRANSFER`, `CREATE_ACCOUNT`), execution time in ms, and IP addresses.

---

## 🔌 API Integration

Configured with Vite reverse proxy in `vite.config.js`:
- `/api` requests are proxied to `http://localhost:8080`.
- All requests automatically append JWT Bearer token: `Authorization: Bearer <token>`.

### Backend Endpoints Connected:
- `POST /api/v1/auth/login` - Teller/Admin login
- `POST /api/v1/auth/register` - Staff registration
- `GET /api/v1/accounts` - Paginated accounts list
- `POST /api/v1/accounts` - Create new Savings/Checking account
- `POST /api/v1/accounts/{accountNumber}/deposit` - Cash deposit
- `POST /api/v1/accounts/{accountNumber}/withdraw` - Cash withdrawal
- `POST /api/v1/accounts/transfer` - Inter-account transfer
- `GET /api/v1/customers` - Paginated customer profiles
- `POST /api/v1/customers` - Create customer KYC profile
- `GET /api/v1/audit-logs` - System audit events

---

## 🛠️ How to Run

### 1. Prerequisites
- Node.js (v18+) & npm
- Backend API running on `http://localhost:8080` (see [Banking System Backend](https://github.com/YimLemeng/Banking-system))

### 2. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/YimLemeng/Banking-system-UI.git
cd Banking-system-UI

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
👉 **`http://localhost:3000`**

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 👤 Demo / Test Credentials

Use these pre-configured user credentials to sign in and test the system terminal:

| Role | Username / Identifier | Password | Access Privileges |
|---|---|---|---|
| **System Administrator** | `admin` | `admin123` | Full Access: Customer KYC, Depository Accounts, Transactions, System Users, Audit Trail, Profile & Security |
| **Bank Teller Officer** | `teller` | `teller123` | Branch Operations: Teller Counter, Cash Deposit, Withdrawal, Transfer, KYC, Account Statements |
