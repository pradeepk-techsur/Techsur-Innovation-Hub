'use client';
import { useState } from 'react';

const ACTION_LABELS: Record<string, string> = {
  request_demo: 'Request a Demonstration',
  discuss_use_case: 'Discuss a Related Use Case',
  explore_adoption: 'Explore Adoption',
  request_technical_guidance: 'Request Technical Guidance',
  share_related_work: 'Share Related Work',
  contact_ir: 'Contact I&R',
};

interface Props {
  actionType: string;
  recordId?: string;
  recordTitle?: string;
  onClose: () => void;
}

export function EngagementModal({ actionType, recordId, recordTitle, onClose }: Props) {
  const [form, setForm] = useState({
    requesterName: '',
    requesterOffice: '',
    requesterEmail: '',
    needDescription: '',
    desiredNextStep: '',
    consentToContact: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ referenceNumber: string } | null>(null);
  const [error, setError] = useState('');

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consentToContact) {
      setError('You must consent to contact to submit this request.');
      return;
    }
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/v1/engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: actionType,
        originatingRecordId: recordId,
        originatingRecordTitle: recordTitle,
        requesterName: form.requesterName,
        requesterOffice: form.requesterOffice,
        requesterEmail: form.requesterEmail,
        needDescription: form.needDescription,
        desiredNextStep: form.desiredNextStep || undefined,
        consentToContact: true,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setSubmitted({ referenceNumber: data.referenceNumber });
    } else {
      setError(data.message ?? 'Request could not be submitted. Please try again.');
    }
    setSubmitting(false);
  }

  // Submitted state
  if (submitted) {
    return (
      <div role="dialog" aria-modal="true" aria-label={ACTION_LABELS[actionType]} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
          <div className="text-green-600 text-3xl mb-3" aria-hidden="true">✓</div>
          <h2 className="text-xl font-bold mb-2">Request Sent</h2>
          <p className="text-gray-600">Reference: <strong>{submitted.referenceNumber}</strong></p>
          <p className="mt-3 text-sm text-gray-600">
            Your request has been routed to the TSIO Innovation &amp; Research team. They will follow up with you.
          </p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={ACTION_LABELS[actionType]} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{ACTION_LABELS[actionType]}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        {recordTitle && (
          <p className="text-sm text-gray-600 mb-4">
            Regarding: <em>{recordTitle}</em>
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="eng-name" className="block text-sm font-medium mb-1">Your name *</label>
            <input id="eng-name" type="text" value={form.requesterName}
              onChange={e => update('requesterName', e.target.value)}
              required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label htmlFor="eng-office" className="block text-sm font-medium mb-1">Your office *</label>
            <input id="eng-office" type="text" value={form.requesterOffice}
              onChange={e => update('requesterOffice', e.target.value)}
              required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label htmlFor="eng-email" className="block text-sm font-medium mb-1">Your email *</label>
            <input id="eng-email" type="email" value={form.requesterEmail}
              onChange={e => update('requesterEmail', e.target.value)}
              required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label htmlFor="eng-description" className="block text-sm font-medium mb-1">
              Describe your need * <span className="font-normal text-gray-500">(min 20 characters)</span>
            </label>
            <textarea id="eng-description" value={form.needDescription}
              onChange={e => update('needDescription', e.target.value)}
              rows={4} required className="w-full border rounded px-3 py-2"
              placeholder={`Describe what you're hoping to explore...`} />
          </div>
          <div>
            <label htmlFor="eng-nextstep" className="block text-sm font-medium mb-1">
              Desired next step (optional)
            </label>
            <input id="eng-nextstep" type="text" value={form.desiredNextStep}
              onChange={e => update('desiredNextStep', e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-3 items-start">
            <input id="eng-consent" type="checkbox"
              checked={form.consentToContact}
              onChange={e => update('consentToContact', e.target.checked)}
              className="mt-1" aria-required="true" />
            <label htmlFor="eng-consent" className="text-sm">
              I consent to I&amp;R contacting me in response to this request. *
            </label>
          </div>
          {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
