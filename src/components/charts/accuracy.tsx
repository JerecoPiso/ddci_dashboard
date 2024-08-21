import { AccuracyData } from "@/variables/bol";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
interface Chart {
  chartName: string,
  accuracyChartData: AccuracyData[];
}
function AccuracyChart({chartName, accuracyChartData }: Chart) {
  const accuracyChartConfig = {
    visitors: {
      label: "Counts",
    },
    _025: {
      label: "0-25%",
      color: "hsl(var(--chart-04))",
    },
    _2650: {
      label: "26-50%",
      color: "hsl(var(--chart-03))",
    },
    _51_75: {
      label: "51-75%",
      color: "hsl(var(--chart-02))",
    },
    _76100: {
      label: "76-100%",
      color: "hsl(var(--chart-01))",
    },
  } satisfies ChartConfig;
  return (
    <Card x-chunk="charts-01-chunk-7">
      <CardHeader className="p-2">
        <CardDescription>{chartName}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={accuracyChartConfig}
          className="mx-auto aspect-square max-h-[170px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={accuracyChartData}
              dataKey="accuracy_count"
              nameKey="accuracy_range"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
export default AccuracyChart;
