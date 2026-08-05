import { jsPDF } from "jspdf"
import { getTermoRecebimento, getTermoResponsabilidade, type Block, type TermoData } from "./termos"

// Carrega a imagem da pasta /public e converte para base64 em tempo de execução.
// Evita colar strings base64 gigantes manualmente (fonte comum de erro "wrong PNG signature").
async function loadLogoBase64(): Promise<string> {
  const res = await fetch("/logo.png")
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Medidas em mm (A4)
const PAGE_W = 210
const PAGE_H = 297
const MARGIN_X = 20
const MARGIN_TOP = 22
const MARGIN_BOTTOM = 24
const CONTENT_W = PAGE_W - MARGIN_X * 2
const LINE_H = 6

// Dimensões do logo (proporção real da imagem: 180x105px ≈ 1.71:1)
const LOGO_W = 35 // largura em mm
const LOGO_H = 20.4 // altura em mm

class PdfWriter {
  doc: jsPDF
  y: number

  constructor() {
    this.doc = new jsPDF({ unit: "mm", format: "a4" })
    this.y = MARGIN_TOP
  }

  private ensureSpace(needed: number) {
    if (this.y + needed > PAGE_H - MARGIN_BOTTOM) {
      this.doc.addPage()
      this.y = MARGIN_TOP
    }
  }

  addLogo(base64: string, width = LOGO_W, height = LOGO_H) {
    // Alinhado no canto superior esquerdo, respeitando a margem da página.
    const x = MARGIN_X
    this.doc.addImage(base64, "PNG", x, this.y, width, height)
    this.y += height + 6 // espaço depois do logo antes do texto começar
  }

  private writeLines(text: string, fontSize: number, style: "normal" | "bold", indent = 0) {
    this.doc.setFont("helvetica", style)
    this.doc.setFontSize(fontSize)
    const maxW = CONTENT_W - indent
    const lines = this.doc.splitTextToSize(text, maxW) as string[]
    for (const line of lines) {
      this.ensureSpace(LINE_H)
      this.doc.text(line, MARGIN_X + indent, this.y)
      this.y += LINE_H
    }
  }

  renderBlock(block: Block) {
    switch (block.type) {
      case "title":
        this.y += 2
        this.writeLines(block.text, 13, "bold")
        this.y += 2
        break
      case "heading":
        this.y += 1
        this.writeLines(block.text, 11, "bold")
        break
      case "paragraph":
        this.writeLines(block.text, 10.5, "normal")
        break
      case "bullet": {
        this.doc.setFont("helvetica", "normal")
        this.doc.setFontSize(10.5)
        this.ensureSpace(LINE_H)
        this.doc.text("•", MARGIN_X + 2, this.y)
        this.writeLines(block.text, 10.5, "normal", 7)
        break
      }
      case "field": {
        this.ensureSpace(LINE_H)
        this.doc.setFontSize(10.5)
        this.doc.setFont("helvetica", "bold")
        const label = `${block.label}: `
        this.doc.text(label, MARGIN_X, this.y)
        const labelW = this.doc.getTextWidth(label)
        this.doc.setFont("helvetica", "normal")
        const valueLines = this.doc.splitTextToSize(block.value, CONTENT_W - labelW) as string[]
        this.doc.text(valueLines[0] ?? "", MARGIN_X + labelW, this.y)
        this.y += LINE_H
        for (let i = 1; i < valueLines.length; i++) {
          this.ensureSpace(LINE_H)
          this.doc.text(valueLines[i], MARGIN_X, this.y)
          this.y += LINE_H
        }
        break
      }
      case "spacer":
        this.y += (block.size ?? 1) * 2
        break
    }
  }

  renderSignatures(userName: string, supervisorName: string) {
    const needed = 34
    this.ensureSpace(needed)
    this.y += 14
    const colW = (CONTENT_W - 14) / 2
    const lineY = this.y
    const leftX = MARGIN_X
    const rightX = MARGIN_X + colW + 14

    this.doc.setDrawColor(60)
    this.doc.setLineWidth(0.3)
    this.doc.line(leftX, lineY, leftX + colW, lineY)
    this.doc.line(rightX, lineY, rightX + colW, lineY)

    this.y += 5
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(9.5)
    this.doc.text("Ass. do Usuário", leftX, this.y)
    this.doc.text("Ass. do Supervisor", rightX, this.y)

    this.y += 5
    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(9)
    if (userName) this.doc.text(userName, leftX, this.y)
    if (supervisorName) this.doc.text(supervisorName, rightX, this.y)
  }

  renderSingleSignature(userName: string) {
    const needed = 24
    this.ensureSpace(needed)
    this.y += 12
    const colW = CONTENT_W * 0.6
    const lineY = this.y
    this.doc.setDrawColor(60)
    this.doc.setLineWidth(0.3)
    this.doc.line(MARGIN_X, lineY, MARGIN_X + colW, lineY)
    if (userName) {
      this.y += 5
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(9)
      this.doc.text(userName, MARGIN_X, this.y)
    }
  }

  addPage() {
    this.doc.addPage()
    this.y = MARGIN_TOP
  }
}

export async function generateTermoPdf(data: TermoData): Promise<jsPDF> {
  const w = new PdfWriter()

  // Logo aparece só aqui, no topo da primeira página
  const logoBase64 = await loadLogoBase64()
  w.addLogo(logoBase64)

  // Documento 1 - Termo de Responsabilidade
  for (const block of getTermoResponsabilidade(data)) {
    w.renderBlock(block)
  }
  w.renderSignatures(data.colaborador.nome, data.supervisor)

  // Documento 2 - Termo de Recebimento (nova página)
  w.addPage()
  for (const block of getTermoRecebimento(data)) {
    w.renderBlock(block)
  }
  w.renderSingleSignature(data.colaborador.nome)

  return w.doc
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}
