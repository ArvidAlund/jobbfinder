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
