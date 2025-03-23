import { AuthProvider } from "@/context/AuthContext";
import localFont from "next/font/local";
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased ` }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
