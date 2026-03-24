export default function PrivacyPolicyPage() {
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
        <h1 style={{ fontSize: 34, marginBottom: 16 }}>Privacy Policy</h1>
        <p style={{ lineHeight: 1.8, opacity: 0.92 }}>
          This policy describes how UniFlow handles account and profile information.
          We only collect data needed to operate core features such as authentication,
          profiles, and learning progress.
        </p>
        <h2 style={{ marginTop: 24, marginBottom: 10 }}>Data We Use</h2>
        <p style={{ lineHeight: 1.8, opacity: 0.92 }}>
          We may store your name, email, profile details, and activity related to your
          use of the platform.
        </p>
        <h2 style={{ marginTop: 24, marginBottom: 10 }}>How We Protect It</h2>
        <p style={{ lineHeight: 1.8, opacity: 0.92 }}>
          We apply reasonable safeguards to protect your information and limit access
          to authorized services and team members.
        </p>
        <p style={{ marginTop: 28, opacity: 0.9 }}>
          Contact the UniFlow team if you need to update or remove your data.
        </p>
      </div>
    </main>
  );
}
