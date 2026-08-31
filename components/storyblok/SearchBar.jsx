export default function SearchBar({ department, q }) {
  return (
    <form method="get" className="flex gap-2 items-center">
      {department && (
        <input type="hidden" name="department" value={department} />
      )}
      <input
        type="text"
        name="q"
        defaultValue={q || ""}
        placeholder="Sök jobb..."
        className="border rounded px-3 py-2"
      />
      <button type="submit" className="bg-slate-900 text-white rounded px-4 py-2">
        Sök
      </button>
    </form>
  );
}
