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
