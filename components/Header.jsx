import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Jobbportal
        </Link>
        <nav>
          <Link href="/jobs" className="hover:underline">
            Lediga jobb
          </Link>
        </nav>
      </div>
    </header>
  );
}
