import { StoryblokServerComponent } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { fetchStory } from "@/lib/storyblok";
import "@/lib/storyblok-components";

export const dynamic = "force-dynamic";

export default async function JobsPage({ searchParams }) {
  const story = await fetchStory("jobs");
  if (!story) notFound();

  const { department: rawDepartment, q: rawQ } = await searchParams;
  const department = String(rawDepartment || "");
  const q = String(rawQ || "");

  return (
    <StoryblokServerComponent
      blok={story.content}
      department={department}
      q={q}
    />
  );
}
