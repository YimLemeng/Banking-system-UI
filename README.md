# 🏛️ TRUST BANK - Enterprise Core Banking Terminal (Frontend)

[![React](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![NBC Compliance](https://img.shields.io/badge/NBC%20Licence-%230492-blue.svg)](https://www.nbc.gov.kh)

Production-grade, enterprise core banking terminal web application engineered with **React.js**, **Tailwind CSS**, and **AdminLTE 4** design principles. Designed for commercial bank branch operations, treasury management, customer KYC onboarding, over-the-counter teller counter settlements, and regulatory audit compliance with full bilingual **Khmer (ភាសាខ្មែរ)** & **English (EN)** localization.

> 🌐 **Live Web Application**: [https://banking-system.yimlemeng.workers.dev](https://banking-system.yimlemeng.workers.dev)  
> ⚙️ **Backend REST API Repository**: [https://github.com/YimLemeng/Banking-system](https://github.com/YimLemeng/Banking-system)  
> 👤 **Default Terminal Credentials**: `admin` / `admin123` (Administrator) • `teller` / `teller123` (Teller)

---

## 📸 Key Terminal Interfaces & Highlights

- **Institutional Sign-in Terminal**: Split hero layout featuring deep-luxury bank photography, real-time NBC clearance badge, node status indicator, and high-contrast login workstation.
- **Branch Overview Dashboard**: Real-time vault balances (USD & KHR), customer account metrics, dynamic multi-month transaction volume curves, and one-click quick action cards.
- **Dedicated Teller Counter**: High-efficiency cash desk with quick denomination shortcuts (`+$20`, `+$50`, `+$100`, `+$500`), automated transaction receipt slip generator, and multi-currency support.
- **Enterprise Customer KYC & Moderation**: Registry of verified customer profiles, identification validation, and direct account creation.
- **Customer Accounts Master Ledger**: Comprehensive depository accounts directory with balance monitoring, account type indicators (Savings, Checking, Fixed Deposit), and account status toggles.
- **Official Bank Report Print (A4)**: Regulatory-compliant print preview system featuring the Neoclassical bank crest, National Bank of Cambodia (NBC) License #0492, SWIFT code, executive KPI summary blocks, zebra-striped ledger tables, and dual signature/seal blocks.
- **Real-Time Audit Trail**: Live database monitoring of Spring Boot `@Audited` security events with exact ISO-8601 database timestamps (`createdAt`), client IP tracking, and execution performance metrics.
- **System Users Directory**: Live administrative staff registry, role authorization badges (`ADMIN`, `USER`), and instant directory refreshes.

---

## 🎨 Enterprise Architecture & Design System

### 1. Bilingual Typography Engine (Khmer OS Battambang)
- Custom typography engine configured with `@font-face` rules for `Khmer OS Battambang` (Regular & Bold) covering Unicode ranges `U+1780-17FF` and `U+19E0-19FF`.
- Strictly maintains OpenType complex script shaping (GSUB/GPOS) with `letter-spacing: normal` and `line-height: 1.7` to prevent subscript consonant (`ជើង`) and vowel detachment.
- Seamless instantaneous language switcher between **English (EN)** and **ភាសាខ្មែរ (Khmer)** across all navigation bars, modals, tables, and reports.

### 2. Official Institutional Print Reports (`OfficialReportPrint`)
Dedicated print media system (`@media print`) that transforms web data tables into formal A4 bank documents:
- **Neoclassical Bank Crest**: Vector emblem in Navy `#0f2b48` and Imperial Gold `#f59e0b`.
- **Regulatory Metadata**: National Bank of Cambodia commercial banking license `#0492`, Head Office details, SWIFT Code `TRUSKHP1`, unique Document Ref number, generation timestamp, and reporting officer identity.
- **Executive KPI Summary**: Grid of operational metrics (Total Balance, Active Accounts, Transaction Volume, Risk Status).
- **Print-Specific Table Styling**: High-contrast navy headers, zebra-striped rows, border-defined status pills, and page break prevention.
- **Dual Verification Seals**: `Prepared by Reporting Officer` block and `Approved by Branch Auditor / NBC Verified Seal` block.

### 3. Interactive Operation Overlays (`LoadingOverlay`)
- Integrated `LoadingContext` with dual-ring concentric spinner animation.
- Context-aware bilingual status messages for operations like `កំពុងទាញយកទិន្នន័យអ្នកប្រើប្រាស់ប្រព័ន្ធ...` and `Refreshing Depository Ledger & Accounts...`.
- Minimum smooth duration handling to avoid flickering on ultra-fast network responses.

### 4. AdminLTE 4 Table Pagination (`TablePagination`)
- Standardized enterprise data table footer component.
- Selectable page sizing (`5`, `10`, `25`, `50`, `100` entries per page).
- Accessible navigation buttons (First, Previous, Next, Last) with current index range display.

---

## 🔌 Backend REST API Integration

The frontend seamlessly connects to the Spring Boot Core Banking backend via **Axios** with automatic JWT Bearer token authentication:

| Endpoint | Method | Description |
|---|:---:|---|
| `/auth/login` | `POST` | Authenticate teller / administrator credentials |
| `/auth/register` | `POST` | Register new banking personnel |
| `/accounts` | `GET` | Paginated listing of all depository accounts |
| `/accounts` | `POST` | Open new Savings, Checking, or Investment account |
| `/accounts/{accNum}/deposit` | `POST` | Cash deposit with live ledger balance adjustment |
| `/accounts/{accNum}/withdraw` | `POST` | Cash withdrawal with balance verification |
| `/accounts/transfer` | `POST` | Inter-account ledger transfer |
| `/customers` | `GET` | Paginated customer KYC profiles |
| `/customers` | `POST` | Register verified customer identity |
| `/customers/{id}` | `PUT` | Update customer KYC contact details |
| `/transactions/search` | `GET` | Transaction history ledger and statement generation |
| `/audit-logs` | `GET` | Real-time system security audit trail events |
| `/users` | `GET` | System users and staff credentials directory |

---

## 🛠️ Getting Started & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Backend API**: Running locally on `http://localhost:8080` (or remote Spring Boot backend)

### 1. Clone & Install
```bash
# Clone repository
git clone https://github.com/YimLemeng/Banking-system-UI.git
cd Banking-system-UI

# Install npm dependencies
npm install
```

### 2. Environment Configuration
Create or configure `.env` in the root folder:
```env
# Backend REST API Base URL
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 3. Launch Development Server
```bash
npm run dev
```
Terminal interface will be accessible at:  
👉 **`http://localhost:3000`**

### 4. Production Build & Test
```bash
# Build production bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Directory Structure

```text
banking-frontend/
├── public/
│   ├── banking-hero.jpg           # High-resolution bank hero background
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── modals/                # Teller and management modal dialogs
│   │   ├── BankLogo.jsx           # SVG Neoclassical bank building icon
│   │   ├── Header.jsx             # Top navigation bar with language & profile
│   │   ├── LoadingOverlay.jsx     # Dual-ring animated loading modal
│   │   ├── OfficialReportPrint.jsx# NBC A4 official bank report print layout
│   │   ├── QuickActionCard.jsx    # Dashboard counter action shortcuts
│   │   ├── Sidebar.jsx            # AdminLTE 4 collapsible sidebar
│   │   ├── StatCard.jsx           # KPI metrics card with trend indicators
│   │   ├── TablePagination.jsx    # Enterprise data table pagination
│   │   └── Toast.jsx              # System status alert notifications
│   ├── context/
│   │   ├── AuthContext.jsx        # JWT authentication & bilingual translation
│   │   ├── LoadingContext.jsx     # Global async loading modal provider
│   │   └── ThemeContext.jsx       # Theme styles & color tokens
│   ├── pages/
│   │   ├── AuditTrail.jsx         # Live audit log with exact database timestamps
│   │   ├── CustomerAccounts.jsx   # Master depository accounts ledger
│   │   ├── CustomerKYC.jsx        # Customer registration & KYC verification
│   │   ├── Dashboard.jsx          # Branch overview KPIs & volume charts
│   │   ├── LoginPage.jsx          # Institutional split-screen sign-in terminal
│   │   ├── StaffProfile.jsx       # Officer credentials & security settings
│   │   ├── Statements.jsx         # Customer statement search & receipt printing
│   │   ├── SystemUsers.jsx        # Core banking personnel registry
│   │   └── TellerCounter.jsx      # Over-the-counter deposit/withdrawal cash desk
│   ├── services/
│   │   └── api.js                 # Axios HTTP client with JWT interceptor
│   ├── App.jsx                    # Root application router and state orchestration
│   ├── index.css                  # Universal Khmer fonts & @media print CSS rules
│   └── main.jsx                   # React DOM entry point
├── package.json
├── tailwind.config.js             # Tailwind typography & color extensions
└── vite.config.js                 # Vite development & build config
```

---

## 📜 License & Compliance
This software is built for educational, demonstration, and enterprise research purposes under the **MIT License**. Regulated terminal workflows are designed in alignment with National Bank of Cambodia (NBC) core banking guidelines.
