/**
 * NextActionCTAs — contextual next action CTA buttons for an innovation record.
 *
 * Implements F3.9 (Next Action section) and F8.1 (record-level engagement CTAs).
 * Phase 3: buttons open the EngagementModal form with DB-first persistence.
 * Phase 1 used simple mailto links — replaced here per F8.1.
 */
'use client';
import { useState } from 'react';
import { EngagementModal } from './EngagementModal';

const ACTION_LABELS: Record<string, string> = {
  request_demo: 'Request a Demonstration',
  discuss_use_case: 'Discuss a Related Use Case',
  explore_adoption: 'Explore Adoption',
  request_technical_guidance: 'Request Technical Guidance',
  share_related_work: 'Share Related Work',
  contact_ir: 'Contact I&R',
};

interface Action { action_id: string; action_type: string; custom_label: string | null; }
interface RecordRef { id: string; title: string; slug: string; }

interface Props { actions: Action[]; record: RecordRef; }

export function NextActionCTAs({ actions, record }: Props) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const ctaActions = actions.length > 0 ? actions : [{ action_id: 'default', action_type: 'contact_ir', custom_label: null }];

  return (
    <div className="flex flex-wrap gap-3" aria-label="Next action options">
      {ctaActions.map(action => (
        <button
          key={action.action_id}
          onClick={() => setActiveModal(action.action_type)}
          className="px-4 py-2 border border-blue-700 text-blue-700 rounded hover:bg-blue-50"
          aria-label={action.custom_label ?? ACTION_LABELS[action.action_type]}
        >
          {action.custom_label ?? ACTION_LABELS[action.action_type] ?? action.action_type}
        </button>
      ))}

      {activeModal && (
        <EngagementModal
          actionType={activeModal}
          recordId={record.id}
          recordTitle={record.title}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
