# Jobbportal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js jobbportal (list + detail pages, VG toolbar filter/search) backed by a Storyblok `job-post` content type, deployable to Vercel.

**Architecture:** Next.js App Router site. Storyblok CDN API is the only data source (no local DB). List page fetches an index story containing nestable Storyblok blocks (Toolbar, JobList) rendered via `StoryblokServerComponent`; URL search params drive filtering server-side. Detail page fetches a single story by slug.

**Tech Stack:** Next.js 14 (JavaScript, App Router), `@storyblok/react`, Tailwind CSS, deployed on Vercel.

## Global Constraints
- New repo (not course project repo) — this directory `D:\kod\skola` is it.
- Content types/datasource/stories created manually by user in Storyblok UI (not by this plan) — plan assumes: content type `job-post` with fields title/summary/department/location/content/publishedAt, content type `page`, datasource `job-departments`, folder `jobs/` with `jobs/index` root story + ≥3 `job-post` stories.
- Use `version: "published"` against Storyblok CDN in all fetches (per spec, for production correctness).
- `app/jobs/page.jsx` must contain NO form or list markup — only fetch + prop passing.
- Env var name: `STORYBLOK_DELIVERY_API_TOKEN`.
- Tailwind CSS for all styling.
- No automated test framework — this is a static content site with no non-trivial branching logic; each task's "test" step is a manual dev-server verification instead (per spec's testing section: none required).

---

### Task 1: Project scaffold + Storyblok SDK wiring

**Files:**
- Create: `package.json`, `next.config.mjs`, `tailwind.config.js`, `postcss.config.js`, `app/globals.css`, `app/layout.jsx`
- Create: `lib/storyblok.js` — Storyblok client init + shared fetch helpers
- Create: `.env.local.example`
- Create: `.gitignore`

**Interfaces:**
- Produces: `lib/storyblok.js` exports:
  - `getStoryblokApi()` — returns configured `@storyblok/react` client instance (also registers components passed in)
  - `fetchStory(slug, extraParams = {})` — async, calls `cdn/stories/${slug}` with `version: "published"`, returns `data.story` or `null` on 404
  - `fetchStories(params)` — async, calls `cdn/stories` with `version: "published"` merged with `params`, returns `data.stories` (array)
  - `fetchDatasourceEntries(slug)` — async, calls `cdn/datasource_entries?datasource=${slug}`, returns array of `{name, value}`

- [ ] **Step 1: Scaffold Next.js app**

```bash
cd "D:/kod/skola"
npx --yes create-next-app@latest . --js --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

When prompted about existing files in the directory (docs/, .git/), allow it to proceed (it only scaffolds new files, doesn't touch existing ones).

- [ ] **Step 2: Install Storyblok SDK**

```bash
npm install @storyblok/react
```

- [ ] **Step 3: Add env example and gitignore entries**

`.env.local.example`:
```
STORYBLOK_DELIVERY_API_TOKEN=your_token_here
```

Ensure `.gitignore` contains `.env*.local` (create-next-app adds this by default — verify with `cat .gitignore`).

- [ ] **Step 4: Write `lib/storyblok.js`**

```js
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
```

Install the underlying client used above:

```bash
npm install storyblok-js-client
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: build succeeds (default Next.js starter page compiles).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Storyblok client helpers"
```

---

### Task 2: Global layout — Header + Footer

**Files:**
- Create: `components/Header.jsx`
- Create: `components/Footer.jsx`
- Modify: `app/layout.jsx` — render `<Header />` above `{children}` and `<Footer />` below

**Interfaces:**
- Consumes: nothing (static components)
- Produces: `Header` and `Footer` default-exported React components, no props

- [ ] **Step 1: Write `components/Header.jsx`**

```jsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Jobbportal
        </Link>
        <nav>
          <Link href="/jobs" className="hover:underline">
            Lediga jobb
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Write `components/Footer.jsx`**

```jsx
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-300">
        © {new Date().getFullYear()} Jobbportal
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Wire into `app/layout.jsx`**

```jsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Jobbportal",
  description: "Lediga jobb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Open `http://localhost:3000` in browser. Expected: header with "Jobbportal" + "Lediga jobb" link, footer with copyright, on every page. Stop dev server after checking (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add global header and footer layout"
```

---

### Task 3: Job detail page `/jobs/[slug]`

**Files:**
- Create: `app/jobs/[slug]/page.jsx`
- Create: `components/RichText.jsx` — renders Storyblok richtext field

**Interfaces:**
- Consumes: `fetchStory(slug)` from `lib/storyblok.js` (Task 1)
- Produces: nothing consumed by later tasks (leaf route)

- [ ] **Step 1: Write `components/RichText.jsx`**

```jsx
import { renderRichText } from "@storyblok/react";

