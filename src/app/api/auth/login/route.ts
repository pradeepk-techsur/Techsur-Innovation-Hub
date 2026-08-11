import { NextResponse } from 'next/server';
import { getAuthProvider } from '@/lib/auth/provider';
import { createSession, setSessionCookie } from '@/lib/auth/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  // Dev mode: body.role = 'stakeholder'|'curator'|'admin'
  // Production: body.credential = OIDC token or other provider credential
  const credential = body.role ?? body.credential ?? 'stakeholder';

  const provider = getAuthProvider();
  const user = await provider.authenticate(credential);

  if (!user) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }

  const token = await createSession(user);
  const response = NextResponse.json({
    ok: true,
    user: { name: user.name, email: user.email, office: user.office, role: user.role },
  });
  setSessionCookie(response, token);
  return response;
}
