
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { FirebaseClientProvider } from '@/firebase';
import { OnboardingWrapper } from './onboarding/provider';

export const metadata: Metadata = {
  title: 'Woomania',
  description: 'Empowering women through every phase of life.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <AuthProvider>
            <OnboardingWrapper>
              <main className="flex-grow">{children}</main>
              <Toaster />
            </OnboardingWrapper>
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
