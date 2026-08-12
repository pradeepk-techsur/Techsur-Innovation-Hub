'use client';

import { useState, useEffect, useCallback } from 'react';

type FollowUpStatus = 'received' | 'in_progress' | 'completed' | 'no_action_required';

interface EngagementRequest {
  id: string;
  request_type: string;
  originating_record_id: string | null;
  originating_record_title: string | null;
  requester_name: string;
  requester_office: string;
  submitted_at: string;
  follow_up_status: FollowUpStatus;
  follow_up_updated_at: string | null;
  curator_notes: string | null;
  routing_address_at_submission: string;
  email_routing_initiated: boolean;
}

const FOLLOW_UP_TABS: { label: string; value: FollowUpStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Received', value: 'received' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'No Action Required', value: 'no_action_required' },
];

const FOLLOW_UP_OPTIONS: { label: string; value: FollowUpStatus }[] = [
  { label: 'Received', value: 'received' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'No Action Required', value: 'no_action_required' },
];

const STATUS_COLORS: Record<FollowUpStatus, string> = {
  received: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-50 text-blue-800 border-blue-200',
  completed: 'bg-green-50 text-green-800 border-green-200',
  no_action_required: 'bg-gray-50 text-gray-700 border-gray-200',
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  request_demo: 'Request Demo',
  discuss_use_case: 'Discuss Use Case',
  explore_adoption: 'Explore Adoption',
  request_technical_guidance: 'Technical Guidance',
  share_related_work: 'Share Related Work',
  contact_ir: 'Contact I&R',
};

export default function EngagementPage() {
  const [activeFilter, setActiveFilter] = useState<FollowUpStatus | 'all'>('all');
  const [requests, setRequests] = useState<EngagementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<FollowUpStatus>('received');
  const [updateNotes, setUpdateNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ id: string; type: 'success' | 'error'; text: string } | null>(null);

  const loadRequests = useCallback(async (filter: FollowUpStatus | 'all') => {
    setLoading(true);
    setError(null);
    try {
      const url =
        filter === 'all'
          ? '/api/v1/curator/engagement?page_size=50'
          : `/api/v1/curator/engagement?follow_up_status=${filter}&page_size=50`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'ok') {
        setRequests(data.data);
      } else {
        setError('Failed to load engagement requests.');
      }
    } catch {
      setError('Network error loading requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests(activeFilter);
  }, [activeFilter, loadRequests]);

  function openStatusUpdate(req: EngagementRequest) {
    setUpdatingId(req.id);
    setUpdateStatus(req.follow_up_status);
    setUpdateNotes(req.curator_notes ?? '');
    setSaveMessage(null);
  }

  function cancelUpdate() {
    setUpdatingId(null);
    setUpdateNotes('');
    setSaveMessage(null);
  }

  async function saveStatus(id: string) {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`/api/v1/curator/engagement/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_up_status: updateStatus, curator_notes: updateNotes || undefined }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setSaveMessage({ id, type: 'success', text: 'Status updated.' });
        setUpdatingId(null);
        await loadRequests(activeFilter);
      } else {
        setSaveMessage({ id, type: 'error', text: data.message ?? 'Failed to update status.' });
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
        <h1 className="text-2xl font-bold text-gray-900">Engagement Activity</h1>
        <p className="text-sm text-gray-600 mt-1">
          Review and track engagement requests from stakeholders.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200 flex-wrap">
        {FOLLOW_UP_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              activeFilter === tab.value
                ? 'bg-white border-l border-r border-t border-gray-200 -mb-px text-blue-700 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 text-sm py-8 text-center">Loading engagement requests…</p>}
      {error && <p className="text-red-600 text-sm py-4">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p className="text-gray-500 text-sm py-8 text-center">No engagement requests.</p>
      )}

      {!loading && requests.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Request Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Record</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Requester</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Office</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Submitted</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <>
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {REQUEST_TYPE_LABELS[req.request_type] ?? req.request_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate" title={req.originating_record_title ?? undefined}>
                      {req.originating_record_id && req.originating_record_title ? (
                        <a href={`/curator/records/${req.originating_record_id}`} className="text-blue-600 hover:underline">
                          {req.originating_record_title}
                        </a>
                      ) : (
                        <span className="text-gray-400">General inquiry</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{req.requester_name}</td>
                    <td className="px-4 py-3 text-gray-600">{req.requester_office}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(req.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs rounded border ${STATUS_COLORS[req.follow_up_status]}`}>
                        {req.follow_up_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openStatusUpdate(req)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                  {/* Inline status update form */}
                  {updatingId === req.id && (
                    <tr key={`${req.id}-update`}>
                      <td colSpan={7} className="px-4 py-4 bg-indigo-50 border-t border-indigo-100">
                        <div className="max-w-lg">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Update Status — <span className="font-normal">{req.requester_name}</span>
                          </p>
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Follow-up Status</label>
                            <select
                              value={updateStatus}
                              onChange={(e) => setUpdateStatus(e.target.value as FollowUpStatus)}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                            >
                              {FOLLOW_UP_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Curator Notes <span className="font-normal text-gray-400">(optional)</span>
                            </label>
                            <textarea
                              value={updateNotes}
                              onChange={(e) => setUpdateNotes(e.target.value)}
                              rows={3}
                              maxLength={3000}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                              placeholder="Add notes about this engagement…"
                            />
                          </div>
                          {saveMessage?.id === req.id && (
                            <p className={`text-xs mb-2 ${saveMessage.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                              {saveMessage.text}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => void saveStatus(req.id)}
                              disabled={saving}
                              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                            >
                              {saving ? 'Saving…' : 'Save Status'}
                            </button>
                            <button
                              onClick={cancelUpdate}
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
