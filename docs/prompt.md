# Prompt to Rebuild the Woomania Web Application

## High-Level Goal

Your primary objective is to build a complete, production-ready web application called "Woomania". This application is a supportive and empowering health and wellness platform for women. It should be built as a Next.js application using the App Router.

## 1. Technology Stack & Core Principles

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS with CSS Variables.
-   **UI Components:** ShadCN UI. You must use the existing `components/ui` components for all UI elements (e.g., `Card`, `Button`, `Input`, `Dialog`, `Table`).
-   **Database & Auth:** Firebase (Firestore for database, Firebase Authentication for user management).
-   **Generative AI:** Genkit for all AI-powered features.
-   **Icons:** `lucide-react`.

## 2. Global Styling and Layout

### a. Theme and Fonts
-   Implement a global theme in `src/app/globals.css`. The theme should be feminine, warm, and inviting, using a pink and fuchsia-based color palette for primary and accent colors. The HSL variables for the theme are:
    -   `--background: 340 67% 94%`
    -   `--foreground: 337 50% 15%`
    -   `--primary: 337 79% 43%`
    -   `--accent: 291 64% 42%`
-   The primary body and headline font must be 'Alegreya', loaded from Google Fonts.

### b. Main Layouts
-   **Root Layout (`src/app/layout.tsx`):** This should set up the global font, Firebase providers, and the `Toaster` component.
-   **Auth Layout (`src/app/(auth)/layout.tsx`):** A simple centered layout for the login and signup pages.
-   **Dashboard Layout (`src/app/dashboard/layout.tsx`):** This is a two-column layout. It must include a `DashboardSidebar` on the left and a main content area on the right, which is preceded by a `Header`. This layout must be protected, redirecting unauthenticated users to `/login`.

## 3. Core Features & Pages

### a. Authentication (Email/Password & Google)
-   Create a landing page (`src/app/page.tsx`) for unauthenticated users, with options to "Get Started" (signup) or "Log In".
-   Implement a **Signup Page** (`src/app/(auth)/signup/page.tsx`) with fields for email and password, plus a "Sign Up with Google" button.
-   Implement a **Login Page** (`src/app/(auth)/login/page.tsx`) with fields for email and password, plus a "Login with Google" button.
-   Upon successful first-time login or signup, the user should be redirected to the `/dashboard`.

### b. Onboarding Flow
-   The onboarding flow should **not** be mandatory immediately after signup. Instead, the dashboard should detect if a user has completed onboarding.
-   If onboarding is incomplete, the dashboard should show a CTA to `/onboarding/start`.
-   The onboarding flow consists of several steps:
    1.  **About You (`/onboarding/start`):** Collects name, age range, and country.
    2.  **Cycle Status (`/onboarding/cycle-status`):** Asks about period regularity, cycle length, period duration, and last period start date (using a calendar picker).
    3.  **Focus Areas (`/onboarding/focus`):** Allows users to select their health goals (e.g., "Tracking my periods", "PCOS", "Fertility").
    4.  **Privacy (`/onboarding/privacy`):** Asks about comfort with online doctors and sharing preferences.
    5.  **Summary (`/onboarding/summary`):** Shows a summary of the collected data and a final "Go to my Woomania" button.
-   Upon completion, all onboarding data must be saved to a `UserProfile` document in Firestore under `/users/{userId}/userProfiles/{userId}`.

### c. Dashboard (`src/app/dashboard/page.tsx`)
-   This is the main hub for authenticated users.
-   It must greet the user by name (e.g., "Hi Sarah, welcome to Woomania 💗").
-   It should display a prominent CTA to complete the onboarding process if their profile is missing key cycle data.
-   If onboarding is complete, it should display "Today at a glance" showing the user's current cycle phase (e.g., "Follicular phase").
-   Include a "Quick Actions" section with links to key features like "Track my cycle," "Chat with Woomania AI," etc.
-   Display sections for "Recommended for you" (mock blog posts) and a "Community Teaser".

### d. Cycle Log (`src/app/dashboard/cycle-log/page.tsx`)
-   This is a critical feature for tracking the menstrual cycle.
-   Display a "Today at a glance" card summarizing the current phase, next predicted period date, and average cycle length.
-   Provide two primary actions:
    1.  **Log Today's Symptoms:** A dialog (`Dialog`) opens allowing the user to select from a predefined list of symptoms (e.g., "Cramps", "Bloating"). This should save a new `cycleLogs` entry in Firestore or update today's existing entry.
    2.  **Add a Period Day:** A button that creates a `cycleLog` entry for the current day with `isPeriodDay: true`.
-   Display a "Log History" table showing past cycles. Each row should represent a distinct cycle with its start date, end date, duration, and a list of logged symptoms.
-   **AI Feature:** Each cycle in the history table must have a "Get Plan" button. Clicking this opens a dialog that displays a personalized daily wellness plan generated by a Genkit flow based on the symptoms logged for that cycle.

### e. Profile Management (`src/app/dashboard/profile/page.tsx`)
-   Allow users to view and update their profile information (Display Name, Bio).
-   The user's email should be displayed but disabled from editing.
-   All data must be fetched from and saved to their `UserProfile` document in Firestore.

### f. Static Content Pages
-   Create the following pages with mock data. They should all use the main `Header` component.
    -   **Blog (`/blog`):** A grid of mock blog post cards.
    -   **Community (`/community`):** A feed of mock community forum posts.
    -   **Ask a Doctor (`/ask-doctor`):** A page to submit a question and view previously answered mock questions in an accordion.

### g. AI Features (Genkit)
-   **AI Chat (`/ai-chat`):**
    -   Implement a full-screen chat interface.
    -   Create a Genkit flow (`chat-flow.ts`) that takes the conversation history and a new message.
    -   The flow must use a system prompt that defines the persona of "Woomania AI": a warm, empathetic, and supportive companion who **must not give medical advice** and must include a disclaimer if asked.
    -   The response from the model should be streamed back to the UI.
-   **Wellness Planner (`planner-flow.ts`):**
    -   Create a Genkit flow that accepts a list of symptoms as input.
    -   The prompt should instruct the AI to generate a 3-part daily plan (Morning, Afternoon, Evening) with activities and reasons, general advice, and a `doctorRecommendation` enum (`'normal'`, `'monitor'`, or `'seek_advice'`).
    -   The output must be a structured JSON object defined by a Zod schema.

## 4. Firestore Data Structure

-   The `backend.json` file must be the source of truth for the data structure.
-   **User Profiles:** `/users/{userId}/userProfiles/{profileId}` (where `profileId` is the same as `userId`). Stores all onboarding and user profile data.
-   **Cycle Logs:** `/users/{userId}/cycleLogs/{cycleLogId}`. Stores daily logs containing `date`, `isPeriodDay` (boolean), and `symptoms` (array of strings). This collection must be owned by the user.

## 5. Security Rules (`firestore.rules`)

-   Implement strict security rules.
-   User-specific data (profiles, cycle logs) must only be readable and writable by the authenticated user whose UID matches the `{userId}` in the path.
-   Use helper functions like `isSignedIn()` and `isOwner()` to keep rules clean.
-   Public collections (if any, like blog posts) should be publicly readable but writable only by their authors.
-   Deny all access by default.
