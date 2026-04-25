import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === 'Ramanmankotia' && password === 'Mahadev@24') {
      const response = NextResponse.json({ success: true });
      
      // Setting cookie directly on the response object is more reliable for immediate redirects
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: true, // Most modern browsers require secure for cross-site but it's fine for same-site HTTPS
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
