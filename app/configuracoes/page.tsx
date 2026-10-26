import { AppHeader } from "@/components/app-header"
import { Configuracoes } from "@/components/configuracoes"
export default function Page(){return <><AppHeader/><main className="mx-auto max-w-4xl px-4 py-8"><h1 className="mb-2 text-2xl font-bold">Configurações</h1><p className="mb-6 text-muted-foreground">Gerencie assinaturas e cláusulas do termo.</p><Configuracoes/></main></>}
