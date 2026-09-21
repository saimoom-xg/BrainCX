import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrainCX | Voice Agent',
  description: 'Talk with BrainCX — AI-powered voice customer experience.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white" style={{ backgroundColor: '#ffffff' }}>
        {children}
      </body>
    </html>
  );
}