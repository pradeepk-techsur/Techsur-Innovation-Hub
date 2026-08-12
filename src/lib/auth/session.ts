import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import type { AuthenticatedUser } from './provider';

export interface StakeholderSession {
  id: string;              // session UUID
  userId: string;
  name: string;            // AUTH-10: required for submission attribution
  office: string;          // AUTH-10: required for submission attribution
  email: string;           // AUTH-10: required for submission attribution
  role: 'stakeholder' | 'curator' | 'admin';
  expiresAt: number;       // Unix timestamp
}

const SESSION_COOKIE = 'tsio_hub_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;  // 8 hours

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be at least 32 characters (SEC-08)');
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(user: AuthenticatedUser): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;

  const token = await new SignJWT({
    sessionId,
    userId: user.id,
    name: user.name,
    office: user.office,
    email: user.email,
    role: user.role,
    expiresAt,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());

  return token;
}

export async function getSession(): Promise<StakeholderSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: payload.sessionId as string,
      userId: payload.userId as string,
      name: payload.name as string,
      office: payload.office as string,
      email: payload.email as string,
      role: payload.role as StakeholderSession['role'],
      expiresAt: payload.expiresAt as number,
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,                              // prevents JS access (SEC-08)
    secure: true,          // Required when sameSite='none'; always on for preview proxy
    sameSite: 'none',      // Allow cross-site/cross-origin preview proxy delivery
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 0,
    path: '/',
  });
}
