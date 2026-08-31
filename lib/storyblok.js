import StoryblokClient from "storyblok-js-client";

let client;

export function getStoryblokApi() {
  if (!client) {
    client = new StoryblokClient({
      accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
    });
  }
  return client;
}

export async function fetchStory(slug, extraParams = {}) {
  try {
    const { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, {
      version: "published",
      ...extraParams,
    });
    return data.story;
  } catch (err) {
    if (err?.status === 404 || err?.response?.status === 404) return null;
    throw err;
  }
}

export async function fetchStories(params) {
  const { data } = await getStoryblokApi().get("cdn/stories", {
    version: "published",
    ...params,
  });
  return data.stories;
}

export async function fetchDatasourceEntries(slug) {
  const { data } = await getStoryblokApi().get("cdn/datasource_entries", {
    datasource: slug,
  });
  return data.datasource_entries;
}
