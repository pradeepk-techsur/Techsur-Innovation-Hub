'use client';

import { useState, useEffect, useCallback } from 'react';

type OpportunityStatus = 'pending' | 'accepted' | 'declined' | 'needs_more_information' | 'duplicate';

interface OpportunitySubmission {
  id: string;
  problem_title: string;
  request_type: string;
  submitting_office: string;
  submitter_name: string;
  submission_date: string;
  status: OpportunityStatus;
  dispositioned_at: string | null;
  curator_notes: string | null;
}

const STATUS_TABS: { label: string; value: OpportunityStatus }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Declined', value: 'declined' },
  { label: 'Needs More Info', value: 'needs_more_information' },
  { label: 'Duplicate', value: 'duplicate' },
];

const DISPOSITION_OPTIONS: { label: string; value: OpportunityStatus }[] = [
  { label: 'Accept', value: 'accepted' },
  { label: 'Decline', value: 'declined' },
  { label: 'Needs More Information', value: 'needs_more_information' },
  { label: 'Duplicate', value: 'duplicate' },
];

const REQUEST_TYPE_LABELS: Record<string, string> = {
  current_mission_problem: 'Mission Problem',
  emerging_tech_question: 'Tech Question',
  request_for_research: 'Research Request',
  potential_poc: 'Potential POC',
  request_for_demo: 'Demo Request',
  collaboration_opportunity: 'Collaboration',
  share_existing_work: 'Share Work',
  other: 'Other',
};

export default function OpportunityQueuePage() {
  const [activeStatus, setActiveStatus] = useState<OpportunityStatus>('pending');
  const [submissions, setSubmissions] = useState<OpportunitySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dispositioningId, setDispositioningId] = useState<string | null>(null);
  const [dispositionStatus, setDispositionStatus] = useState<OpportunityStatus>('accepted');
  const [dispositionNotes, setDispositionNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ id: string; type: 'success' | 'error'; text: string } | null>(null);

  const loadSubmissions = useCallback(async (status: OpportunityStatus) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/curator/submissions/opportunity?status=${status}&page_size=50`);
      const data = await res.json();
      if (data.status === 'ok') {
        setSubmissions(data.data);
      } else {
        setError('Failed to load submissions.');
      }
    } catch {
      setError('Network error loading submissions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubmissions(activeStatus);
  }, [activeStatus, loadSubmissions]);

  function openDispositionForm(id: string) {
    setDispositioningId(id);
    setDispositionStatus('accepted');
    setDispositionNotes('');
    setSaveMessage(null);
  }

  function cancelDisposition() {
    setDispositioningId(null);
    setDispositionNotes('');
    setSaveMessage(null);
  }

  async function saveDisposition(id: string) {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`/api/v1/curator/submissions/opportunity/${id}/disposition`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: dispositionStatus, curator_notes: dispositionNotes || undefined }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setSaveMessage({ id, type: 'success', text: 'Dispositioned successfully.' });
        setDispositioningId(null);
        await loadSubmissions(activeStatus);
      } else {
        setSaveMessage({ id, type: 'error', text: data.message ?? 'Failed to save disposition.' });
      }
    } catch {
      setSaveMessage({ id, type: 'error', text: 'Network error.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Opportunity Submissions</h1>
        <p className="text-sm text-gray-600 mt-1">Review mission problems and opportunity submissions from stakeholders.</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveStatus(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              activeStatus === tab.value
                ? 'bg-white border-l border-r border-t border-gray-200 -mb-px text-blue-700 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 text-sm py-8 text-center">Loading submissions…</p>}
      {error && <p className="text-red-600 text-sm py-4">{error}</p>}

      {!loading && !error && submissions.length === 0 && (
        <p className="text-gray-500 text-sm py-8 text-center">No {activeStatus.replace(/_/g, ' ')} submissions.</p>
      )}

      {!loading && submissions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Problem Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Office</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Submitter</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Submitted</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <>
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                      <span title={sub.problem_title}>{sub.problem_title}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {REQUEST_TYPE_LABELS[sub.request_type] ?? sub.request_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{sub.submitting_office}</td>
                    <td className="px-4 py-3 text-gray-600">{sub.submitter_name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(sub.submission_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {activeStatus === 'pending' && (
                        <button
                          onClick={() => openDispositionForm(sub.id)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Disposition
                        </button>
                      )}
                      {activeStatus !== 'pending' && sub.dispositioned_at && (
                        <span className="text-xs text-gray-400">
                          {new Date(sub.dispositioned_at).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* Inline disposition form */}
                  {dispositioningId === sub.id && (
                    <tr key={`${sub.id}-disposition`}>
                      <td colSpan={6} className="px-4 py-4 bg-blue-50 border-t border-blue-100">
                        <div className="max-w-lg">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Disposition: <span className="font-normal">{sub.problem_title}</span>
                          </p>
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                            <select
                              value={dispositionStatus}
                              onChange={(e) => setDispositionStatus(e.target.value as OpportunityStatus)}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                            >
                              {DISPOSITION_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Curator Notes <span className="font-normal text-gray-400">(optional)</span>
                            </label>
                            <textarea
                              value={dispositionNotes}
                              onChange={(e) => setDispositionNotes(e.target.value)}
                              rows={3}
                              maxLength={3000}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                              placeholder="Add notes for this disposition…"
                            />
                          </div>
                          {saveMessage?.id === sub.id && (
                            <p className={`text-xs mb-2 ${saveMessage.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                              {saveMessage.text}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => void saveDisposition(sub.id)}
                              disabled={saving}
                              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              {saving ? 'Saving…' : 'Save Disposition'}
                            </button>
                            <button
                              onClick={cancelDisposition}
                              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
