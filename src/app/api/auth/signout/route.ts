import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  await auth.api.signOut()
  return NextResponse.json({ success: true })
}