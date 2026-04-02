export default function TermsOfServicePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--app-bg-gradient)",
        color: "#ffffff",
        fontFamily: "'DM Sans', sans-serif",
        padding: "48px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 16,
          padding: "28px 24px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 style={{ fontSize: 34, marginBottom: 16 }}>Terms of Service</h1>
        <p style={{ lineHeight: 1.8, opacity: 0.92 }}>
          These terms explain the basic rules for using UniFlow. By creating an account
          or signing in, you agree to use the platform responsibly and provide accurate
          information where required.
        </p>
        <h2 style={{ marginTop: 24, marginBottom: 10 }}>Acceptable Use</h2>
        <p style={{ lineHeight: 1.8, opacity: 0.92 }}>
          You agree not to misuse the platform, attempt unauthorized access, or submit
          harmful content. UniFlow may suspend access for violations of these terms.
        </p>
        <h2 style={{ marginTop: 24, marginBottom: 10 }}>Account Responsibility</h2>
        <p style={{ lineHeight: 1.8, opacity: 0.92 }}>
          You are responsible for activity under your account and for keeping your login
          credentials secure.
        </p>
        <p style={{ marginTop: 28, opacity: 0.9 }}>
          Questions? Contact the UniFlow team for clarification.
        </p>
      </div>
    </main>
  );
}
