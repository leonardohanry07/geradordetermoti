"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen bg-background"><Sidebar /><div className="min-w-0 flex-1 pt-14 md:pt-0"><main id="conteudo">{children}</main></div></div>
}
