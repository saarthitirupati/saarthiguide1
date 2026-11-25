import { NextResponse } from 'next/server';

const HOTEL_ADMIN_EMAIL = process.env.HOTEL_ADMIN_EMAIL || 'saarthihoteladmin@saarthiguide.in';
const HOTEL_ADMIN_PASSWORD = process.env.HOTEL_ADMIN_PASSWORD || 'Saarthihotel@2026';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (email !== HOTEL_ADMIN_EMAIL.toLowerCase() || password !== HOTEL_ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid Hotel Admin ID or password.' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      success: true,
      token: 'saarthi_hotel_admin_2026',
    });

    res.cookies.set('saarthi_hotel_admin', 'authenticated', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });

    return res;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('saarthi_hotel_admin', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });
  return res;
}
