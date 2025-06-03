import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WagmiProvider } from '@/lib/providers/WagmiProvider'

// Initialize the font with display swap for better performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: 'NFT Minting App',
  description: 'NFT MINTING APP',
  generator: 'ALEX NECSOIU',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  )
}
