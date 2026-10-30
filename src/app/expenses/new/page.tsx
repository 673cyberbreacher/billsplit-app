'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Loader2, ArrowLeft, Plus, Minus, CreditCard, Users, Calendar, Globe, Zap, Trash2, Edit, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const splitTypeSchema = z.enum(['EQUAL', 'PERCENTAGE', 'EXACT', 'SHARES'])

const expenseSchema = z.object({
  groupId: z.string().min(1, 'Please select a group'),
  description: z.string().min(2, 'Description must be at least 2 characters').max(100),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().length(3),
  category: z.enum(['FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'UTILITIES', 'SHOPPING', 'HEALTH', 'TRAVEL', 'OTHER']),
  splitType: splitTypeSchema,
  date: z.string().min(1, 'Please select a date'),
  notes: z.string().max(500).optional(),
  receiptUrl: z.string().url().optional().or(z.literal('')),
  shares: z.array(z.object({
    userId: z.string(),
    userName: z.string(),
    amount: z.number().optional(),
    percentage: z.number().optional(),
    shares: z.number().optional(),
  })).optional(),
}).refine((data) => {
  if (data.splitType === 'PERCENTAGE' && data.shares) {
    const total = data.shares.reduce((sum, s) => sum + (s.percentage || 0), 0)
    return Math.abs(total - 100) < 0.01
  }
  if (data.splitType === 'EXACT' && data.shares) {
    const total = data.shares.reduce((sum, s) => sum + (s.amount || 0), 0)
    return Math.abs(total - data.amount) < 0.01
  }
  if (data.splitType === 'SHARES' && data.shares) {
    const totalShares = data.shares.reduce((sum, s) => sum + (s.shares || 0), 0)
    return totalShares > 0
  }
  return true
}, {
  message: 'Shares must add up correctly',
  path: ['shares'],
})

type ExpenseForm = z.infer<typeof expenseSchema>

const mockGroups = [
  { id: '1', name: 'Apartment Roommates', currency: 'USD', members: [{id:'1',name:'You'},{id:'2',name:'Sarah Chen'},{id:'3',name:'Mike Johnson'},{id:'4',name:'Emma Davis'}] },
  { id: '2', name: 'Tokyo Trip 2024', currency: 'JPY', members: [{id:'1',name:'You'},{id:'2',name:'Alex Kim'},{id:'3',name:'Jordan Lee'}] },
  { id: '3', name: 'Weekend Cabin', currency: 'USD', members: [{id:'1',name:'You'},{id:'2',name:'Chris'},{id:'3',name:'Pat'},{id:'4',name:'Sam'},{id:'5',name:'Alex'},{id:'6',name:'Taylor'}] },
]

const categories = [
  { value: 'FOOD', label: 'Food & Dining', icon: '🍔', color: 'from-orange-500 to-orange-600' },
  { value: 'TRANSPORT', label: 'Transport', icon: '🚌', color: 'from-blue-500 to-blue-600' },
  { value: 'ENTERTAINMENT', label: 'Entertainment', icon: '🎮', color: 'from-purple-500 to-purple-600' },
  { value: 'UTILITIES', label: 'Utilities', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
  { value: 'SHOPPING', label: 'Shopping', icon: '🛍️', color: 'from-pink-500 to-pink-600' },
  { value: 'HEALTH', label: 'Health', icon: '💊', color: 'from-green-500 to-green-600' },
  { value: 'TRAVEL', label: 'Travel', icon: '✈️', color: 'from-cyan-500 to-cyan-600' },
  { value: 'OTHER', label: 'Other', icon: '📦', color: 'from-gray-500 to-gray-600' },
]

const splitTypes = [
  { value: 'EQUAL', label: 'Equal Split', desc: 'Everyone pays the same amount' },
  { value: 'PERCENTAGE', label: 'By Percentage', desc: 'Each person pays a % of total' },
  { value: 'EXACT', label: 'Exact Amounts', desc: 'Specify exact amount per person' },
  { value: 'SHARES', label: 'By Shares', desc: 'Divide by share units (e.g., 2 shares for couple)' },
]

export default function NewExpensePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedGroupId = searchParams.get('groupId')
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      groupId: preSelectedGroupId || '',
      currency: preSelectedGroupId ? mockGroups.find(g => g.id === preSelectedGroupId)?.currency || 'USD' : 'USD',
      category: 'FOOD',
      splitType: 'EQUAL',
      date: new Date().toISOString().split('T')[0],
      shares: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'shares' })
  const selectedGroupId = watch('groupId')
  const selectedSplitType = watch('splitType')
  const amount = watch('amount')
  const selectedGroup = mockGroups.find(g => g.id === selectedGroupId)

  const updateShares = () => {
    if (!selectedGroup) return
    const members = selectedGroup.members
    if (selectedSplitType === 'EQUAL') {
      const shareAmount = amount ? amount / members.length : 0
      members.forEach((m, i) => {
        setValue(`shares.${i}.amount`, Number(shareAmount.toFixed(2)))
      })
    } else if (selectedSplitType === 'PERCENTAGE') {
      const pct = 100 / members.length
      members.forEach((m, i) => {
        setValue(`shares.${i}.percentage`, Number(pct.toFixed(2)))
      })
    } else if (selectedSplitType === 'EXACT') {
      members.forEach((m, i) => {
        setValue(`shares.${i}.amount`, i === 0 ? amount : 0)
      })
    } else if (selectedSplitType === 'SHARES') {
      members.forEach((m, i) => {
        setValue(`shares.${i}.shares`, 1)
      })
    }
  }

  const onSubmit = async (data: ExpenseForm) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) { toast.error(result.message || 'Failed to create expense'); return }
      toast.success('Expense added successfully!')
      router.push(`/groups/${data.groupId}`)
      router.refresh()
    } catch { toast.error('Something went wrong') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="orb-bg" aria-hidden="true"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>
      <header className="nav-glass sticky top-0 z-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/expenses" className="flex items-center gap-2 text-muted-foreground hover:text-primary-glow transition-colors"><ArrowLeft className="h-5 w-5" /><span className="font-medium">Back to Expenses</span></Link>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <div className="animate-slide-up"><div className="flex items-center gap-2 mb-2"><div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent flex items-center justify-center"><Plus className="h-5 w-5 text-primary" /></div><div><h1 className="text-2xl font-bold">Add New Expense</h1><p className="text-sm text-muted-foreground">Split a new expense with your group</p></div></div></div>
        <Card className="card-glass animate-slide-up delay-1">
          <CardHeader><CardTitle>Expense Details</CardTitle><CardDescription>Enter the expense information</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2"><Label htmlFor="groupId">Group *</Label>
                <Select onValueChange={v=>{setValue('groupId',v);setValue('currency',mockGroups.find(g=>g.id===v)?.currency||'USD');updateShares()}} defaultValue={preSelectedGroupId||''}><SelectTrigger className="input-glass" aria-invalid={!!errors.groupId}><SelectValue placeholder="Select a group" /></SelectTrigger><SelectContent>{mockGroups.map(g=>(<SelectItem key={g.id} value={g.id}><div className="flex items-center justify-between w-full"><span>{g.name}</span><span className="text-xs text-muted-foreground">{g.currency}</span></div></SelectItem>))}</SelectContent></Select>
                {errors.groupId&&<p className="text-sm text-destructive">{errors.groupId.message}</p>}
              </div>
              <div className="space-y-2"><Label htmlFor="description">Description *</Label>
                <Input id="description" placeholder="e.g., Dinner at Italian restaurant" {...register('description')} disabled={isLoading} className="input-glass" aria-invalid={!!errors.description} />
                {errors.description&&<p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-2 sm:col-span-2"><Label htmlFor="amount">Amount *</Label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">{selectedGroup?.currency==='JPY'?'¥':'$'}</span><Input id="amount" type="number" step="0.01" min="0.01" placeholder="0.00" {...register('amount',{valueAsNumber:true})} disabled={isLoading} onChange={e=>{register('amount').onChange(e);updateShares()}} className="input-glass pl-8" aria-invalid={!!errors.amount} /></div>
                {errors.amount&&<p className="text-sm text-destructive">{errors.amount.message}</p>}</div>
                <div className="space-y-2"><Label htmlFor="currency">Currency</Label><Input id="currency" value={selectedGroup?.currency||'USD'} readOnly className="input-glass bg-muted/50" /></div></div>
              <div className="space-y-2"><Label>Category</Label>
                <div className="grid grid-cols-4 gap-2">{categories.map(cat=>(<button key={cat.value} type="button" onClick={()=>setValue('category',cat.value as any)} className={cn('relative p-3 rounded-xl border-2 transition-all text-center',watch('category')===cat.value?'border-primary-glow bg-primary-glow/10':'border-glass-border hover:border-primary-glow/50')}>
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium">{cat.label}</div>
                </button>))}</div>
              </div>
              <div className="space-y-2"><Label>Split Type</Label>
                <div className="grid gap-2 md:grid-cols-2">{splitTypes.map(st=>(<button key={st.value} type="button" onClick={()=>{setValue('splitType',st.value as any);updateShares()}} className={cn('p-4 rounded-xl border-2 transition-all text-left',watch('splitType')===st.value?'border-primary-glow bg-primary-glow/10':'border-glass-border hover:border-primary-glow/50')}>
                  <div className="font-medium">{st.label}</div>
                  <div className="text-xs text-muted-foreground">{st.desc}</div>
                </button>))}</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="date">Date *</Label><Input id="date" type="date" {...register('date')} disabled={isLoading} className="input-glass" aria-invalid={!!errors.date} /></div><div className="space-y-2"><Label>Receipt URL</Label><Input placeholder="https://..." {...register('receiptUrl')} disabled={isLoading} className="input-glass" aria-invalid={!!errors.receiptUrl} /></div></div>
              <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" placeholder="Optional notes..." {...register('notes')} disabled={isLoading} className="input-glass min-h-[80px]" rows={2} /></div>
              <Separator />
              <div className="space-y-4"><div className="flex items-center justify-between"><h3 className="font-semibold">Split Between Members</h3><Button type="button" variant="ghost" size="sm" onClick={()=>setShowAdvanced(!showAdvanced)}>{showAdvanced?<Minus className="h-4 w-4" />:<Plus className="h-4 w-4" />} {showAdvanced?'Hide':'Show'} Details</Button></div>
                {selectedGroup && fields.length === 0 && selectedGroup.members.forEach((m,i)=>{append({userId:m.id,userName:m.name,amount:0,percentage:0,shares:1})})}
                {showAdvanced && (
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-3 p-3 rounded-xl bg-primary-glow/5 border border-glass-border">
                        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary-glow to-accent text-primary">{field.userName?.[0]}</AvatarFallback></Avatar>
                        <div className="flex-1 min-w-0"><p className="font-medium truncate">{field.userName}</p></div>
                        {selectedSplitType==='EQUAL'&&<Input type="number" step="0.01" readOnly className="w-24 text-right bg-muted/50" {...register(`shares.${index}.amount`)} />}
                        {selectedSplitType==='PERCENTAGE'&&<Input type="number" step="0.01" min="0" max="100" placeholder="%" className="w-24" {...register(`shares.${index}.percentage`)} />}
                        {selectedSplitType==='EXACT'&&<Input type="number" step="0.01" min="0" placeholder="Amount" className="w-24" {...register(`shares.${index}.amount`)} />}
                        {selectedSplitType==='SHARES'&&<Input type="number" step="1" min="1" placeholder="Shares" className="w-24" {...register(`shares.${index}.shares`)} />}
                        <input type="hidden" {...register(`shares.${index}.userId`)} />
                        <input type="hidden" {...register(`shares.${index}.userName`)} />
                      </div>
                    ))}
                    {errors.shares && <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errors.shares.message}</p>}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4"><Link href="/expenses"><Button type="button" variant="outline" className="btn-gradient-secondary flex-1">Cancel</Button></Link><Button type="submit" className="btn-gradient flex-1" disabled={isLoading}>{isLoading?(<> <Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>):(<><Plus className="mr-2 h-4 w-4" />Create Expense</>)}</Button></div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}