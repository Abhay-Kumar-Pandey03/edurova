"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Target, TrendingUp, Star, MapPin, IndianRupee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { College, predictColleges } from "@/lib/data";

const examOptions = [
  { value: "JEE", label: "JEE (Engineering Colleges)" },
  { value: "NEET", label: "NEET (Medical Colleges)" },
];

export default function PredictorPage() {
  const [selectedExam, setSelectedExam] = useState("");
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<College[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!selectedExam || !rank) return;
    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum <= 0) return;

    try {
      setIsLoading(true);
      setError(null);
      const colleges = await predictColleges(selectedExam, rankNum);
      setResults(colleges);
      setHasSearched(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to predict colleges.");
      setResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate admission chance based on rank vs college rank range
  const getChance = (college: College, userRank: number): "high" | "medium" | "low" => {
    const midpoint = (college.min_rank + college.max_rank) / 2;
    if (userRank <= college.min_rank + (midpoint - college.min_rank) * 0.3) return "high";
    if (userRank <= midpoint) return "medium";
    return "low";
  };

  const getChanceBadge = (chance: "high" | "medium" | "low") => {
    switch (chance) {
      case "high": return <Badge className="bg-green-600 text-white">High Chance</Badge>;
      case "medium": return <Badge className="bg-yellow-600 text-white">Medium Chance</Badge>;
      case "low": return <Badge variant="destructive">Low Chance</Badge>;
    }
  };

  const rankNum = parseInt(rank) || 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">College Predictor</h1>
              <p className="mt-3 text-muted-foreground">
                Enter your entrance exam details to get personalized college recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Enter Your Details
                </CardTitle>
                <CardDescription>Fill in your exam and rank to predict college options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="exam">Entrance Exam</Label>
                    <Select value={selectedExam} onValueChange={setSelectedExam}>
                      <SelectTrigger id="exam">
                        <SelectValue placeholder="Select exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {examOptions.map((exam) => (
                          <SelectItem key={exam.value} value={exam.value}>
                            {exam.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rank">Expected Rank</Label>
                    <Input
                      id="rank" type="number" placeholder="Enter your rank"
                      value={rank} onChange={(e) => setRank(e.target.value)} min="1"
                    />
                  </div>
                </div>

                <Button
                  className="w-full" size="lg"
                  onClick={handlePredict}
                  disabled={!selectedExam || !rank || isLoading}
                >
                  <Target className="mr-2 h-5 w-5" />
                  {isLoading ? "Predicting..." : "Predict Colleges"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results */}
        {hasSearched && (
          <section className="bg-muted/50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="mb-6 text-2xl font-bold">
                Prediction Results
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  ({results.length} colleges found for {selectedExam} Rank {rank})
                </span>
              </h2>

              {error ? (
                <Card className="py-12 border-destructive">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <p className="text-lg font-medium">Failed to get predictions</p>
                    <p className="mt-2 text-muted-foreground">{error}</p>
                  </CardContent>
                </Card>
              ) : results.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((college) => {
                    const chance = getChance(college, rankNum);
                    return (
                      <Card key={college.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg line-clamp-2">{college.name}</CardTitle>
                            {getChanceBadge(chance)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {college.location}, {college.state}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Rank range: {college.min_rank.toLocaleString()} – {college.max_rank.toLocaleString()}
                          </p>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-lg bg-secondary/50 p-2">
                              <Star className="mx-auto h-4 w-4 text-primary" />
                              <p className="mt-1 text-sm font-semibold">{college.rating}</p>
                              <p className="text-xs text-muted-foreground">Rating</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2">
                              <TrendingUp className="mx-auto h-4 w-4 text-primary" />
                              <p className="mt-1 text-sm font-semibold">{college.placement_percent}%</p>
                              <p className="text-xs text-muted-foreground">Placement</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2">
                              <IndianRupee className="mx-auto h-4 w-4 text-primary" />
                              <p className="mt-1 text-sm font-semibold">{(college.fees / 100000).toFixed(1)}L</p>
                              <p className="text-xs text-muted-foreground">Fees</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {college.courses.slice(0, 3).map((course, i) => (
                              <Badge key={`${college.id}-course-${i}`} variant="outline" className="text-xs">{course}</Badge>
                            ))}
                          </div>
                          <Link href={`/colleges/${college.id}`}>
                            <Button variant="outline" className="w-full gap-2">
                              View Details <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="py-12">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <p className="text-lg font-medium">No colleges found for this rank</p>
                    <p className="mt-2 text-muted-foreground">Try a different exam or adjust your rank</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
