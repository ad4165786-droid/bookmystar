# BookMyStar 🇮🇳

> **India's Premier 1-on-1 Influencer Video & Voice Call Booking Platform**

BookMyStar is a modern, high-converting commercial marketplace web application enabling fans to book private, guaranteed 1-on-1 voice and video consultations with verified creators, esports athletes, musicians, and industry leaders.

---

## 🌟 Key Features

### 1. Commercial Landing & Discovery Portal
- **Hero Showcase**: High-impact value proposition with verified creator preview cards and real-time availability badges.
- **Dynamic Star Directory**: Real-time filtering by category (Gaming, Music, Tech, Fashion, Fitness, Comedy), call type (Video / Voice), and price range slider (in INR ₹).
- **Anti-Collision Slot Locking**: 10-minute real-time hold on selected time slots to prevent double-booking.
- **Transparent Pricing**: Separate 10, 15, 30, and 60-minute rates for voice and video calls.
- **Trust & Compliance Badges**: 100% Escrow payout guarantee, instant digital GST tax invoice generator, and strict end-to-end WebRTC call privacy.

### 2. Multi-Role Authentication & Access Control (RBAC)
- **Unified Public Auth**: Seamless modal and entry flows with tabbed role switching between **User Sign In** and **Influencer Sign In**.
- **One-Click Demo Credentials**: Instant one-click test logins for evaluating both fan and creator experiences.
- **Hidden Admin Portal**: Private `/admin/login` route with zero presence or links anywhere on the public-facing website.
- **Strict Layout Segregation**: Distinct, route-protected dashboard layouts for Users (`/user/dashboard`), Influencers (`/influencer/dashboard`), and Admins (`/admin/dashboard`).

### 3. Dedicated Dashboards
- **Fan / User Dashboard**: Explore stars, manage upcoming/past bookings, download GST invoices, file dispute grievances, and join live calls.
- **Creator Studio**: Studio overview metrics, profile & portfolio manager, call rates matrix, calendar availability scheduler, fan booking requests, and earnings/escrow payout requests.
- **Admin Operations Center**: Creator KYC verification queue, escrow payment disbursals, platform commission rules (e.g., 15%), grievance dispute moderation, and immutable audit logs.

### 4. Interactive WebRTC Call Room
- Live video & audio consultation room with countdown session timer, audio waveform visualizer, text chat, report grievance trigger, and post-call fan review modal.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Typography**: Hanken Grotesk & Plus Jakarta Sans

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/ad4165786-droid/bookmystar.git

# Navigate into the project directory
cd bookmystar

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build & Preview

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

This project is proprietary and confidential. © 2026 BookMyStar Internet Services Pvt Ltd. All rights reserved.

