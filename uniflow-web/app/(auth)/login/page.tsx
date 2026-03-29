import { AuthMarketingLayout } from "@/components/shared/AuthMarketingLayout";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthMarketingLayout headerCta={{ href: "/register", label: "Register" }}>
      <LoginForm />
    </AuthMarketingLayout>
  );
}
