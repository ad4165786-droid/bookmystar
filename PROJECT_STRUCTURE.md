# 🌟 BookMyStar — Project Folder & Architecture Structure

A modern influencer video and voice call booking platform connecting fans directly with verified creators.

```text
bookmystar/
├── .vscode/                               # VS Code workspace settings & linter rules
│   ├── css_custom_data.json               # Tailwind @directives schema
│   ├── extensions.json                    # Recommended VS Code plugins
│   └── settings.json                      # Custom at-rules & lint configuration
│
├── public/                                # Public static assets
│
├── src/                                   # Application source code
│   ├── assets/                            # Static images, SVG badges, and icons
│   │   └── .gitkeep
│   │
│   ├── components/                        # UI Components by functional domain
│   │   ├── admin/                         # 🛡️ Admin Management Desk
│   │   │   ├── AdminAnnouncements.tsx     # Global broadcast alerts
│   │   │   ├── AdminAuditRoles.tsx        # RBAC role permissions & activity audit trail
│   │   │   ├── AdminBookings.tsx          # Real-time booking monitor & session audit
│   │   │   ├── AdminCommission.tsx        # Dynamic platform commission settings (15-20%)
│   │   │   ├── AdminGrievances.tsx        # Dispute handling & refund desk
│   │   │   ├── AdminInfluencers.tsx       # Government ID (KYC) approval & onboarding
│   │   │   ├── AdminModeration.tsx        # Content & review moderation
│   │   │   ├── AdminOverview.tsx          # Platform revenue KPIs & gross metrics
│   │   │   ├── AdminPayments.tsx          # Razorpay escrow fund manager & payout ledger
│   │   │   ├── AdminReports.tsx           # Audit logs & financial report downloads
│   │   │   └── AdminUsers.tsx             # User ban, unban, and account management
│   │   │
│   │   ├── auth/                          # 🔐 Role-Based Authentication
│   │   │   ├── AdminLoginPage.tsx         # Private hidden admin authentication (/admin/login)
│   │   │   └── AuthPage.tsx               # Dual User/Influencer sign-in & registration
│   │   │
│   │   ├── call/                          # 📞 Active WebRTC Call Room
│   │   │   └── LiveCallRoom.tsx           # 1-on-1 audio/video call room with live timer
│   │   │
│   │   ├── common/                        # 🌐 Shared / Fallback Pages
│   │   │   └── NotFoundPage.tsx           # 404 Page Not Found with smart navigation
│   │   │
│   │   ├── dashboard/                     # 🧭 Layout Shells
│   │   │   ├── AdminDashboardLayout.tsx   # Admin dashboard sidebar, header & routing
│   │   │   ├── InfluencerDashboardLayout.tsx # Creator Studio layout with white sidebar
│   │   │   └── UserDashboardLayout.tsx    # Fan portal layout with white sidebar
│   │   │
│   │   ├── influencer/                    # ⭐ Influencer / Creator Studio
│   │   │   ├── InfluencerBookings.tsx     # Session schedule, call queue & invoice view
│   │   │   ├── InfluencerContentProfile.tsx # Bio, verified ID, category & showcase portfolio
│   │   │   ├── InfluencerDashboard.tsx    # Studio overview, earnings KPIs & upcoming call
│   │   │   ├── InfluencerEarningsPayouts.tsx # Payout withdrawal requests (Bank/UPI) & ledger
│   │   │   └── InfluencerPricingSchedule.tsx # Active bookable days, time slots & blackouts
│   │   │
│   │   ├── landing/                       # 🌐 Public Marketplace Homepage
│   │   │   └── CommercialLandingPage.tsx  # Hero section, star discovery catalog, search & FAQ
│   │   │
│   │   ├── modals/                        # 💳 Interactive Dialogs & Popups
│   │   │   ├── CheckoutModal.tsx          # Slot picker & Razorpay mock payment flow
│   │   │   └── InvoiceModal.tsx           # GST-compliant printable tax receipt
│   │   │
│   │   └── user/                          # 👤 Fan Portal
│   │       ├── InfluencerDetailView.tsx   # Creator profile page, gallery & booking CTA
│   │       ├── UserBookings.tsx           # Fan call bookings, join room button & invoices
│   │       ├── UserGrievances.tsx         # Ticket raising & refund requests
│   │       ├── UserHome.tsx               # Marketplace explorer, trending stars & filters
│   │       └── UserProfileSettings.tsx    # Fan profile, wallet and notification settings
│   │
│   ├── context/                           # 🧠 Global State & Operations
│   │   └── AppContext.tsx                 # Central state manager (Auth, RBAC, Bookings, Payouts)
│   │
│   ├── data/                              # 📦 Seed Data
│   │   └── mockData.ts                    # Verified influencers, demo bookings, rates, tickets
│   │
│   ├── hooks/                             # 🪝 Custom React Hooks
│   │   └── useDebounce.ts                 # Search & filter debounce hook
│   │
│   ├── services/                          # ⚡ External Integrations
│   │   └── paymentService.ts              # Razorpay payment gateway integration helper
│   │
│   ├── utils/                             # 🛠️ Helper Utilities
│   │   └── formatters.ts                  # Currency (INR), date, and duration formatting
│   │
│   ├── App.tsx                            # Root routing, view switching & modal container
│   ├── index.css                          # Tailwind CSS imports & custom styles
│   ├── main.tsx                           # Application entry point (React 18)
│   └── types.ts                           # Comprehensive TypeScript type definitions
│
├── .gitignore                             # Git ignore rules
├── index.html                             # Single page HTML entry
├── package.json                           # NPM packages & build scripts
├── package-lock.json                      # Dependency lockfile
├── postcss.config.js                      # PostCSS config
├── PROJECT_STRUCTURE.md                   # Complete architectural guide
├── README.md                              # Project overview & documentation
├── tailwind.config.js                     # Tailwind theme (Orange brand, neutral slate)
├── tsconfig.json                          # TypeScript configuration
└── vite.config.ts                         # Vite bundler settings
```

---

## 🚀 Key Modules Summary

| Module | Location | Description |
| :--- | :--- | :--- |
| **Marketplace Landing** | `src/components/landing/` | Public homepage with creator discovery, filters, search, and pricing |
| **Authentication (RBAC)** | `src/components/auth/` | Isolated authentication for Fans, Influencers, and Hidden Admin (`/admin/login`) |
| **Creator Studio** | `src/components/influencer/` | Dashboard, schedule, payouts, and media portfolio management |
| **Fan Dashboard** | `src/components/user/` | Active call bookings, invoice receipts, and creator detail pages |
| **Admin Panel** | `src/components/admin/` | KYC verification, commission engine, escrow monitoring & disputes |
| **WebRTC Call Room** | `src/components/call/` | 1-on-1 audio and video calling interface with live status & timer |

