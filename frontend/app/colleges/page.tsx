"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CollegeCard } from "@/components/college-card";
import { College, getAllColleges } from "@/lib/data";

function CollegeListContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [collegesData, setCollegesData] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(initialSearch);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [feesRange, setFeesRange] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 500);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllColleges({
          search: searchQuery || undefined,
          exam: selectedExam !== "all" ? selectedExam : undefined,
          minFees:
            feesRange === "under1L" ? 0
            : feesRange === "1L-5L" ? 100000
            : feesRange === "above5L" ? 500000
            : undefined,
          maxFees:
            feesRange === "under1L" ? 100000
            : feesRange === "1L-5L" ? 500000
            : undefined,
          page: 1,
        });
        setCollegesData(response.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load colleges.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchColleges();
  }, [searchQuery, selectedExam, feesRange]);

  const states = useMemo(
    () => ["all", ...new Set(collegesData.map((c) => c.state))],
    [collegesData]
  );

  const filteredColleges = useMemo(() => {
    let result = [...collegesData];
    if (selectedState !== "all") result = result.filter((c) => c.state === selectedState);
    switch (sortBy) {
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "fees-low": result.sort((a, b) => a.fees - b.fees); break;
      case "fees-high": result.sort((a, b) => b.fees - a.fees); break;
      case "placement": result.sort((a, b) => b.placement_percent - a.placement_percent); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [collegesData, selectedState, sortBy]);

  const clearFilters = () => {
    setSelectedExam("all");
    setSelectedState("all");
    setSearchQuery("");
    setInputValue("");
    setFeesRange("all");
  };

  const hasActiveFilters =
    selectedExam !== "all" || selectedState !== "all" || searchQuery || feesRange !== "all";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-card py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground">Browse Colleges</h1>
            <p className="mt-2 text-muted-foreground">Explore top colleges across India</p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Search and Filters Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search colleges..."
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    debouncedSetSearch(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Exam Filter */}
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    <SelectItem value="JEE">JEE</SelectItem>
                    <SelectItem value="NEET">NEET</SelectItem>
                  </SelectContent>
                </Select>

                {/* State Filter */}
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state === "all" ? "All States" : state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Fees Filter */}
                <Select value={feesRange} onValueChange={setFeesRange}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Fees Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fees</SelectItem>
                    <SelectItem value="under1L">Under ₹1L</SelectItem>
                    <SelectItem value="1L-5L">₹1L - ₹5L</SelectItem>
                    <SelectItem value="above5L">Above ₹5L</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    <SelectItem value="placement">Placement %</SelectItem>
                    <SelectItem value="fees-low">Fees (Low to High)</SelectItem>
                    <SelectItem value="fees-high">Fees (High to Low)</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => { setSearchQuery(""); setInputValue(""); }} />
                  </Badge>
                )}
                {selectedExam !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedExam}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedExam("all")} />
                  </Badge>
                )}
                {selectedState !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedState}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedState("all")} />
                  </Badge>
                )}
                {feesRange !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {feesRange === "under1L" ? "Under ₹1L"
                      : feesRange === "1L-5L" ? "₹1L - ₹5L"
                      : "Above ₹5L"}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFeesRange("all")} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  Clear all
                </Button>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredColleges.length} colleges
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center rounded-lg border bg-card py-16">
                <p className="text-muted-foreground">Loading colleges...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-16 text-center">
                <p className="text-lg font-medium">Failed to load colleges</p>
                <p className="mt-2 text-muted-foreground">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : filteredColleges.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredColleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-16">
                <p className="text-lg font-medium">No colleges found</p>
                <p className="mt-2 text-muted-foreground">Try adjusting your search or filters</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <CollegeListContent />
    </Suspense>
  );
}
