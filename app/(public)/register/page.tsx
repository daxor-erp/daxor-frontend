'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { REGISTER } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Boxes,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function scorePassword(pw: string) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']
const STRENGTH_COLORS = ['bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-600']

export default function RegisterPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    agree: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [registerMutation, { loading }] = useMutation(REGISTER)

  const setF = (k: string, v: string | boolean) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  const strength = useMemo(() => scorePassword(form.password), [form.password])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Required'
    else if (form.password.length < 8) e.password = 'Use at least 8 characters'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    if (!form.agree) e.agree = 'You must accept the terms'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const { data } = await registerMutation({
        variables: {
          input: {
            email: form.email.trim(),
            password: form.password,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
          },
        },
      })
      if (data?.register) {
        login(data.register.token, data.register.user)
        toast.success('Account created — welcome to Daxor!')
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
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
              Built for Indian businesses · GST · INR
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-balance">
              Start running your operations the smart way.
            </h2>
            <p className="text-white/80 text-base leading-relaxed">
              Set up your workspace in minutes. Invite your team, configure your modules, and go live.
            </p>
            <ul className="space-y-2.5">
              {[
                { icon: Users, label: 'Multi-user with role-based access' },
                { icon: Boxes, label: 'Inventory, warehouses, intercompany flows' },
                { icon: TrendingUp, label: 'Financial reports, payroll, statutory compliance' },
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
            Free forever · 14-day premium trial · Cancel anytime
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
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
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">It only takes a minute. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  First name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Aarav"
                  value={form.firstName}
                  onChange={(e) => setF('firstName', e.target.value)}
                  className={cn('h-11', errors.firstName && 'border-rose-400 focus-visible:ring-rose-400')}
                  required
                />
                {errors.firstName && <p className="text-xs text-rose-600">{errors.firstName}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Sharma"
                  value={form.lastName}
                  onChange={(e) => setF('lastName', e.target.value)}
                  className={cn('h-11', errors.lastName && 'border-rose-400 focus-visible:ring-rose-400')}
                  required
                />
                {errors.lastName && <p className="text-xs text-rose-600">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Work email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setF('email', e.target.value)}
                className={cn('h-11', errors.email && 'border-rose-400 focus-visible:ring-rose-400')}
                autoComplete="email"
                required
              />
              {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setF('password', e.target.value)}
                  className={cn('h-11 pr-11', errors.password && 'border-rose-400 focus-visible:ring-rose-400')}
                  autoComplete="new-password"
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
              {form.password && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex gap-1 flex-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-all',
                          i < strength ? STRENGTH_COLORS[strength] : 'bg-border',
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground w-20 text-right">
                    {STRENGTH_LABELS[strength]}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-xs text-rose-600">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={(e) => setF('confirm', e.target.value)}
                  className={cn('h-11 pr-11', errors.confirm && 'border-rose-400 focus-visible:ring-rose-400')}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-xs text-rose-600">{errors.confirm}</p>}
            </div>

            <label className="flex items-start gap-2 text-sm select-none">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setF('agree', e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-muted-foreground leading-snug">
                I agree to the{' '}
                <a className="font-medium text-primary hover:underline" href="#">Terms of Service</a> and{' '}
                <a className="font-medium text-primary hover:underline" href="#">Privacy Policy</a>.
              </span>
            </label>
            {errors.agree && (
              <p className="-mt-2 inline-flex items-center gap-1 text-xs text-rose-600">
                <AlertCircle className="h-3 w-3" />
                {errors.agree}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-grad-brand text-white font-semibold border-none hover:opacity-95 group"
              disabled={loading}
            >
              {loading ? 'Creating account…' : (
                <>
                  Create account
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-7 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
