'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { Loader2, ArrowLeft, Plus, Users, ArrowRightLeft, Calendar, DollarSign, Zap } from 'lucide-react'
import { toast } from 'sonner'

const settlementSchema = z.object({
  groupId: z.string().min(1, 'Please select a group'),
  fromUserId: z.string().min(1, 'Please select who paid'),
  toUserId: z.string().min(1, 'Please select who received'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().length(3),
  method: z.string().optional(),
  reference: z.string().max(100).optional(),
  date: z.string().min(1, 'Please select a date'),
  notes: z.string().max(500).optional(),
}).refine(data => data.fromUserId !== data.toUserId, {
  message: 'Payer and receiver cannot be the same person',
  path: ['toUserId'],
})

type SettlementForm = z.infer<typeof settlementSchema>

const mockGroups = [
  { id: '1', name: 'Apartment Roommates', currency: 'USD', members: [{id:'1',name:'You'},{id:'2',name:'Sarah Chen'},{id:'3',name:'Mike Johnson'},{id:'4',name:'Emma Davis'}] },
  { id: '2', name: 'Tokyo Trip 2024', currency: 'JPY', members: [{id:'1',name:'You'},{id:'2',name:'Alex Kim'},{id:'3',name:'Jordan Lee'}] },
  { id: '3', name: 'Weekend Cabin', currency: 'USD', members: [{id:'1',name:'You'},{id:'2',name:'Chris'},{id:'3',name:'Pat'},{id:'4',name:'Sam'},{id:'5',name:'Alex'},{id:'6',name:'Taylor'}] },
]

const paymentMethods = [
  'Cash', 'Venmo', 'PayPal', 'Bank Transfer', 'Zelle', 'CashApp', 'Wise', 'Revolut', 'Other'
]

export default function NewSettlementClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedGroupId = searchParams.get('groupId')
  const preSelectedExpenseId = searchParams.get('expenseId')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettlementForm>({
    resolver: zodResolver(settlementSchema),
    defaultValues: {
      groupId: preSelectedGroupId || '',
      currency: preSelectedGroupId ? mockGroups.find(g => g.id === preSelectedGroupId)?.currency || 'USD' : 'USD',
      date: new Date().toISOString().split('T')[0],
      fromUserId: '',
      toUserId: '',
    },
  })

  const selectedGroupId = watch('groupId')
  const selectedGroup = mockGroups.find(g => g.id === selectedGroupId)
  const members = selectedGroup?.members || []

  const onSubmit = async (data: SettlementForm) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) { toast.error(result.message || 'Failed to record settlement'); return }
      toast.success('Settlement recorded successfully!')
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
            <Link href="/settlements" className="flex items-center gap-2 text-muted-foreground hover:text-primary-glow transition-colors"><ArrowLeft className="h-5 w-5" /><span className="font-medium">Back to Settlements</span></Link>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <div className="animate-slide-up"><div className="flex items-center gap-2 mb-2"><div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent flex items-center justify-center"><Plus className="h-5 w-5 text-primary" /></div><div><h1 className="text-2xl font-bold">Record Settlement</h1><p className="text-sm text-muted-foreground">Log a payment between group members</p></div></div></div>
        <Card className="card-glass animate-slide-up delay-1">
          <CardHeader><CardTitle>Settlement Details</CardTitle><CardDescription>Enter the payment information</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2"><Label htmlFor="groupId">Group *</Label>
                <Select onValueChange={v=>{setValue('groupId',v);setValue('currency',mockGroups.find(g=>g.id===v)?.currency||'USD');setValue('fromUserId','');setValue('toUserId','')}} defaultValue={preSelectedGroupId||''}><SelectTrigger className="input-glass" aria-invalid={!!errors.groupId}><SelectValue placeholder="Select a group" /></SelectTrigger><SelectContent>{mockGroups.map(g=>(<SelectItem key={g.id} value={g.id}><div className="flex items-center justify-between w-full"><span>{g.name}</span><span className="text-xs text-muted-foreground">{g.currency}</span></div></SelectItem>))}</SelectContent></Select>
                {errors.groupId&&<p className="text-sm text-destructive">{errors.groupId.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="fromUserId">Who Paid *</Label>
                <Select onValueChange={v=>setValue('fromUserId',v)} defaultValue=""><SelectTrigger className="input-glass" aria-invalid={!!errors.fromUserId}><SelectValue placeholder="Select payer" /></SelectTrigger><SelectContent>{members.map(m=>(<SelectItem key={m.id} value={m.id}>{m.name} {m.id==='1'&&'(You)'}</SelectItem>))}</SelectContent></Select>
                {errors.fromUserId&&<p className="text-sm text-destructive">{errors.fromUserId.message}</p>}</div>
                <div className="space-y-2"><Label htmlFor="toUserId">Who Received *</Label>
                <Select onValueChange={v=>setValue('toUserId',v)} defaultValue=""><SelectTrigger className="input-glass" aria-invalid={!!errors.toUserId}><SelectValue placeholder="Select receiver" /></SelectTrigger><SelectContent>{members.map(m=>(<SelectItem key={m.id} value={m.id}>{m.name} {m.id==='1'&&'(You)'}</SelectItem>))}</SelectContent></Select>
                {errors.toUserId&&<p className="text-sm text-destructive">{errors.toUserId.message}</p>}</div></div>
              <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-2 sm:col-span-2"><Label htmlFor="amount">Amount *</Label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">{selectedGroup?.currency==='JPY'?'¥':'$'}</span><Input id="amount" type="number" step="0.01" min="0.01" placeholder="0.00" {...register('amount',{valueAsNumber:true})} disabled={isLoading} className="input-glass pl-8" aria-invalid={!!errors.amount} /></div>
                {errors.amount&&<p className="text-sm text-destructive">{errors.amount.message}</p>}</div>
                <div className="space-y-2"><Label htmlFor="currency">Currency</Label><Input id="currency" value={selectedGroup?.currency||'USD'} readOnly className="input-glass bg-muted/50" /></div></div>
              <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="method">Payment Method</Label>
                <Select onValueChange={v=>register('method').onChange({target:{value:v}})} defaultValue=""><SelectTrigger className="input-glass"><SelectValue placeholder="Select method" /></SelectTrigger><SelectContent>{paymentMethods.map(m=>(<SelectItem key={m} value={m}>{m}</SelectItem>))}<SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="date">Date *</Label><Input id="date" type="date" {...register('date')} disabled={isLoading} className="input-glass" aria-invalid={!!errors.date} /></div></div>
              <div className="space-y-2"><Label htmlFor="reference">Reference</Label><Input id="reference" placeholder="e.g., May rent share" {...register('reference')} disabled={isLoading} className="input-glass" aria-invalid={!!errors.reference} /></div>
              <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" placeholder="Optional notes..." {...register('notes')} disabled={isLoading} className="input-glass min-h-[80px]" rows={2} /></div>
              <div className="flex gap-3 pt-4"><Link href="/settlements"><Button type="button" variant="outline" className="btn-gradient-secondary flex-1">Cancel</Button></Link><Button type="submit" className="btn-gradient flex-1" disabled={isLoading}>{isLoading?(<> <Loader2 className="mr-2 h-4 w-4 animate-spin" />Recording...</>):(<><Plus className="mr-2 h-4 w-4" />Record Settlement</>)}</Button></div>
            </form>
          </CardContent>
        </Card>
        <div className="mt-8 grid gap-4 md:grid-cols-2 animate-slide-up delay-2">
          {[{icon:Zap,title:'Instant Sync',desc:'Payments appear instantly for all group members'},{icon:Users,title:'Balance Updates',desc:'Group balances recalculate automatically'},{icon:DollarSign,title:'Multi-Currency',desc:'Record payments in any supported currency'},{icon:Calendar,title:'Historical Tracking',desc:'Full audit trail with dates and methods'}].map((tip,i)=>(<Card key={tip.title} className="card-glass p-4"><div className="flex items-start gap-3"><div className="h-8 w-8 rounded-lg bg-primary-glow/10 flex items-center justify-center flex-shrink-0"><tip.icon className="h-4 w-4 text-primary-glow" /></div><div><h4 className="font-medium text-sm">{tip.title}</h4><p className="text-xs text-muted-foreground">{tip.desc}</p></div></div></Card>))}
        </div>
      </main>
    </div>
  )
}