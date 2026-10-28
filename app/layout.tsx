import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/app-shell'

const barlow = Barlow({ variable: '--font-barlow', subsets: ['latin'], weight: ['400','500','600'] })
const barlowCondensed = Barlow_Condensed({ variable: '--font-barlow-condensed', subsets: ['latin'], weight: ['600','700'] })

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
  themeColor: '#0a0708',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${barlowCondensed.variable} bg-background`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try { var t = localStorage.getItem('termos-ti:theme:v1'); var theme = t === 'light' ? 'light' : 'dark'; document.documentElement.classList.remove('dark', 'light'); document.documentElement.classList.add(theme); document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#fafafa' : '#0a0708'); } catch (e) { document.documentElement.classList.remove('light'); document.documentElement.classList.add('dark'); }` }} />
      </head>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
