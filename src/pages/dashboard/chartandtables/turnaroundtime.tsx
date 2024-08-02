import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
type ChartData = {
  index: number;
  count: number;
  time_range: string;
  fill: string;
};
const generateRandomNumber = () => {
  const number = Math.floor(Math.random() * 100) + 1; // Generates a number between 1 and 100
  return number;
};
const generateChartData = (
  time_range: string[],
  colors: string[]
): ChartData[] => {
  return time_range.map((time_range, index) => ({
    index,
    count: generateRandomNumber(),
    time_range: time_range,
    fill: colors[index] || "var(--default-color)",
  }));
};
function TurnAroundTime() {
  const _colors = ["#0A2647", "#144272", "#205295", "#2C74B3"];
  const ranges = ["Under 2 mins", "2-5 mins", "5-10 mins", "10 mins above"];
  const [elapsedTimeChartData] = useState<ChartData[]>(() =>
    generateChartData(ranges, _colors)
  );
  const [timeAesChartData] = useState<ChartData[]>(() =>
    generateChartData(ranges, _colors)
  );
  const [timeExtractionChartData] = useState<ChartData[]>(() =>
    generateChartData(ranges, _colors)
  );
  const [timeStructuringChartData] = useState<ChartData[]>(() =>
    generateChartData(ranges, _colors)
  );
  const chartConfig = {
    visitors: {
      label: "Counts",
    },
    under_2min: {
      label: "Under 2 mins",
    },
    _2_5mins: {
      label: "2-5 mins",
    },
    _5_10mins: {
      label: "5-10 mins",
    },
    _10_15mins: {
      label: "10-15 mins",
    },
    _15mins_above: {
      label: "15 mins above",
    },
  } satisfies ChartConfig;
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Turn Around Time</CardTitle>
      </CardHeader>
      <CardContent>
        <Card className="flex flex-col">
          <CardContent className="flex-1 p-4">
            <div className="grid grid-cols-12">
              <div className="lg:col-span-1 md:col-span-2 col-span-12">
                <div className="lg:col-span-1 md:col-span-2 col-span-6">
                  <p className=" text-black/80 font-medium dark:text-muted-foreground">
                    Legend
                  </p>
                  <div className="flex items-center text-sm gap-x-2 mt-2">
                    <p className="bg-[hsl(var(--chart-01))] text-[hsl(var(--chart-01))] min-w-5 min-h-5"></p>
                    Under 2 mins
                  </div>
                  <div className="flex items-center text-sm gap-x-2 mt-2">
                    <p className="bg-[hsl(var(--chart-02))] text-[hsl(var(--chart-02))] min-w-5 min-h-5"></p>
                    2-5 mins
                  </div>
                  <div className="flex items-center text-sm gap-x-2 mt-2">
                    <p className="bg-[hsl(var(--chart-03))] text-[hsl(var(--chart-03))] min-w-5 min-h-5"></p>
                    5-10 mins
                  </div>
                  <div className="flex items-center text-sm gap-x-2 mt-2">
                    <p className="bg-[hsl(var(--chart-04))] text-[hsl(var(--chart-04))] min-w-5 min-h-5"></p>
                    10 mins above
                  </div>
                </div>
              </div>
              <div className="lg:col-span-11 md:col-span-10 col-span-12">
                <div className="grid grid-cols-4 gap-2">
                  <div className="md:col-span-1 col-span-4">
                    <p className="text-center mb-2 text-foreground dark:text-muted-foreground">
                      Elapsed Time
                    </p>
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[550px]"
                    >
                      <PieChart className="w-[40em]">
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent nameKey="count" hideLabel />
                          }
                        />
                        <Pie
                          data={elapsedTimeChartData}
                          dataKey="count"
                          nameKey="time_range"
                          //   innerRadius="30%"
                        >
                          <LabelList
                            dataKey="count"
                            className="fill-background"
                            stroke="none"
                            fontWeight="normal"
                            fontSize={12}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                  <div className="md:col-span-1 col-span-4">
                    <p className="text-center mb-2 text-foreground dark:text-muted-foreground">
                      Image Capturing
                    </p>
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[550px] "
                    >
                      <PieChart className="w-[40em]">
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent nameKey="count" hideLabel />
                          }
                        />
                        <Pie
                          data={timeAesChartData}
                          dataKey="count"
                          nameKey="time_range"
                        >
                          <LabelList
                            dataKey="count"
                            className="fill-background"
                            stroke="none"
                            fontWeight="normal"
                            fontSize={12}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                  <div className="md:col-span-1 col-span-4">
                    <p className="text-center mb-2 text-foreground dark:text-muted-foreground">
                      Document Processing
                    </p>
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[550px] "
                    >
                      <PieChart className="w-[40em]">
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent nameKey="count" hideLabel />
                          }
                        />
                        <Pie
                          data={timeExtractionChartData}
                          dataKey="count"
                          nameKey="time_range"
                        >
                          <LabelList
                            dataKey="count"
                            className="fill-background"
                            stroke="none"
                            fontWeight="normal"
                            fontSize={12}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                  <div className="md:col-span-1 col-span-4">
                    <p className="text-center mb-2 text-foreground dark:text-muted-foreground">
                      Data Validation
                    </p>
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[550px] "
                    >
                      <PieChart className="w-[40em]">
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent nameKey="count" hideLabel />
                          }
                        />
                        <Pie
                          data={timeStructuringChartData}
                          dataKey="count"
                          nameKey="time_range"
                        >
                          <LabelList
                            dataKey="count"
                            className="fill-background"
                            stroke="none"
                            fontWeight="normal"
                            fontSize={12}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
export default TurnAroundTime;
