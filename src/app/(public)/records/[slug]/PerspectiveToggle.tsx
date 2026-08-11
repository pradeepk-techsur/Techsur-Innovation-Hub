'use client';
/**
 * PerspectiveToggle — ARIA tablist toggle between Executive and Technical perspectives (F4.1).
 *
 * Implements WCAG 2.1 AA keyboard-accessible tab pattern:
 *   - role="tablist" on the container
 *   - role="tab" + aria-selected on each button
 *   - aria-controls pointing to the matching tabpanel id
 *   - tabIndex managed so only the active tab is in the tab order
 *
 * Both perspectives render from the same `record` prop — no duplicate API calls (F4.4).
 * The component is a Client Component ('use client') for useState; the parent SSR
 * page passes all data as props, so there is no client-side data fetching.
 */

import { useState } from 'react';
import { ExecutiveView } from './ExecutiveView';
import { TechnicalView } from './TechnicalView';
import type { InnovationRecordRow } from '@/lib/db/types';

type Perspective = 'executive' | 'technical';

interface ArtifactRow {
  artifact_id: string;
  artifact_type: string;
  name: string;
  url: string | null;
  is_restricted: boolean;
  access_notes: string | null;
  display_order: number;
}

interface NextActionRow {
  action_id: string;
  record_id: string;
  action_type: string;
  custom_label: string | null;
  is_enabled: boolean;
  display_order: number;
}

interface Props {
  record: InnovationRecordRow;
  artifacts: ArtifactRow[];
  next_actions: NextActionRow[];
  defaultPerspective?: Perspective;
}

export function PerspectiveToggle({
  record,
  artifacts,
  next_actions,
  defaultPerspective = 'executive',
}: Props) {
  const [active, setActive] = useState<Perspective>(defaultPerspective);

  return (
    <div>
      {/* ARIA tablist — keyboard accessible per WCAG 2.1 AA */}
      <div role="tablist" aria-label="Choose perspective" className="flex border-b mb-6">
        <button
          id="executive-tab"
          role="tab"
          aria-selected={active === 'executive'}
          aria-controls="executive-panel"
          onClick={() => setActive('executive')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            active === 'executive'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          tabIndex={active === 'executive' ? 0 : -1}
        >
          Executive Perspective
        </button>
        <button
          id="technical-tab"
          role="tab"
          aria-selected={active === 'technical'}
          aria-controls="technical-panel"
          onClick={() => setActive('technical')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            active === 'technical'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          tabIndex={active === 'technical' ? 0 : -1}
        >
          Technical Perspective
        </button>
      </div>

      {/* Tab panels — same underlying record data (F4.1, F4.4) */}
      {active === 'executive' ? (
        <ExecutiveView record={record} artifacts={artifacts} next_actions={next_actions} />
      ) : (
        <TechnicalView record={record} artifacts={artifacts} next_actions={next_actions} />
      )}
    </div>
  );
}
