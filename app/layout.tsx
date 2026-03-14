import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import LangProvider from '@/components/providers/LangProvider'
import TerminalLog from '@/components/ui/TerminalLog'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Jorge Peduti — Analytics Engineer',
  description:
    'Portfolio of Jorge Peduti, Analytics Engineer specializing in Supply Chain data infrastructure — O2C, P2P, Inventory, International Trade.',
  openGraph: {
    title: 'Jorge Peduti — Analytics Engineer',
    description:
      'I design the infrastructure that turns raw Supply Chain data into boardroom decisions.',
    url: 'https://jjp-portfolio.vercel.app/',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <LangProvider>
          {children}
          <TerminalLog />
        </LangProvider>
      </body>
    </html>
  )
}
