'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MATURITY_OPTIONS = [
  { value: 'idea', label: 'Idea' },
  { value: 'evaluated_idea', label: 'Evaluated idea' },
  { value: 'experiment_poc', label: 'Experiment / POC' },
  { value: 'prototype_pilot', label: 'Prototype / Pilot' },
  { value: 'production_validated', label: 'Production validated' },
  { value: 'archived_retired', label: 'Archived / Retired' },
] as const;

const COLLABORATION_OPTIONS = [
  { value: 'open_for_reuse', label: 'Open for reuse — others may adopt freely' },
  { value: 'seeking_collaborator', label: 'Seeking collaborator — want to co-develop further' },
  { value: 'informational_only', label: 'Informational only — share lessons learned, no reuse intended' },
  { value: 'seeking_adopter', label: 'Seeking adopter — want someone to take this forward' },
  { value: 'discuss_with_ir', label: 'Discuss with I&R — not sure yet' },
] as const;

interface Props {
  userInfo: { name: string; email: string };
}

export function ContributionForm({ userInfo }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    // Step 1: About the work
    contributionTitle: '',
    problemAddressed: '',
    workDescription: '',
    currentMaturity: 'experiment_poc' as typeof MATURITY_OPTIONS[number]['value'],
    collaborationPreference: 'open_for_reuse' as typeof COLLABORATION_OPTIONS[number]['value'],
    // Step 2: Attribution + contact (F7.3)
    contributingOffice: '',
    contributorNames: '',
    currentOwner: '',
    ownerContactEmail: '',
    artifactLinks: '',
    knownLimitations: '',
    submitterName: userInfo.name,
    submitterEmail: userInfo.email,
    nonEndorsementAcknowledged: false,  // F7.4 — required checkbox
    consentToContact: false,
  });

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setErrors({});

    const res = await fetch('/api/v1/submissions/contribution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contributionTitle: form.contributionTitle,
        problemAddressed: form.problemAddressed,
        workDescription: form.workDescription,
        contributingOffice: form.contributingOffice,
        contributorNames: form.contributorNames,
        currentMaturity: form.currentMaturity,
        currentOwner: form.currentOwner,
        ownerContactEmail: form.ownerContactEmail,
        collaborationPreference: form.collaborationPreference,
        artifactLinks: form.artifactLinks || undefined,
        knownLimitations: form.knownLimitations || undefined,
        submitterName: form.submitterName,
        submitterEmail: form.submitterEmail,
        nonEndorsementAcknowledged: true,
        consentToContact: true,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/submit-contribution/confirmation?ref=${data.referenceNumber}`);
    } else {
      setErrors(data.fields ?? { _: data.message ?? 'Submission failed' });
    }
    setSubmitting(false);
  }

  return (
    <div>
      {/* Progress indicator */}
      <div aria-label={`Step ${step} of 2`} className="flex gap-2 mb-6">
        {[1, 2].map(n => (
          <div key={n} className={`h-2 flex-1 rounded ${n <= step ? 'bg-blue-700' : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-sm text-gray-600 mb-4">Step {step} of 2</p>

      {/* Step 1: About the work (F7.1, F7.2) */}
      {step === 1 && (
        <fieldset>
          <legend className="text-lg font-semibold mb-4">About the Work</legend>
          <p className="text-sm text-gray-600 mb-4">
            Describe the existing work you are sharing — not a new problem idea.
            This form is for teams who already have innovation work to contribute.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="contributionTitle" className="block text-sm font-medium mb-1">
                Contribution title *
              </label>
              <input
                id="contributionTitle"
                type="text"
                value={form.contributionTitle}
                onChange={e => update('contributionTitle', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="A concise name for your innovation work"
                required
              />
              {errors.contributionTitle && <p className="text-red-600 text-sm mt-1">{errors.contributionTitle}</p>}
            </div>
            <div>
              <label htmlFor="problemAddressed" className="block text-sm font-medium mb-1">
                Problem addressed *
                <span className="font-normal text-gray-500 ml-1">(min 30 characters)</span>
              </label>
              <textarea
                id="problemAddressed"
                value={form.problemAddressed}
                onChange={e => update('problemAddressed', e.target.value)}
                rows={4}
                className="w-full border rounded px-3 py-2"
                placeholder="What mission problem or friction did this work address?"
              />
              {errors.problemAddressed && <p className="text-red-600 text-sm mt-1">{errors.problemAddressed}</p>}
            </div>
            <div>
              <label htmlFor="workDescription" className="block text-sm font-medium mb-1">
                Work description *
                <span className="font-normal text-gray-500 ml-1">(min 50 characters)</span>
              </label>
              <textarea
                id="workDescription"
                value={form.workDescription}
                onChange={e => update('workDescription', e.target.value)}
                rows={5}
                className="w-full border rounded px-3 py-2"
                placeholder="Describe what was built, tested, or learned. Include outcomes and findings."
              />
              {errors.workDescription && <p className="text-red-600 text-sm mt-1">{errors.workDescription}</p>}
            </div>
            <div>
              <label htmlFor="currentMaturity" className="block text-sm font-medium mb-1">
                Current maturity *
              </label>
              <select
                id="currentMaturity"
                value={form.currentMaturity}
                onChange={e => update('currentMaturity', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {MATURITY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="collaborationPreference" className="block text-sm font-medium mb-1">
                Collaboration preference *
              </label>
              <select
                id="collaborationPreference"
                value={form.collaborationPreference}
                onChange={e => update('collaborationPreference', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {COLLABORATION_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
      )}

      {/* Step 2: Attribution + contact (F7.3 — immutable attribution fields) */}
      {step === 2 && (
        <fieldset>
          <legend className="text-lg font-semibold mb-4">Attribution &amp; Contact</legend>

          {/* F7.3 — Attribution notice */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Attribution preservation:</strong> The information you provide below will be
              preserved and publicly attributed if the contribution is published. It cannot be
              removed after submission — this protects your credit as the contributor.
            </p>
          </div>

          <div className="space-y-4">
            {/* F7.3: Required attribution fields */}
            <div>
              <label htmlFor="contributingOffice" className="block text-sm font-medium mb-1">
                Contributing office *
                <span className="font-normal text-blue-700 ml-1">(preserved for attribution)</span>
              </label>
              <input
                id="contributingOffice"
                type="text"
                value={form.contributingOffice}
                onChange={e => update('contributingOffice', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. District Court, Eastern District of Virginia"
                required
              />
              {errors.contributingOffice && <p className="text-red-600 text-sm mt-1">{errors.contributingOffice}</p>}
            </div>
            <div>
              <label htmlFor="contributorNames" className="block text-sm font-medium mb-1">
                Contributor names *
                <span className="font-normal text-blue-700 ml-1">(preserved for attribution)</span>
              </label>
              <input
                id="contributorNames"
                type="text"
                value={form.contributorNames}
                onChange={e => update('contributorNames', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Names of team members who did the work"
                required
              />
              {errors.contributorNames && <p className="text-red-600 text-sm mt-1">{errors.contributorNames}</p>}
            </div>
            <div>
              <label htmlFor="currentOwner" className="block text-sm font-medium mb-1">
                Current owner *
                <span className="font-normal text-blue-700 ml-1">(preserved for attribution)</span>
              </label>
              <input
                id="currentOwner"
                type="text"
                value={form.currentOwner}
                onChange={e => update('currentOwner', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Who owns or maintains this work"
                required
              />
              {errors.currentOwner && <p className="text-red-600 text-sm mt-1">{errors.currentOwner}</p>}
            </div>
            <div>
              <label htmlFor="ownerContactEmail" className="block text-sm font-medium mb-1">
                Owner contact email *
              </label>
              <input
                id="ownerContactEmail"
                type="email"
                value={form.ownerContactEmail}
                onChange={e => update('ownerContactEmail', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.ownerContactEmail && <p className="text-red-600 text-sm mt-1">{errors.ownerContactEmail}</p>}
            </div>
            <div>
              <label htmlFor="artifactLinks" className="block text-sm font-medium mb-1">
                Artifact links (optional)
              </label>
              <textarea
                id="artifactLinks"
                value={form.artifactLinks}
                onChange={e => update('artifactLinks', e.target.value)}
                rows={2}
                className="w-full border rounded px-3 py-2"
                placeholder="Links to reports, demos, code, or documentation"
              />
            </div>
            <div>
              <label htmlFor="knownLimitations" className="block text-sm font-medium mb-1">
                Known limitations (optional)
              </label>
              <textarea
                id="knownLimitations"
                value={form.knownLimitations}
                onChange={e => update('knownLimitations', e.target.value)}
                rows={2}
                className="w-full border rounded px-3 py-2"
                placeholder="Constraints, scope limits, or caveats others should know"
              />
            </div>

            {/* Submitter info */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Your contact information</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="submitterName" className="block text-sm font-medium mb-1">Your name *</label>
                  <input
                    id="submitterName"
                    type="text"
                    value={form.submitterName}
                    onChange={e => update('submitterName', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="submitterEmail" className="block text-sm font-medium mb-1">Your email *</label>
                  <input
                    id="submitterEmail"
                    type="email"
                    value={form.submitterEmail}
                    onChange={e => update('submitterEmail', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* F7.4 — Non-endorsement acknowledgment (required) */}
            <div className="border-t pt-4 mt-2">
              <div className="flex gap-3 items-start">
                <input
                  id="nonEndorsementAcknowledged"
                  type="checkbox"
                  checked={form.nonEndorsementAcknowledged}
                  onChange={e => update('nonEndorsementAcknowledged', e.target.checked)}
                  className="mt-1"
                  aria-required="true"
                />
                <label htmlFor="nonEndorsementAcknowledged" className="text-sm">
                  I understand that submitting this work does not imply central endorsement,
                  and that my contribution will go through a curation review before any publication. *
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
                  I consent to I&amp;R contacting me to follow up on this contribution. *
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
        {step < 2 ? (
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
            disabled={submitting || !form.nonEndorsementAcknowledged || !form.consentToContact}
            className="ml-auto px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Contribution'}
          </button>
        )}
      </div>
    </div>
  );
}
