"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getStats, Stats } from "@/lib/data";

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalColleges: 0,
    totalStates: 0,
    avgPlacement: 0,
    topRating: 0,
  });

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const statCards = [
    { label: "Colleges", value: `${stats.totalColleges}+` },
    { label: "States Covered", value: `${stats.totalStates}+` },
    { label: "Avg Placement", value: `${stats.avgPlacement}%+` },
    { label: "Top Rating", value: `${stats.topRating}` },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 py-20 text-white">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Find Your Dream College in India
              </h1>
              <p className="mt-4 text-lg text-blue-50">
                Discover, compare and predict colleges with ease
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/colleges"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
                >
                  Browse Colleges
                </Link>
                <Link
                  href="/predictor"
                  className="rounded-lg border border-white/70 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Predict My College
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="-mt-8 pb-16">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-blue-100 bg-white p-6 text-center shadow-sm"
                >
                  <p className="text-3xl font-bold text-blue-700">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
