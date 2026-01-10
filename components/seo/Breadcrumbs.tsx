import { generateBreadcrumbList, type BreadcrumbItem } from "@/lib/seo";
import { StructuredData } from "./StructuredData";
import type { Locale } from "@/i18n/config";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: Locale;
}

export function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  const breadcrumbList = generateBreadcrumbList(items, locale);
  return <StructuredData data={breadcrumbList} />;
}
