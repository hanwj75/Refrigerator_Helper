import { useEffect } from "react";
import { SITE_NAME } from "@/lib/site";

type SeoMetaProps = {
  title: string;
  description: string;
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let metaElement = document.head.querySelector<HTMLMetaElement>(selector);

  if (!metaElement) {
    metaElement = document.createElement("meta");
    document.head.appendChild(metaElement);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    metaElement?.setAttribute(key, value);
  });
}

function upsertCanonical(href: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = href;
}

export function SeoMeta({ title, description }: SeoMetaProps) {
  useEffect(() => {
    const pageTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = new URL(window.location.pathname, window.location.origin).toString();

    document.title = pageTitle;
    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: "index, follow",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: pageTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    upsertCanonical(canonicalUrl);
  }, [description, title]);

  return null;
}
