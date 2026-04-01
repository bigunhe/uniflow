import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to role selection page
    router.push('/');
  }, [router]);

  return (
    <main className="p-6 max-w-md">
      <h1 className="text-xl font-semibold mb-2">Login</h1>
      <p className="mb-4 text-gray-600">
        Google authentication coming soon.
      </p>
      <div className="flex flex-col gap-2">
        <Link
          href="/profile-setup"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit"
        >
          Continue to profile setup
        </Link>
        <Link href="/" className="text-blue-600 hover:underline w-fit">
          ← Home
        </Link>
        <Link href="/networking" className="text-blue-600 hover:underline w-fit">
          Networking (Mentors & Alumni)
        </Link>
      </div>
    </main>
  );
}
