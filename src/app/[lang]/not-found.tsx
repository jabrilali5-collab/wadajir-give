import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20">
      <h1 className="text-3xl">Page not found — Bogga lama helin</h1>
      <p className="mt-3 text-ink-soft">The page may have moved, or the fundraiser isn&apos;t public.</p>
      <Link href="/" className="btn btn-primary mt-6">Wadajir Give</Link>
    </div>
  );
}
