"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/colleges", label: "Colleges" },
  { href: "/compare", label: "Compare" },
  { href: "/predictor", label: "Predictor" },
];

const isActiveRoute = (pathname: string, href: string): boolean => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-blue-700">
          EduRova
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {navLinks.map((link) => {
            const active = isActiveRoute(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
