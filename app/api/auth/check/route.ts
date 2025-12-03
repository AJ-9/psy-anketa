import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session')?.value
    
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const isAuthenticated = verifySession(session)
    
    return NextResponse.json({ authenticated: isAuthenticated })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

