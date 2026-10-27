import { PageHeader } from "@/components/page-header"
import { TermoForm } from "@/components/termo-form"

export default function Page() { return <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 md:py-8"><PageHeader title="Gerar novo termo" description="Preencha os dados e gere o PDF com os dois termos prontos para assinatura." /><TermoForm /></div> }
