```markdown
# 🌸 HerFlow

HerFlow is a calm, intelligent, privacy-first companion for menstrual and cycle awareness — a progressive web app built for clarity, comfort, and confidence. It combines cycle intelligence, empathetic AI, community support, and culturally-aware wellness content with a gentle, delightful design.

---

<p align="center">
  Crafted with ❤️ by <strong>Iankitsinghak</strong>
</p>

## Table of contents

- [Why HerFlow](#why-herflow)
- [Key features](#key-features)
- [Woomania — The Empathetic AI Companion](#woomania---the-empathetic-ai-companion)
- [Indian wellness touch](#indian-wellness-touch)
- [PWA experience](#pwa-experience)
- [Security & privacy](#security--privacy)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Why HerFlow

Most health apps feel clinical, noisy, or overwhelming. HerFlow was created as a soft, safe ecosystem with:

- Trust: your data stays with you.
- Comfort: sensitive, non-triggering language.
- Warmth: design that feels like a friend.
- Clarity: simple, actionable insights into your cycle.

HerFlow is designed for modern, conscious women and aims to make understanding your body straightforward and reassuring.

## Key features

- Smart period prediction and luteal-aware ovulation window calculation
- Daily cycle phase explanation in simple language
- Symptom tracking, mood patterns, and trend graphs
- Gentle insights and personalised recommendations (non-medical)
- Anonymous-optional community posts, comments, and moderation tools
- Offline-first PWA with "Add to Home Screen" support

## Woomania — The Empathetic AI Companion

Woomania is a caring conversational partner that:

- Explains health concepts gently
- Offers emotional support and clarity
- Helps draft/posts with AI-assisted writing
- Is explicitly not a substitute for medical advice

## Indian wellness touch

Designed with Indian users in mind:

- Period-ready checklists
- Awareness cards for PCOS & thyroid conditions
- Local product guides (pads, cups, tampons)
- Cultural sensitivity around privacy and communication

## PWA experience

- Installable as a native-like app
- Offline-first architecture and smooth transitions
- Low friction, zero clutter UX

## Security & privacy

HerFlow aims to respect user privacy by design:

- We do not sell, share, or track user data
- Sensitive data encrypted in transit
- Firestore secured with strict rules
- No third-party advertising or hidden analytics

"Your body is personal. Your data should be too."

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Firebase (Auth, Firestore, Storage)
- Genkit (Gemini 2.5) for Woomania AI
- React Hook Form + Zod for validation
- next-pwa for PWA support

## Project structure

/
├── src/
│   ├── app/                 # App Router pages
│   ├── components/          # UI + feature components
│   ├── ai/                  # Genkit AI flows
│   ├── firebase/            # Config + providers
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities (analytics, predictions)
│   ├── locales/             # i18n (future languages)
│   └── context/             # State providers
├── public/
│   ├── readme/              # README screenshots
│   ├── icons/               # Splash + PWA icons
│   └── manifest.json        
└── firestore.rules          # Ultra-secure Firestore rules


## Local development

1. Clone the repo:
   git clone https://github.com/Iankitsinghak/HerFlow.git
2. Install dependencies:
   npm install
3. Create a .env.local file (see below for variables)
4. Run the dev server:
   npm run dev
5. Open http://localhost:3000

## Environment variables

Create a .env.local with values from your Firebase and Genkit/AI provider:

- NEXT_PUBLIC_FIREBASE_API_KEY=
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
- NEXT_PUBLIC_FIREBASE_PROJECT_ID=
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
- NEXT_PUBLIC_FIREBASE_APP_ID=
- FIREBASE_PRIVATE_KEY= (if required for server-side)
- GENKIT_API_KEY= (or GEMINI_KEY, depending on service)

Never commit secrets to the repository.

## Contributing

Contributions, bug reports, and improvements are welcome.

- Fork the repository
- Create a feature branch
- Open a PR with a clear description of changes and rationale
- Follow the existing code style and include tests where applicable

If you'd like help creating issues or PRs, open one describing what you want to work on.

## License

Specify your license here (e.g., MIT). If you don't have one, consider adding a license file.

## Contact

Built by Iankitsinghak — thank you for checking out HerFlow. For collaboration or questions, open an issue or reach out on GitHub.

```
