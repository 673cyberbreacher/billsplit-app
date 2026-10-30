'use client'

import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, CreditCard, ArrowRightLeft, MoreVertical, Edit, Trash2, Settings, ArrowLeft, Zap, Activity, DollarSign, Receipt, UserPlus, Mail, Copy, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useState } from 'react'

const mockGroup = {
  id: '1',
  name: 'Apartment Roommates',
  description: 'Monthly rent, utilities, groceries',
  currency: 'USD',
  memberCount: 4,
  expenseCount: 23,
  totalExpenses: 2450.00,
  yourBalance: -120.50,
  createdAt: '2024-01-15',
  members: [
    { id: '1', name: 'You', email: 'you@example.com', avatar: null, role: 'ADMIN', balance: -120.50 },
    { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', avatar: null, role: 'MEMBER', balance: 45.00 },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: null, role: 'MEMBER', balance: 35.50 },
    { id: '4', name: 'Emma Davis', email: 'emma@example.com', avatar: null, role: 'MEMBER', balance: 40.00 },
  ],
  expenses: [
    { id: '1', description: 'May Rent', amount: 1800, category: 'UTILITIES', splitType: 'EQUAL', date: '2024-05-01', paidBy: 'You', shares: { 'You': 450, 'Sarah Chen': 450, 'Mike Johnson': 450, 'Emma Davis': 450 } },
    { id: '2', description: 'Electricity Bill', amount: 120, category: 'UTILITIES', splitType: 'EQUAL', date: '2024-05-05', paidBy: 'Sarah Chen', shares: { 'You': 30, 'Sarah Chen': 30, 'Mike Johnson': 30, 'Emma Davis': 30 } },
    { id: '3', description: 'Groceries', amount: 85.50, category: 'FOOD', splitType: 'EXACT', date: '2024-05-10', paidBy: 'Mike Johnson', shares: { 'You': 25.50, 'Sarah Chen': 20, 'Mike Johnson': 20, 'Emma Davis': 20 } },
    { id: '4', description: 'Internet', amount: 65, category: 'UTILITIES', splitType: 'EQUAL', date: '2024-05-15', paidBy: 'Emma Davis', shares: { 'You': 16.25, 'Sarah Chen': 16.25, 'Mike Johnson': 16.25, 'Emma Davis': 16.25 } },
    { id: '5', description: 'Dinner Out', amount: 140, category: 'ENTERTAINMENT', splitType: 'PERCENTAGE', date: '2024-05-20', paidBy: 'You', shares: { 'You': 35, 'Sarah Chen': 35, 'Mike Johnson': 35, 'Emma Davis': 35 } },
  ],
  settlements: [
    { id: '1', fromUser: 'Sarah Chen', toUser: 'You', amount: 50, status: 'COMPLETED', date: '2024-05-10' },
    { id: '2', fromUser: 'Mike Johnson', toUser: 'You', amount: 70.50, status: 'PENDING', date: '2024-05-25' },
  ]
}

const categoryIcons: Record<string, any> = {
  FOOD: '🍔', TRANSPORT: '🚌', ENTERTAINMENT: '🎮', UTILITIES: '⚡', SHOPPING: '🛍️', HEALTH: '💊', TRAVEL: '✈️', OTHER: '📦'
}

const categoryColors: Record<string, string> = {
  FOOD: 'from-orange-500 to-orange-600', TRANSPORT: 'from-blue-500 to-blue-600', ENTERTAINMENT: 'from-purple-500 to-purple-600', UTILITIES: 'from-yellow-500 to-yellow-600', SHOPPING: 'from-pink-500 to-pink-600', HEALTH: 'from-green-500 to-green-600', TRAVEL: 'from-cyan-500 to-cyan-600', OTHER: 'from-gray-500 to-gray-600'
}

export default function GroupDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const groupId = params.id as string
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  if (status === 'loading') {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="orb-bg" aria-hidden="true"><div className="orb orb-1" /><div className="orb orb-2" /></div>
        <div className="relative z-10 flex flex-col items-center gap-4"><div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-glow/30 border-t-primary-glow" /><p className="text-muted-foreground">Loading group...</p></div>
      </div>
    )
  }

  if (!session) return null

  const group = mockGroup
  const currentUser = session.user

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: group.currency }).format(amount)
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive', icon: any }> = {
      COMPLETED: { variant: 'success', icon: Check },
      PENDING: { variant: 'warning', icon: () => null },
      CANCELLED: { variant: 'destructive', icon: X },
    }
    const b = badges[status] || badges.PENDING
    return <Badge variant={b.variant} className="gap-1">{b.icon && <b.icon className="h-3 w-3" />}{status}</Badge>
  }

  const handleInvite = async () => {
    if (!inviteEmail) return
    toast.success(`Invite sent to ${inviteEmail}`)
    setShowInvite(false)
    setInviteEmail('')
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${groupId}`)
    toast.success('Invite link copied!')
  }

  return (
    <div className="relative min-h-screen">
      {/* Orb Background */}
      <div className="orb-bg" aria-hidden="true">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      </div>

      {/* Navigation */}
      <header className="nav-glass sticky top-0 z-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/groups" className="flex items-center gap-2 text-muted-foreground hover:text-primary-glow transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-foreground to-primary-glow -webkit-bg-clip-text -webkit-text-fill-transparent bg-clip-text">{group.name}</h1>
                <p className="text-xs text-muted-foreground">{group.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="btn-gradient-secondary" onClick={copyInviteLink}>
                <Copy className="mr-2 h-4 w-4" /> Invite Link
              </Button>
              <Button className="btn-gradient gap-2" onClick={() => setShowInvite(true)}>
                <UserPlus className="h-4 w-4" /> Invite
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        {/* Group Header Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4 animate-slide-up">
          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">{formatCurrency(group.totalExpenses)}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-glow to-accent flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <p className={`text-2xl font-bold ${group.yourBalance >= 0 ? 'text-success-glow' : 'text-destructive-glow'}`}>
                    {group.yourBalance >= 0 ? '+' : ''}{formatCurrency(group.yourBalance)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success-glow to-primary-glow flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-2xl font-bold">{group.memberCount}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent-glow to-orb-3 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="text-2xl font-bold">{group.expenseCount}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orb-3 to-orb-4 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="expenses" className="animate-slide-up delay-1">
          <TabsList className="glass-strong bg-glass/50">
            <TabsTrigger value="expenses" className="px-4 py-2 data-[state=active]:bg-primary-glow/20 data-[state=active]:text-primary-glow">
              <Receipt className="mr-2 h-4 w-4" /> Expenses ({group.expenses.length})
            </TabsTrigger>
            <TabsTrigger value="members" className="px-4 py-2 data-[state=active]:bg-primary-glow/20 data-[state=active]:text-primary-glow">
              <Users className="mr-2 h-4 w-4" /> Members ({group.memberCount})
            </TabsTrigger>
            <TabsTrigger value="settlements" className="px-4 py-2 data-[state=active]:bg-primary-glow/20 data-[state=active]:text-primary-glow">
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Settlements ({group.settlements.length})
            </TabsTrigger>
            <TabsTrigger value="balances" className="px-4 py-2 data-[state=active]:bg-primary-glow/20 data-[state=active]:text-primary-glow">
              <DollarSign className="mr-2 h-4 w-4" /> Balances
            </TabsTrigger>
          </TabsList>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Expenses</h2>
              <Link href={`/expenses/new?groupId=${groupId}`}>
                <Button className="btn-gradient gap-2 sm:px-4">
                  <Plus className="h-4 w-4" /> Add Expense
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {group.expenses.map((expense) => (
                <Card key={expense.id} className="card-glass p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background: `linear-gradient(135deg, var(--tw-gradient-from, ${categoryColors[expense.category].split(' ')[1]}) , var(--tw-gradient-to, ${categoryColors[expense.category].split(' ')[3]})`}}>
                        {categoryIcons[expense.category]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{expense.description}</h3>
                          <Badge variant="outline" className="text-xs">{expense.splitType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Paid by {expense.paidBy} • {new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-gradient">{formatCurrency(expense.amount)}</p>
                      <p className="text-xs text-muted-foreground">Your share: {formatCurrency((expense.shares as any)[currentUser.name || 'You'] || 0)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Group Members</h2>
              <Button className="btn-gradient gap-2" onClick={() => setShowInvite(true)}>
                <UserPlus className="h-4 w-4" /> Invite Member
              </Button>
            </div>
            <div className="space-y-3">
              {group.members.map((member) => (
                <Card key={member.id} className="card-glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || ''} alt={member.name} />
                        <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary-glow to-accent text-primary">
                          {member.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{member.name}</h3>
                          {member.id === '1' && <Badge variant="default" className="text-xs">You</Badge>}
                          {member.role === 'ADMIN' && <Badge variant="outline" className="text-xs">Admin</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${member.balance >= 0 ? 'text-success-glow' : 'text-destructive-glow'}`}>
                        {member.balance >= 0 ? '+' : ''}{formatCurrency(member.balance)}
                      </p>
                      <p className="text-xs text-muted-foreground">Balance</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settlements Tab */}
          <TabsContent value="settlements" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settlements</h2>
              <Link href={`/settlements/new?groupId=${groupId}`}>
                <Button className="btn-gradient gap-2">
                  <Plus className="h-4 w-4" /> Record Payment
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {group.settlements.map((settlement) => (
                <Card key={settlement.id} className="card-glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <ArrowRightLeft className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{settlement.fromUser} → {settlement.toUser}</p>
                        <p className="text-sm text-muted-foreground">{new Date(settlement.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-gradient">{formatCurrency(settlement.amount)}</p>
                      {getStatusBadge(settlement.status)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Balances Tab */}
          <TabsContent value="balances" className="mt-6">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Balance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-primary-glow/5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary-glow to-accent text-primary">
                            {member.name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name} {member.id === '1' && <Badge variant="default" className="ml-2 text-xs">You</Badge>}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${member.balance >= 0 ? 'text-success-glow' : 'text-destructive-glow'}`}>
                          {member.balance >= 0 ? 'Gets back' : 'Owes'}: {formatCurrency(Math.abs(member.balance))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="card-glass-strong w-full max-w-md">
            <CardHeader>
              <CardTitle>Invite Member</CardTitle>
              <CardDescription>Enter their email to send an invite link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="friend@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="input-glass"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="btn-gradient-secondary flex-1" onClick={() => setShowInvite(false)}>Cancel</Button>
                <Button className="btn-gradient flex-1" onClick={handleInvite} disabled={!inviteEmail}>
                  <Mail className="mr-2 h-4 w-4" /> Send Invite
                </Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={copyInviteLink}>
                <Copy className="mr-2 h-4 w-4" /> Copy Invite Link Instead
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}