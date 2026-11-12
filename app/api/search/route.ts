import { createFromSource } from "fumadocs-core/search/server";
import { latestSource } from "@/lib/source";

export const revalidate = false;

// Only the latest docs are indexed: an older major (/docs/<lib>/v1/...) would otherwise
// return every page twice.
export const { staticGET: GET } = createFromSource(latestSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});
