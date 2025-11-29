# HerFlow 🌸

<p align="center">
  <!-- TODO: Replace this placeholder with a screenshot of your actual application -->
  <img src="https://images.unsplash.com/photo-1667473916565-6fd552001ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxoZWFsdGglMjBjYWxlbmRhcnxlbnwwfHx8fDE3NjQxNTQ3OTV8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="An abstract image of a digital health calendar and interface" width="600" data-ai-hint="health app interface" />
</p>

<p align="center">
  <strong>A gentle companion for your rhythm, wellbeing, and everyday comfort.</strong>
</p>

---

HerFlow is a supportive and empowering health and wellness platform designed for women. It goes beyond simple period tracking, offering a holistic ecosystem that combines data-driven insights, a private community, and AI-powered guidance to help users understand their bodies and navigate their health journey with confidence and clarity.

Built with a modern, secure, and scalable technology stack, HerFlow is a production-ready Progressive Web App (PWA) that provides a seamless, app-like experience on any device.

## ✨ Key Features

HerFlow is packed with features designed to support users through every phase of their cycle and life:

- **Personalized Onboarding:** A gentle, multi-step flow that gathers essential health information to customize the user experience from day one.
- **Intelligent Cycle Tracking:** Log period days, symptoms, mood, and flow intensity. The app provides a "Today at a glance" view of the current cycle phase, predicts future periods, and visualizes historical data.
- **AI-Powered Wellness Planner:** Based on logged symptoms for a given cycle, users can generate a personalized daily wellness plan (Morning, Afternoon, Evening) with actionable advice and recommendations.
- **AI Chat Companion ("Woomania"):** An empathetic and supportive AI chat assistant available 24/7 to answer general health questions, provide encouragement, and offer a listening ear. It includes safety disclaimers and is designed *not* to give medical advice.
- **Supportive Community Forum:** A safe and private space for users to connect, share stories, and ask questions. Features include:
  - Create, read, and comment on posts.
  - Option to post anonymously to encourage open conversation.
  - AI-assisted writing to help users draft their posts.
  - Secure, role-based delete functionality for posts and comments.
- **Period-Ready Checklist:** A customizable to-do list where users can add and manage essential items to ensure they're always prepared for their period.
- **Gentle Health Guides:** Informational pages on topics like period products and general health awareness, designed to be accessible and easy to understand.
- **Progressive Web App (PWA):** Fully installable on both mobile and desktop devices for a native app experience, including full-screen launch and a permanent "Install App" button.
- **Secure Authentication:** Robust user authentication with options for Email/Password and Google Sign-In, built on Firebase Authentication.
- **Multi-Language Support:** A flexible i18n framework to support multiple languages, with user preferences saved to their profile.
- **Responsive & Modern UI:** A beautiful, calming, and fully responsive user interface built with ShadCN UI and Tailwind CSS.

## 🚀 Technology Stack

HerFlow is built with a modern, robust, and scalable tech stack, perfect for a production environment.

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database:** [Firebase](https://firebase.google.com/)
  - **Authentication:** Firebase Authentication (Email/Password, Google Provider)
  - **Database:** Cloud Firestore for all application data.
  - **Security:** Strict Firestore Security Rules to protect user data.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **Data Fetching:** Real-time data synchronization with Firestore using custom React hooks.
- **PWA:** [next-pwa](https://www.npmjs.com/package/next-pwa) for Progressive Web App capabilities.

## Getting Started

This project is set up to run in a Firebase Studio environment.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

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
