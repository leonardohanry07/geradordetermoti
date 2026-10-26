import { AppHeader } from "@/components/app-header"
import { Historico } from "@/components/historico"
export default function Page(){return <><AppHeader/><main className="mx-auto max-w-6xl px-4 py-8"><h1 className="mb-2 text-2xl font-bold">Histórico</h1><p className="mb-6 text-muted-foreground">Consulte e baixe novamente os termos registrados.</p><Historico/></main></>}
