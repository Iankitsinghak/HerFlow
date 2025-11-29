# 🌸 HerFlow — A Gentle Companion for Every Cycle

<p align="center">
  <img src="./public/readme/banner.png" width="850" alt="HerFlow Banner" />
</p>

<p align="center">
  <strong>A beautiful, safe, AI-powered women’s health platform — crafted for clarity, comfort, and care.</strong>
</p>

---

## 💠 ASCII Header (Perfect “HERFLOW”)

```txt
██╗  ██╗███████╗██████╗ ███████╗██╗      ██████╗ ██╗    ██╗
██║  ██║██╔════╝██╔══██╗██╔════╝██║     ██╔═══██╗██║    ██║
███████║█████╗  ██████╔╝ █████╗ ██║     ██║   ██║██║ █╗ ██║
██╔══██║██╔══╝  ██╔══██╗██║     ██║     ██║   ██║██║███╗██║
██║  ██║███████╗██║  ██║██║     ███████╗╚██████╔╝╚███╔███╔╝
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝██║     ╚══════╝ ╚═════╝  ╚══╝╚══╝ 
```

---

<p align="center"> 
  <img src="https://img.shields.io/badge/PWA-Ready-ff4da6?style=for-the-badge&logo=pwa&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Firebase-Secure-ffcc33?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Gemini_AI-Woomania-blue?style=for-the-badge&logo=googlecloud" />
  <img src="https://img.shields.io/badge/Made%20For-Women%20in%20India-ff6699?style=for-the-badge" />
</p>

---

## TL;DR

HerFlow is a holistic, safe, emotionally comforting women’s wellness PWA that blends:
- cycle intelligence
- a gentle, feminine design
- an empathetic AI (Woomania)
- anonymous, low‑toxicity community features
- radical privacy and client-first data policies
- India-first wellness guidance and product recommendations

---

## 🌷 Vision — Where Wellness Meets Warmth

Every insight, every word, and every interaction is designed to make people feel:
understood, supported, and safe. HerFlow avoids clinical coldness — it’s a soft, reliable companion that respects privacy and dignity.

---

## 🧘‍♀️ Design & Tech Philosophy

1. Soft Technology
   - Feather-light pink themes, rounded corners, calming micro-interactions.
   - Gentle wording and empathy-first UX to reduce stress and triggers.

2. Radical Privacy
   - No tracking. No selling. No hidden analytics.
   - Firestore secured with strict rules; encryption in transit.
   - User-controlled export/delete and optional anonymity for community posts.

3. Science with Simplicity
   - Luteal-phase-aware ovulation prediction.
   - Pattern detection from logs.
   - Clear, intuitive charts and human-friendly explanations.

4. India-First Experience
   - Local product recommendations, cultural sensitivity, regional content priorities.

---

## ✨ Core Features

- Cycle intelligence: next period, ovulation window, phase today, averages, irregularity detection.
- Symptom & mood logging with trend graphs.
- Flow intensity & symptom correlations.
- Woomania — an empathetic AI companion (non-medical).
- Anonymous, gentle community with moderation tools and AI-drafted post assistance.
- Offline-first PWA: add-to-home-screen, splash screens, fast startup.
- Security-first: strict Firestore rules and data minimization.

<p align="center">
  <img src="./public/readme/dashboard.png" alt="Dashboard preview" width="800" />
</p>

---

## 🤖 Woomania — The AI That Feels Human

- Tone: empathetic and non-judgmental.
- Purpose: explain, comfort, draft posts, clarify cycle science.
- Safety: automatic medical disclaimers; explicit "not medical advice".
- Architecture: AI calls proxied via server/cloud functions to avoid exposing keys client-side.

---

## 💬 Community — A Safe Corner

- Anonymous posting and replies.
- Low-toxicity UI patterns (e.g., soft prompts, gradual disclosure).
- Secure deletion and moderation workflows.
- AI-assisted draft and content-sanitisation options.

<p align="center">
  <img src="./public/readme/community.png" alt="Community preview" width="800" />
</p>

---

## 🩸 Period-Ready Checklist & India Guide

- Ready kit suggestions: pads, tampons, pain-relief patches, wipes, emergency underwear.
- India-specific product recommendations and suppliers (e.g., Nua, Niine, Sirona, Boondh).
- PCOS & thyroid awareness cards with gentle disclaimers.

---

## 🔐 Security & Privacy

- Data stays in Firebase and is never sold or shared without explicit consent.
- Firestore rules enforce least privilege access. Use the emulator for testing rules.
- Zod validation on both client and server to avoid malformed writes.
- Audit logs for admin actions and opt-in telemetry (if any) must be explicit.

---

## 🚀 Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Firebase (Auth, Firestore, Storage)
- Genkit (Gemini 2.5) — Woomania AI
- React Hook Form + Zod
- next-pwa

---

## 📂 Project Structure

```
src/
 ├── app/               # App Router pages
 ├── components/        # UI components
 ├── ai/                # Woomania AI flows
 ├── firebase/          # Firebase config & providers
 ├── hooks/             # Custom hooks
 ├── lib/               # Utilities (prediction, analytics)
 ├── locales/           # i18n bases
 └── context/           # Providers
public/
 └── readme/            # README screenshots & banners
firestore.rules         # Firestore security rules
```

---

## 🧪 Getting Started (local)

1. Clone
   ```bash
   git clone https://github.com/Iankitsinghak/HerFlow.git
   cd HerFlow
   ```

2. Install
   ```bash
   npm ci
   ```

3. Copy env
   ```bash
   cp .env.example .env.local
   # Fill in the environment variables (see below)
   ```

4. Run dev
   ```bash
   npm run dev
   ```
   - Default local URL: http://localhost:3000 (or change PORT env var if your setup uses a different port)

5. Emulators (recommended for testing rules)
   ```bash
   firebase emulators:start --only firestore,auth
   ```

---

## ⚙️ Environment variables (example)

Add to `.env.local` (do NOT commit):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_PRIVATE_KEY=          # for server-side admin operations (keep secret)
GENKIT_API_KEY=                # or GEMINI_KEY depending on provider
```

Use GitHub Secrets for CI/CD.

---

## 🛠️ Dev & Release Checklist

Before PR:
- Fork -> feature branch naming: feat/<what> or fix/<issue-number>
- Run tests & lint: `npm run lint && npm run test`
- Validate Firestore rules in emulator
- Add unit tests for new logic

Release:
- Bump semver in package.json
- Update CHANGELOG.md
- Tag release and create GitHub Release
- Deploy (Vercel / Firebase Hosting) from main

---

## 🌟 Roadmap

- Push notifications
- Mood journal & deeper mood analytics
- Encrypted export/import of user data
- AI-powered personalized insights
- Multi-language support (Hindi, Bengali, Tamil, Marathi)
- Doctor-facing exports & optional clinical summaries

---

## ✨ Credits

Crafted with calmness by Ankit Singh (Iankitsinghak).

> “Here’s to cycles understood, stories shared, and wellness made gentle.”

---

## License

MIT — see LICENSE file.
