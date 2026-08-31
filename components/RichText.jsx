import { renderRichText } from "@storyblok/react/rsc";

export default function RichText({ document }) {
  if (!document) return null;
  const html = renderRichText(document);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
