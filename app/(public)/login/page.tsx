'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { LOGIN } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Users,
  Boxes,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const { login } = useAuth()
  const [loginMutation, { loading }] = useMutation(LOGIN)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await loginMutation({
        variables: { input: { email: email.trim(), password } },
      })
      if (data?.login) {
        login(data.login.token, data.login.user)
        toast.success('Welcome back!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-grad-hero overflow-hidden">
        <div className="absolute inset-0 bg-dotgrid opacity-[0.08]" />
        <div
          className="absolute -top-20 -right-24 h-96 w-96 rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(closest-side, hsl(168 84% 45%), transparent)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(closest-side, hsl(38 92% 55%), transparent)' }}
        />
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
          <Link href="/" className="inline-flex items-center gap-2.5 w-fit">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 grid place-items-center backdrop-blur-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-xl font-bold tracking-tight">Daxor</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">ERP Suite</p>
            </div>
          </Link>

          <div className="max-w-md space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Enterprise Resource Planning · India edition
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-balance">
              Run your entire business on one elegant platform.
            </h2>
            <p className="text-white/80 text-base leading-relaxed">
              Sales, purchases, inventory, payroll, and finance — all in one place, with deep approval workflows and real-time dashboards.
            </p>
            <ul className="space-y-2.5">
              {[
                { icon: Users, label: 'CRM, quotations & sales pipeline' },
                { icon: Boxes, label: 'Inventory, warehouses & GRN tracking' },
                { icon: TrendingUp, label: 'Financial reports & payroll compliance' },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 grid place-items-center backdrop-blur-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/70">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
            SOC-style audit trail · Multi-tenant · INR/GST ready
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center lg:hidden mb-8">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-grad-brand grid place-items-center text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold tracking-tight">Daxor</p>
            </div>
          </div>

          <div className="space-y-1.5 mb-7">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your Daxor workspace to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Keep me signed in for 30 days
            </label>

            <Button
              type="submit"
              className="w-full h-11 font-semibold border-none hover:opacity-95 group"
              disabled={loading}
            >
              {loading ? 'Signing in…' : (
                <>
                  Sign in
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Need an account? Contact your platform administrator for credentials.
          </p>

          <p className="mt-10 text-center text-[11px] text-muted-foreground">
            By signing in you agree to our{' '}
            <a className="underline-offset-2 hover:underline" href="#">Terms</a> &{' '}
            <a className="underline-offset-2 hover:underline" href="#">Privacy policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
