"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { FileText, LayoutDashboard, History, Settings, ChevronsLeft, ChevronsRight, Menu, X } from "lucide-react"

const mainLinks = [
  { href: "/", label: "Gerar termo", icon: FileText },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/historico", label: "Histórico", icon: History },
]
const settingsLink = { href: "/configuracoes", label: "Configurações", icon: Settings }

function isActive(pathname: string, href: string) { return href === "/" ? pathname === href : pathname.startsWith(href) }

function NavItem({ href, label, icon: Icon, collapsed, onNavigate }: { href: string; label: string; icon: typeof FileText; collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const active = isActive(pathname, href)
  return <li><Link href={href} onClick={onNavigate} aria-label={label} aria-current={active ? "page" : undefined} className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring motion-reduce:transition-none ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"} ${collapsed ? "justify-center" : ""}`}><Icon className="size-5 shrink-0" aria-hidden="true" /><span className={collapsed ? "sr-only" : "transition-opacity duration-200 motion-reduce:transition-none"}>{label}</span>{collapsed && <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-sidebar-accent px-2.5 py-1.5 text-xs text-sidebar-accent-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{label}</span>}</Link></li>
}

function SidebarContent({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  return <><div className="flex items-center gap-3"><Link href="/" onClick={onNavigate} aria-label="Página inicial" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"><FileText className="size-5" aria-hidden="true" /></Link>{!collapsed && <div className="min-w-0"><p className="font-semibold leading-tight">Termos de T.I</p><p className="text-xs text-muted-foreground">Equipamentos</p></div>}</div><nav aria-label="Navegação principal" className="mt-8"><ul className="flex flex-col gap-2">{mainLinks.map((link) => <NavItem key={link.href} {...link} collapsed={collapsed} onNavigate={onNavigate} />)}</ul></nav><div className="mt-auto"><ul><NavItem {...settingsLink} collapsed={collapsed} onNavigate={onNavigate} /></ul>{!collapsed && <p className="mt-4 px-3 text-xs leading-relaxed text-muted-foreground">Os registros ficam salvos neste navegador. Exporte o CSV do Histórico como backup.</p>}</div></>
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { try { setCollapsed(localStorage.getItem("termos-ti:sidebar:v1") === "collapsed") } catch {} setMounted(true) }, [])
  useEffect(() => { if (mounted) { try { localStorage.setItem("termos-ti:sidebar:v1", collapsed ? "collapsed" : "expanded") } catch {} } }, [collapsed, mounted])
  useEffect(() => { setMobileOpen(false) }, [pathname])
  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; if (mobileOpen) closeRef.current?.focus(); return () => { document.body.style.overflow = "" } }, [mobileOpen])
  const toggle = () => setCollapsed((value) => !value)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => { if (event.key === "Escape") { setMobileOpen(false); triggerRef.current?.focus() } }
  return <>
    <aside id="app-sidebar" className={`sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col md:p-4 ${mounted ? "transition-[width] duration-200 ease-out motion-reduce:transition-none" : ""} ${collapsed ? "w-[72px]" : "w-[248px]"}`}><div className="relative flex h-full flex-col"><button type="button" onClick={toggle} aria-label={collapsed ? "Expandir menu" : "Recolher menu"} aria-expanded={!collapsed} aria-controls="app-sidebar" className="absolute right-0 top-1 z-10 flex size-8 translate-x-1/2 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">{collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}</button><SidebarContent collapsed={collapsed} /></div></aside>
    <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground md:hidden"><Link href="/" className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><FileText className="size-5" /></span><span className="font-semibold">Termos de T.I</span></Link><button ref={triggerRef} type="button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu" className="flex size-11 items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"><Menu className="size-5" /></button></div>
    {mobileOpen && <div className="fixed inset-0 z-50 md:hidden" onKeyDown={onKeyDown}><button type="button" aria-label="Fechar menu" onClick={() => { setMobileOpen(false); triggerRef.current?.focus() }} className="absolute inset-0 bg-background/80" /><aside className="relative flex h-full w-72 flex-col bg-sidebar p-4 text-sidebar-foreground shadow-2xl"><button ref={closeRef} type="button" aria-label="Fechar menu" onClick={() => { setMobileOpen(false); triggerRef.current?.focus() }} className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"><X className="size-5" /></button><div className="mt-1 flex h-full flex-col"><SidebarContent onNavigate={() => setMobileOpen(false)} /></div></aside></div>}
  </>
}
