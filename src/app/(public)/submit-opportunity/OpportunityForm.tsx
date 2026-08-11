'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const REQUEST_TYPES = [
  { value: 'current_mission_problem', label: 'Current mission problem' },
  { value: 'emerging_tech_question', label: 'Emerging technology question' },
  { value: 'request_for_research', label: 'Request for research' },
  { value: 'potential_poc', label: 'Potential proof of concept' },
  { value: 'request_for_demo', label: 'Request for demonstration' },
  { value: 'collaboration_opportunity', label: 'Collaboration opportunity' },
  { value: 'share_existing_work', label: 'Share existing innovation work' },
  { value: 'other', label: 'Other' },
] as const;

interface Props {
  userInfo: { name: string; email: string; office: string };
}

export function OpportunityForm({ userInfo }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    requestType: 'current_mission_problem',
    problemTitle: '',
    problemDescription: '',  // F6.1 — must describe the problem
    affectedUsers: '',
    currentWorkflow: '',
    impact: '',
    desiredOutcome: '',
    knownConstraints: '',
    relatedWorkAttempted: '',
    discoveryParticipants: '',
    additionalContext: '',
    submittingOffice: userInfo.office,
    submitterName: userInfo.name,
    submitterEmail: userInfo.email,
    nonAcceptanceAcknowledged: false,  // F6.4 — required checkbox
    consentToContact: false,
  });

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setErrors({});

    const res = await fetch('/api/v1/submissions/opportunity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: form.requestType,
        problemTitle: form.problemTitle,
        problemDescription: form.problemDescription,
        affectedUsers: form.affectedUsers,
        currentWorkflow: form.currentWorkflow || undefined,
        impact: form.impact,
        desiredOutcome: form.desiredOutcome || undefined,
        knownConstraints: form.knownConstraints || undefined,
        relatedWorkAttempted: form.relatedWorkAttempted || undefined,
        discoveryParticipants: form.discoveryParticipants || undefined,
        additionalContext: form.additionalContext || undefined,
        submittingOffice: form.submittingOffice,
        submitterName: form.submitterName,
        submitterEmail: form.submitterEmail,
        consentToContact: true,
        nonAcceptanceAcknowledged: true,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/submit-opportunity/confirmation?ref=${data.referenceNumber}`);
    } else {
      setErrors(data.fields ?? { _: data.message ?? 'Submission failed' });
    }
    setSubmitting(false);
  }

  return (
    <div>
      {/* Progress indicator */}
      <div aria-label={`Step ${step} of 3`} className="flex gap-2 mb-6">
        {[1, 2, 3].map(n => (
          <div key={n} className={`h-2 flex-1 rounded ${n <= step ? 'bg-blue-700' : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-sm text-gray-600 mb-4">Step {step} of 3</p>

      {/* Step 1: Problem description (F6.1 — starts with problem, not application request) */}
      {step === 1 && (
        <fieldset>
          <legend className="text-lg font-semibold mb-4">Describe the Problem</legend>
          <p className="text-sm text-gray-600 mb-4">
            Focus on the mission problem or friction — not a requested application or solution.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="problemTitle" className="block text-sm font-medium mb-1">Problem title *</label>
              <input
                id="problemTitle"
                type="text"
                value={form.problemTitle}
                onChange={e => update('problemTitle', e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
              {errors.problemTitle && <p className="text-red-600 text-sm mt-1">{errors.problemTitle}</p>}
            </div>
            <div>
              <label htmlFor="requestType" className="block text-sm font-medium mb-1">
                How would you characterize this? *
              </label>
              <select
                id="requestType"
                value={form.requestType}
                onChange={e => update('requestType', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {REQUEST_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="problemDescription" className="block text-sm font-medium mb-1">
                Describe the problem or friction *
                <span className="font-normal text-gray-500 ml-1">(min 50 characters)</span>
              </label>
              <textarea
                id="problemDescription"
                value={form.problemDescription}
                onChange={e => update('problemDescription', e.target.value)}
                rows={5}
                className="w-full border rounded px-3 py-2"
                placeholder="Describe the mission problem or friction your users experience today — not a proposed solution or application."
              />
              {errors.problemDescription && (
                <p className="text-red-600 text-sm mt-1">{errors.problemDescription}</p>
              )}
            </div>
          </div>
        </fieldset>
      )}

      {/* Step 2: Context */}
      {step === 2 && (
        <fieldset>
          <legend className="text-lg font-semibold mb-4">Context</legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="affectedUsers" className="block text-sm font-medium mb-1">
                Who is affected? *
              </label>
              <textarea
                id="affectedUsers"
                value={form.affectedUsers}
                onChange={e => update('affectedUsers', e.target.value)}
                rows={3}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="impact" className="block text-sm font-medium mb-1">
                What is the impact? *
              </label>
              <textarea
                id="impact"
                value={form.impact}
                onChange={e => update('impact', e.target.value)}
                rows={3}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="currentWorkflow" className="block text-sm font-medium mb-1">
                Current workflow (optional)
              </label>
              <textarea
                id="currentWorkflow"
                value={form.currentWorkflow}
                onChange={e => update('currentWorkflow', e.target.value)}
                rows={2}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="desiredOutcome" className="block text-sm font-medium mb-1">
                Desired outcome (optional)
              </label>
              <textarea
                id="desiredOutcome"
                value={form.desiredOutcome}
                onChange={e => update('desiredOutcome', e.target.value)}
                rows={2}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="knownConstraints" className="block text-sm font-medium mb-1">
                Known constraints (optional)
              </label>
              <textarea
                id="knownConstraints"
                value={form.knownConstraints}
                onChange={e => update('knownConstraints', e.target.value)}
                rows={2}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="relatedWorkAttempted" className="block text-sm font-medium mb-1">
                Related work already attempted (optional)
              </label>
              <textarea
                id="relatedWorkAttempted"
                value={form.relatedWorkAttempted}
                onChange={e => update('relatedWorkAttempted', e.target.value)}
                rows={2}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* Step 3: Your information + acknowledgments (F6.2, F6.4) */}
      {step === 3 && (
        <fieldset>
          <legend className="text-lg font-semibold mb-4">Your Information</legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="submittingOffice" className="block text-sm font-medium mb-1">
                Submitting office *
              </label>
              <input
                id="submittingOffice"
                type="text"
                value={form.submittingOffice}
                onChange={e => update('submittingOffice', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="submitterName" className="block text-sm font-medium mb-1">
                Your name *
              </label>
              <input
                id="submitterName"
                type="text"
                value={form.submitterName}
                onChange={e => update('submitterName', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="submitterEmail" className="block text-sm font-medium mb-1">
                Your email *
              </label>
              <input
                id="submitterEmail"
                type="email"
                value={form.submitterEmail}
                onChange={e => update('submitterEmail', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* F6.4 — Non-acceptance acknowledgment checkbox (explicit user action required) */}
            <div className="border-t pt-4 mt-4">
              <div className="flex gap-3 items-start">
                <input
                  id="nonAcceptanceAcknowledged"
                  type="checkbox"
                  checked={form.nonAcceptanceAcknowledged}
                  onChange={e => update('nonAcceptanceAcknowledged', e.target.checked)}
                  className="mt-1"
                  aria-required="true"
                />
                <label htmlFor="nonAcceptanceAcknowledged" className="text-sm">
                  I understand that submitting this form does not imply acceptance into
                  the I&amp;R portfolio or commitment to any action. *
                </label>
              </div>
              <div className="flex gap-3 items-start mt-3">
                <input
                  id="consentToContact"
                  type="checkbox"
                  checked={form.consentToContact}
                  onChange={e => update('consentToContact', e.target.checked)}
                  className="mt-1"
                  aria-required="true"
                />
                <label htmlFor="consentToContact" className="text-sm">
                  I consent to I&amp;R contacting me to follow up on this submission. *
                </label>
              </div>
            </div>

            {errors._ && (
              <p role="alert" className="text-red-600 text-sm">{errors._}</p>
            )}
          </div>
        </fieldset>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep(s => s + 1)}
            className="ml-auto px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !form.nonAcceptanceAcknowledged || !form.consentToContact}
            className="ml-auto px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
}
