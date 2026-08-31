import { StoryblokServerComponent, storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { fetchStory } from "@/lib/storyblok";
import { storyblokComponents } from "@/lib/storyblok-components";

export const dynamic = "force-dynamic";

storyblokInit({
  accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  components: storyblokComponents,
});

export default async function JobsPage({ searchParams }) {
  let story;
  try {
    story = await fetchStory("jobs");
  } catch {
    story = null;
  }
  if (!story) notFound();

  const { department: rawDepartment, q: rawQ } = await searchParams;
  const department = rawDepartment || "";
  const q = rawQ || "";

  return (
    <StoryblokServerComponent
      blok={story.content}
      department={department}
      q={q}
    />
  );
}
