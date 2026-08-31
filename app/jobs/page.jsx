import { StoryblokServerComponent, storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import { fetchStory } from "@/lib/storyblok";
import { storyblokComponents } from "@/lib/storyblok-components";

storyblokInit({
  accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  components: storyblokComponents,
});

export default async function JobsPage({ searchParams }) {
  const story = await fetchStory("jobs/index");
  const department = searchParams?.department || "";
  const q = searchParams?.q || "";

  return (
    <StoryblokServerComponent
      blok={story.content}
      department={department}
      q={q}
    />
  );
}
