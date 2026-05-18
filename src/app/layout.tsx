
import type { Metadata } from 'next';
import './globals.css';
import { initializeFirebase, FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

const { firebaseApp, firestore, auth } = initializeFirebase();

export const metadata: Metadata = {
  title: 'Wazi POS - Government Receipt System',
  description: 'Professional receipt generation for mobile POS and thermal printers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
