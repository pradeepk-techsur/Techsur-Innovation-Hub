'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props { returnTo: string; }

export function LoginForm({ returnTo }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<'stakeholder' | 'curator' | 'admin'>('stakeholder');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      router.push(returnTo);
      router.refresh();
    } else {
      setError('Sign in failed. Please try again.');
    }
    setLoading(false);
  }

  // Dev mode: show role selector
  // Production: replace with OIDC redirect button
  const isDevMode = process.env.NODE_ENV !== 'production';

  return (
    <form onSubmit={handleSubmit}>
      {isDevMode && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
          Development mode — select a role to sign in as.
          <select
            value={role}
            onChange={e => setRole(e.target.value as typeof role)}
            className="block mt-2 w-full border rounded px-2 py-1"
            aria-label="Development role"
          >
            <option value="stakeholder">Stakeholder (submit/engage)</option>
            <option value="curator">Curator (manage records)</option>
            <option value="admin">Admin (settings)</option>
          </select>
        </div>
      )}
      {error && (
        <p role="alert" className="text-red-600 text-sm mb-4">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
