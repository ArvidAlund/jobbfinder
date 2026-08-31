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
