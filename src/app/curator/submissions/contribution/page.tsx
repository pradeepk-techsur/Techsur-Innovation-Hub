'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type ContributionStatus =
  | 'pending'
  | 'accepted_for_curation'
  | 'declined'
  | 'needs_more_information'
  | 'duplicate'
  | 'curated';

interface ContributionSubmission {
  id: string;
  contribution_title: string;
  contributing_office: string;
  contributor_names: string;
  current_maturity: string;
  submission_date: string;
  status: ContributionStatus;
  dispositioned_at: string | null;
  curator_notes: string | null;
  created_record_id: string | null;
}

const STATUS_TABS: { label: string; value: ContributionStatus }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted_for_curation' },
  { label: 'Curated', value: 'curated' },
  { label: 'Declined', value: 'declined' },
  { label: 'Needs More Info', value: 'needs_more_information' },
  { label: 'Duplicate', value: 'duplicate' },
];

const DISPOSITION_OPTIONS: { label: string; value: ContributionStatus }[] = [
  { label: 'Accept for Curation', value: 'accepted_for_curation' },
  { label: 'Decline', value: 'declined' },
  { label: 'Needs More Information', value: 'needs_more_information' },
  { label: 'Duplicate', value: 'duplicate' },
];

const MATURITY_LABELS: Record<string, string> = {
  idea: 'Idea',
  evaluated_idea: 'Evaluated Idea',
  experiment_poc: 'Experiment / POC',
  prototype_pilot: 'Prototype / Pilot',
  production_validated: 'Production / Validated',
  archived_retired: 'Archived / Retired',
};

export default function ContributionQueuePage() {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState<ContributionStatus>('pending');
  const [submissions, setSubmissions] = useState<ContributionSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dispositioningId, setDispositioningId] = useState<string | null>(null);
  const [dispositionStatus, setDispositionStatus] = useState<ContributionStatus>('accepted_for_curation');
  const [dispositionNotes, setDispositionNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ id: string; type: 'success' | 'error'; text: string } | null>(null);
  const [creatingRecordId, setCreatingRecordId] = useState<string | null>(null);

  const loadSubmissions = useCallback(async (status: ContributionStatus) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/curator/submissions/contribution?status=${status}&page_size=50`);
      const data = await res.json();
      if (data.status === 'ok') {
        setSubmissions(data.data);
      } else {
        setError('Failed to load contributions.');
      }
    } catch {
      setError('Network error loading contributions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubmissions(activeStatus);
  }, [activeStatus, loadSubmissions]);

  function openDispositionForm(id: string) {
    setDispositioningId(id);
    setDispositionStatus('accepted_for_curation');
    setDispositionNotes('');
    setActionMessage(null);
  }

  function cancelDisposition() {
    setDispositioningId(null);
    setDispositionNotes('');
    setActionMessage(null);
  }

  async function saveDisposition(id: string) {
    setSaving(true);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/v1/curator/submissions/contribution/${id}/disposition`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: dispositionStatus, curator_notes: dispositionNotes || undefined }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setDispositioningId(null);
        await loadSubmissions(activeStatus);
      } else {
        setActionMessage({ id, type: 'error', text: data.message ?? 'Failed to save disposition.' });
      }
    } catch {
      setActionMessage({ id, type: 'error', text: 'Network error.' });
    } finally {
      setSaving(false);
    }
  }

  async function createRecord(contribution: ContributionSubmission) {
    setCreatingRecordId(contribution.id);
    setActionMessage(null);
    try {
      const res = await fetch(
        `/api/v1/curator/submissions/contribution/${contribution.id}/create-record`,
        { method: 'POST' }
      );
      const data = await res.json();
      if (data.status === 'ok' && data.data?.recordId) {
        router.push(`/curator/records/${data.data.recordId}`);
      } else if (data.error_code === 'ALREADY_CURATED') {
        setActionMessage({ id: contribution.id, type: 'error', text: 'Record already created from this contribution.' });
      } else {
        setActionMessage({ id: contribution.id, type: 'error', text: data.message ?? 'Failed to create record.' });
      }
    } catch {
      setActionMessage({ id: contribution.id, type: 'error', text: 'Network error.' });
    } finally {
      setCreatingRecordId(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Innovation Contributions</h1>
        <p className="text-sm text-gray-600 mt-1">
          Review contributions from teams with existing innovation work to share.
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200 flex-wrap">
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

      {loading && <p className="text-gray-500 text-sm py-8 text-center">Loading contributions…</p>}
      {error && <p className="text-red-600 text-sm py-4">{error}</p>}

      {!loading && !error && submissions.length === 0 && (
        <p className="text-gray-500 text-sm py-8 text-center">
          No {activeStatus.replace(/_/g, ' ')} contributions.
        </p>
      )}

      {!loading && submissions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Office</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Contributor(s)</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Maturity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Submitted</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <>
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                      {sub.contribution_title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{sub.contributing_office}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate" title={sub.contributor_names}>
                      {sub.contributor_names}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded bg-purple-50 text-purple-700 border border-purple-100">
                        {MATURITY_LABELS[sub.current_maturity] ?? sub.current_maturity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(sub.submission_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {activeStatus === 'pending' && (
                          <button
                            onClick={() => openDispositionForm(sub.id)}
                            className="text-sm text-blue-600 hover:underline text-left"
                          >
                            Disposition
                          </button>
                        )}
                        {(activeStatus === 'accepted_for_curation' || activeStatus === 'pending') && !sub.created_record_id && (
                          <button
                            onClick={() => void createRecord(sub)}
                            disabled={creatingRecordId === sub.id}
                            className="text-sm text-green-600 hover:underline text-left disabled:opacity-50"
                          >
                            {creatingRecordId === sub.id ? 'Creating…' : 'Create Record'}
                          </button>
                        )}
                        {sub.created_record_id && (
                          <a
                            href={`/curator/records/${sub.created_record_id}`}
                            className="text-sm text-emerald-700 hover:underline"
                          >
                            Record created →
                          </a>
                        )}
                        {actionMessage?.id === sub.id && (
                          <p className={`text-xs ${actionMessage.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                            {actionMessage.text}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Inline disposition form */}
                  {dispositioningId === sub.id && (
                    <tr key={`${sub.id}-disposition`}>
                      <td colSpan={6} className="px-4 py-4 bg-blue-50 border-t border-blue-100">
                        <div className="max-w-lg">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Disposition: <span className="font-normal">{sub.contribution_title}</span>
                          </p>
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                            <select
                              value={dispositionStatus}
                              onChange={(e) => setDispositionStatus(e.target.value as ContributionStatus)}
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
                          {actionMessage?.id === sub.id && (
                            <p className={`text-xs mb-2 ${actionMessage.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                              {actionMessage.text}
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
