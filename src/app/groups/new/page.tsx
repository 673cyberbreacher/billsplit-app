'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Loader2, ArrowLeft, Plus, Users, Globe, Zap } from 'lucide-react'
import { toast } from 'sonner'

const createGroupSchema = z.object({
  name: z.string().min(2, 'Group name must be at least 2 characters').max(50),
  description: z.string().max(200).optional(),
  currency: z.string().min(1, 'Please select a currency'),
})

type CreateGroupForm = z.infer<typeof createGroupSchema>

const currencies = [
  { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
  { code: 'EUR', name: 'Euro (€)', symbol: '€' },
  { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar (C$)', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar (A$)', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc (CHF)', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan (¥)', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee (₹)', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real (R$)', symbol: 'R$' },
]

export default function NewGroupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { currency: 'USD' },
  })

  const selectedCurrency = watch('currency')
  const currencyInfo = currencies.find(c => c.code === selectedCurrency)

  const onSubmit = async (data: CreateGroupForm) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.message || 'Failed to create group')
        return
      }

      toast.success('Group created successfully!')
      router.push(`/groups/${result.id}`)
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Orb Background */}
      <div className="orb-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Navigation */}
      <header className="nav-glass sticky top-0 z-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/groups" className="flex items-center gap-2 text-muted-foreground hover:text-primary-glow transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Groups</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent flex items-center justify-center">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create New Group</h1>
              <p className="text-sm text-muted-foreground">Set up a group for sharing expenses</p>
            </div>
          </div>
        </div>

        <Card className="card-glass animate-slide-up delay-1">
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
            <CardDescription>Enter the basic information for your new group</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Apartment Roommates, Tokyo Trip 2024"
                    {...register('name')}
                    disabled={isLoading}
                    aria-invalid={!!errors.name}
                    className="input-glass pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Monthly rent, utilities, groceries for our apartment"
                  {...register('description')}
                  disabled={isLoading}
                  className="input-glass min-h-[100px]"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Optional — helps members understand the group purpose</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select onValueChange={currency => register('currency').onChange({ target: { value: currency } } as any)} defaultValue="USD">
                  <SelectTrigger className="input-glass" aria-invalid={!!errors.currency}>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center justify-between w-full">
                          <span>{currency.code} — {currency.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-destructive flex items-center gap-1">{errors.currency.message}</p>
                )}
              </div>

              {/* Currency Preview */}
              <div className="p-4 rounded-xl bg-primary-glow/5 border border-primary-glow/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary-glow" />
                    <div>
                      <p className="text-sm font-medium">Default Currency</p>
                      <p className="text-sm text-muted-foreground">{currencyInfo?.code} — {currencyInfo?.name}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gradient">{currencyInfo?.symbol}</span>
                </div>
              </div>

              <Separator>Or</Separator>

              <div className="flex gap-3">
                <Link href="/groups">
                  <Button type="button" variant="outline" className="btn-gradient-secondary flex-1">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="btn-gradient flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Group
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 animate-slide-up delay-2">
          {[
            { icon: Users, title: 'Invite Members Later', desc: 'Add members after creation via email invite links' },
            { icon: Zap, title: 'Flexible Splitting', desc: 'Equal, percentage, exact amounts, or custom shares' },
            { icon: Globe, title: 'Multi-Currency', desc: '150+ currencies with live exchange rates' },
            { icon: Plus, title: 'Recurring Expenses', desc: 'Set up rent, subscriptions on auto-pilot' },
          ].map((tip, i) => (
            <Card key={tip.title} className="card-glass p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary-glow/10 flex items-center justify-center flex-shrink-0">
                  <tip.icon className="h-4 w-4 text-primary-glow" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground">{tip.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}