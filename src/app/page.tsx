import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Users, CreditCard, ArrowRight, Shield, Zap, Sparkles, ArrowUpRight, Globe, Lock, ArrowRightLeft, Zap as ZapIcon } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Orb Background */}
      <div className="orb-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />
      </div>

      {/* Noise Overlay */}
      <div className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`}}
      />

      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="nav-glass sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gradient">
                <ZapIcon className="h-6 w-6" />
                BillSplit
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-medium hover:bg-primary-glow/10 hover:text-primary-glow transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="btn-gradient px-6 py-2.5 text-sm">
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-glow/10 px-4 py-1.5 text-sm font-medium text-primary-glow mb-8 animate-slide-up">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Split bills, not friendships — v2.0 with AI insights</span>
              </div>

              {/* Headline */}
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl animate-slide-up delay-1">
                The easiest way to{' '}
                <span className="text-gradient">split expenses</span>{' '}
                with friends
              </h1>

              <p className="mb-10 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up delay-2">
                Track shared expenses, settle up instantly, and never lose track of who owes what.
                Perfect for roommates, trips, dinners, and group events.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-3">
                <Link href="/register">
                  <Button className="btn-gradient px-8 py-3.5 text-base gap-3" style={{fontSize: '1.125rem'}}>
                    <span>Start Free — No Card Required</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="btn-gradient-secondary px-8 py-3.5 text-base" style={{fontSize: '1.125rem'}}>
                    Sign In to Dashboard
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground/60 animate-fade-in delay-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary-glow/50" />
                  <span>Bank-grade encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary-glow/50" />
                  <span>Global CDN</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZapIcon className="h-4 w-4 text-primary-glow/50" />
                  <span>Real-time sync</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center animate-slide-up">
              <span className="badge-glow mb-4 inline-block">Core Features</span>
              <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Everything you need to <span className="text-gradient">split bills</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Built for real-life sharing — flexible splits, recurring expenses, and instant settlements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,
                  title: 'Smart Groups',
                  desc: 'Create groups for roommates, trips, or events. Add members by email with role-based permissions.',
                  gradient: 'from-primary-glow to-accent',
                },
                {
                  icon: CreditCard,
                  title: 'Flexible Splitting',
                  desc: 'Split equally, by percentage, exact amounts, or custom shares. Handles any scenario effortlessly.',
                  gradient: 'from-success-glow to-primary-glow',
                },
                {
                  icon: Shield,
                  title: 'Instant Settlements',
                  desc: 'Track who owes whom, mark settlements complete, and keep a full audit trail with notifications.',
                  gradient: 'from-accent-glow to-orb-3',
                },
                {
                  icon: ZapIcon,
                  title: 'Recurring Expenses',
                  desc: 'Set up subscriptions, rent, utilities on auto-pilot. Never forget a shared payment again.',
                  gradient: 'from-warning-glow to-destructive-glow',
                },
                {
                  icon: Globe,
                  title: 'Multi-Currency',
                  desc: 'Support for 150+ currencies with live exchange rates. Perfect for international trips.',
                  gradient: 'from-orb-3 to-orb-4',
                },
                {
                  icon: Sparkles,
                  title: 'AI Insights',
                  desc: 'Smart spending analysis, settlement optimization, and predictive budgeting for your groups.',
                  gradient: 'from-primary-glow to-orb-4',
                },
              ].map((feature, i) => (
                <Link key={feature.title} href="/register" className="group">
                  <Card className="card-glass group-hover:border-primary-glow/50 group-hover:shadow-[0_0_60px_rgba(34,211,238,0.15)]">
                    <CardHeader>
                      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br" style={{background: `linear-gradient(to bottom right, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})`}}>
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 lg:py-28 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center animate-slide-up">
              <span className="badge-glow mb-4 inline-block">How It Works</span>
              <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Get started in <span className="text-gradient">3 simple steps</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', icon: Users, title: 'Create a group', desc: 'Set up a group for your apartment, trip, or event. Invite members via email — they\'ll get a magic link to join instantly.' },
                { step: '02', icon: CreditCard, title: 'Add expenses', desc: 'Log expenses as they happen. Choose split type: equal, percentage, exact amounts, or custom shares. Attach receipts.' },
                { step: '03', icon: ArrowRightLeft, title: 'Settle up', desc: 'See who owes what at a glance. Record payments via Venmo, CashApp, bank transfer. Everything balances automatically.' },
              ].map(({ step, icon: Icon, title, desc }, i) => (
                <div key={step} className="relative text-center card-glass p-8 animate-slide-up" style={{animationDelay: `${(i + 1) * 0.1}s`}}>
                  <div className="mb-4 flex items-center justify-center">
                    <span className="text-5xl font-bold bg-gradient-to-r from-primary-glow to-accent -webkit-bg-clip-text -webkit-text-fill-transparent bg-clip-text">
                      {step}
                    </span>
                  </div>
                  <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-glow/10">
                    <Icon className="h-7 w-7 text-primary-glow" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats / Social Proof */}
        <section className="py-20 lg:py-28 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { value: '50K+', label: 'Active Groups', icon: Users },
                { value: '$2.5M+', label: 'Expenses Tracked', icon: CreditCard },
                { value: '99.9%', label: 'Uptime', icon: ZapIcon },
                { value: '150+', label: 'Countries', icon: Globe },
              ].map((stat, i) => (
                <Card key={stat.label} className="card-glass text-center p-8 animate-slide-up" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-glow/10 mx-auto">
                    <stat.icon className="h-6 w-6 text-primary-glow" />
                  </div>
                  <div className="text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 relative">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="card-glass-strong p-10 md:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/10 via-transparent to-accent/10" />
              <div className="relative z-10">
                <span className="badge-glow mb-4 inline-block">Ready to start?</span>
                <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  Simplify <span className="text-gradient">shared expenses</span> today
                </h2>
                <p className="mb-8 text-lg text-muted-foreground max-w-xl mx-auto">
                  Join thousands of people who've stopped stressing over split bills. Free forever for personal use.
                </p>
                <Link href="/register">
                  <Button className="btn-gradient px-10 py-4 text-lg gap-3">
                    <span>Create Your First Group</span>
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-glass-border py-12 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gradient">
                <ZapIcon className="h-5 w-5" />
                BillSplit
              </Link>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-primary-glow transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-primary-glow transition-colors">Terms</Link>
                <Link href="/contact" className="hover:text-primary-glow transition-colors">Contact</Link>
              </div>
              <p className="text-xs text-muted-foreground/60">
                Built with Next.js 15, Prisma, NextAuth, Tailwind CSS & 💙
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}