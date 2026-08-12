'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.75)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 12px',
        minHeight: '44px',
        borderRadius: 'var(--radius-control)',
        transition: 'color 100ms',
        textDecoration: 'underline',
      }}
      type="button"
    >
      Sign Out
    </button>
  );
}
