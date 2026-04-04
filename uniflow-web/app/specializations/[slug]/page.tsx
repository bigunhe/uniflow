import { notFound } from "next/navigation";
import { SpecializationJobRolesView } from "@/components/specializations/SpecializationJobRolesView";
import {
  getSpecializationRolesPage,
  SPECIALIZATION_ROLE_SLUGS,
} from "@/lib/specializationRolesContent";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SPECIALIZATION_ROLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getSpecializationRolesPage(slug);
  if (!page) return { title: "Not found" };
  return { title: `${page.pageTitle} | UniFlow` };
}

export default async function SpecializationRolesRoutePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSpecializationRolesPage(slug);
  if (!page) notFound();
  return <SpecializationJobRolesView data={page} />;
}
