'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, Users, CreditCard, ArrowRightLeft, LogOut, Bell, Settings, TrendingUp, ArrowUpRight, Activity, Zap, Shield, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
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
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const user = session.user

  const stats = [
    { label: 'Total Groups', value: '0', icon: Users, color: 'from-primary-glow to-accent', trend: '+12%' },
    { label: 'Total Expenses', value: '$0.00', icon: CreditCard, color: 'from-success-glow to-primary-glow', trend: '+8%' },
    { label: 'You Owe', value: '$0.00', icon: ArrowRightLeft, color: 'from-destructive-glow to-warning-glow', trend: 'All settled' },
    { label: 'Owed to You', value: '$0.00', icon: TrendingUp, color: 'from-accent-glow to-orb-3', trend: 'Nothing pending' },
  ]

  const quickActions = [
    { href: '/groups/new', icon: Plus, title: 'Create Group', desc: 'Start a new group for sharing expenses', color: 'from-primary-glow to-accent' },
    { href: '/expenses/new', icon: CreditCard, title: 'Add Expense', desc: 'Log a new shared expense', color: 'from-success-glow to-primary-glow' },
    { href: '/groups', icon: Users, title: 'View Groups', desc: 'Manage your groups and members', color: 'from-accent-glow to-orb-3' },
    { href: '/settlements', icon: ArrowRightLeft, title: 'Settlements', desc: 'View and record payments', color: 'from-orb-3 to-orb-4' },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Orb Background */}
      <div className="orb-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
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
                  { href: '/groups', label: 'Groups' },
                  { href: '/expenses', label: 'Expenses' },
                  { href: '/settlements', label: 'Settlements' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary-glow/10 transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-primary-glow/10 transition-all">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  3
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-xl">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image || ''} alt={user.name || ''} />
                      <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary-glow to-accent text-primary">
                        {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-strong" align="end" forceMount>
                  <div className="p-2 border-b border-glass-border">
                    <p className="px-3 py-1 text-sm font-medium">{user.name}</p>
                    <p className="px-3 py-1 text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex w-full items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <form action="/api/auth/signout" method="POST">
                      <button type="submit" className="flex w-full items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        {/* Welcome Section */}
        <div className="mb-10 animate-slide-up">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary-glow to-accent -webkit-bg-clip-text -webkit-text-fill-transparent bg-clip-text">
            Welcome back, {user.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="mt-1 text-muted-foreground">Here&apos;s an overview of your groups and expenses.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {stats.map((stat, i) => (
            <Link key={stat.label} href={stat.label === 'Total Groups' ? '/groups' : stat.label === 'Total Expenses' ? '/expenses' : '/settlements'} className="group">
              <Card className="card-glass group-hover:border-primary-glow/50 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br" style={{background: `linear-gradient(135deg, var(--tw-gradient-from, ${stat.color.split(' ')[1]}) , var(--tw-gradient-to, ${stat.color.split(' ')[3]})`}}>
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-success-glow flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10 animate-slide-up delay-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <Link href="/groups/new">
              <Button variant="ghost" size="sm" className="text-primary-glow hover:text-primary-glow hover:bg-primary-glow/10">
                <Plus className="mr-1.5 h-4 w-4" />
                New Group
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, i) => (
              <Link key={action.title} href={action.href} className="group">
                <Card className="card-glass h-full group-hover:border-primary-glow/50 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                  <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center">
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br" style={{background: `linear-gradient(135deg, var(--tw-gradient-from, ${action.color.split(' ')[1]}) , var(--tw-gradient-to, ${action.color.split(' ')[3]})`}}>
                      <action.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.desc}</p>
                    <div className="mt-4 flex items-center justify-center gap-1 text-xs text-primary-glow font-medium group-hover:translate-x-1 transition-transform">
                      <span>Get started</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity / Getting Started */}
        <Card className="card-glass animate-slide-up delay-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-glow" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-glow/10">
                <Activity className="h-8 w-8 text-primary-glow" />
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">No activity yet. Create your first group to start splitting expenses with friends.</p>
              <Link href="/groups/new">
                <Button className="btn-gradient gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Group
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="mt-10 grid gap-4 md:grid-cols-3 animate-slide-up delay-3">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Real-time sync across all devices. Changes appear instantly for everyone.' },
            { icon: Shield, title: 'Secure & Private', desc: 'Bank-grade encryption. Your financial data never leaves your control.' },
            { icon: Globe, title: 'Global Ready', desc: '150+ currencies with live rates. Perfect for international trips.' },
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