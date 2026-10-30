import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSettlementSchema = z.object({
  groupId: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  amount: z.number().positive(),
  method: z.string().optional(),
  reference: z.string().max(100).optional(),
}).refine(data => data.fromUserId !== data.toUserId, {
  message: 'Payer and receiver cannot be the same person',
  path: ['toUserId'],
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createSettlementSchema.parse(body)

    // Verify both users are members of the group
    const [fromMember, toMember] = await Promise.all([
      prisma.groupMember.findUnique({ where: { groupId_userId: { groupId: data.groupId, userId: data.fromUserId } } }),
      prisma.groupMember.findUnique({ where: { groupId_userId: { groupId: data.groupId, userId: data.toUserId } } }),
    ])

    if (!fromMember || !toMember) {
      return NextResponse.json({ message: 'Both users must be members of the group' }, { status: 403 })
    }

    const settlement = await prisma.settlement.create({
      data: {
        groupId: data.groupId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        amount: data.amount,
        status: 'COMPLETED',
        method: data.method,
        reference: data.reference,
        completedAt: new Date(),
      },
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        toUser: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, currency: true } },
      },
    })

    return NextResponse.json(settlement, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 })
    }
    console.error('Create settlement error:', error)
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

    const settlements = await prisma.settlement.findMany({
      where,
      include: {
        fromUser: { select: { id: true, name: true, email: true, image: true } },
        toUser: { select: { id: true, name: true, email: true, image: true } },
        group: { select: { id: true, name: true, currency: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(settlements)
  } catch (error) {
    console.error('Get settlements error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}