"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, LayoutDashboard, History, Settings } from "lucide-react"

const links = [{ href: "/", label: "Gerar termo", icon: FileText }, { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, { href: "/historico", label: "Histórico", icon: History }, { href: "/configuracoes", label: "Configurações", icon: Settings }]
export function AppHeader() {
  const pathname = usePathname()
  return <header className="border-b border-border bg-card/80 backdrop-blur"><div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"><Link href="/" className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20"><FileText className="size-5" /></span><span className="text-sm font-semibold text-foreground sm:text-base">Gerador de Termos de Equipamento de T.I</span></Link><nav aria-label="Navegação principal" className="flex gap-1 overflow-x-auto">{links.map(({ href, label, icon: Icon }) => { const active = href === "/" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`} aria-current={active ? "page" : undefined}><Icon className="size-4" />{label}</Link> })}</nav></div></header>
}
