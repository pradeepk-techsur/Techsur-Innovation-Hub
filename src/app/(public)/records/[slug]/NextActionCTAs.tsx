/**
 * NextActionCTAs — contextual next action CTA buttons for an innovation record.
 *
 * Implements F3.9: Next Action section. Renders action buttons as mailto links
 * pointing to the I&R routing address. Phase 3 will wire these to the engagement
 * request form; Phase 1 uses mailto links as functional placeholders.
 *
 * Guarantees at minimum one "Contact I&R" fallback link so the Next Action section
 * is never empty when there are no specific actions configured.
 */

interface RecordNextActionRow {
  action_id: string;
  record_id: string;
  action_type: string;
  custom_label: string | null;
  is_enabled: boolean;
  display_order: number;
}

interface RecordProps {
  id: string;
  title: string;
}

interface Props {
  actions: RecordNextActionRow[];
  record: RecordProps;
}

const ACTION_LABELS: Record<string, string> = {
  request_demo: 'Request a Demonstration',
  discuss_use_case: 'Discuss a Related Use Case',
  explore_adoption: 'Explore Adoption',
  request_technical_guidance: 'Request Technical Guidance',
  share_related_work: 'Share Related Work',
  contact_ir: 'Contact I&R',
};

// Phase 3: read routing address from hub_settings at runtime.
// Phase 1: hardcoded from the seeded engagement_routing_address value.
const ROUTING_ADDRESS = 'AOml_TSO_IRB_Team@ao.uscourts.gov';

export function NextActionCTAs({ actions, record }: Props) {
  if (actions.length === 0) {
    // Fallback: always provide at least one CTA so the section is never empty
    return (
      <div>
        <a
          href={`mailto:${ROUTING_ADDRESS}?subject=${encodeURIComponent(`Innovation Hub – ${record.title}`)}`}
          className="inline-block mt-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Contact I&amp;R
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 mt-2" aria-label="Next action options">
      {actions.map(action => (
        <a
          key={action.action_id}
          href={`mailto:${ROUTING_ADDRESS}?subject=${encodeURIComponent(
            `${action.action_type.replace(/_/g, ' ')} – ${record.title}`
          )}`}
          className="inline-block px-4 py-2 border border-blue-700 text-blue-700 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={ACTION_LABELS[action.action_type] ?? action.action_type}
        >
          {action.custom_label ?? ACTION_LABELS[action.action_type] ?? action.action_type}
        </a>
      ))}
    </div>
  );
}
