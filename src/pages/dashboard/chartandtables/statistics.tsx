import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Area, AreaChart } from "recharts";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
function Statistics() {
  const [chartData] = useState([
    { status: "SHIPPER DETAILS", count: 400, percent: "81%" },
    { status: "CONSIGNEE DETAILS", count: 370, percent: "78%" },
    { status: "BILL TO DETAILS", count: 430, percent: "88%" },
    { status: "SPECIAL", count: 285, percent: "68%" },
    { status: "COMMODITIES", count: 460, percent: "91%" },
    { status: "REFERENCES", count: 360, percent: "72%" },
  ]);
  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-01))",
    },
  } satisfies ChartConfig;
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8}>
              <LabelList
                position="top"
                dataKey="percent"
                fontSize={15}
                fontWeight={500}
                fillOpacity={1}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        {/* <div>
          <ChartContainer
            config={{
              time: {
                label: "Time",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="min-h-[200px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={[
                {
                  date: "2024-01-01",
                  time: 8.5,
                },
                {
                  date: "2024-01-02",
                  time: 7.2,
                },
                {
                  date: "2024-01-03",
                  time: 8.1,
                },
                {
                  date: "2024-01-04",
                  time: 6.2,
                },
                {
                  date: "2024-01-05",
                  time: 5.2,
                },
                {
                  date: "2024-01-06",
                  time: 8.1,
                },
                {
                  date: "2024-01-07",
                  time: 7.0,
                },
              ]}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-time)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-time)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="time"
                type="natural"
                fill="url(#fillTime)"
                fillOpacity={0.4}
                stroke="var(--color-time)"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                formatter={(value) => (
                  <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                    Time in bed
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {value}
                      <span className="font-normal text-muted-foreground">
                        hr
                      </span>
                    </div>
                  </div>
                )}
              />
            </AreaChart>
          </ChartContainer>
        </div> */}
      </CardContent>
    </Card>
  );
}
export default Statistics;
