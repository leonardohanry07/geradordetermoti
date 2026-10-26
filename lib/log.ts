"use client"

import { useStoredState } from "./storage"
import { getEquipmentType } from "./equipment-config"
import type { TermoData } from "./termos"
export type LogEntry = { id: string; createdAt: string; nome: string; cpf: string; tipo: string; tipoLabel: string; nomeOutro: string; marca: string; modelo: string; specificLabel: string; specificValue: string; acessorios: string; dataTermo: string; unidade: string; termo: TermoData }
export const LOG_KEY = "termos-ti:log:v1"
function id() { try { return crypto.randomUUID() } catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}` } }
export function buildLogEntry(data: TermoData): LogEntry { const type = data.equipamento.tipo; const equipment = getEquipmentType(type); return { id: id(), createdAt: new Date().toISOString(), nome: data.colaborador.nome, cpf: data.colaborador.cpf, tipo: type, tipoLabel: type === "outros" ? "Outros" : equipment?.label ?? type, nomeOutro: data.equipamento.outroNome ?? "", marca: data.equipamento.marca, modelo: data.equipamento.modelo, specificLabel: equipment?.specificField.label ?? "Identificador", specificValue: data.equipamento.specificValue, acessorios: data.equipamento.acessorios, dataTermo: data.colaborador.data, unidade: data.company.unidadeRazaoSocial, termo: structuredClone(data) }
}
export function addLogEntry(entry: LogEntry): void { try { const current = JSON.parse(window.localStorage.getItem(LOG_KEY) ?? "[]") as LogEntry[]; window.localStorage.setItem(LOG_KEY, JSON.stringify([entry, ...current])) } catch { /* armazenamento indisponível */ } }
export function useLog() { return useStoredState<LogEntry[]>(LOG_KEY, []) }
export function entriesToCsv(entries: LogEntry[]): string { const header = ["Data/hora","Nome","CPF","Tipo","Nome outro","Marca","Modelo","Identificador","Acessórios","Data do termo","Unidade"]; const rows = entries.map((e) => [e.createdAt,e.nome,e.cpf,e.tipoLabel,e.nomeOutro,e.marca,e.modelo,e.specificValue,e.acessorios,e.dataTermo,e.unidade]); const quote = (v: string) => `"${v.replaceAll('"','""')}"`; return "\ufeff" + [header, ...rows].map((row) => row.map(quote).join(";")).join("\r\n") }
