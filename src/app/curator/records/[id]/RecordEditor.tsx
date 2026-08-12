'use client';

import { useState, useCallback, useTransition } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Artifact {
  artifact_id: string;
  name: string;
  url: string;
  artifact_type: string;
  is_restricted: boolean;
  access_notes: string | null;
  display_order: number;
}

interface RecordData {
  id: string;
  slug: string;
  publication_state: string;
  version: number;
  title: string;
  summary: string;
  problem_statement: string;
  affected_users: string | null;
  current_workflow: string | null;
  why_experimentation: string | null;
  mission_areas: string[];
  problem_type_tags: string[];
  hypothesis_or_objective: string;
  scope_description: string | null;
  technology_areas: string[];
  technologies_used: string | null;
  methods_used: string | null;
  tags: string[];
  outcome_summary: string;
  what_worked: string | null;
  what_did_not_work: string | null;
  uncertainty_reduced: string | null;
  decision_enabled: string | null;
  evidence_summary: string | null;
  source_basis: string;
  findings_architectural: string | null;
  findings_security: string | null;
  findings_cloud_platform: string | null;
  findings_performance: string | null;
  findings_ux: string | null;
  findings_data: string | null;
  findings_testing: string | null;
  findings_operational: string | null;
  findings_cost: string | null;
  findings_scalability: string | null;
  findings_other: string | null;
  maturity: string | null;
  review_statuses: string[];
  ready_for: string | null;
  not_ready_for: string | null;
  next_stage_requirements: string | null;
  last_reviewed_date: string | null;
  next_review_date: string | null;
  maturity_change_reason: string | null;
  reuse_potential: string | null;
  what_can_be_reused: string | null;
  what_should_be_adapted: string | null;
  what_not_to_copy: string | null;
  environment_assumptions: string | null;
  required_skills: string | null;
  required_services: string | null;
  production_readiness_gaps: string | null;
  engagement_indicator: string;
  opportunity_source: string | null;
  contributing_offices: string[];
  contributor_names: string[];
  ir_contribution: string | null;
  owner_steward: string;
  owner_contact: string | null;
  operational_owner: string | null;
  production_owner: string | null;
  attribution_statement: string;
  source_contribution_id: string | null;
  applicable_disclaimer: string;
  supersession_reason: string | null;
  retirement_reason: string | null;
  next_action_description: string | null;
  artifacts: Artifact[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MISSION_AREAS = [
  'case_management', 'evidence_management', 'legal_research', 'court_operations',
  'public_access', 'data_analytics', 'cybersecurity', 'it_infrastructure',
  'human_resources', 'financial_management', 'facilities', 'other',
];

const TECHNOLOGY_AREAS = [
  'ai_ml', 'cloud_computing', 'cybersecurity', 'data_analytics',
  'automation', 'mobile', 'integration', 'legacy_modernization', 'other',
];

const REVIEW_STATUS_OPTIONS = [
  { value: 'security_reviewed', label: 'Security Reviewed' },
  { value: 'legal_reviewed', label: 'Legal Reviewed' },
  { value: 'privacy_reviewed', label: 'Privacy Reviewed' },
  { value: 'architecture_reviewed', label: 'Architecture Reviewed' },
  { value: 'accessibility_reviewed', label: 'Accessibility Reviewed' },
];

const MATURITY_OPTIONS = [
  { value: '', label: '— Not set —' },
  { value: 'idea', label: 'Idea' },
  { value: 'evaluated_idea', label: 'Evaluated Idea' },
  { value: 'experiment_poc', label: 'Experiment / PoC' },
  { value: 'prototype_pilot', label: 'Prototype / Pilot' },
  { value: 'production_validated', label: 'Production Validated' },
  { value: 'archived_retired', label: 'Archived / Retired' },
];

const REUSE_POTENTIAL_OPTIONS = [
  { value: '', label: '— Not set —' },
  { value: 'high', label: 'High' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'low', label: 'Low' },
  { value: 'not_assessed', label: 'Not Assessed' },
];

const ENGAGEMENT_INDICATOR_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'demo_available', label: 'Demo Available' },
  { value: 'seeking_adoption_partner', label: 'Seeking Adoption Partner' },
  { value: 'technical_playbook_available', label: 'Technical Playbook Available' },
  { value: 'reference_pattern_available', label: 'Reference Pattern Available' },
  { value: 'monitoring_only', label: 'Monitoring Only' },
  { value: 'archived', label: 'Archived' },
];

