import Link from 'next/link';

// Rendered when a logged-in stakeholder attempts to access /curator (AUTH-04)
// The curator layout redirects wrong-role sessions here instead of to /login
export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
        <p className="text-gray-600 mb-4">
          Your account does not have curator or admin access. If you believe this is an error,
          contact your administrator.
        </p>
        <p className="text-xs text-gray-400 mb-6">HTTP 403 — Authenticated but insufficient role</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700"
        >
          Return to Hub
        </Link>
      </div>
    </div>
  );
}
