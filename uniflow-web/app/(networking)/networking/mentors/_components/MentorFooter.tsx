import Link from "next/link";

const footerLinks = [
  { label: "Mentor Directory", href: "/networking/mentors/mentor-discovery" },
  { label: "Dashboard", href: "/networking/mentors/mentor-dashboard" },
  { label: "Messages", href: "/networking/mentors/messages" },
];

export function MentorFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className="text-base font-semibold text-slate-900">UniFlow Mentors</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            A practical mentorship experience for students looking for focused guidance,
            structured sessions, and measurable learning outcomes.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Explore</h4>
          <ul className="mt-3 space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-600 hover:text-slate-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Contact</h4>
          <p className="mt-3 text-sm text-slate-600">support@uniflow.app</p>
          <p className="mt-1 text-sm text-slate-600">Mon-Fri, 9:00 AM - 6:00 PM</p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} UniFlow. All rights reserved.
      </div>
    </footer>
  );
}
