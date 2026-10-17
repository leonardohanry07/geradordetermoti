"use client"

import { useMemo, useState } from "react"
import {
  Building2,
  Download,
  Eye,
  FileText,
  Laptop,
  Pencil,
  Plus,
  ScrollText,
  Trash2,
  User,
} from "lucide-react"
import { DEFAULT_COMPANY, EQUIPMENT_TYPES, getEquipmentType } from "@/lib/equipment-config"
import { generateTermoPdf, slugify } from "@/lib/generate-pdf"
import type { TermoData } from "@/lib/termos"

function maskCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

function maskCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14)
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}

function formatDateBR(isoDate: string) {
  if (!isoDate) return ""
  const [y, m, d] = isoDate.split("-")
  if (!y || !m || !d) return isoDate
  return `${d}/${m}/${y}`
}

function todayISO() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

// ---- Componentes de UI simples ----

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
    </label>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
    />
  )
}

function Section({
  icon,
  title,
  description,
  action,
  children,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function TermoForm() {
  const [company, setCompany] = useState(DEFAULT_COMPANY)
  const [companyEditable, setCompanyEditable] = useState(false)

  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [data, setData] = useState(todayISO())

  const [tipo, setTipo] = useState(EQUIPMENT_TYPES[0].id)
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [specificValue, setSpecificValue] = useState("")
  const [acessorios, setAcessorios] = useState("")

  const [supervisor, setSupervisor] = useState("")
  const [error, setError] = useState("")

  // Cláusulas adicionais: entram automaticamente numeradas (9, 10, 11...) no final
  // do Termo de Responsabilidade, sempre depois das cláusulas fixas (1 a 8).
  const [clausulas, setClausulas] = useState<{ titulo: string; texto: string }[]>([])

  const equipmentType = useMemo(() => getEquipmentType(tipo), [tipo])

  function addClausula() {
    setClausulas((prev) => [...prev, { titulo: "", texto: "" }])
  }

  function updateClausula(index: number, field: "titulo" | "texto", value: string) {
    setClausulas((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    )
  }

  function removeClausula(index: number) {
    setClausulas((prev) => prev.filter((_, i) => i !== index))
  }

  function buildData(): TermoData {
    return {
      company,
      colaborador: { nome: nome.trim(), cpf: cpf.trim(), data: formatDateBR(data) },
      equipamento: {
        tipo,
        marca: marca.trim(),
        modelo: modelo.trim(),
        specificValue: specificValue.trim(),
        acessorios: acessorios.trim(),
      },
      supervisor: supervisor.trim(),
      clausulasAdicionais: clausulas.filter((c) => c.titulo.trim() || c.texto.trim()),
    }
  }

  function validate(): boolean {
    if (!nome.trim()) return setError("Informe o nome do colaborador."), false
    if (!cpf.trim()) return setError("Informe o CPF do colaborador."), false
    if (!data) return setError("Informe a data."), false
    if (!modelo.trim() && !marca.trim())
      return setError("Informe ao menos a marca ou o modelo do equipamento."), false
    setError("")
    return true
  }

  async function handleDownload() {
    if (!validate()) return
    const doc = await generateTermoPdf(buildData())
    const fileName = `termo-${equipmentType?.id ?? "equipamento"}-${slugify(nome) || "colaborador"}.pdf`
    doc.save(fileName)
  }

  async function handlePreview() {
    if (!validate()) return
    const doc = await generateTermoPdf(buildData())
    const url = doc.output("bloburl")
    window.open(url, "_blank")
  }

  return (
    <div className="grid gap-5">
      {/* Empresa / Unidade */}
      <Section
        icon={<Building2 className="size-5" />}
        title="Dados da empresa / unidade"
        description="Ficam fixos por padrão. Edite apenas se precisar trocar."
        action={
          <button
            type="button"
            onClick={() => setCompanyEditable((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Pencil className="size-3.5" />
            {companyEditable ? "Bloquear" : "Editar"}
          </button>
        }
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Termo de Responsabilidade
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="razaoSocial">Razão social</Label>
            <Input
              id="razaoSocial"
              value={company.razaoSocial}
              disabled={!companyEditable}
              onChange={(e) => setCompany((c) => ({ ...c, razaoSocial: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={company.cnpj}
              disabled={!companyEditable}
              onChange={(e) => setCompany((c) => ({ ...c, cnpj: maskCnpj(e.target.value) }))}
            />
          </div>
        </div>

        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Termo de Recebimento
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="nomeMarca">Nome da empresa (entregue por)</Label>
            <Input
              id="nomeMarca"
              value={company.nomeMarca}
              disabled={!companyEditable}
              onChange={(e) => setCompany((c) => ({ ...c, nomeMarca: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="unidadeRazaoSocial">Unidade (razão social)</Label>
            <Input
              id="unidadeRazaoSocial"
              value={company.unidadeRazaoSocial}
              disabled={!companyEditable}
              onChange={(e) => setCompany((c) => ({ ...c, unidadeRazaoSocial: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="unidadeCnpj">Unidade (CNPJ)</Label>
            <Input
              id="unidadeCnpj"
              value={company.unidadeCnpj}
              disabled={!companyEditable}
              onChange={(e) => setCompany((c) => ({ ...c, unidadeCnpj: maskCnpj(e.target.value) }))}
            />
          </div>
        </div>
      </Section>

      {/* Colaborador */}
      <Section
        icon={<User className="size-5" />}
        title="Dados do colaborador"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="nome">Nome do colaborador</Label>
            <Input
              id="nome"
              value={nome}
              placeholder="Ex: Thamires de Oliveira"
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              inputMode="numeric"
              placeholder="000.000.000-00"
              onChange={(e) => setCpf(maskCpf(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
        </div>
      </Section>

      {/* Equipamento */}
      <Section
        icon={<Laptop className="size-5" />}
        title="Equipamento"
        description="Selecione o tipo para exibir o campo específico."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="tipo">Tipo de equipamento</Label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value)
                setSpecificValue("")
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              {EQUIPMENT_TYPES.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="marca">Marca</Label>
            <Input
              id="marca"
              value={marca}
              placeholder="Ex: Apple, Dell, Logitech"
              onChange={(e) => setMarca(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="modelo">Modelo</Label>
            <Input
              id="modelo"
              value={modelo}
              placeholder="Ex: iPhone 13, Latitude 3420"
              onChange={(e) => setModelo(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="specific">{equipmentType?.specificField.label ?? "Identificador"}</Label>
            <Input
              id="specific"
              value={specificValue}
              placeholder={equipmentType?.specificField.placeholder}
              onChange={(e) => setSpecificValue(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="acessorios">Acessórios</Label>
            <Input
              id="acessorios"
              value={acessorios}
              placeholder="Ex: cabo USB-C, capa, fonte"
              onChange={(e) => setAcessorios(e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* Assinaturas */}
      <Section icon={<FileText className="size-5" />} title="Assinatura">
        <div>
          <Label htmlFor="supervisor">Nome do supervisor (opcional)</Label>
          <Input
            id="supervisor"
            value={supervisor}
            placeholder="Aparece na linha de assinatura do supervisor"
            onChange={(e) => setSupervisor(e.target.value)}
          />
        </div>
      </Section>

      {/* Cláusulas adicionais */}
      <Section
        icon={<ScrollText className="size-5" />}
        title="Cláusulas adicionais"
        description="Aparecem no final do Termo de Responsabilidade, numeradas em sequência às cláusulas 1-8."
        action={
          <button
            type="button"
            onClick={addClausula}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Plus className="size-3.5" />
            Adicionar cláusula
          </button>
        }
      >
        {clausulas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma cláusula adicional. Use o botão acima se este colaborador precisar de alguma
            condição extra (ex: equipamento restrito ao local de trabalho).
          </p>
        ) : (
          <div className="grid gap-4">
            {clausulas.map((clausula, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Cláusula {9 + index}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeClausula(index)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                    Remover
                  </button>
                </div>
                <div>
                  <Label htmlFor={`clausula-titulo-${index}`}>Título da cláusula</Label>
                  <Input
                    id={`clausula-titulo-${index}`}
                    value={clausula.titulo}
                    placeholder="Ex: Uso exclusivo no local de trabalho"
                    onChange={(e) => updateClausula(index, "titulo", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`clausula-texto-${index}`}>Texto da cláusula</Label>
                  <textarea
                    id={`clausula-texto-${index}`}
                    value={clausula.texto}
                    placeholder="Ex: O equipamento deverá permanecer exclusivamente nas dependências da empresa, sendo vedado seu uso fora do ambiente de trabalho."
                    onChange={(e) => updateClausula(index, "texto", e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-4 flex flex-col gap-3 rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={handlePreview}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Eye className="size-4" />
          Pré-visualizar
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Download className="size-4" />
          Gerar e baixar PDF
        </button>
      </div>
    </div>
  )
}
