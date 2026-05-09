"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  X,
  Plus,
  Star,
  TrendingUp,
  IndianRupee,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import {
  compareColleges,
  getAllColleges,
  College,
} from "@/lib/data";

function CompareContent() {
  const searchParams = useSearchParams();

  const initialColleges = Array.from(
    new Set(
      searchParams
        .get("colleges")
        ?.split(",")
        .filter(Boolean) || []
    )
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialColleges.slice(0, 3)
  );

  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);

  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [isLoadingSelected, setIsLoadingSelected] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // FETCH ALL COLLEGES
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoadingAll(true);

        const aggregated: College[] = [];

        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const response = await getAllColleges({ page });

          aggregated.push(...response.data);

          totalPages = response.pagination?.totalPages || 1;

          page += 1;
        }

        // REMOVE DUPLICATES
        const uniqueColleges = aggregated.filter(
          (college, index, self) =>
            index === self.findIndex((c) => c.id === college.id)
        );

        setAllColleges(uniqueColleges);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Failed to load colleges."
        );
      } finally {
        setIsLoadingAll(false);
      }
    };

    fetchAll();
  }, []);

  // FETCH SELECTED COLLEGES
  useEffect(() => {
    const fetchSelected = async () => {
      if (selectedIds.length === 0) {
        setSelectedColleges([]);
        return;
      }

      try {
        setIsLoadingSelected(true);

        const colleges = await compareColleges(selectedIds);

        // REMOVE DUPLICATES
        const uniqueColleges = colleges.filter(
          (college, index, self) =>
            index === self.findIndex((c) => c.id === college.id)
        );

        setSelectedColleges(uniqueColleges);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Failed to compare colleges."
        );
      } finally {
        setIsLoadingSelected(false);
      }
    };

    fetchSelected();
  }, [selectedIds]);

  const availableColleges = allColleges.filter(
    (c) => !selectedIds.includes(String(c.id))
  );

  const addCollege = (id: string) => {
    if (
      selectedIds.length < 3 &&
      !selectedIds.includes(id)
    ) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeCollege = (id: string) => {
    setSelectedIds(
      selectedIds.filter((x) => x !== id)
    );
  };

  const ComparisonRow = ({
    label,
    getValue,
    highlight = false,
  }: {
    label: string;
    getValue: (college: College) => React.ReactNode;
    highlight?: boolean;
  }) => (
    <TableRow className={highlight ? "bg-muted/50" : ""}>
      <TableCell className="font-medium text-muted-foreground">
        {label}
      </TableCell>

      {selectedColleges.map((college, index) => (
        <TableCell
          key={`${label}-${college.id}-${index}`}
          className="text-center"
        >
          {getValue(college)}
        </TableCell>
      ))}

      {Array.from({
        length: 3 - selectedColleges.length,
      }).map((_, i) => (
        <TableCell
          key={`empty-${label}-${i}`}
          className="text-center text-muted-foreground"
        >
          -
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-card py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground">
              Compare Colleges
            </h1>

            <p className="mt-2 text-muted-foreground">
              Compare up to 3 colleges side by side
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            {error && (
              <Card className="mb-6 border-destructive">
                <CardContent className="py-4 text-sm text-destructive">
                  {error}
                </CardContent>
              </Card>
            )}

            {/* SELECTED COLLEGES */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedColleges.map((college, index) => (
                <Card
                  key={`${college.id}-${index}`}
                  className="relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() =>
                      removeCollege(String(college.id))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm line-clamp-2 pr-8">
                      {college.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {college.location}, {college.state}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        <Star className="mr-1 h-3 w-3" />
                        {college.rating}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {college.exam_accepted}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* ADD COLLEGE CARD */}
              {selectedColleges.length < 3 && (
                <Card className="border-dashed">
                  <CardContent className="flex h-full flex-col items-center justify-center py-8">
                    <Plus className="mb-2 h-8 w-8 text-muted-foreground" />

                    <p className="mb-4 text-sm text-muted-foreground">
                      Add College
                    </p>

                    <Select onValueChange={addCollege}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a college" />
                      </SelectTrigger>

                      <SelectContent>
                        {isLoadingAll ? (
                          <SelectItem
                            value="loading"
                            disabled
                          >
                            Loading...
                          </SelectItem>
                        ) : (
                          availableColleges.map(
                            (college, index) => (
                              <SelectItem
                                key={`${college.id}-${index}`}
                                value={String(college.id)}
                              >
                                {college.name}
                              </SelectItem>
                            )
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* COMPARISON TABLE */}
            {isLoadingSelected ? (
              <Card className="py-16">
                <CardContent className="flex items-center justify-center text-muted-foreground">
                  Loading comparison...
                </CardContent>
              </Card>
            ) : selectedColleges.length >= 2 ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Comparison Table
                  </CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">
                          Criteria
                        </TableHead>

                        {selectedColleges.map(
                          (college, index) => (
                            <TableHead
                              key={`${college.id}-${index}`}
                              className="text-center min-w-[180px]"
                            >
                              <Link
                                href={`/colleges/${college.id}`}
                                className="hover:text-primary"
                              >
                                {college.name.length > 30
                                  ? `${college.name.substring(
                                      0,
                                      30
                                    )}...`
                                  : college.name}
                              </Link>
                            </TableHead>
                          )
                        )}

                        {Array.from({
                          length:
                            3 -
                            selectedColleges.length,
                        }).map((_, i) => (
                          <TableHead
                            key={`eh-${i}`}
                            className="text-center min-w-[180px]"
                          >
                            -
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      <ComparisonRow
                        label="Location"
                        getValue={(c) => (
                          <span className="flex items-center justify-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {c.location}, {c.state}
                          </span>
                        )}
                      />

                      <ComparisonRow
                        highlight
                        label="Rating"
                        getValue={(c) => (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 text-primary" />

                            <span className="font-semibold">
                              {c.rating}/5
                            </span>
                          </div>
                        )}
                      />

                      <ComparisonRow
                        label="Placement Rate"
                        getValue={(c) => (
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="h-4 w-4 text-primary" />

                            <span className="font-semibold">
                              {c.placement_percent}%
                            </span>
                          </div>
                        )}
                      />

                      <ComparisonRow
                        highlight
                        label="Annual Fees"
                        getValue={(c) => (
                          <div className="flex items-center justify-center gap-1">
                            <IndianRupee className="h-4 w-4 text-primary" />

                            <span className="font-semibold">
                              ₹
                              {(c.fees / 100000).toFixed(
                                1
                              )}
                              L
                            </span>
                          </div>
                        )}
                      />

                      <ComparisonRow
                        label="Exam Accepted"
                        getValue={(c) => (
                          <Badge variant="secondary">
                            {c.exam_accepted}
                          </Badge>
                        )}
                      />

                      <ComparisonRow
                        highlight
                        label="Rank Range"
                        getValue={(c) => (
                          <span className="text-sm">
                            {c.min_rank.toLocaleString()} –
                            {" "}
                            {c.max_rank.toLocaleString()}
                          </span>
                        )}
                      />

                      <ComparisonRow
                        label="Courses"
                        getValue={(c) => (
                          <div className="flex flex-wrap justify-center gap-1">
                            {c.courses
                              .slice(0, 3)
                              .map((course, index) => (
                                <Badge
                                  key={`${c.id}-${course}-${index}`}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {course}
                                </Badge>
                              ))}

                            {c.courses.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                +
                                {c.courses.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      />
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="py-16">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <p className="text-lg font-medium">
                    Select at least 2 colleges to compare
                  </p>

                  <p className="mt-2 text-muted-foreground">
                    Use the dropdowns above to add colleges
                  </p>

                  <Link
                    href="/colleges"
                    className="mt-4"
                  >
                    <Button variant="outline">
                      Browse Colleges
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}