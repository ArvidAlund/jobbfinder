import Link from "next/link";

export default function JobCard({ story }) {
  const { title, summary, location, department } = story.content;
  const slug = story.slug;

  return (
    <li className="border rounded-lg p-5 hover:shadow-md transition-shadow">
      <Link href={`/jobs/${slug}`} className="block">
        <p className="text-sm uppercase tracking-wide text-slate-500">
          {department}
        </p>
        <h2 className="text-xl font-semibold mt-1">{title}</h2>
        <p className="text-slate-600 mt-1">{location}</p>
        <p className="mt-2">{summary}</p>
      </Link>
    </li>
  );
}
