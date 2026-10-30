'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ArrowLeft, CreditCard, Users, ArrowRightLeft, MoreVertical, Edit, Trash2, Calendar, Receipt, Copy, Check, X, Globe, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const mockExpense = {
  id: '1',
  groupId: '1',
  groupName: 'Apartment Roommates',
  description: 'May Rent',
  amount: 1800,
  currency: 'USD',
  category: 'UTILITIES',
  splitType: 'EQUAL',
  date: '2024-05-01',
  paidBy: 'You',
  paidById: '1',
  receiptUrl: 'https://example.com/receipt.pdf',
  notes: 'Monthly rent for May 2024',
  status: 'PENDING',
  shares: [
    { userId: '1', userName: 'You', amount: 450, percentage: 25, shares: 1, settled: false },
    { userId: '2', userName: 'Sarah Chen', amount: 450, percentage: 25, shares: 1, settled: true },
    { userId: '3', userName: 'Mike Johnson', amount: 450, percentage: 25, shares: 1, settled: false },
    { userId: '4', userName: 'Emma Davis', amount: 450, percentage: 25, shares: 1, settled: true },
  ],
  settlements: [
    { id: '1', fromUser: 'Sarah Chen', toUser: 'You', amount: 450, status: 'COMPLETED', date: '2024-05-02' },
    { id: '2', fromUser: 'Emma Davis', toUser: 'You', amount: 450, status: 'COMPLETED', date: '2024-05-03' },
  ]
}

const categoryIcons: Record<string, string> = { FOOD: '🍔', TRANSPORT: '🚌', ENTERTAINMENT: '🎮', UTILITIES: '⚡', SHOPPING: '🛍️', HEALTH: '💊', TRAVEL: '✈️', OTHER: '📦' }
const categoryColors: Record<string, string> = { FOOD: 'from-orange-500 to-orange-600', TRANSPORT: 'from-blue-500 to-blue-600', ENTERTAINMENT: 'from-purple-500 to-purple-600', UTILITIES: 'from-yellow-500 to-yellow-600', SHOPPING: 'from-pink-500 to-pink-600', HEALTH: 'from-green-500 to-green-600', TRAVEL: 'from-cyan-500 to-cyan-600', OTHER: 'from-gray-500 to-gray-600' }
const splitTypeLabels: Record<string, string> = { EQUAL: 'Equal Split', PERCENTAGE: 'By Percentage', EXACT: 'Exact Amounts', SHARES: 'By Shares' }
const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

