"use client"

import { useStoredState } from "./storage"
import { DEFAULT_CLAUSES, DEFAULT_SIGNERS } from "./defaults"
import type { Clause, Signer } from "./termos"

export type Settings = { signers: Signer[]; clauses: Clause[] }
export const SETTINGS_KEY = "termos-ti:settings:v1"

export function useSettings(): [Settings, React.Dispatch<React.SetStateAction<Settings>>, boolean] {
  return useStoredState<Settings>(SETTINGS_KEY, { signers: DEFAULT_SIGNERS, clauses: DEFAULT_CLAUSES })
}
