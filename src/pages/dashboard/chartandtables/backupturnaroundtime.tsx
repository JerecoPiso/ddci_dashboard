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
// red chart colors

function TurnAroundTime() {
  const ranges = [
    "Under 2 mins",
    "2-5 mins",
    "5-10 mins",
    "10-15 mins",
    "15 mins above",
  ];
  const [elapsedTimeChartData] = useState<ChartData[]>(() =>
    generateChartData(ranges, [
      "#004d99",
      "#0073e6",
      "#1a8cff",
      "#4da6ff",
      "#80bfff",
    ])
  );
  const [timeAesChartData] = useState<ChartData[]>(() =>
    generateChartData(ranges, [
      "#b30000",
      "#e60000",
      "#ff3333",
      "#ff4d4d",
      "#ff8080",
    ])
  );
  const [timeExtractionChartData] = useState<
    ChartData[]
  >(() =>
    generateChartData(ranges, [
      "#3d5c5c",
      "#476b6b",
      "#527a7a",
      "#5c8a8a",
      "#85adad",
    ])
  );
  const [timeStructuringChartData] = useState<
    ChartData[]
  >(() =>
    generateChartData(ranges, [
      "#008060",
      "#009973",
      "#00b386",
      "#00cc99",
      "#00e6ac",
    ])
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
            <div className="grid grid-cols-4 gap-2">
              <div className="md:col-span-1 col-span-3">
                <p className="text-center mb-2 text-foreground dark:text-muted-foreground">
                  SLA - Elapsed Time Arrival Through Structuring
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
              <div className="md:col-span-1 col-span-3">
                <p className="text-center mb-2 text-foreground dark:text-muted-foreground">
                  Time in AES
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
                      innerRadius="30%"
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
              <div className="md:col-span-1 col-span-3">
              <p className="text-center mb-2 text-foreground dark:text-muted-foreground">
                  Time Spent in Extraction
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
                      innerRadius="30%"
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
              <div className="md:col-span-1 col-span-3">
              <p className="text-center mb-2 text-foreground dark:text-muted-foreground">
                  Time in Structuring
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
                      innerRadius="30%"
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
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
export default TurnAroundTime;
