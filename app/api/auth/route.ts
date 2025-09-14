import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (username === adminUser && password === adminPass) {
    // Set a simple cookie for session (expires in 1 day)
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_auth', 'true', { httpOnly: true, maxAge: 60 * 60 * 24 });
    return res;
  }
  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
