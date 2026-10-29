"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { LockKeyhole, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")
    const { error: authError } = await createClient().auth.signInWithPassword({ email, password })
    if (authError) setError("E-mail ou senha incorretos.")
    else router.push("/")
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="grid gap-1.5 text-[14px] font-medium text-[#18345f]" htmlFor="email">
        E-mail
        <span className="relative block">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-[19px] -translate-y-1/2 text-[#9aa8bc]" aria-hidden="true" />
          <input id="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@academiagavioes.com.br" className="h-9 w-full rounded-md border border-[#cbd3df] bg-white pl-10 pr-3 text-sm text-[#172d50] shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none placeholder:text-[#7282a0] focus:border-[#f04444] focus:ring-2 focus:ring-[#f04444]/15" />
        </span>
      </label>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <label className="text-[14px] font-medium text-[#18345f]" htmlFor="password">Senha</label>
          <Link href="/recuperar-senha" className="text-[14px] text-[#ff4848] underline-offset-2 hover:underline">Esqueci minha senha</Link>
        </div>
        <span className="relative block">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-[19px] -translate-y-1/2 text-[#9aa8bc]" aria-hidden="true" />
          <input id="password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="h-9 w-full rounded-md border border-[#cbd3df] bg-white pl-10 pr-3 text-sm text-[#172d50] shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none placeholder:text-[#7282a0] focus:border-[#f04444] focus:ring-2 focus:ring-[#f04444]/15" />
        </span>
      </div>
      <label className="mt-0.5 flex items-center gap-2 text-[14px] text-[#18345f]">
        <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 rounded border-[#cbd3df] accent-[#f04444]" />
        Lembrar de mim
      </label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button disabled={loading} className="mt-1 h-11 w-full rounded-md bg-[#f04444] text-[16px] font-semibold text-white shadow-sm transition-colors hover:bg-[#e83b3b] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Entrando..." : "Entrar"}</button>
      <p className="text-center text-[14px] text-[#425b86]">Não tem conta? <Link href="/criar-conta" className="font-medium text-[#ec2027] underline-offset-2 hover:underline">Criar conta</Link></p>
    </form>
  )
}
