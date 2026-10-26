import { AppHeader } from "@/components/app-header"
import { Dashboard } from "@/components/dashboard"
export default function Page(){return <><AppHeader/><main className="mx-auto max-w-6xl px-4 py-8"><h1 className="mb-2 text-2xl font-bold">Dashboard</h1><p className="mb-6 text-muted-foreground">Visão geral dos termos gerados.</p><Dashboard/></main></>}
