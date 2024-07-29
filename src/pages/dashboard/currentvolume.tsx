import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"
function CurrentVolume() {
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Current Volume</CardTitle>
        {/* <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12">
          <div className="md:col-span-2">
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Receive Today</CardDescription>
                <CardTitle className="text-4xl">1,329</CardTitle>
              </CardHeader>
            
              <CardFooter>
                <Progress value={25} aria-label="25% increase" />
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Receive Today</CardDescription>
                <CardTitle className="text-4xl">1,329</CardTitle>
              </CardHeader>
            
              <CardFooter>
                <Progress value={25} aria-label="25% increase" />
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Receive Today</CardDescription>
                <CardTitle className="text-4xl">1,329</CardTitle>
              </CardHeader>
            
              <CardFooter>
                <Progress value={25} aria-label="25% increase" />
              </CardFooter>
            </Card>
          </div>
          <div className="md:col-span-10"></div>
        </div>
      </CardContent>
    </Card>
  );
}
export default CurrentVolume;