export default function ExpenseDetailPage() {
  const params = useParams()
  const expense = mockExpense

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive', icon: any }> = {
      COMPLETED: { variant: 'success', icon: Check },
      PENDING: { variant: 'warning', icon: () => null },
      CANCELLED: { variant: 'destructive', icon: X },
    }
    const b = badges[status] || badges.PENDING
    return <Badge variant={b.variant} className="gap-1">{b.icon && <b.icon className="h-3 w-3" />}{status}</Badge>
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  return (
    <div className="relative min-h-screen">
      <div className="orb-bg" aria-hidden="true"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>
      <header className="nav-glass sticky top-0 z-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/groups/${expense.groupId}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary-glow transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-foreground to-primary-glow -webkit-bg-clip-text -webkit-text-fill-transparent bg-clip-text">{expense.description}</h1>
                <p className="text-xs text-muted-foreground">{expense.groupName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary-glow/10"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent className="glass-strong" align="end" forceMount>
                  <DropdownMenuItem asChild><Link href={`/expenses/${expense.id}/edit`} className="flex w-full items-center gap-2"><Edit className="h-4 w-4" />Edit</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={copyLink} className="flex w-full items-center gap-2 cursor-pointer"><Copy className="h-4 w-4" />Copy Link</DropdownMenuItem>
                  <DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-3 animate-slide-up">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-glass">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{background:`linear-gradient(135deg, var(--tw-gradient-from, ${categoryColors[expense.category].split(' ')[1]}) , var(--tw-gradient-to, ${categoryColors[expense.category].split(' ')[3]})`}}>{categoryIcons[expense.category]}</div>
                    <div>
                      <h2 className="text-2xl font-bold">{expense.description}</h2>
                      <p className="text-muted-foreground">Paid by {expense.paidBy} • {new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-bold text-gradient">{formatCurrency(expense.amount, expense.currency)}</p>
                    {getStatusBadge(expense.status)}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-xl bg-primary-glow/5 border border-glass-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Tag className="h-4 w-4" />Category</div>
                    <p className="font-semibold capitalize">{expense.category.toLowerCase()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary-glow/5 border border-glass-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Globe className="h-4 w-4" />Split Type</div>
                    <p className="font-semibold">{splitTypeLabels[expense.splitType]}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary-glow/5 border border-glass-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Receipt className="h-4 w-4" />Status</div>
                    <p className="font-semibold capitalize">{expense.status.toLowerCase()}</p>
                  </div>
                </div>
                {expense.notes && (
                  <div className="mt-6 p-4 rounded-xl bg-primary-glow/5 border border-glass-border">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p>{expense.notes}</p>
                  </div>
                )}
                {expense.receiptUrl && (
                  <div className="mt-4">
                    <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-glow hover:underline font-medium">
                      <Receipt className="h-4 w-4" /> View Receipt
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary-glow" />Split Details ({expense.shares.length} members)</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expense.shares.map((share) => (
                    <div key={share.userId} className="flex items-center justify-between p-4 rounded-xl bg-primary-glow/5 border border-glass-border">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10"><AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary-glow to-accent text-primary">{share.userName[0]}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium">{share.userName} {share.userId==='1'&&<Badge variant="default" className="ml-2 text-xs">You</Badge>}</p>
                          <p className="text-sm text-muted-foreground">{share.percentage}% • {share.shares} share{share.shares>1?'s':''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-gradient">{formatCurrency(share.amount, expense.currency)}</p>
                        <Badge variant={share.settled?'success':'warning'} className="gap-1">{share.settled&&<Check className="h-3 w-3" />}{share.settled?'Settled':'Pending'}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {expense.settlements.length > 0 && (
              <Card className="card-glass">
                <CardHeader><CardTitle className="flex items-center gap-2"><ArrowRightLeft className="h-5 w-5 text-primary-glow" />Settlements ({expense.settlements.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expense.settlements.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-primary-glow/5 border border-glass-border">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><ArrowRightLeft className="h-5 w-5 text-white" /></div>
                          <div>
                            <p className="font-semibold">{s.fromUser} → {s.toUser}</p>
                            <p className="text-sm text-muted-foreground">{new Date(s.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-bold text-gradient">{formatCurrency(s.amount, expense.currency)}</p>
                          {getStatusBadge(s.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="card-glass">
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/settlements/new?groupId=${expense.groupId}&expenseId=${expense.id}`}><Button className="btn-gradient w-full justify-center gap-2"><ArrowRightLeft className="h-4 w-4" />Record Payment</Button></Link>
                <Link href={`/expenses/${expense.id}/edit`}><Button variant="outline" className="btn-gradient-secondary w-full justify-center gap-2"><Edit className="h-4 w-4" />Edit Expense</Button></Link>
                <Button variant="outline" className="btn-gradient-secondary w-full justify-center gap-2" onClick={copyLink}><Copy className="h-4 w-4" />Copy Link</Button>
              </CardContent>
            </Card>
            <Card className="card-glass">
              <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Total Amount</span><span className="font-bold text-gradient">{formatCurrency(expense.amount, expense.currency)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Your Share</span><span className="font-bold">{(expense.shares.find(s=>s.userId==='1')?.amount||0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Settled</span><span className="font-bold text-success-glow">{expense.shares.filter(s=>s.settled).length}/{expense.shares.length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pending</span><span className="font-bold text-warning-glow">{expense.shares.filter(s=>!s.settled).length}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}