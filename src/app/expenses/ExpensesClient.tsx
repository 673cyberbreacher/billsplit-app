'use client'

import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, CreditCard, ArrowRightLeft, MoreVertical, Edit, Trash2, Calendar, Filter, Search, ChevronDown, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const mockExpenses = [
  { id: '1', groupId: '1', groupName: 'Apartment Roommates', description: 'May Rent', amount: 1800, currency: 'USD', category: 'UTILITIES', splitType: 'EQUAL', date: '2024-05-01', paidBy: 'You', status: 'SETTLED' },
  { id: '2', groupId: '1', groupName: 'Apartment Roommates', description: 'Electricity Bill', amount: 120, currency: 'USD', category: 'UTILITIES', splitType: 'EQUAL', date: '2024-05-05', paidBy: 'Sarah Chen', status: 'PENDING' },
  { id: '3', groupId: '2', groupName: 'Tokyo Trip 2024', description: 'Hotel Shibuya', amount: 125000, currency: 'JPY', category: 'TRAVEL', splitType: 'PERCENTAGE', date: '2024-04-15', paidBy: 'Alex Kim', status: 'SETTLED' },
  { id: '4', groupId: '1', groupName: 'Apartment Roommates', description: 'Groceries', amount: 85.50, currency: 'USD', category: 'FOOD', splitType: 'EXACT', date: '2024-05-10', paidBy: 'Mike Johnson', status: 'PENDING' },
  { id: '5', groupId: '3', groupName: 'Weekend Cabin', description: 'Cabin Rental', amount: 600, currency: 'USD', category: 'TRAVEL', splitType: 'EQUAL', date: '2024-06-01', paidBy: 'You', status: 'SETTLED' },
  { id: '6', groupId: '1', groupName: 'Apartment Roommates', description: 'Internet', amount: 65, currency: 'USD', category: 'UTILITIES', splitType: 'EQUAL', date: '2024-05-15', paidBy: 'Emma Davis', status: 'PENDING' },
  { id: '7', groupId: '2', groupName: 'Tokyo Trip 2024', description: 'Shinkansen Tickets', amount: 45000, currency: 'JPY', category: 'TRANSPORT', splitType: 'EQUAL', date: '2024-04-18', paidBy: 'Jordan Lee', status: 'SETTLED' },
  { id: '8', groupId: '1', groupName: 'Apartment Roommates', description: 'Dinner Out', amount: 140, currency: 'USD', category: 'ENTERTAINMENT', splitType: 'PERCENTAGE', date: '2024-05-20', paidBy: 'You', status: 'PENDING' },
]

const categoryIcons: Record<string, string> = {
  FOOD: '🍔', TRANSPORT: '🚌', ENTERTAINMENT: '🎮', UTILITIES: '⚡', SHOPPING: '🛍️', HEALTH: '💊', TRAVEL: '✈️', OTHER: '📦'
}

const categoryColors: Record<string, string> = {
  FOOD: 'from-orange-500 to-orange-600', TRANSPORT: 'from-blue-500 to-blue-600', ENTERTAINMENT: 'from-purple-500 to-purple-600', UTILITIES: 'from-yellow-500 to-yellow-600', SHOPPING: 'from-pink-500 to-pink-600', HEALTH: 'from-green-500 to-green-600', TRAVEL: 'from-cyan-500 to-cyan-600', OTHER: 'from-gray-500 to-gray-600'
}

const splitTypeLabels: Record<string, string> = {
  EQUAL: 'Equal', PERCENTAGE: 'Percentage', EXACT: 'Exact', SHARES: 'Shares'
}