const ARTIFACT_TYPES = [
  'lessons_learned', 'poc_report', 'decision_brief', 'architecture_diagram',
  'demo_video', 'repository', 'infrastructure_definition', 'test_results',
  'security_findings', 'technical_playbook', 'other',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, children, help }: { label: string; children: React.ReactNode; help?: string }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, maxLength }: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number;
}) {
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

function MultiSelect({ options, selected, onChange }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-2 py-1 rounded text-xs border font-medium ${
            selected.includes(opt)
              ? 'bg-blue-700 text-white border-blue-700'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {opt.replace(/_/g, ' ')}
        </button>
      ))}
    </div>
  );
}

function MultiInput({ values, onChange, placeholder }: {
  values: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) {
      onChange([...values, v]);
      setInput('');
    }
  };
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {values.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs">
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="text-blue-400 hover:text-blue-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4 mt-6">
      {title}
    </h2>
  );
}

// ─── Lifecycle Panel ─────────────────────────────────────────────────────────

const STATE_LABELS: Record<string, { label: string; description: string; color: string }> = {
  draft:                { label: 'Draft', description: 'Record is being prepared. Not visible to the public.', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  submitted_for_review: { label: 'Submitted for Review', description: 'Awaiting curatorial review before publication.', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  published:            { label: 'Published', description: 'Visible to all catalog users.', color: 'bg-green-100 text-green-800 border-green-300' },
  superseded:           { label: 'Superseded', description: 'Replaced by a newer record.', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  archived:             { label: 'Archived', description: 'Retained for historical reference. Not visible in public catalog.', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  retired:              { label: 'Retired', description: 'Permanently withdrawn. Not visible in public catalog.', color: 'bg-red-100 text-red-800 border-red-300' },
};

interface GateFailureErrors {
  fields: Record<string, string>;
  warnings: Record<string, string>;
}

function LifecycleActionsPanel({
  record,
  onStateChange,
}: {
  record: RecordData;
  onStateChange: (newState: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [gateFailure, setGateFailure] = useState<GateFailureErrors | null>(null);
  const [gateWarnings, setGateWarnings] = useState<Record<string, string> | null>(null);
  const [supersessionReason, setSupersessionReason] = useState('');
  const [retirementReason, setRetirementReason] = useState('');
  const [showSupersede, setShowSupersede] = useState(false);
  const [showRetire, setShowRetire] = useState(false);

  const stateInfo = STATE_LABELS[record.publication_state] ?? { label: record.publication_state, description: '', color: 'bg-gray-100 text-gray-700 border-gray-300' };

  async function performTransition(endpoint: string, body?: Record<string, unknown>) {
    setActionError(null);
    setGateFailure(null);
    setGateWarnings(null);

    const res = await fetch(`/api/v1/curator/records/${record.id}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({})) as {
      status?: string;
      error_code?: string;
      message?: string;
      fields?: Record<string, string>;
      warnings?: Record<string, string>;
    };

    if (!res.ok) {
      if (data.error_code === 'PUBLICATION_GATE_FAILED') {
        setGateFailure({ fields: data.fields ?? {}, warnings: data.warnings ?? {} });
        return;
      }
      setActionError(data.message ?? `Transition failed (${res.status}).`);
      return;
    }

    // Success — check for non-blocking warnings
    if (data.warnings && Object.keys(data.warnings).length > 0) {
      setGateWarnings(data.warnings);
    }

    // Determine new state from endpoint name
    const newStateMap: Record<string, string> = {
      'publish': 'published',
      'unpublish': 'draft',
      'submit-for-review': 'submitted_for_review',
      'supersede': 'superseded',
      'archive': 'archived',
      'retire': 'retired',
    };
    onStateChange(newStateMap[endpoint] ?? record.publication_state);
  }

  function handleAction(endpoint: string, body?: Record<string, unknown>) {
    startTransition(() => {
      void performTransition(endpoint, body);
    });
  }

  return (
    <div className="border border-gray-200 rounded mb-6">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-800 rounded"
      >
        <span>Lifecycle Actions</span>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded border text-xs font-medium ${stateInfo.color}`}>
            {stateInfo.label}
          </span>
          <span className="text-gray-400">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">{stateInfo.description}</p>

          {/* Gate failure panel */}
          {gateFailure && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm font-medium text-red-800 mb-2">
                Publication Gate Failed — the following fields must be resolved:
              </p>
              <ul className="space-y-1">
                {Object.entries(gateFailure.fields).map(([key, msg]) => (
                  <li key={key} className="text-sm text-red-700">
                    <span className="font-mono text-xs text-red-500 mr-1">{key}:</span>
                    {msg}
                  </li>
                ))}
              </ul>
              {Object.keys(gateFailure.warnings).length > 0 && (
                <div className="mt-2 pt-2 border-t border-red-200">
                  <p className="text-xs font-medium text-amber-700 mb-1">Warnings (non-blocking):</p>
                  {Object.entries(gateFailure.warnings).map(([key, msg]) => (
                    <p key={key} className="text-xs text-amber-600">{msg}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Gate warnings (on successful publish) */}
          {gateWarnings && Object.keys(gateWarnings).length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-sm font-medium text-amber-800 mb-1">Publication warnings:</p>
              {Object.entries(gateWarnings).map(([key, msg]) => (
                <p key={key} className="text-sm text-amber-700">{msg}</p>
              ))}
            </div>
          )}

          {/* Action error */}
          {actionError && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">{actionError}</p>
            </div>
          )}

          {/* Transition buttons by state */}
          <div className="flex flex-wrap gap-2">
            {record.publication_state === 'draft' && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleAction('submit-for-review')}
                className="px-3 py-1.5 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
              >
                Submit for Review
              </button>
            )}

            {record.publication_state === 'submitted_for_review' && (
              <>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleAction('publish')}
                  className="px-3 py-1.5 bg-green-700 text-white rounded text-sm font-medium hover:bg-green-800 disabled:opacity-50"
                >
                  Publish
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleAction('unpublish')}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  Return to Draft
                </button>
              </>
            )}

            {record.publication_state === 'published' && (
              <>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleAction('unpublish')}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  Unpublish
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setShowSupersede(s => !s)}
                  className="px-3 py-1.5 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
                >
                  Supersede…
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleAction('archive')}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
                >
                  Archive
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setShowRetire(s => !s)}
                  className="px-3 py-1.5 bg-red-700 text-white rounded text-sm font-medium hover:bg-red-800 disabled:opacity-50"
                >
                  Retire…
                </button>
              </>
            )}

            {record.publication_state === 'superseded' && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleAction('archive')}
                className="px-3 py-1.5 bg-blue-700 text-white rounded text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
              >
                Archive
              </button>
            )}
          </div>

          {/* Supersede reason inline form */}
          {showSupersede && (
            <div className="border border-orange-200 rounded p-3 bg-orange-50 space-y-2">
              <p className="text-sm font-medium text-orange-800">Supersede — provide a reason:</p>
              <textarea
                value={supersessionReason}
                onChange={e => setSupersessionReason(e.target.value)}
                placeholder="Why is this record being superseded?"
                rows={2}
                className="w-full px-3 py-2 border border-orange-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isPending || !supersessionReason.trim()}
                  onClick={() => {
                    setShowSupersede(false);
                    handleAction('supersede', { supersession_reason: supersessionReason });
                  }}
                  className="px-3 py-1.5 bg-orange-700 text-white rounded text-sm font-medium hover:bg-orange-800 disabled:opacity-50"
                >
                  Confirm Supersede
                </button>
                <button
                  type="button"
                  onClick={() => setShowSupersede(false)}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Retire reason inline form */}
          {showRetire && (
            <div className="border border-red-200 rounded p-3 bg-red-50 space-y-2">
              <p className="text-sm font-medium text-red-800">Retire — provide a reason:</p>
              <textarea
                value={retirementReason}
                onChange={e => setRetirementReason(e.target.value)}
                placeholder="Why is this record being retired?"
                rows={2}
                className="w-full px-3 py-2 border border-red-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isPending || !retirementReason.trim()}
                  onClick={() => {
                    setShowRetire(false);
                    handleAction('retire', { retirement_reason: retirementReason });
                  }}
                  className="px-3 py-1.5 bg-red-700 text-white rounded text-sm font-medium hover:bg-red-800 disabled:opacity-50"
                >
                  Confirm Retire
                </button>
                <button
                  type="button"
                  onClick={() => setShowRetire(false)}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isPending && (
            <p className="text-xs text-gray-500 italic">Processing lifecycle transition…</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function RecordEditor({ record: initialRecord }: { record: RecordData }) {
  const [record, setRecord] = useState<RecordData>(initialRecord);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error' | 'conflict'>('idle');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Artifacts state
  const [showAddArtifact, setShowAddArtifact] = useState(false);
  const [newArtifact, setNewArtifact] = useState({
    name: '', url: '', artifact_type: 'other', is_restricted: false, access_notes: '', display_order: 0,
  });

  const set = useCallback(<K extends keyof RecordData>(key: K, value: RecordData[K]) => {
    setRecord(prev => ({ ...prev, [key]: value }));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const { artifacts: _arts, version: _ver, id: _id2, ...changes } = record;
      const res = await fetch(`/api/v1/curator/records/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: record.version, ...changes }),
      });
      if (res.status === 409) {
        setSaveStatus('conflict');
        setSaveMessage('This record was updated by another user. Reload to see the latest version.');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveStatus('error');
        setSaveMessage(data.message ?? 'Failed to save.');
        return;
      }
      // version bumped by DB trigger — reload version from server
      const refreshed = await fetch(`/api/v1/curator/records/${record.id}`);
      if (refreshed.ok) {
        const data = await refreshed.json();
        setRecord(prev => ({ ...prev, version: data.data.version, artifacts: data.data.artifacts }));
      }
      setSaveStatus('saved');
      setSaveMessage(null);
    } catch {
      setSaveStatus('error');
      setSaveMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddArtifact() {
    const res = await fetch(`/api/v1/curator/records/${record.id}/artifacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArtifact),
    });
    if (res.ok) {
      const refreshed = await fetch(`/api/v1/curator/records/${record.id}`);
      if (refreshed.ok) {
        const data = await refreshed.json();
        setRecord(prev => ({ ...prev, artifacts: data.data.artifacts }));
      }
      setNewArtifact({ name: '', url: '', artifact_type: 'other', is_restricted: false, access_notes: '', display_order: 0 });
      setShowAddArtifact(false);
    }
  }

  async function handleRemoveArtifact(artifactId: string) {
    await fetch(`/api/v1/curator/records/${record.id}/artifacts/${artifactId}`, { method: 'DELETE' });
    setRecord(prev => ({ ...prev, artifacts: prev.artifacts.filter(a => a.artifact_id !== artifactId) }));
  }

  const stateColor: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    submitted_for_review: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    superseded: 'bg-orange-100 text-orange-800',
    archived: 'bg-blue-100 text-blue-800',
    retired: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{record.title || 'Untitled Record'}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${stateColor[record.publication_state] ?? 'bg-gray-100 text-gray-700'}`}>
              {record.publication_state.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-gray-500 font-mono">{record.slug}</span>
            <span className="text-xs text-gray-400">v{record.version}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'saved' && <span className="text-sm text-green-600">✓ Saved</span>}
          {saveStatus === 'error' && <span className="text-sm text-red-600">{saveMessage}</span>}
          {saveStatus === 'conflict' && (
            <span className="text-sm text-orange-600">{saveMessage}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-medium text-sm disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Lifecycle Actions Panel (F9.9 — collapsed by default) */}
      <LifecycleActionsPanel
        record={record}
        onStateChange={(newState) => setRecord(prev => ({ ...prev, publication_state: newState }))}
      />

      {/* Group 1: Problem Definition (F3.1) */}
      <SectionHeader title="Problem Definition (F3.1)" />
      <Field label="Title">
        <TextInput value={record.title} onChange={v => set('title', v)} placeholder="Innovation record title" maxLength={300} />
      </Field>
      <Field label="Summary">
        <TextArea value={record.summary} onChange={v => set('summary', v)} placeholder="Brief summary of this innovation work" rows={3} />
      </Field>
      <Field label="Problem Statement">
        <TextArea value={record.problem_statement} onChange={v => set('problem_statement', v)} placeholder="What problem was addressed?" rows={4} />
      </Field>
      <Field label="Affected Users">
        <TextInput value={record.affected_users ?? ''} onChange={v => set('affected_users', v || null)} placeholder="Who is affected by this problem?" />
      </Field>
      <Field label="Current Workflow">
        <TextArea value={record.current_workflow ?? ''} onChange={v => set('current_workflow', v || null)} placeholder="How is this currently handled?" rows={3} />
      </Field>
      <Field label="Why Experimentation">
        <TextArea value={record.why_experimentation ?? ''} onChange={v => set('why_experimentation', v || null)} placeholder="Why was experimentation appropriate?" rows={3} />
      </Field>
      <Field label="Mission Areas">
        <MultiSelect options={MISSION_AREAS} selected={record.mission_areas ?? []} onChange={v => set('mission_areas', v)} />
      </Field>
      <Field label="Problem Type Tags">
        <MultiInput values={record.problem_type_tags ?? []} onChange={v => set('problem_type_tags', v)} placeholder="Add tag, press Enter" />
      </Field>

      {/* Group 2: Hypothesis & Scope (F3.2) */}
      <SectionHeader title="Hypothesis & Scope (F3.2)" />
      <Field label="Hypothesis / Objective">
        <TextArea value={record.hypothesis_or_objective} onChange={v => set('hypothesis_or_objective', v)} placeholder="What was the hypothesis or objective?" rows={3} />
      </Field>
      <Field label="Scope Description">
        <TextArea value={record.scope_description ?? ''} onChange={v => set('scope_description', v || null)} placeholder="Describe the scope of the experiment" rows={3} />
      </Field>
      <Field label="Technology Areas">
        <MultiSelect options={TECHNOLOGY_AREAS} selected={record.technology_areas ?? []} onChange={v => set('technology_areas', v)} />
      </Field>
      <Field label="Technologies Used">
        <TextInput value={record.technologies_used ?? ''} onChange={v => set('technologies_used', v || null)} placeholder="Specific technologies, frameworks, tools" />
      </Field>
      <Field label="Methods Used">
        <TextInput value={record.methods_used ?? ''} onChange={v => set('methods_used', v || null)} placeholder="Research methods, evaluation approaches" />
      </Field>
      <Field label="Tags">
        <MultiInput values={record.tags ?? []} onChange={v => set('tags', v)} placeholder="Add tag, press Enter" />
      </Field>

      {/* Group 3: Outcomes (F3.3) */}
      <SectionHeader title="Outcomes & Evidence (F3.3)" />
      <Field label="Outcome Summary">
        <TextArea value={record.outcome_summary} onChange={v => set('outcome_summary', v)} placeholder="What was the overall outcome?" rows={4} />
      </Field>
      <Field label="What Worked">
        <TextArea value={record.what_worked ?? ''} onChange={v => set('what_worked', v || null)} placeholder="What approaches proved effective?" rows={3} />
      </Field>
      <Field label="What Did Not Work">
        <TextArea value={record.what_did_not_work ?? ''} onChange={v => set('what_did_not_work', v || null)} placeholder="What didn't work, and why?" rows={3} />
      </Field>
      <Field label="Uncertainty Reduced">
        <TextArea value={record.uncertainty_reduced ?? ''} onChange={v => set('uncertainty_reduced', v || null)} placeholder="What uncertainty was reduced?" rows={2} />
      </Field>
      <Field label="Decision Enabled">
        <TextArea value={record.decision_enabled ?? ''} onChange={v => set('decision_enabled', v || null)} placeholder="What decisions does this enable?" rows={2} />
      </Field>
      <Field label="Evidence Summary">
        <TextArea value={record.evidence_summary ?? ''} onChange={v => set('evidence_summary', v || null)} placeholder="Summary of evidence gathered" rows={3} />
      </Field>
      <Field label="Source Basis">
        <TextInput value={record.source_basis} onChange={v => set('source_basis', v)} placeholder="Basis for the information in this record" />
      </Field>

      {/* Group 4: Technical Findings (F3.4) */}
      <SectionHeader title="Technical Findings (F3.4)" />
      {([
        ['findings_architectural', 'Architectural'],
        ['findings_security', 'Security'],
        ['findings_cloud_platform', 'Cloud Platform'],
        ['findings_performance', 'Performance'],
        ['findings_ux', 'UX'],
        ['findings_data', 'Data'],
        ['findings_testing', 'Testing'],
        ['findings_operational', 'Operational'],
        ['findings_cost', 'Cost'],
        ['findings_scalability', 'Scalability'],
        ['findings_other', 'Other'],
      ] as [keyof RecordData, string][]).map(([key, label]) => (
        <Field key={key} label={`${label} Findings`}>
          <TextArea
            value={(record[key] as string | null) ?? ''}
            onChange={v => set(key, v || null as unknown as RecordData[typeof key])}
            rows={2}
          />
        </Field>
      ))}

      {/* Group 5: Maturity & Review Status (F3.5) */}
      <SectionHeader title="Maturity & Review Status (F3.5)" />
      <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4 text-sm text-amber-800">
        <strong>Important:</strong> Maturity and Review Status are independent fields. Changing one does not automatically change the other.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Maturity ↑ Independent from review status">
          <select
            value={record.maturity ?? ''}
            onChange={e => set('maturity', e.target.value || null as unknown as string)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {MATURITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </Field>
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">Review Status ↑ Independent from maturity</p>
          <div className="space-y-2">
            {REVIEW_STATUS_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={(record.review_statuses ?? []).includes(opt.value)}
                  onChange={e => {
                    const current = record.review_statuses ?? [];
                    set('review_statuses', e.target.checked
                      ? [...current, opt.value]
                      : current.filter(s => s !== opt.value)
                    );
                  }}
                  className="rounded border-gray-300"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
      <Field label="Ready For">
        <TextArea value={record.ready_for ?? ''} onChange={v => set('ready_for', v || null)} rows={2} />
      </Field>
      <Field label="Not Ready For">
        <TextArea value={record.not_ready_for ?? ''} onChange={v => set('not_ready_for', v || null)} rows={2} />
      </Field>
      <Field label="Next Stage Requirements">
        <TextArea value={record.next_stage_requirements ?? ''} onChange={v => set('next_stage_requirements', v || null)} rows={2} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Last Reviewed Date">
          <TextInput value={record.last_reviewed_date ?? ''} onChange={v => set('last_reviewed_date', v || null)} placeholder="YYYY-MM-DD" />
        </Field>
        <Field label="Next Review Date">
          <TextInput value={record.next_review_date ?? ''} onChange={v => set('next_review_date', v || null)} placeholder="YYYY-MM-DD" />
        </Field>
      </div>
      <Field label="Maturity Change Reason">
        <TextArea value={record.maturity_change_reason ?? ''} onChange={v => set('maturity_change_reason', v || null)} rows={2} placeholder="Reason for the most recent maturity change" />
      </Field>

      {/* Group 6: Reuse Guidance (F3.6) */}
      <SectionHeader title="Reuse Guidance (F3.6)" />
      <Field label="Reuse Potential">
        <select
          value={record.reuse_potential ?? ''}
          onChange={e => set('reuse_potential', e.target.value || null as unknown as string)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {REUSE_POTENTIAL_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </Field>
      <Field label="What Can Be Reused">
        <TextArea value={record.what_can_be_reused ?? ''} onChange={v => set('what_can_be_reused', v || null)} rows={3} />
      </Field>
      <Field label="What Should Be Adapted">
        <TextArea value={record.what_should_be_adapted ?? ''} onChange={v => set('what_should_be_adapted', v || null)} rows={3} />
      </Field>
      <Field label="What Not To Copy">
        <TextArea value={record.what_not_to_copy ?? ''} onChange={v => set('what_not_to_copy', v || null)} rows={2} />
      </Field>
      <Field label="Environment Assumptions">
        <TextArea value={record.environment_assumptions ?? ''} onChange={v => set('environment_assumptions', v || null)} rows={2} />
      </Field>
      <Field label="Required Skills">
        <TextInput value={record.required_skills ?? ''} onChange={v => set('required_skills', v || null)} />
      </Field>
      <Field label="Required Services">
        <TextInput value={record.required_services ?? ''} onChange={v => set('required_services', v || null)} />
      </Field>
      <Field label="Production Readiness Gaps">
        <TextArea value={record.production_readiness_gaps ?? ''} onChange={v => set('production_readiness_gaps', v || null)} rows={2} />
      </Field>
      <Field label="Engagement Indicator">
        <select
          value={record.engagement_indicator}
          onChange={e => set('engagement_indicator', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ENGAGEMENT_INDICATOR_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </Field>

      {/* Group 7: Attribution (F3.7) */}
      <SectionHeader title="Attribution & Ownership (F3.7)" />
      <Field label="Opportunity Source">
        <TextInput value={record.opportunity_source ?? ''} onChange={v => set('opportunity_source', v || null)} placeholder="How was this innovation opportunity identified?" />
      </Field>
      <Field label="Contributing Offices">
        <MultiInput values={record.contributing_offices ?? []} onChange={v => set('contributing_offices', v)} placeholder="Add office, press Enter" />
      </Field>
      <Field label="Contributor Names">
        <MultiInput values={record.contributor_names ?? []} onChange={v => set('contributor_names', v)} placeholder="Add name, press Enter" />
      </Field>
      <Field label="IR Contribution">
        <TextArea value={record.ir_contribution ?? ''} onChange={v => set('ir_contribution', v || null)} rows={2} placeholder="Innovation & Research team's contribution" />
      </Field>
      <Field label="Owner / Steward">
        <TextInput value={record.owner_steward} onChange={v => set('owner_steward', v)} placeholder="Name or office responsible for this record" />
      </Field>
      <Field label="Owner Contact">
        <TextInput value={record.owner_contact ?? ''} onChange={v => set('owner_contact', v || null)} placeholder="Contact email or name" />
      </Field>
      <Field label="Operational Owner">
        <TextInput value={record.operational_owner ?? ''} onChange={v => set('operational_owner', v || null)} />
      </Field>
      <Field label="Production Owner">
        <TextInput value={record.production_owner ?? ''} onChange={v => set('production_owner', v || null)} />
      </Field>
      <Field label="Attribution Statement">
        <TextArea value={record.attribution_statement} onChange={v => set('attribution_statement', v)} rows={2} placeholder="How should this work be attributed?" />
      </Field>
      {record.source_contribution_id && (
        <Field label="Source Contribution ID">
          <p className="text-sm font-mono text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200">
            {record.source_contribution_id} (read-only)
          </p>
        </Field>
      )}

      {/* Group 8: Disclaimers & Lifecycle */}
      <SectionHeader title="Disclaimers & Lifecycle" />
      <Field label="Applicable Disclaimer">
        <TextArea value={record.applicable_disclaimer} onChange={v => set('applicable_disclaimer', v)} rows={3} />
      </Field>
      {record.publication_state === 'superseded' && (
        <Field label="Supersession Reason">
          <TextArea value={record.supersession_reason ?? ''} onChange={v => set('supersession_reason', v || null)} rows={2} />
        </Field>
      )}
      {(record.publication_state === 'archived' || record.publication_state === 'retired') && (
        <Field label="Retirement / Archive Reason">
          <TextArea value={record.retirement_reason ?? ''} onChange={v => set('retirement_reason', v || null)} rows={2} />
        </Field>
      )}

      {/* Group 9: Next Action */}
      <SectionHeader title="Next Action" />
      <Field label="Next Action Description">
        <TextArea value={record.next_action_description ?? ''} onChange={v => set('next_action_description', v || null)} rows={2} />
      </Field>

      {/* Artifacts (F9.5) */}
      <SectionHeader title="Artifacts" />
      <div className="space-y-2 mb-4">
        {record.artifacts.length === 0 && (
          <p className="text-sm text-gray-500 italic">No artifacts yet.</p>
        )}
        {record.artifacts.map(art => (
          <div key={art.artifact_id} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{art.name}</p>
              <a
                href={art.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline font-mono break-all"
              >
                {art.url}
              </a>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{art.artifact_type.replace(/_/g, ' ')}</span>
                {art.is_restricted && (
                  <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
                    Restricted
                  </span>
                )}
                {art.access_notes && (
                  <span className="text-xs text-gray-400">{art.access_notes}</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveArtifact(art.artifact_id)}
              className="text-xs text-red-600 hover:text-red-800 shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {!showAddArtifact ? (
        <button
          type="button"
          onClick={() => setShowAddArtifact(true)}
          className="text-sm text-blue-700 hover:underline"
        >
          + Add Artifact
        </button>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-3">
          <h3 className="text-sm font-medium text-gray-800">Add Artifact</h3>
          <Field label="Name">
            <TextInput value={newArtifact.name} onChange={v => setNewArtifact(a => ({ ...a, name: v }))} placeholder="Artifact name (min 3 chars)" />
          </Field>
          <Field label="URL">
            <TextInput value={newArtifact.url} onChange={v => setNewArtifact(a => ({ ...a, url: v }))} placeholder="https://..." />
          </Field>
          <Field label="Type">
            <select
              value={newArtifact.artifact_type}
              onChange={e => setNewArtifact(a => ({ ...a, artifact_type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              {ARTIFACT_TYPES.map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </Field>
          <Field label="Access Notes (optional)">
            <TextInput value={newArtifact.access_notes} onChange={v => setNewArtifact(a => ({ ...a, access_notes: v }))} />
          </Field>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={newArtifact.is_restricted}
              onChange={e => setNewArtifact(a => ({ ...a, is_restricted: e.target.checked }))}
            />
            Restricted (URL hidden from public catalog)
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddArtifact}
              className="px-3 py-1.5 bg-blue-700 text-white rounded text-sm hover:bg-blue-800"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddArtifact(false)}
              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Save button (bottom) */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-medium disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saveStatus === 'saved' && <span className="text-sm text-green-600">✓ Saved successfully</span>}
        {saveStatus === 'conflict' && (
          <span className="text-sm text-orange-600">{saveMessage}</span>
        )}
        {saveStatus === 'error' && <span className="text-sm text-red-600">{saveMessage}</span>}
      </div>
    </div>
  );
}
