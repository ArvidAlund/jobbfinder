import { notFound } from "next/navigation";
import { fetchStory } from "@/lib/storyblok";
import RichText from "@/components/RichText";
import "@/lib/storyblok-components";

export default async function JobDetailPage({ params }) {
  const { slug } = await params;
  const story = await fetchStory(`jobs/${slug}`);
  if (!story) notFound();

  const { title, summary, department, location, content } = story.content;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm uppercase tracking-wide text-slate-500">
        {department}
      </p>
      <h1 className="text-3xl font-bold mt-1">{title}</h1>
      <p className="text-slate-600 mt-2">{location}</p>
      <p className="mt-4 text-lg">{summary}</p>
      <div className="mt-8">
        <RichText document={content} />
      </div>
    </article>
  );
}