export default function RichText({ document }) {
  if (!document) return null;
  const html = renderRichText(document);
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

- [ ] **Step 2: Write `app/jobs/[slug]/page.jsx`**

```jsx
import { notFound } from "next/navigation";
import { fetchStory } from "@/lib/storyblok";
import RichText from "@/components/RichText";

export default async function JobDetailPage({ params }) {
  const story = await fetchStory(`jobs/${params.slug}`);
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
```

Note: `department` here renders the raw datasource value (e.g. `utveckling`). If a human-readable label is wanted, that's a display nicety, not required by spec — skip (YAGNI).

- [ ] **Step 3: Verify** (requires real Storyblok space + token + at least one published `job-post` story at e.g. `jobs/frontend-utvecklare` — set up per spec before this step)

```bash
npm run dev
```
Visit `http://localhost:3000/jobs/<a-real-slug>`. Expected: title, location, summary, and rich text content render. Visit `http://localhost:3000/jobs/does-not-exist`. Expected: Next.js 404 page.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add job detail page"
```

---

### Task 4: Storyblok block registry + JobList block

**Files:**
- Create: `components/storyblok/JobList.jsx`
- Create: `components/storyblok/JobCard.jsx`
- Create: `lib/storyblok-components.js` — the component-name → component map used to init the bridge

**Interfaces:**
- Consumes: `fetchStories`, `fetchDatasourceEntries` from `lib/storyblok.js`
- Produces: `JobList` accepts props `{ blok, department, q }` where `blok` is the Storyblok blok object (may carry editor-set `filter_query`/`search_term` fields, ignored when `department`/`q` props are passed) — `department`/`q` are the URL-driven overrides. Registered in `lib/storyblok-components.js` under key `"job-list"`.

- [ ] **Step 1: Write `components/storyblok/JobCard.jsx`**

```jsx
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
```

- [ ] **Step 2: Write `components/storyblok/JobList.jsx`**

```jsx
import { fetchStories } from "@/lib/storyblok";
import JobCard from "./JobCard";

export default async function JobList({ blok, department, q }) {
  const params = {
    starts_with: "jobs/",
    content_type: "job-post",
    excluding_slugs: "jobs/index",
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
```

- [ ] **Step 3: Write `lib/storyblok-components.js`**

```js
import JobList from "@/components/storyblok/JobList";

export const storyblokComponents = {
  "job-list": JobList,
};
```

- [ ] **Step 4: Verify** (needs ≥3 published `job-post` stories under `jobs/` per spec)

Write a throwaway script to sanity-check the fetch logic before wiring the page:

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const { fetchStories } = require('./lib/storyblok.js');
fetchStories({ starts_with: 'jobs/', content_type: 'job-post' }).then(s => {
  console.log(s.length, 'stories found');
  console.log(s.map(x => x.slug));
});
"
```
Expected: prints 3+ slugs. (If this fails with an import error because `lib/storyblok.js` uses ESM `export`, instead verify via Step 5's dev server check — that's the authoritative check for this task.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add JobList Storyblok block with filter/search query building"
```

---

### Task 5: Toolbar blocks — SearchBar + DepartmentFilter

**Files:**
- Create: `components/storyblok/SearchBar.jsx`
- Create: `components/storyblok/DepartmentFilter.jsx`
- Create: `components/storyblok/Toolbar.jsx`
- Modify: `lib/storyblok-components.js` — register `"toolbar"`, `"search-bar"`, `"department-filter"`

**Interfaces:**
- Consumes: `fetchDatasourceEntries` from `lib/storyblok.js`
- Produces: `Toolbar` renders its `blok.body` array via `StoryblokServerComponent`. `SearchBar`/`DepartmentFilter` accept `{ department, q }` props (current active filter state, passed down from the page) so each form preserves the other's current value in a hidden field.

- [ ] **Step 1: Write `components/storyblok/SearchBar.jsx`**

```jsx
export default function SearchBar({ department, q }) {
  return (
    <form method="get" className="flex gap-2 items-center">
      {department && (
        <input type="hidden" name="department" value={department} />
      )}
      <input
        type="text"
        name="q"
        defaultValue={q || ""}
        placeholder="Sök jobb..."
        className="border rounded px-3 py-2"
      />
      <button type="submit" className="bg-slate-900 text-white rounded px-4 py-2">
        Sök
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Write `components/storyblok/DepartmentFilter.jsx`**

```jsx
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
```

- [ ] **Step 3: Write `components/storyblok/Toolbar.jsx`**

```jsx
import { StoryblokServerComponent } from "@storyblok/react/rsc";

export default function Toolbar({ blok, department, q }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 flex flex-wrap gap-4 items-center justify-between">
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent
          blok={nestedBlok}
          key={nestedBlok._uid}
          department={department}
          q={q}
        />
      ))}
    </div>
  );
}
```

Note: `body` is the expected field name for the Toolbar's nestable-blocks field in Storyblok (per spec: "toolbar — Nestable Block som behållare"). Confirm this matches the actual field name set up in Storyblok; rename here if the user named it differently.

- [ ] **Step 4: Register components in `lib/storyblok-components.js`**

```js
import JobList from "@/components/storyblok/JobList";
import Toolbar from "@/components/storyblok/Toolbar";
import SearchBar from "@/components/storyblok/SearchBar";
import DepartmentFilter from "@/components/storyblok/DepartmentFilter";

export const storyblokComponents = {
  "job-list": JobList,
  "toolbar": Toolbar,
  "search-bar": SearchBar,
  "department-filter": DepartmentFilter,
};
```

- [ ] **Step 5: Verify**

Deferred to Task 6 (needs the page wired up to actually render these via `StoryblokServerComponent`) — no standalone check here since these are Storyblok blocks, not routes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add toolbar, search-bar, and department-filter Storyblok blocks"
```

---

### Task 6: Jobs list page `/jobs` + Page wrapper block

**Files:**
- Create: `app/jobs/page.jsx`
- Create: `components/storyblok/Page.jsx`
- Modify: `lib/storyblok-components.js` — register `"page"`

**Interfaces:**
- Consumes: `fetchStory` from `lib/storyblok.js`, `storyblokComponents` from `lib/storyblok-components.js`, all Task 4/5 blocks (via the registry, not directly)
- Produces: route `/jobs` — final integration point, nothing else depends on it

- [ ] **Step 1: Write `components/storyblok/Page.jsx`**

```jsx
import { StoryblokServerComponent } from "@storyblok/react/rsc";

export default function Page({ blok, ...overrideProps }) {
  return (
    <>
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent
          blok={nestedBlok}
          key={nestedBlok._uid}
          {...overrideProps}
        />
      ))}
    </>
  );
}
```

- [ ] **Step 2: Register in `lib/storyblok-components.js`**

```js
import Page from "@/components/storyblok/Page";

export const storyblokComponents = {
  page: Page,
  "job-list": JobList,
  toolbar: Toolbar,
  "search-bar": SearchBar,
  "department-filter": DepartmentFilter,
};
```

- [ ] **Step 3: Write `app/jobs/page.jsx`**

No form or list markup here — only fetch + prop-forwarding, per spec constraint.

```jsx
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
```

- [ ] **Step 4: Verify** (requires `jobs/index` story of type `page` with a `toolbar` block containing `search-bar` + `department-filter`, and a `job-list` block, all set up per spec)

```bash
npm run dev
```
Visit `http://localhost:3000/jobs`. Expected: toolbar (search input + department dropdown) above a list of ≥3 job cards. Submit search form with a term matching one job's title → list narrows to matches, URL becomes `/jobs?q=...`. Select a department and submit → list narrows, URL becomes `/jobs?department=...`. Combine both (search first, then filter) → both params present in URL, hidden fields preserved each value across the other form's submit.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add jobs list page wiring toolbar and job list via Storyblok blocks"
```

---

### Task 7: Deploy to Vercel

**Files:**
- Create: `README.md` — repo/deploy links per spec's submission format
- Modify: none (config-only task)

**Interfaces:**
- Consumes: everything (final task)
- Produces: nothing

- [ ] **Step 1: Push to GitHub**

```bash
gh repo create <repo-name> --private --source=. --remote=origin
git push -u origin main
```
(Ask user to confirm repo name and visibility before running — this is a destructive/visible action needing confirmation per session policy.)

- [ ] **Step 2: Deploy via Vercel**

```bash
npx vercel --prod
```
Follow prompts to link/create the Vercel project. When it asks about environment variables, add `STORYBLOK_DELIVERY_API_TOKEN` (or set it after via `npx vercel env add STORYBLOK_DELIVERY_API_TOKEN production`).

- [ ] **Step 3: Verify production**

Visit `<vercel-url>/jobs` and `<vercel-url>/jobs/<a-real-slug>`. Expected: both render correctly using the published Storyblok content (same as local dev check in Tasks 3 and 6).

- [ ] **Step 4: Update `README.md`**

```markdown
# Jobbportal

- GitHub: https://github.com/<user>/<repo-name>
- Vercel: https://<project>.vercel.app
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add deployment links"
git push
```

---

## Self-Review Notes

- **Spec coverage:** content type/datasource/content creation is explicitly the user's responsibility per spec ("Storyblok" section) — not a coding task, so correctly excluded from this plan; all G routes (Task 3, 6), RichText (Task 3), datasource-driven filter (Task 5), search (Task 5), filter_query/search_term (Task 4), global header/footer (Task 2), deploy (Task 7) are covered.
- **Placeholder scan:** no TBDs; all code blocks are complete, runnable.
- **Type/interface consistency:** `fetchStory`/`fetchStories`/`fetchDatasourceEntries` signatures defined in Task 1 match every call site in Tasks 3–6. `JobList`/`Toolbar`/`SearchBar`/`DepartmentFilter` all take `{ department, q }` consistently. Component registry keys (`page`, `job-list`, `toolbar`, `search-bar`, `department-filter`) must match the Storyblok component *technical names* the user creates in the Storyblok UI — flagged inline in Task 5 Step 3.
- **Risk flagged for user:** Toolbar's nestable-blocks field name (assumed `body`) and each block's Storyblok technical name are assumptions — user must either name them exactly this way when building the schema in Storyblok, or the plan's executor adjusts the registry keys/field names to match.
