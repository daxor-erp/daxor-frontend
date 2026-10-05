'use client'

import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { LOGIN } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [progress, setProgress] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const { login } = useAuth()
  const [loginMutation, { loading }] = useMutation(LOGIN)

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current)
    }
  }, [])

  const runProgressThenRedirect = (path: string) => {
    setTransitioning(true)
    setProgress(8)
    let value = 8
    progressTimer.current = setInterval(() => {
      value = Math.min(value + (value < 70 ? 7 : value < 92 ? 3 : 1), 100)
      setProgress(value)
      if (value >= 100) {
        if (progressTimer.current) clearInterval(progressTimer.current)
        window.location.href = path
      }
    }, 45)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (transitioning) return
    try {
      const { data } = await loginMutation({
        variables: { input: { email: email.trim(), password } },
      })
      if (data?.login) {
        const path = login(data.login.token, data.login.user, { redirect: false })
        runProgressThenRedirect(path)
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    }
  }

  const busy = loading || transitioning

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Soft brand atmosphere — same primary blue family */}
      <div className="pointer-events-none absolute inset-0 bg-[#f4f7fb]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, hsl(212 84% 46% / 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, hsl(211 83% 74% / 0.18), transparent 50%)',
        }}
      />

      <div
        className={cn(
          'relative z-10 w-full max-w-[440px]',
          'animate-in fade-in slide-in-from-bottom-2 duration-500',
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl bg-white',
            'border border-slate-200/80',
            'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-12px_rgba(20,113,216,0.14)]',
          )}
        >
          {/* Blue progress line at title top */}
          <div className="absolute inset-x-0 top-0 z-20 h-[3px] bg-slate-100/90">
            <div
              className={cn(
                'h-full bg-primary transition-[width] duration-100 ease-out',
                transitioning && 'shadow-[0_0_12px_hsl(var(--primary)/0.55)]',
              )}
              style={{ width: `${transitioning ? progress : 0}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={transitioning ? Math.round(progress) : 0}
              aria-label="Signing in"
            />
          </div>

          {/* Brand header on the card */}
          <div className="border-b border-slate-100 px-8 pb-7 pt-10 sm:px-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5">
                <div
                  className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl"
                  aria-hidden
                />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-white">
                  <Sparkles className="h-8 w-8" strokeWidth={1.6} />
                </div>
              </div>
              <h1 className="text-[1.75rem] font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
                Daxor ERP
              </h1>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80">
                Enterprise Suite
              </p>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-slate-500">
                {transitioning
                  ? 'Preparing your workspace…'
                  : 'Sign in with your organisation credentials'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-8 py-8 sm:px-10 sm:pb-9">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] font-medium text-slate-700">
                Username
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  'h-12 rounded-xl border-slate-200 bg-slate-50/80 text-[15px] shadow-none',
                  'placeholder:text-slate-400',
                  'focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-primary/20',
                )}
                autoComplete="username"
                required
                disabled={busy}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px] font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    'h-12 rounded-xl border-slate-200 bg-slate-50/80 pr-12 text-[15px] shadow-none',
                    'placeholder:text-slate-400',
                    'focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-primary/20',
                  )}
                  autoComplete="current-password"
                  required
                  disabled={busy}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  disabled={busy}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className={cn(
                'mt-1 h-12 w-full rounded-xl text-[15px] font-semibold tracking-wide',
                'shadow-md shadow-primary/25 transition hover:shadow-lg hover:shadow-primary/30',
              )}
              disabled={busy}
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {transitioning ? 'Opening workspace…' : 'Signing in…'}
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-3.5">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-[11px] font-medium tracking-wide text-slate-500">
              Secured organisation access
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Need access? Contact your platform administrator.
        </p>
      </div>
    </div>
  )
}
