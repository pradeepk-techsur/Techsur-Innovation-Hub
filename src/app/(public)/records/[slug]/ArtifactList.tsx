/**
 * ArtifactList — displays authoritative artifacts for an innovation record.
 *
 * SEC-04 / T-01-03-01: Restricted artifact URLs are NOT rendered as links.
 * The API redacts URLs at the query layer (CASE WHEN is_restricted THEN NULL ELSE url END).
 * This component enforces a second defense-in-depth check: only renders href when url is non-null.
 *
 * Implements F3.8 (Authoritative Artifacts section).
 */

interface ArtifactRow {
  artifact_id: string;
  artifact_type: string;
  name: string;
  url: string | null; // null when is_restricted = true (API redacts it — SEC-04)
  is_restricted: boolean;
  access_notes: string | null;
  display_order: number;
}

interface Props {
  artifacts: ArtifactRow[];
}

const ARTIFACT_TYPE_LABELS: Record<string, string> = {
  lessons_learned: 'Lessons Learned',
  poc_report: 'POC Report',
  decision_brief: 'Decision Brief',
  architecture_diagram: 'Architecture Diagram',
  demo_video: 'Demo Video',
  repository: 'Repository',
  infrastructure_definition: 'Infrastructure Definition',
  test_results: 'Test Results',
  security_findings: 'Security Findings',
  technical_playbook: 'Technical Playbook',
  other: 'Other',
};

export function ArtifactList({ artifacts }: Props) {
  if (artifacts.length === 0) {
    return <p className="text-gray-500">No artifacts linked for this record.</p>;
  }

  return (
    <ul className="space-y-3" aria-label="Authoritative artifacts">
      {artifacts.map(artifact => (
        <li key={artifact.artifact_id} className="border border-gray-200 rounded p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {ARTIFACT_TYPE_LABELS[artifact.artifact_type] ?? artifact.artifact_type}
              </span>
              {/* F3.8: Link if not restricted; name only if restricted (SEC-04) */}
              {artifact.url ? (
                <a
                  href={artifact.url}
                  className="block font-medium text-blue-700 hover:underline mt-1"
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={`Open artifact: ${artifact.name} (opens in new tab)`}
                >
                  {artifact.name}
                </a>
              ) : (
                <p className="block font-medium mt-1" aria-label={`Artifact: ${artifact.name}`}>
                  {artifact.name}
                </p>
              )}
              {artifact.access_notes && (
                <p className="text-sm text-gray-600 mt-1">{artifact.access_notes}</p>
              )}
            </div>
            {artifact.is_restricted && (
              <span
                className="flex-shrink-0 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
                aria-label="Access restricted"
              >
                Access restricted
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
