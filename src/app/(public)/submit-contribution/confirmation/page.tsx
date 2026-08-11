export default async function ContributionConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;

  return (
    <main id="main-content" className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="text-green-600 text-5xl mb-4" aria-hidden="true">✓</div>
      <h1 className="text-2xl font-bold">Contribution Received</h1>
      {params.ref && (
        <p className="mt-2 text-gray-600">Reference number: <strong>{params.ref}</strong></p>
      )}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-left text-sm text-blue-800">
        <p><strong>What happens next:</strong></p>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>Your contribution enters the I&amp;R curation queue</li>
          <li>Attribution and ownership information you provided will be preserved</li>
          <li>If published, the resulting record will remain linked to your contribution</li>
          <li>Submission does not imply central endorsement or approval</li>
        </ul>
      </div>
      <div className="mt-8 flex gap-4 justify-center">
        <a href="/catalog" className="px-4 py-2 border rounded hover:bg-gray-50">
          Browse Innovation Records
        </a>
      </div>
    </main>
  );
}
