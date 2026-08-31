import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import Page from "@/components/storyblok/Page";
import JobList from "@/components/storyblok/JobList";
import Toolbar from "@/components/storyblok/Toolbar";
import SearchBar from "@/components/storyblok/SearchBar";
import DepartmentFilter from "@/components/storyblok/DepartmentFilter";

export const storyblokComponents = {
  page: Page,
  "job-list": JobList,
  "toolbar": Toolbar,
  "search-bar": SearchBar,
  "department-filter": DepartmentFilter,
};

storyblokInit({
  accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  components: storyblokComponents,
});
