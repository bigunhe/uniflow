import { notFound } from "next/navigation";
import { SpecializationJobRolesView } from "@/components/specializations/SpecializationJobRolesView";
import {
  getSpecializationRolesPage,
  SPECIALIZATION_ROLE_SLUGS,
} from "@/lib/specializationRolesContent";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return SPECIALIZATION_ROLE_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps) {
  const page = getSpecializationRolesPage(params.slug);
  if (!page) return { title: "Not found" };
  return { title: `${page.pageTitle} | UniFlow` };
}

export default function SpecializationRolesRoutePage({ params }: PageProps) {
  const page = getSpecializationRolesPage(params.slug);
  if (!page) notFound();
  return <SpecializationJobRolesView data={page} />;
}
