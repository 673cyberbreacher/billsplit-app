import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createExpenseSchema = z.object({
  groupId: z.string(),
  description: z.string().min(2).max(100),
  amount: z.number().positive(),
  currency: z.string().length(3),
  category: z.enum(['FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'UTILITIES', 'SHOPPING', 'HEALTH', 'TRAVEL', 'OTHER']),
  splitType: z.enum(['EQUAL', 'PERCENTAGE', 'EXACT', 'SHARES']),
  date: z.string(),
  notes: z.string().max(500).optional(),
  receiptUrl: z.string().url().optional().nullable(),
  shares: z.array(z.object({
    userId: z.string(),
    userName: z.string(),
    amount: z.number().optional(),
    percentage: z.number().optional(),
    shares: z.number().optional(),
  })).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createExpenseSchema.parse(body)

    // Verify user is member of group
    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId: data.groupId, userId: session.user.id } },
    })
    if (!membership) {
      return NextResponse.json({ message: 'Not a member of this group' }, { status: 403 })
    }

    // Create expense with shares
    const expense = await prisma.expense.create({
      data: {
        groupId: data.groupId,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        category: data.category,
        splitType: data.splitType,
        date: new Date(data.date),
        paidById: session.user.id,
        notes: data.notes,
        receiptUrl: data.receiptUrl,
        shares: {
          create: data.shares?.map(s => ({
            userId: s.userId,
            amount: s.amount || 0,
            percentage: s.percentage,
            shares: s.shares,
          })) || [],
        },
      },
      include: {
        shares: { include: { user: { select: { id: true, name: true, email: true } } } },
        paidBy: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, currency: true } },
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 })
    }
    console.error('Create expense error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get('groupId')

    const where: any = {
      group: { members: { some: { userId: session.user.id } } },
    }
    if (groupId) where.groupId = groupId

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        shares: { include: { user: { select: { id: true, name: true, email: true } } } },
        paidBy: { select: { id: true, name: true, email: true, image: true } },
        group: { select: { id: true, name: true, currency: true } },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Get expenses error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}