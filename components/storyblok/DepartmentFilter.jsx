import { fetchDatasourceEntries } from "@/lib/storyblok";

export default async function DepartmentFilter({ department, q }) {
  const entries = await fetchDatasourceEntries("job-departments");

  return (
    <form method="get" className="flex gap-2 items-center">
      {q && <input type="hidden" name="q" value={q} />}
      <select name="department" defaultValue={department || ""} className="border rounded px-3 py-2">
        <option value="">Alla avdelningar</option>
        {entries.map((entry) => (
          <option key={entry.value} value={entry.value}>
            {entry.name}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-slate-900 text-white rounded px-4 py-2">
        Filtrera
      </button>
    </form>
  );
}
