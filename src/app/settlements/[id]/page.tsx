'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ArrowLeft, ArrowRightLeft, MoreVertical, Edit, Trash2, Calendar, Copy, Check, X, Clock, Users, DollarSign, CreditCard, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const mockSettlement = {
  id: '1',
  groupId: '1',
  groupName: 'Apartment Roommates',
  fromUser: 'Sarah Chen',
  fromUserId: '2',
  toUser: 'You',
  toUserId: '1',
  amount: 450,
  currency: 'USD',
  status: 'COMPLETED',
  date: '2024-05-02',
  method: 'Venmo',
  reference: 'May rent share',
  notes: 'Paid for May rent share via Venmo',
  completedAt: '2024-05-02T14:30:00Z',
}

const statusConfig: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive', icon: any, color: string, bg: string }> = {
  COMPLETED: { variant: 'success', icon: Check, color: 'text-success-glow', bg: 'bg-success-glow/10' },
  PENDING: { variant: 'warning', icon: Clock, color: 'text-warning-glow', bg: 'bg-warning-glow/10' },
  CANCELLED: { variant: 'destructive', icon: X, color: 'text-destructive-glow', bg: 'bg-destructive-glow/10' },
  FAILED: { variant: 'destructive', icon: X, color: 'text-destructive-glow', bg: 'bg-destructive-glow/10' },
}

const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

export default function SettlementDetailPage() {
  const params = useParams()
  const settlement = mockSettlement
  const cfg = statusConfig[settlement.status]

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  const isYouFrom = settlement.fromUser === 'You'
  const isYouTo = settlement.toUser === 'You'

  return (
    <div className="relative min-h-screen">
      <div className="orb-bg" aria-hidden="true"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>
      <header className="nav-glass sticky top-0 z-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/groups/${settlement.groupId}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary-glow transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-foreground to-primary-glow -webkit-bg-clip-text -webkit-text-fill-transparent bg-clip-text">Settlement Details</h1>
                <p className="text-xs text-muted-foreground">{settlement.groupName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary-glow/10"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent className="glass-strong" align="end" forceMount>
                  <DropdownMenuItem asChild><Link href={`/settlements/${settlement.id}/edit`} className="flex w-full items-center gap-2"><Edit className="h-4 w-4" />Edit</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={copyLink} className="flex w-full items-center gap-2 cursor-pointer"><Copy className="h-4 w-4" />Copy Link</DropdownMenuItem>
                  <DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-6 animate-slide-up">
          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background: isYouFrom ? 'linear-gradient(135deg, var(--destructive-glow), var(--destructive))' : isYouTo ? 'linear-gradient(135deg, var(--success-glow), var(--primary-glow))' : 'linear-gradient(135deg, var(--primary-glow), var(--accent))'}}><ArrowRightLeft className="h-8 w-8 text-primary" /></div>
                  <div>
                    <h2 className="text-2xl font-bold">{settlement.fromUser} → {settlement.toUser}</h2>
                    <p className="text-muted-foreground">{settlement.groupName} • {new Date(settlement.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-3xl font-bold ${isYouFrom ? 'text-destructive-glow' : isYouTo ? 'text-success-glow' : 'text-gradient'}`}>{isYouFrom ? '-' : '+'}{formatCurrency(settlement.amount, settlement.currency)}</p>
                  <Badge variant={cfg.variant} className={`gap-1 ${cfg.bg} border-${cfg.variant === 'success' ? 'success' : cfg.variant === 'warning' ? 'warning' : 'destructive'}/20`}><cfg.icon className="h-3 w-3" />{settlement.status}</Badge>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-xl bg-primary-glow/5 border border-glass-border"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />Date</div><p className="font-semibold">{new Date(settlement.date).toLocaleDateString()}</p></div>
                <div className="p-4 rounded-xl bg-primary-glow/5 border border-glass-border"><div className="flex items-center gap-2 text-sm text-muted-foreground"><CreditCard className="h-4 w-4" />Method</div><p className="font-semibold">{settlement.method || 'Not specified'}</p></div>
                <div className="p-4 rounded-xl bg-primary-glow/5 border border-glass-border"><div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" />Amount</div><p className="font-semibold text-gradient">{formatCurrency(settlement.amount, settlement.currency)}</p></div>
                <div className="p-4 rounded-xl bg-primary-glow/5 border border-glass-border"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" />Status</div><p className={`font-semibold ${cfg.color}`}>{settlement.status}</p></div>
              </div>
              {settlement.reference && (
                <div className="mt-4 p-4 rounded-xl bg-primary-glow/5 border border-glass-border">
                  <p className="text-sm text-muted-foreground mb-1">Reference</p>
                  <p>{settlement.reference}</p>
                </div>
              )}
              {settlement.notes && (
                <div className="mt-4 p-4 rounded-xl bg-primary-glow/5 border border-glass-border">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p>{settlement.notes}</p>
                </div>
              )}
              {settlement.completedAt && settlement.status === 'COMPLETED' && (
                <div className="mt-4 p-4 rounded-xl bg-success-glow/5 border border-success-glow/20">
                  <p className="text-sm text-success-glow mb-1 flex items-center gap-1"><Check className="h-3.5 w-3.5" />Completed on {new Date(settlement.completedAt).toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader><CardTitle className="flex items-center gap-2"><ArrowRightLeft className="h-5 w-5 text-primary-glow" />Payment Flow</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-6 py-4">
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-2"><AvatarFallback className="text-lg font-medium bg-gradient-to-br from-primary-glow to-accent text-primary">{settlement.fromUser[0]}</AvatarFallback></Avatar>
                  <p className="font-medium">{settlement.fromUser}</p>
                  <p className="text-sm text-muted-foreground">Payer</p>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowRightLeft className="h-8 w-8 text-primary-glow rotate-90" />
                  <p className="text-sm text-muted-foreground mt-1">{formatCurrency(settlement.amount, settlement.currency)}</p>
                </div>
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-2"><AvatarFallback className="text-lg font-medium bg-gradient-to-br from-success-glow to-primary-glow text-primary">{settlement.toUser[0]}</AvatarFallback></Avatar>
                  <p className="font-medium">{settlement.toUser}</p>
                  <p className="text-sm text-muted-foreground">Receiver</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/settlements/${settlement.id}/edit`}><Button variant="outline" className="btn-gradient-secondary w-full justify-center gap-2"><Edit className="h-4 w-4" />Edit Settlement</Button></Link>
              <Button variant="outline" className="btn-gradient-secondary w-full justify-center gap-2" onClick={copyLink}><Copy className="h-4 w-4" />Copy Link</Button>
              <Link href={`/groups/${settlement.groupId}`}><Button variant="ghost" className="w-full justify-center gap-2"><ArrowLeft className="h-4 w-4" />Back to Group</Button></Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}