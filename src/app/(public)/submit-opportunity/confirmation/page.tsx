export default async function OpportunityConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;

  return (
    <main id="main-content" className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="text-green-600 text-5xl mb-4" aria-hidden="true">✓</div>
      <h1 className="text-2xl font-bold">Submission Received</h1>
      {params.ref && (
        <p className="mt-2 text-gray-600">
          Reference number: <strong>{params.ref}</strong>
        </p>
      )}

      {/* F6.4 — non-acceptance reiterated on confirmation page */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded text-left text-sm text-amber-800">
        <p>
          <strong>Please note:</strong> Submitting this form does not imply acceptance into
          the I&amp;R portfolio or commitment to any action. Your submission will be reviewed
          by the I&amp;R team. If it is a good fit, they will follow up with you.
        </p>
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <a href="/catalog" className="px-4 py-2 border rounded hover:bg-gray-50">
          Browse Innovation Records
        </a>
        <a href="/" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
          Return Home
        </a>
      </div>
    </main>
  );
}
