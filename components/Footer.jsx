export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-300">
        © {new Date().getFullYear()} Jobbportal
      </div>
    </footer>
  );
}
