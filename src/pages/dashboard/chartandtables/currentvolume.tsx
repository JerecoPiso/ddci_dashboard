import { CircleCheckBig, ScanText, ImageUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
function CurrentVolume() {
  // const [bols, setBols] = useState<[]>([]);
  const hasFetchedData = useRef(false);
  const [cookies] = useCookies(["token"]);
  const [chartData, setChartData] = useState([
    { status: "UPLOADED", count: 0 },
    { status: "OCRED", count: 0 },
    { status: "BILLED", count: 0 },
  ]);
  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-01))",
    },
  } satisfies ChartConfig;
  const getBOL = async () => {
    const response = await axios.get(
      "http://192.168.23.84:8007/ddcic/api/beta/document/active",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    );
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.data.forEach((el: any) => {
        if(el.status == "UPLOADED"){
          updateAccuracy(0)
        }else if(el.status == "OCRED"){
          updateAccuracy(1)
        }else if(el.status == "BILLED"){
          updateAccuracy(2)
        }
      });
    }
  };
  const updateAccuracy = (index: number) => {
    setChartData((prevChartData) =>
      prevChartData.map((data, i) =>
        i === index
          ? { ...data, count: data.count + 1 }
          : data
      )
    );
  };
  useEffect(() => {
    if (!hasFetchedData.current) {
      getBOL();
      hasFetchedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Current Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-2">
          <div className="md:col-span-2 col-span-12 flex flex-col">
            <div>
              <div className="flex gap-x-2 items-center  border rounded-md shadow-sm p-2">
                <ImageUp
                  size={48}
                  className="text-blue-600 dark:text-muted-foreground"
                />
                <div>
                  <p className="text-lg text-muted-foreground">
                    Uploaded
                  </p>
                  <p className=" text-muted-foreground text-lg">{chartData[0].count}</p>
                </div>
              </div>
              <div className="flex gap-x-2 items-center  border rounded-md shadow-sm p-2 mt-2">
                <ScanText
                  size={48}
                  className="text-green-600 dark:text-muted-foreground"
                />
                <div>
                  <p className="text-lg text-muted-foreground">
                    Ocred
                  </p>
                  <p className=" text-muted-foreground text-lg">{chartData[1].count}</p>
                </div>
              </div>
              <div className="flex gap-x-2 items-center  border rounded-md shadow-sm p-2 mt-2">
                <CircleCheckBig
                  size={48}
                  className="text-red-600 dark:text-muted-foreground"
                />
                <div>
                  <p className="text-lg text-muted-foreground">
                    Billed
                  </p>
                  <p className=" text-muted-foreground text-lg">{chartData[2].count}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-10 col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Bar Chart</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="max-h-[250px] w-full"
                >
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="status"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      // tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default CurrentVolume;
