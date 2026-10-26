import { AppHeader } from "@/components/app-header"
import { TermoForm } from "@/components/termo-form"
export default function Page(){return <><AppHeader/><main className="mx-auto max-w-4xl px-4 py-8"><div className="mb-6"><h1 className="text-2xl font-bold text-foreground text-balance">Gerar novo termo</h1><p className="mt-1 text-muted-foreground">Preencha os dados e gere o PDF com os dois termos prontos para assinatura.</p></div><TermoForm/></main></>}
