// Server component wraps client LoginForm
import { LoginForm } from './LoginForm';
import { Breadcrumb } from '@/components/Breadcrumb';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const params = await searchParams;
  const returnTo = params.returnTo ?? '/';
  return (
    <main id="main-content">
      <div className="max-w-md mx-auto mt-8 px-4">
        <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Sign In' }]} />
      </div>
      <div className="max-w-md mx-auto p-8 border rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <p className="text-gray-600 mb-6">
          Sign in to submit opportunities, share innovation work, or initiate engagement requests.
        </p>
        <LoginForm returnTo={returnTo} />
        <p className="mt-4 text-sm text-gray-500">
          Browsing, searching, and viewing innovation records does not require sign-in.
        </p>
      </div>
    </main>
  );
}
