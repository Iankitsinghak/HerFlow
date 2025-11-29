# 🌸 HerFlow — A Beautiful Cycle, Wellness & Community Platform for Women

<p align="center">
  <img src="./public/readme/cover.png" width="700" alt="HerFlow App Preview" />
</p>

<p align="center">
  <strong>A gentle companion for your rhythm, wellbeing, and everyday comfort.</strong><br>
  A modern, AI-powered women’s health app built with love, science, and safety.
</p>

---

HerFlow is a warm, intuitive, and intelligent health companion designed to support women across every phase of their cycle.  
It goes beyond traditional period tracking — bringing together **cycle insights**, **symptom logging**, **AI guidance**, **a supportive community**, and **Indian-friendly wellness tools** to create a truly holistic platform.

Built as a **production-ready Next.js Progressive Web App (PWA)**, HerFlow loads fast, works offline, installs on home screens, and feels just like a native mobile app.

---

## ✨ Features at a Glance

### 🌙 **Personalized Cycle Tracking**
- Track periods, flow, mood, symptoms, and lifestyle factors  
- “Today at a Glance” card with phase prediction  
- Automatic period & ovulation prediction (with luteal-phase logic)  
- Insights based on historical cycles  

<p align="center">
  <img src="./public/readme/dashboard.png" width="700" alt="HerFlow Dashboard" />
</p>

---

### 🤖 **Woomania — Your Gentle AI Companion**
A soft, empathetic, non-judgmental chatbot trained to:
- Explain concepts clearly  
- Offer emotional comfort  
- Provide safe, general health guidance  
- Encourage users to consult doctors for medical decisions  

---

### 🩸 **Symptom & Mood Logging**
- Customizable symptoms with emojis  
- Daily logging system  
- Graph trends for mood, symptoms, flow, cycle length  

---

### 🌸 **Indian-Friendly Wellness Features**
- Period-ready checklist  
- Indian product guide (pads/cups/tampons brands used here)  
- PCOS/Thyroid awareness snapshots  
- Cultural sensitivity built-in (privacy-first design)

---

### 💬 **Community (Anonymous-Friendly)**
A safe space where users can:
- Post publicly or anonymously  
- Comment, reply, and support each other  
- Delete their own posts (secure role-based rules)  
- Use AI to help draft posts  

<p align="center">
  <img src="./public/readme/community.png" width="700" alt="HerFlow Community" />
</p>

---

### 🩺 **Ask a Doctor**
A private section where users can submit concerns that only doctors/moderators can see.

---

### 📱 **PWA – Installable App**
- Add to Home Screen  
- Startup splash screens  
- Offline-ready  
- Looks/behaves like a native app  

---

### 🔐 **Private, Secure, Account-Based**
- Firebase Auth (Email + Google Sign-In)  
- Firestore with secure rules  
- Privacy-first: no tracking, no analytics sharing, no 3rd-party ads  

---

## 🚀 Tech Stack

- **Next.js (App Router)** — Modern, fast & scalable  
- **TypeScript** — Type-safe development  
- **Firebase**  
  - Authentication  
  - Firestore  
  - Storage  
- **Genkit AI (Gemini)** — AI chat & insights  
- **Tailwind CSS + ShadCN UI** — Beautiful, responsive UI  
- **React Hook Form + Zod** — Forms & validation  
- **next-pwa** — Progressive Web App support  

---

### Project Structure

```
/
├── src/
│   ├── app/                # Main Next.js App Router directory
│   │   ├── (auth)/         # Auth pages (Login, Signup)
│   │   ├── dashboard/      # Protected user dashboard pages
│   │   ├── onboarding/     # User onboarding flow
│   │   ├── api/            # API routes (if any)
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── ai/                 # Genkit AI flows and configuration
│   ├── components/         # Reusable React components (UI, layout, features)
│   ├── firebase/           # Firebase configuration, providers, and hooks
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and shared libraries
│   ├── locales/            # Translation files (en.json, hi.json, etc.)
│   └── context/            # React context providers (e.g., LanguageProvider)
├── public/                 # Static assets (images, icons, manifest.json)
├── docs/                   # Backend schema and project documentation
├── firestore.rules         # Firestore Security Rules
└── next.config.ts          # Next.js configuration (with PWA settings)
```

---

<p align="center">
  Crafted with ❤️ by <strong>Iankitsinghak</strong>
</p>
