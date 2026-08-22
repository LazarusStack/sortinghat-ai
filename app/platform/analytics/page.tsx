import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";
import { PAGE_BY_PATH } from "@/lib/pages";

const page = PAGE_BY_PATH.get("/platform/analytics")!;

export const metadata: Metadata = {
  title: `${page.metaTitle} | Sortinghat`,
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: {
    title: page.metaTitle,
    description: page.description,
    url: page.path,
    siteName: "Sortinghat",
    type: "website",
  },
};

export default function Route() {
  return <MarketingPage page={page} />;
}
