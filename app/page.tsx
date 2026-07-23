import { FileText } from "lucide-react"
import { TermoForm } from "@/components/termo-form"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground text-balance">
              Gerador de Termos de Equipamento de T.I
            </h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados e gere o PDF com os dois termos prontos para assinatura.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <TermoForm />
        <p className="mt-6 text-center text-xs text-muted-foreground text-pretty">
          O PDF gerado contém o Termo de Responsabilidade e o Termo de Recebimento em sequência,
          com áreas de assinatura do usuário e do supervisor.
        </p>
      </div>
    </main>
  )
}
