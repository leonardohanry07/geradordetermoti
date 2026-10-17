import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gerador de Termos de Equipamento de T.I',
  description:
    'Gere em PDF o Termo de Responsabilidade e o Termo de Recebimento de equipamentos de T.I preenchendo um formulário simples.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
    apple: '/iconesite.png',
  },
}


export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0708',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`dark ${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
