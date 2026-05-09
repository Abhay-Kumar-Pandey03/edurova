import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Star, TrendingUp, IndianRupee,
  Building, ArrowLeft, BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getCollegeById } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;
  let college: Awaited<ReturnType<typeof getCollegeById>>;
  try {
    college = await getCollegeById(id);
  } catch {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background">
          <div className="container mx-auto px-4 py-8">
            <Link href="/colleges">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Colleges
              </Button>
            </Link>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* College Image Placeholder */}
              <div className="lg:col-span-1">
                <div className="relative aspect-video rounded-xl bg-muted overflow-hidden flex items-center justify-center">
                  <Building className="h-24 w-24 text-muted-foreground/30" />
                  <Badge variant="secondary" className="absolute top-4 left-4">
                    {college.exam_accepted}
                  </Badge>
                </div>
              </div>

              {/* College Info */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
                  {college.name}
                </h1>
                <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{college.location}, {college.state}</span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-card border p-4 text-center">
                    <Star className="mx-auto h-6 w-6 text-primary" />
                    <p className="mt-2 text-2xl font-bold">{college.rating}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                  <div className="rounded-lg bg-card border p-4 text-center">
                    <TrendingUp className="mx-auto h-6 w-6 text-primary" />
                    <p className="mt-2 text-2xl font-bold">{college.placement_percent}%</p>
                    <p className="text-sm text-muted-foreground">Placement</p>
                  </div>
                  <div className="rounded-lg bg-card border p-4 text-center">
                    <IndianRupee className="mx-auto h-6 w-6 text-primary" />
                    <p className="mt-2 text-2xl font-bold">
                      {(college.fees / 100000).toFixed(1)}L
                    </p>
                    <p className="text-sm text-muted-foreground">Annual Fee</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/compare?colleges=${college.id}`}>
                    <Button variant="outline" className="gap-2">
                      Add to Compare
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Info */}
        <section className="py-8">
          <div className="container mx-auto px-4 space-y-6">

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {college.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {college.description}
                </p>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Quick Facts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">Exam Accepted</p>
                    <p className="font-semibold mt-1">{college.exam_accepted}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">Min Rank</p>
                    <p className="font-semibold mt-1">{college.min_rank.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">Max Rank</p>
                    <p className="font-semibold mt-1">{college.max_rank.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">Annual Fees</p>
                    <p className="font-semibold mt-1">₹{college.fees.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-semibold mt-1">{college.rating} / 5</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">Placement</p>
                    <p className="font-semibold mt-1">{college.placement_percent}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Available Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {college.courses.map((course, i) => (
                    <div
                      key={`course-${i}`}
                      className="flex items-center gap-3 rounded-lg border p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{course}</p>
                        <p className="text-sm text-muted-foreground">Full-time Program</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admission Info */}
            <Card>
              <CardHeader>
                <CardTitle>Admission Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="text-muted-foreground">Accepted Exam</span>
                  <Badge>{college.exam_accepted}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="text-muted-foreground">Expected Rank Range</span>
                  <Badge variant="outline">
                    {college.min_rank.toLocaleString()} – {college.max_rank.toLocaleString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
