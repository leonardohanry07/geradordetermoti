"use client"

import { useEffect, useState } from "react"

export type Theme = "light" | "dark"
const THEME_KEY = "termos-ti:theme:v1"

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove("dark", "light")
  root.classList.add(theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#fafafa" : "#0a0708")
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const current: Theme = document.documentElement.classList.contains("light") ? "light" : "dark"
    setTheme(current)
    setMounted(true)
  }, [])
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    applyTheme(next)
    setTheme(next)
    try { localStorage.setItem(THEME_KEY, next) } catch {}
  }
  return { theme: mounted ? theme : "dark", toggle, mounted }
}
