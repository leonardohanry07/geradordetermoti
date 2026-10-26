"use client"

import { useEffect } from "react"
import { useStoredState } from "./storage"
import { DEFAULT_CLAUSES, DEFAULT_SIGNERS } from "./defaults"
import type { Clause, Signer } from "./termos"

export type Settings = { signers: Signer[]; clauses: Clause[] }
export const SETTINGS_KEY = "termos-ti:settings:v1"

export function useSettings(): [Settings, React.Dispatch<React.SetStateAction<Settings>>, boolean] {
  const [settings, setSettings, loaded] = useStoredState<Settings>(SETTINGS_KEY, { signers: DEFAULT_SIGNERS, clauses: DEFAULT_CLAUSES })
  useEffect(() => {
    if (!loaded) return
    setSettings((current) => {
      const usuario = current.signers.find((signer) => signer.kind === "usuario") ?? DEFAULT_SIGNERS[0]
      const others = current.signers.filter((signer) => signer.kind !== "usuario")
      const normalized = [usuario, ...others]
      const unchanged = current.signers.length === normalized.length && current.signers.every((signer, index) => signer === normalized[index])
      return unchanged ? current : { ...current, signers: normalized }
    })
  }, [loaded, setSettings])
  return [settings, setSettings, loaded]
}
