
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="utility-page mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl font-black">Access not authorized</h1>
      <p className="mt-4 leading-7 text-slate-600">
        Your account is signed in, but it is not configured as a portfolio administrator.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block font-semibold text-forest"
      >
        Return to portfolio
      </Link>
    </main>
  );
}
