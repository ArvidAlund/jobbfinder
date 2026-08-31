# Jobbportal — Design Spec

Date: 2026-08-31

## Purpose
Individual exam project: dynamic CMS-backed job listing site. New Storyblok space, new repo, deployed to Vercel. G + VG scope.

## Stack
- Next.js (App Router, JavaScript, no TypeScript)
- `@storyblok/react` SDK (bridge + CDN fetch)
- Tailwind CSS
- Deploy: Vercel

## Storyblok content model (set up by user in Storyblok UI)
- Content type `job-post`: title (Text), summary (Textarea), department (Single Option → datasource `job-departments`), location (Text), content (RichText), publishedAt (Datetime)
- Content type `page` (generic wrapper, holds nestable blocks)
- Datasource `job-departments`: slug `job-departments`, entries e.g. Utveckling/utveckling, Design/design, Marknadsföring/marknadsforing
- Content folder `jobs/` — `jobs/index` (content type `page`, "Define as root for the folder") + ≥3 published `job-post` stories

## Routes
- `app/layout.jsx` — global Header + Footer
- `app/jobs/page.jsx` — server component. Reads `searchParams` (`department`, `q`). Fetches `jobs/index` story. Renders `<StoryblokServerComponent blok={story.content} />`, passing searchParams down as override props (no form/list markup lives in page.jsx itself).
- `app/jobs/[slug]/page.jsx` — fetches `cdn/stories/jobs/${slug}` (version: published). `notFound()` if missing. Renders title, summary, location, department, `renderRichText(content)`.

## Storyblok components (registered in `components/`)
- `Page` — wrapper for `jobs/index`, renders its nested bloks
- `Toolbar` — nestable block, pure layout container for search-bar + department-filter
- `SearchBar` — `<form method="get">`, input `name=q`, hidden input carries current `department`
- `DepartmentFilter` — `<form method="get">`, `<select name=department>` populated from datasource `job-departments` (fetched via CDN datasource_entries), hidden input carries current `q`
- `JobList` — nestable block in `jobs/index`. Receives department/q as props (overriding its own Storyblok fields when URL params present). Fetches stories: `starts_with: "jobs/"`, `content_type: "job-post"`, applies `filter_query[department][in]` and `search_term` against CDN API. Renders cards (title, summary, location, department) linking to `/jobs/[slug]`. Empty result → "Inga jobb hittades".

## Data flow
URL query params → `jobs/page.jsx` → passed as props into `JobList` via `StoryblokServerComponent` blok override → `JobList` builds CDN query → renders. Toolbar forms are plain GET forms — no client JS, full page reload triggers server-side refetch.

## Error handling
- Detail page: missing story → `notFound()`
- List: empty results → inline message, not an error

## Testing
None — static content site (ponytail: skip; no non-trivial branching logic beyond query building).

## Out of scope
- Auth, comments, pagination beyond CDN defaults, i18n, TypeScript.