export default function ExpensesClient() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const groupId = searchParams.get('groupId')
  const [filter, setFilter] = useState<'all' | 'pending' | 'settled'>('all')
  const [search, setSearch] = useState('')

  if (status === 'loading') {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="orb-bg" aria-hidden="true"><div className="orb orb-1" /><div className="orb orb-2" /></div>
        <div className="relative z-10 flex flex-col items-center gap-4"><div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-glow/30 border-t-primary-glow" /><p className="text-muted-foreground">Loading expenses...</p></div>
      </div>
    )
  }

  if (!session) return null

  const filteredExpenses = mockExpenses.filter(e => {
    if (groupId && e.groupId !== groupId) return false
    if (filter === 'pending' && e.status !== 'PENDING') return false
    if (filter === 'settled' && e.status !== 'SETTLED') return false
    if (search && !e.description.toLowerCase().includes(search.toLowerCase()) && !e.groupName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

  return (
    <div className="relative min-h-screen">
      <div className="orb-bg" aria-hidden="true"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>

      <header className="nav-glass sticky top-0 z-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-gradient"><Activity className="h-6 w-6" />BillSplit</Link>
              <nav className="hidden md:flex items-center gap-1">
                {[{href:'/dashboard',label:'Dashboard'},{href:'/groups',label:'Groups'},{href:'/expenses',label:'Expenses',active:true},{href:'/settlements',label:'Settlements'}].map(item=>(
                  <Link key={item.href} href={item.href} className={cn('px-3 py-2 rounded-xl text-sm font-medium transition-all',item.active?'text-foreground bg-primary-glow/10':'text-muted-foreground hover:text-foreground hover:bg-primary-glow/10')}>{item.label}</Link>
                ))}
              </nav>
            </div>
            <Link href="/expenses/new">
              <Button className="btn-gradient gap-2 hidden sm:inline-flex"><Plus className="h-4 w-4" />New Expense</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary-glow to-accent -webkit-bg-clip-text -webkit-text-fill-transparent bg-clip-text">All Expenses</h1>
              <p className="mt-1 text-muted-foreground">Track and manage all your shared expenses</p>
            </div>
            <Link href="/expenses/new"><Button className="btn-gradient gap-2"><Plus className="h-4 w-4" />Add Expense</Button></Link>
          </div>
        </div>

        <Card className="card-glass mb-6 animate-slide-up delay-1">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                <Input placeholder="Search expenses..." value={search} onChange={e=>setSearch(e.target.value)} className="input-glass pl-10" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select value={filter} onChange={e=>setFilter(e.target.value as any)} className="input-glass bg-transparent pr-8 appearance-none cursor-pointer">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="settled">Settled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredExpenses.length > 0 ? (
          <div className="space-y-4 animate-slide-up delay-2">
            {filteredExpenses.map((expense, i) => (
              <Card key={expense.id} className="card-glass group-hover:border-primary-glow/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:`linear-gradient(135deg, var(--tw-gradient-from, ${categoryColors[expense.category].split(' ')[1]}) , var(--tw-gradient-to, ${categoryColors[expense.category].split(' ')[3]})`}}>{categoryIcons[expense.category]}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{expense.description}</h3>
                          <Badge variant="outline" className="text-xs">{splitTypeLabels[expense.splitType]}</Badge>
                          <Badge variant="outline" className="text-xs">{expense.groupName}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />{new Date(expense.date).toLocaleDateString()}•Paid by {expense.paidBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <p className="text-xl font-bold text-gradient whitespace-nowrap">{formatCurrency(expense.amount, expense.currency)}</p>
                      <Badge variant={expense.status==='SETTLED'?'success':'warning'} className="gap-1">{expense.status==='SETTLED'&&<ChevronDown className="h-3 w-3" />}{expense.status}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary-glow/10"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-strong" align="end" forceMount>
                          <DropdownMenuItem asChild><Link href={`/expenses/${expense.id}`} className="flex w-full items-center gap-2"><Edit className="h-4 w-4" />View Details</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href={`/expenses/${expense.id}/edit`} className="flex w-full items-center gap-2"><Edit className="h-4 w-4" />Edit</Link></DropdownMenuItem>
                          <DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-glass animate-slide-up"><CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center"><div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-glow/10"><CreditCard className="h-8 w-8 text-primary-glow" /></div><h2 className="text-xl font-semibold mb-2">No expenses found</h2><p className="text-muted-foreground mb-6 max-w-sm">Start by adding your first expense.</p><Link href="/expenses/new"><Button className="btn-gradient gap-2"><Plus className="h-4 w-4" />Add Expense</Button></Link></CardContent></Card>
        )}
      </main>
    </div>
  )
}