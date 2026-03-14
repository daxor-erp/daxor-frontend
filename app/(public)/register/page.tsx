'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { REGISTER } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function RegisterPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [registerMutation, { loading }] = useMutation(REGISTER)

  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (!form.password) e.password = 'Required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const { data } = await registerMutation({
        variables: { input: { email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName } },
      })
      if (data?.register) {
        login(data.register.token, data.register.user)
        toast.success('Account created successfully')
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-2xl">👋</div>
            <h1 className="text-4xl font-bold">Daxor</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">Get started today</h2>
          <p className="text-blue-100 text-lg mb-6">Create your account and start managing your business operations with Daxor ERP.</p>
          <div className="space-y-4">
            {['Complete CRM & Sales Management', 'Inventory & Purchase Control', 'Financial & Payroll Management', 'Production & Project Tracking'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">✓</div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center lg:hidden mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl">👋</div>
                <h1 className="text-3xl font-bold text-gray-900">Daxor</h1>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input id="firstName" placeholder="John" value={form.firstName} onChange={e => setF('firstName', e.target.value)} className={`h-11 ${errors.firstName ? 'border-red-400' : ''}`} />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={form.lastName} onChange={e => setF('lastName', e.target.value)} className={`h-11 ${errors.lastName ? 'border-red-400' : ''}`} />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input id="email" type="email" placeholder="you@company.com" value={form.email} onChange={e => setF('email', e.target.value)} className={`h-11 ${errors.email ? 'border-red-400' : ''}`} />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={form.password} onChange={e => setF('password', e.target.value)} className={`h-11 ${errors.password ? 'border-red-400' : ''}`} />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-sm font-medium">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setF('confirm', e.target.value)} className={`h-11 ${errors.confirm ? 'border-red-400' : ''}`} />
                {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
              </div>
              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
