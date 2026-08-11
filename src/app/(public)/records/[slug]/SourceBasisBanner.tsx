/**
 * SourceBasisBanner — appears on innovation records that link to an existing
 * lessons-learned document or other authoritative source.
 *
 * Implements F5.1: the existing document IS the source of record; the Hub
 * curates and links — it does NOT rehost or replace the authoritative source.
 * Implements F5.4: the source reference is visible on the record detail page,
 * reinforcing that the Hub record is derivative and the authoritative source
 * remains the primary reference.
 *
 * Security: source_basis is curator-authored content. External URL rendered
 * with rel="noopener noreferrer" target="_blank" to prevent tabnapping (T-02-04-01).
 * Open redirect to external sites is inherent in F5.1 (linking to authoritative
 * sources) and accepted per threat model (curator-controlled, not anonymous input).
 */

interface Props {
  sourceBasis: string; // May be a URL or a plain-text reference description
}

function isUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

export function SourceBasisBanner({ sourceBasis }: Props) {
  if (!sourceBasis) return null;

  return (
    <aside
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4"
      aria-label="Source of record"
      role="note"
    >
      <p className="text-sm font-medium text-blue-800 mb-1">
        Source of Record
      </p>
      <p className="text-sm text-blue-700">
        This Hub record is based on and links to an authoritative source document.
        The Hub summarizes and organizes the source — it does not replace it.
      </p>
      {isUrl(sourceBasis) ? (
        <a
          href={sourceBasis}
          rel="noopener noreferrer"
          target="_blank"
          className="inline-block mt-2 text-sm text-blue-600 underline hover:text-blue-800"
          aria-label="Open authoritative source document (opens in new tab)"
        >
          Open authoritative source →
        </a>
      ) : (
        <p className="mt-2 text-sm text-blue-700 italic">{sourceBasis}</p>
      )}
    </aside>
  );
}
