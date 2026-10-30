'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Plus, Users, CreditCard, ArrowRightLeft, MoreVertical, Edit, Trash2, Settings, Zap, Activity, Shield, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

const mockGroups = [
  {
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
      { id: '1', name: 'You', email: 'you@example.com', avatar: null },
      { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', avatar: null },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: null },
      { id: '4', name: 'Emma Davis', email: 'emma@example.com', avatar: null },
    ],
  },
  {
    id: '2',
    name: 'Tokyo Trip 2024',
    description: 'Flights, hotels, food, activities',
    currency: 'JPY',
    memberCount: 3,
    expenseCount: 47,
    totalExpenses: 345000,
    yourBalance: 15000,
    createdAt: '2024-03-20',
    members: [
      { id: '1', name: 'You', email: 'you@example.com', avatar: null },
      { id: '2', name: 'Alex Kim', email: 'alex@example.com', avatar: null },
      { id: '3', name: 'Jordan Lee', email: 'jordan@example.com', avatar: null },
    ],
  },
  {
    id: '3',
    name: 'Weekend Cabin',
    description: 'Cabin rental, food, supplies',
    currency: 'USD',
    memberCount: 6,
    expenseCount: 12,
    totalExpenses: 890.00,
    yourBalance: 0,
    createdAt: '2024-06-10',
    members: [
      { id: '1', name: 'You', email: 'you@example.com', avatar: null },
      { id: '2', name: 'Chris', email: 'chris@example.com', avatar: null },
      { id: '3', name: 'Pat', email: 'pat@example.com', avatar: null },
      { id: '4', name: 'Sam', email: 'sam@example.com', avatar: null },
      { id: '5', name: 'Alex', email: 'alex2@example.com', avatar: null },
      { id: '6', name: 'Taylor', email: 'taylor@example.com', avatar: null },
    ],
  },
]

export default function GroupsPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="orb-bg" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-glow/30 border-t-primary-glow" />
          <p className="text-muted-foreground">Loading groups...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="relative min-h-screen">
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
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-gradient">
                <Activity className="h-6 w-6" />
                BillSplit
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {[
                  { href: '/dashboard', label: 'Dashboard' },
                  { href: '/groups', label: 'Groups', active: true },
                  { href: '/expenses', label: 'Expenses' },
                  { href: '/settlements', label: 'Settlements' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-3 py-2 rounded-xl text-sm font-medium transition-all',
                      item.active
                        ? 'text-foreground bg-primary-glow/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-primary-glow/10'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <Link href="/groups/new">
              <Button className="btn-gradient gap-2 hidden sm:inline-flex">
                <Plus className="h-4 w-4" />
                New Group
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary-glow to-accent -webkit-bg-clip-text -webkit-text-fill-transparent bg-clip-text">
                Your Groups
              </h1>
              <p className="mt-1 text-muted-foreground">Manage and track all your shared expenses</p>
            </div>
            <Link href="/groups/new">
              <Button className="btn-gradient gap-2">
                <Plus className="h-4 w-4" />
                Create Group
              </Button>
            </Link>
          </div>
        </div>

        {/* Groups Grid */}
        {mockGroups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockGroups.map((group, i) => (
              <Card key={group.id} className="card-glass group-hover:border-primary-glow/50 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] animate-slide-up" style={{animationDelay: `${i * 0.05}s`}}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary-glow/10">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-strong" align="end" forceMount>
                        <DropdownMenuItem asChild>
                          <Link href={`/groups/${group.id}`} className="flex w-full items-center gap-2">
                            <Settings className="h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/groups/${group.id}/edit`} className="flex w-full items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Group
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/expenses/new?groupId=${group.id}`} className="flex w-full items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Add Expense
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/settlements?groupId=${group.id}`} className="flex w-full items-center gap-2">
                            <ArrowRightLeft className="h-4 w-4" />
                            Settlements
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Members */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">{group.memberCount} members</span>
                    </div>
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((member, idx) => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-background ring-1 ring-glass-border">
                          <AvatarImage src={member.avatar || ''} alt={member.name} />
                          <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary-glow to-accent text-primary">
                            {member.name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.memberCount > 4 && (
                        <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-glass-border bg-primary-glow/10">
                          <AvatarFallback className="text-xs font-medium text-primary-glow">
                            +{group.memberCount - 4}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-glass-border">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gradient">{group.expenseCount}</div>
                      <div className="text-xs text-muted-foreground">Expenses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{group.currency} {group.totalExpenses.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-bold ${group.yourBalance >= 0 ? 'text-success-glow' : 'text-destructive-glow'}`}>
                        {group.yourBalance >= 0 ? '+' : ''}{group.currency === 'JPY' ? '' : '$'}{group.yourBalance.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Your Balance</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/groups/${group.id}`} className="flex-1">
                      <Button variant="outline" className="btn-gradient-secondary w-full justify-center">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/expenses/new?groupId=${group.id}`} className="flex-1">
                      <Button className="btn-gradient w-full justify-center gap-1">
                        <CreditCard className="h-3.5 w-3.5" />
                        Add Expense
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-glass animate-slide-up">
            <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-glow/10">
                <Users className="h-8 w-8 text-primary-glow" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No groups yet</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">Create your first group to start splitting expenses with friends, roommates, or travel buddies.</p>
              <Link href="/groups/new">
                <Button className="btn-gradient gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Group
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <div className="mt-12 grid gap-4 md:grid-cols-3 animate-slide-up">
          {[
            { icon: Zap, title: 'Smart Splitting', desc: 'Equal, percentage, exact amounts, or custom shares — handles any scenario.' },
            { icon: Settings, title: 'Recurring Expenses', desc: 'Set up rent, subscriptions, utilities on auto-pilot.' },
            { icon: Activity, title: 'Real-time Sync', desc: 'Changes appear instantly for all group members across devices.' },
          ].map((tip, i) => (
            <Card key={tip.title} className="card-glass p-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-glow/10">
                <tip.icon className="h-6 w-6 text-primary-glow" />
              </div>
              <h3 className="font-semibold mb-1">{tip.title}</h3>
              <p className="text-sm text-muted-foreground">{tip.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}