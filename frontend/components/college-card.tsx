import Link from "next/link";
import { MapPin, Star, TrendingUp, IndianRupee } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { College } from "@/lib/data";

interface CollegeCardProps {
  college: College;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const hasRealImage =
    college.image_url &&
    !college.image_url.includes("example.com") &&
    !college.image_url.includes("placeholder");

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* ✅ Fix 4: Image with fallback gradient */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-blue-400">
        {hasRealImage && (
          <img
            src={college.image_url}
            alt={college.name}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge variant="secondary" className="mb-2">
            {college.exam_accepted}
          </Badge>
          <h3 className="text-lg font-semibold text-white line-clamp-2">{college.name}</h3>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span>{college.location}, {college.state}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2">
            <Star className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="text-sm font-semibold">{college.rating}/5</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Placement</p>
              <p className="text-sm font-semibold">{college.placement_percent}%</p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/50 p-2">
          <IndianRupee className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Annual Fees</p>
            <p className="text-sm font-semibold">
              ₹{(college.fees / 100000).toFixed(1)}L / year
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {college.courses.slice(0, 3).map((course, i) => (
            <Badge key={`${college.id}-course-${i}`} variant="outline" className="text-xs">
              {course}
            </Badge>
          ))}
          {college.courses.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{college.courses.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/colleges/${college.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
