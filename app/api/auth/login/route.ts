import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Логин и пароль обязательны' },
        { status: 400 }
      )
    }

    const result = verifyCredentials(username, password)
    
    if (result.success) {
      const session = createSession()
      const response = NextResponse.json({ success: true })
      
      // Устанавливаем cookie с сессией
      response.cookies.set('admin_session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 дней
      })
      
      return response
    }

    return NextResponse.json(
      { success: false, message: result.message || 'Неверный логин или пароль' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

