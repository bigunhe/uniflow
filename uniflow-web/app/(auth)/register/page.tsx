import { AuthMarketingLayout } from "@/components/shared/AuthMarketingLayout";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <AuthMarketingLayout
      headerCta={{ href: "/login", label: "Login" }}
      headerCtaVariant="muted"
    >
      <RegisterForm />
    </AuthMarketingLayout>
  );
}
