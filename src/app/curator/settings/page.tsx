'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

// Note: Admin-only guard is implemented server-side via the API (returns 403 for non-admins).
// For the page itself, we detect the 403 and redirect curators away.

interface HubSetting {
  value: string;
  type: string;
  description: string | null;
  updatedAt: string | null;
}

interface SettingsMap {
  [key: string]: HubSetting;
}

// Ordered display list of known settings
const KNOWN_SETTINGS = [
  {
    key: 'engagement_routing_address',
    label: 'Engagement Routing Address',
    hint: 'Email address where engagement requests are routed.',
    inputType: 'email',
  },
  {
    key: 'engagement_routing_display_name',
    label: 'Routing Display Name',
    hint: 'Display name for the routing address.',
    inputType: 'text',
  },
  {
    key: 'engagement_rate_limit_per_hour',
    label: 'Engagement Rate Limit (per hour)',
    hint: 'Maximum engagement requests per IP per hour.',
    inputType: 'number',
  },
  {
    key: 'submission_rate_limit_per_hour',
    label: 'Submission Rate Limit (per hour)',
    hint: 'Maximum opportunity/contribution submissions per IP per hour.',
    inputType: 'number',
  },
  {
    key: 'hub_display_name',
    label: 'Hub Display Name',
    hint: 'The public-facing name of this hub.',
    inputType: 'text',
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saveMessages, setSaveMessages] = useState<Record<string, { type: 'success' | 'error'; text: string }>>({});

  useEffect(() => {
    void (async () => {
      const res = await fetch('/api/v1/curator/settings');
      if (res.status === 403) {
        setAccessDenied(true);
        router.push('/unauthorized');
        return;
      }
      const data = await res.json();
      if (data.status === 'ok') {
        setSettings(data.data as SettingsMap);
        // Initialize edit values from current settings
        const initial: Record<string, string> = {};
        for (const [key, val] of Object.entries(data.data as SettingsMap)) {
          initial[key] = val.value;
        }
        setEditValues(initial);
      }
      setLoading(false);
    })();
  }, [router]);

  async function saveSetting(key: string) {
    setSaving(key);
    setSaveMessages((m) => ({ ...m, [key]: { type: 'success', text: '' } }));
    try {
      const res = await fetch(`/api/v1/curator/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: editValues[key] }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setSaveMessages((m) => ({ ...m, [key]: { type: 'success', text: '✓ Saved successfully. Change recorded in audit log.' } }));
        // Refresh settings
        const fresh = await fetch('/api/v1/curator/settings');
        const freshData = await fresh.json();
        if (freshData.status === 'ok') setSettings(freshData.data as SettingsMap);
      } else {
        setSaveMessages((m) => ({
          ...m,
          [key]: { type: 'error', text: data.message ?? 'Failed to save.' },
        }));
      }
    } catch {
      setSaveMessages((m) => ({ ...m, [key]: { type: 'error', text: 'Network error.' } }));
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return <p className="text-gray-500 text-sm py-8 text-center">Loading settings…</p>;
  }

  if (accessDenied) {
    return <p className="text-gray-500 text-sm py-8 text-center">Redirecting…</p>;
  }

  if (!settings) {
    return <p className="text-red-600 text-sm py-4">Failed to load settings.</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hub Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Admin-only. All changes are recorded in the audit log.
        </p>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded mb-6 text-sm text-amber-900">
        ⚠️ Admin-only page. Every setting change is audited with the previous and new value.
      </div>

      <div className="space-y-6">
        {KNOWN_SETTINGS.map(({ key, label, hint, inputType }) => {
          const current = settings[key];
          if (!current) return null;
          return (
            <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
              <div className="flex gap-2 items-start">
                <input
                  type={inputType}
                  value={editValues[key] ?? current.value}
                  onChange={(e) => setEditValues((v) => ({ ...v, [key]: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => void saveSetting(key)}
                  disabled={saving === key}
                  className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 shrink-0"
                >
                  {saving === key ? 'Saving…' : 'Save'}
                </button>
              </div>
              {current.updatedAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {new Date(current.updatedAt).toLocaleString()}
                </p>
              )}
              {saveMessages[key] && (
                <p className={`text-xs mt-1 ${saveMessages[key].type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                  {saveMessages[key].text}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Show any other settings not in KNOWN_SETTINGS */}
      {Object.entries(settings)
        .filter(([key]) => !KNOWN_SETTINGS.some((s) => s.key === key))
        .map(([key, val]) => (
          <div key={key} className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
            {val.description && <p className="text-xs text-gray-500 mb-2">{val.description}</p>}
            <div className="flex gap-2 items-start">
              <input
                type="text"
                value={editValues[key] ?? val.value}
                onChange={(e) => setEditValues((v) => ({ ...v, [key]: e.target.value }))}
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
              />
              <button
                onClick={() => void saveSetting(key)}
                disabled={saving === key}
                className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 shrink-0"
              >
                {saving === key ? 'Saving…' : 'Save'}
              </button>
            </div>
            {saveMessages[key] && (
              <p className={`text-xs mt-1 ${saveMessages[key].type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                {saveMessages[key].text}
              </p>
            )}
          </div>
        ))}
    </div>
  );
}
