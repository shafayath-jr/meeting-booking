import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoomLoading() {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* title */}
        <PageTitle title="Meeting Room" />

        {/* room name skeleton */}
        <div className="mb-10 flex items-center justify-center">
          <Skeleton className="h-12 w-64 md:h-16 md:w-96 lg:h-20" />
        </div>

        {/* date cycle skeleton */}
        <Card className="mx-auto w-full max-w-lg">
          <CardContent className="space-y-6">
            <Skeleton className="mx-auto h-8 w-48 md:h-10" />
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <Skeleton className="h-12 w-12 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* action buttons skeleton */}
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Skeleton className="h-12 w-full md:w-40" />
          <Skeleton className="h-12 w-full md:w-40" />
          <Skeleton className="h-12 w-full md:w-40" />
        </div>

        {/* meeting cards skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-8 rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
