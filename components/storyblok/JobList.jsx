import { fetchStories } from "@/lib/storyblok";
import JobCard from "./JobCard";

export default async function JobList({ blok, department, q }) {
  const params = {
    starts_with: "jobs/",
    content_type: "job-post",
    excluding_slugs: "jobs",
  };

  if (department) {
    params.filter_query = { department: { in: department } };
  }
  if (q) {
    params.search_term = q;
  }

  const stories = await fetchStories(params);

  if (!stories?.length) {
    return (
      <p className="mx-auto max-w-5xl px-4 py-10 text-slate-600">
        Inga jobb hittades.
      </p>
    );
  }

  return (
    <ul className="mx-auto max-w-5xl px-4 py-10 grid gap-4">
      {stories.map((story) => (
        <JobCard key={story.uuid} story={story} />
      ))}
    </ul>
  );
}
