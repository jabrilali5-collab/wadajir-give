import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col justify-center py-24">
      <p className="t-kicker">404</p>
      <h1 className="t-h1 mt-5 max-w-[16ch]">
        This page couldn&apos;t be <em className="text-forest">found.</em>
      </h1>
      <p className="t-lead mt-5 max-w-[48ch]">
        It may have moved, or the fundraiser isn&apos;t public. Bogga lama helin.
      </p>
      <Link href="/" className="btn btn-primary mt-8 w-fit">
        <ArrowLeft aria-hidden /> Wadajir Give
      </Link>
    </div>
  );
}
