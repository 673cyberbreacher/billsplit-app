'use client'

import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, ArrowRightLeft, MoreVertical, Edit, Trash2, Calendar, Filter, Search, ChevronDown, Check, X, Clock, Users, CreditCard, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const mockSettlements = [
  { id: '1', groupId: '1', groupName: 'Apartment Roommates', fromUser: 'Sarah Chen', toUser: 'You', amount: 450, currency: 'USD', status: 'COMPLETED', date: '2024-05-02', method: 'Venmo', reference: 'May rent share' },
  { id: '2', groupId: '1', groupName: 'Apartment Roommates', fromUser: 'Emma Davis', toUser: 'You', amount: 450, currency: 'USD', status: 'COMPLETED', date: '2024-05-03', method: 'Bank Transfer', reference: 'May rent share' },
  { id: '3', groupId: '1', groupName: 'Apartment Roommates', fromUser: 'Mike Johnson', toUser: 'You', amount: 30, currency: 'USD', status: 'PENDING', date: '2024-05-25', method: 'Cash', reference: 'Electricity bill' },
  { id: '4', groupId: '2', groupName: 'Tokyo Trip 2024', fromUser: 'You', toUser: 'Alex Kim', amount: 25000, currency: 'JPY', status: 'COMPLETED', date: '2024-04-20', method: 'PayPal', reference: 'Hotel share' },
  { id: '5', groupId: '3', groupName: 'Weekend Cabin', fromUser: 'Chris', toUser: 'You', amount: 100, currency: 'USD', status: 'PENDING', date: '2024-06-05', method: 'Venmo', reference: 'Cabin rental' },
  { id: '6', groupId: '1', groupName: 'Apartment Roommates', fromUser: 'You', toUser: 'Sarah Chen', amount: 20, currency: 'USD', status: 'COMPLETED', date: '2024-05-12', method: 'Cash', reference: 'Groceries' },
]

const statusConfig: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive', icon: any, color: string }> = {
  COMPLETED: { variant: 'success', icon: Check, color: 'text-success-glow' },
  PENDING: { variant: 'warning', icon: Clock, color: 'text-warning-glow' },
  CANCELLED: { variant: 'destructive', icon: X, color: 'text-destructive-glow' },
  FAILED: { variant: 'destructive', icon: X, color: 'text-destructive-glow' },
}

const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

export default function SettlementsClient() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const groupId = searchParams.get('groupId')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [search, setSearch] = useState('')

  if (status === 'loading') {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="orb-bg" aria-hidden="true"><div className="orb orb-1" /><div className="orb orb-2" /></div>
        <div className="relative z-10 flex flex-col items-center gap-4"><div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-glow/30 border-t-primary-glow" /><p className="text-muted-foreground">Loading settlements...</p></div>
      </div>
    )
  }

  if (!session) return null

  const filteredSettlements = mockSettlements.filter(s => {
    if (groupId && s.groupId !== groupId) return false
    if (filter === 'pending' && s.status !== 'PENDING') return false
    if (filter === 'completed' && s.status !== 'COMPLETED') return false
    if (search && !s.fromUser.toLowerCase().includes(search.toLowerCase()) && !s.toUser.toLowerCase().includes(search.toLowerCase()) && !s.groupName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="relative min-h-screen">
      <div className="orb-bg" aria-hidden="true"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>
      <header className="nav-glass sticky top-0 z-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-gradient"><Activity className="h-6 w-6" />BillSplit</Link>
              <nav className="hidden md:flex items-center gap-1">
                {[{href:'/dashboard',label:'Dashboard'},{href:'/groups',label:'Groups'},{href:'/expenses',label:'Expenses'},{href:'/settlements',label:'Settlements',active:true}].map(item=>(
                  <Link key={item.href} href={item.href} className={cn('px-3 py-2 rounded-xl text-sm font-medium transition-all',item.active?'text-foreground bg-primary-glow/10':'text-muted-foreground hover:text-foreground hover:bg-primary-glow/10')}>{item.label}</Link>
                ))}
              </nav>
            </div>
            <Link href="/settlements/new"><Button className="btn-gradient gap-2 hidden sm:inline-flex"><Plus className="h-4 w-4" />Record Payment</Button></Link>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div><h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary-glow to-accent -webkit-bg-clip-text -webkit-text-fill-transparent bg-clip-text">Settlements</h1><p className="mt-1 text-muted-foreground">Track and record all payments between group members</p></div>
            <Link href="/settlements/new"><Button className="btn-gradient gap-2"><Plus className="h-4 w-4" />Record Payment</Button></Link>
          </div>
        </div>
        <Card className="card-glass mb-6 animate-slide-up delay-1"><CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" /><Input placeholder="Search settlements..." value={search} onChange={e=>setSearch(e.target.value)} className="input-glass pl-10" /></div>
            <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-muted-foreground" /><select value={filter} onChange={e=>setFilter(e.target.value as any)} className="input-glass bg-transparent pr-8 appearance-none cursor-pointer"><option value="all">All</option><option value="pending">Pending</option><option value="completed">Completed</option></select></div>
          </div>
        </CardContent></Card>
        {filteredSettlements.length > 0 ? (
          <div className="space-y-4 animate-slide-up delay-2">
            {filteredSettlements.map((s, i) => {
              const cfg = statusConfig[s.status]
              const isYouFrom = s.fromUser === 'You'
              const isYouTo = s.toUser === 'You'
              return (
                <Card key={s.id} className="card-glass group-hover:border-primary-glow/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: isYouFrom ? 'linear-gradient(135deg, var(--destructive-glow), var(--destructive))' : isYouTo ? 'linear-gradient(135deg, var(--success-glow), var(--primary-glow))' : 'linear-gradient(135deg, var(--primary-glow), var(--accent))'}}><ArrowRightLeft className="h-6 w-6 text-primary" /></div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold truncate">{s.groupName}</h3>
                            <Badge variant="outline" className="text-xs">{s.currency}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{new Date(s.date).toLocaleDateString()} • {s.method || 'No method'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <p className={`text-xl font-bold ${isYouFrom ? 'text-destructive-glow' : isYouTo ? 'text-success-glow' : 'text-gradient'}`}>{isYouFrom ? '-' : '+'}{formatCurrency(s.amount, s.currency)}</p>
                          <p className="text-xs text-muted-foreground">{s.fromUser} → {s.toUser}</p>
                        </div>
                        <Badge variant={cfg.variant} className="gap-1"><cfg.icon className="h-3 w-3" />{s.status}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary-glow/10"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent className="glass-strong" align="end" forceMount>
                            <DropdownMenuItem asChild><Link href={`/settlements/${s.id}`} className="flex w-full items-center gap-2"><Edit className="h-4 w-4" />View Details</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/settlements/${s.id}/edit`} className="flex w-full items-center gap-2"><Edit className="h-4 w-4" />Edit</Link></DropdownMenuItem>
                            <DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {s.reference && <p className="mt-2 text-sm text-muted-foreground">"{s.reference}"</p>}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="card-glass animate-slide-up"><CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center"><div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-glow/10"><ArrowRightLeft className="h-8 w-8 text-primary-glow" /></div><h2 className="text-xl font-semibold mb-2">No settlements found</h2><p className="text-muted-foreground mb-6 max-w-sm">Record your first payment to start tracking settlements.</p><Link href="/settlements/new"><Button className="btn-gradient gap-2"><Plus className="h-4 w-4" />Record Payment</Button></Link></CardContent></Card>
        )}
      </main>
    </div>
  )
}