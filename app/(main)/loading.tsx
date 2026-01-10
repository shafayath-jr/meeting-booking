import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <PageContainer>
      <PageTitle title="Booking System" />

      <div className="max-w-4xl mx-auto">
        {/* place cycle skeleton */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-md" />
          <Skeleton className="h-8 md:h-12 w-48 md:w-64" />
          <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-md" />
        </div>

        {/* rooms section skeleton */}
        <div>
          {/* heading skeleton */}
          <div className="p-4 border rounded-xl">
            <Skeleton className="h-6 w-40 mx-auto" />
          </div>

          {/* room cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent>
                  <Skeleton className="h-6 w-32 mx-auto" />
                </CardContent>
                <CardFooter className="flex items-center justify-center">
                  <Skeleton className="h-12 w-40" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
