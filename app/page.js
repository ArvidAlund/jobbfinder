import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero / sök */}
      <main className="flex-1">
        <section className="max-w-3xl mx-auto text-center px-6 py-24">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hitta ditt nästa jobb
          </h1>
          <p className="text-gray-600 mb-8">
            Sök bland tusentals jobbannonser och hitta rätt tjänst för dig.
          </p>

          {/* Liknande knapp som i headern */}
          <Link
            href="/jobs"
            className="inline-block px-6 py-3 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Visa alla jobb
          </Link>
        </section>
      </main>
    </div>
  );
}
