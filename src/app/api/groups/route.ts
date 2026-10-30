import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createGroupSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  currency: z.string().length(3),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, currency } = createGroupSchema.parse(body)

    const group = await prisma.group.create({
      data: {
        name,
        description,
        currency,
        createdBy: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'ADMIN',
          },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, image: true } } },
        },
      },
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
    }
    console.error('Create group error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const groups = await prisma.group.findMany({
      where: {
        members: { some: { userId: session.user.id } },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, image: true } } },
        },
        expenses: { select: { id: true, amount: true, currency: true } },
        _count: { select: { expenses: true, members: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Calculate balances for each group
    const groupsWithBalances = await Promise.all(
      groups.map(async (group) => {
        const expenses = await prisma.expense.findMany({
          where: { groupId: group.id },
          include: { shares: true, paidBy: { select: { id: true, name: true } } },
        })

        const settlements = await prisma.settlement.findMany({
          where: { groupId: group.id },
        })

        // Calculate user's balance
        let yourBalance = 0
        for (const expense of expenses) {
          const share = expense.shares.find(s => s.userId === session.user.id)
          if (share) {
            yourBalance += Number(share.amount)
          }
          if (expense.paidById === session.user.id) {
            yourBalance -= Number(expense.amount)
          }
        }
        for (const settlement of settlements) {
          if (settlement.fromUserId === session.user.id) yourBalance += Number(settlement.amount)
          if (settlement.toUserId === session.user.id) yourBalance -= Number(settlement.amount)
        }

        return {
          ...group,
          totalExpenses: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
          yourBalance,
        }
      })
    )

    return NextResponse.json(groupsWithBalances)
  } catch (error) {
    console.error('Get groups error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}