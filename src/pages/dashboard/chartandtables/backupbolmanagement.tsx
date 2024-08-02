import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { formatDate } from "@/utils/date";
import { Pie, PieChart } from "recharts";
import { DataTable } from "@/components/datatable/components/data-table";
import { columns } from "@/components/datatable/components/columns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Loading from "@/components/loading";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BOL = {
  name: string;
  type: string;
  production: string;
  status: string;
  createdat: string;
  ocrstart: string;
  ocrend: string;
  accuracy: string;
};
type AccuracyData = {
  index: number;
  accuracy_range: string;
  accuracy_count: number;
  fill: string;
};
const generateAccuracyData = (
  ranges: string[],
  colors: string[]
): AccuracyData[] => {
  return ranges.map((range, index) => ({
    index,
    accuracy_range: range,
    accuracy_count: 0,
    fill: colors[index] || "var(--default-color)",
  }));
};
function BolManagement() {
  const ranges = ["_025", "_2650", "_51_75", "_76100"];
  const colors = [
    "var(--color-_025)",
    "var(--color-_2650)",
    "var(--color-_51_75)",
    "var(--color-_76100)",
  ];
  const [loading, setLoading] = useState<boolean>(false);
  const [bols, setBols] = useState<BOL[]>([]);
  const hasFetchedData = useRef(false);
  const [cookies] = useCookies(["token"]);
  const [accuracyChartData, setAccuracyChartData] = useState<AccuracyData[]>(
    () => generateAccuracyData(ranges, colors)
  );
  const [shipperAccuracyChartData, setShipperAccuracyChartData] = useState<
    AccuracyData[]
  >(() => generateAccuracyData(ranges, colors));
  const [consigneeAccuracyChartData, setConsigneeAccuracyChartData] = useState<
    AccuracyData[]
  >(() => generateAccuracyData(ranges, colors));
  const [billtoAccuracyChartData, setBilltoAccuracyChartData] = useState<
    AccuracyData[]
  >(() => generateAccuracyData(ranges, colors));
  const [itemsAccuracyChartData, setItemsAccuracyChartData] = useState<
    AccuracyData[]
  >(() => generateAccuracyData(ranges, colors));
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
  const updateAccuracy = (index: number, type: string) => {
    if (type === "accuracy") {
      setAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index
            ? { ...data, accuracy_count: data.accuracy_count + 1 }
            : data
        )
      );
    } else if (type === "shipper") {
      setShipperAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index
            ? { ...data, accuracy_count: data.accuracy_count + 1 }
            : data
        )
      );
    } else if (type === "consignee") {
      setConsigneeAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index
            ? { ...data, accuracy_count: data.accuracy_count + 1 }
            : data
        )
      );
    } else if (type === "billto") {
      setBilltoAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index
            ? { ...data, accuracy_count: data.accuracy_count + 1 }
            : data
        )
      );
    } else if (type === "items") {
      setItemsAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index
            ? { ...data, accuracy_count: data.accuracy_count + 1 }
            : data
        )
      );
    }
  };
  const itemsPattern = (str: string) => {
    const pattern = /^items\[.*?\]-/;
    return pattern.test(str);
  };
  const getBOL = async () => {
    setLoading(true);
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
      // console.log(response.data)
      const _bols: BOL[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.data.forEach((el: any) => {
        // overall
        let accuracy_total: number = 0;
        let accuracy_count: number = 0;

        let shipper_accuracy_total: number = 0;
        let shipper_accuracy_count: number = 0;

        let consignee_accuracy_total: number = 0;
        let consignee_accuracy_count: number = 0;

        let billto_accuracy_total: number = 0;
        let billto_accuracy_count: number = 0;

        let items_accuracy_total: number = 0;
        let items_accuracy_count: number = 0;

        if (el.ocrDataList.length > 0) {
          for (let i = 0; i < el.ocrDataList.length; i++) {
            if (el.ocrDataList[i].fieldName.startsWith("shipper-")) {
              shipper_accuracy_count++;
              shipper_accuracy_total += parseFloat(
                el.ocrDataList[i]["accuracy"]
              );
            } else if (el.ocrDataList[i].fieldName.startsWith("consignee-")) {
              consignee_accuracy_count++;
              consignee_accuracy_total += parseFloat(
                el.ocrDataList[i]["accuracy"]
              );
            } else if (el.ocrDataList[i].fieldName.startsWith("billTo-")) {
              billto_accuracy_count++;
              billto_accuracy_total += parseFloat(
                el.ocrDataList[i]["accuracy"]
              );
            } else if (itemsPattern(el.ocrDataList[i].fieldName)) {
              items_accuracy_count++;
              items_accuracy_total += parseFloat(el.ocrDataList[i]["accuracy"]);
            }
            accuracy_count++;
            accuracy_total += parseFloat(el.ocrDataList[i]["accuracy"]);
          }
        }
        const _accuracy: number = (accuracy_total / accuracy_count) * 100;
        const _shipper_accuracy: number =
          (shipper_accuracy_total / shipper_accuracy_count) * 100;
        const _consignee_accuracy: number =
          (consignee_accuracy_total / consignee_accuracy_count) * 100;
        const _billto_accuracy: number =
          (billto_accuracy_total / billto_accuracy_count) * 100;
        const _items_accuracy: number =
          (items_accuracy_total / items_accuracy_count) * 100;
        if (shipper_accuracy_count > 0) {
          if (_shipper_accuracy && _shipper_accuracy > 0) {
            if (_shipper_accuracy > 26 && _shipper_accuracy <= 50) {
              updateAccuracy(1, "shipper");
            } else if (_shipper_accuracy > 51 && _shipper_accuracy <= 75) {
              updateAccuracy(2, "shipper");
            } else if (_shipper_accuracy > 76 && _shipper_accuracy <= 100) {
              updateAccuracy(3, "shipper");
            }
          } else {
            updateAccuracy(0, "shipper");
          }
        }
        if (consignee_accuracy_count > 0) {
          if (_consignee_accuracy && _consignee_accuracy > 0) {
            if (_consignee_accuracy > 26 && _consignee_accuracy <= 50) {
              updateAccuracy(1, "consignee");
            } else if (_consignee_accuracy > 51 && _consignee_accuracy <= 75) {
              updateAccuracy(2, "consignee");
            } else if (_consignee_accuracy > 76 && _consignee_accuracy <= 100) {
              updateAccuracy(3, "consignee");
            }
          } else {
            updateAccuracy(0, "consignee");
          }
        }
        if (billto_accuracy_count > 0) {
          if (_billto_accuracy && _billto_accuracy > 0) {
            if (_billto_accuracy > 26 && _billto_accuracy <= 50) {
              updateAccuracy(1, "billto");
            } else if (_billto_accuracy > 51 && _billto_accuracy <= 75) {
              updateAccuracy(2, "billto");
            } else if (_billto_accuracy > 76 && _billto_accuracy <= 100) {
              updateAccuracy(3, "billto");
            }
          } else {
            updateAccuracy(0, "billto");
          }
        }
        if (items_accuracy_count > 0) {
          if (_items_accuracy && _items_accuracy > 0) {
            if (_items_accuracy > 26 && _items_accuracy <= 50) {
              updateAccuracy(1, "items");
            } else if (_items_accuracy > 51 && _items_accuracy <= 75) {
              updateAccuracy(2, "items");
            } else if (_items_accuracy > 76 && _items_accuracy <= 100) {
              updateAccuracy(3, "items");
            }
          } else {
            updateAccuracy(0, "items");
          }
        }
        if (_accuracy && _accuracy > 0) {
          if (_accuracy > 26 && _accuracy <= 50) {
            updateAccuracy(1, "accuracy");
          } else if (_accuracy > 51 && _accuracy <= 75) {
            updateAccuracy(2, "accuracy");
          } else if (_accuracy > 76 && _accuracy <= 100) {
            updateAccuracy(3, "accuracy");
          }
        } else {
          updateAccuracy(0, "accuracy");
        }
        _bols.push({
          name: el.name,
          type: el.type,
          production: el.production,
          status: el.status,
          createdat: formatDate(el.createdAt),
          ocrstart: formatDate(el.ocrStartAt),
          ocrend: formatDate(el.ocrEndAt),
          accuracy: _accuracy
            ? parseFloat(_accuracy.toFixed(2)).toString()
            : "0.00",
        });
      });
      setBols(_bols);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!hasFetchedData.current) {
      getBOL();
      hasFetchedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const data = bols.map((item) => ({
    name: item.name,
    type: item.type,
    production: item.production,
    status: item.status,
    createdat: item.createdat,
    ocrstart: item.ocrstart,
    ocrend: item.ocrend,
    accuracy: item.accuracy,
  }));
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>BOL Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center fixed w-full h-full bg-slate-900/30 left-0 top-0 z-40">
            <Loading size={150} />
          </div>
        ) : ''}

        <Card className="flex flex-col">
          <CardContent className="flex-1 p-4">
            <div className="grid grid-cols-6 gap-x-2">
              <div className="lg:col-span-1 md:col-span-2 col-span-6">
                <p className=" text-black/80 font-medium dark:text-muted-foreground">
                  Legend
                </p>
                <div className="flex items-center text-sm gap-x-2 mt-2">
                  <p className="bg-[hsl(var(--chart-04))] text-[hsl(var(--chart-04))] min-w-5 min-h-5">
                    
                  </p>
                  0-25%
                </div>
                <div className="flex items-center text-sm gap-x-2 mt-2">
                  <p className="bg-[hsl(var(--chart-03))] text-[hsl(var(--chart-03))] min-w-5 min-h-5">
                    
                  </p>
                  26-50%
                </div>
                <div className="flex items-center text-sm gap-x-2 mt-2">
                  <p className="bg-[hsl(var(--chart-02))] text-[hsl(var(--chart-02))] min-w-5 min-h-5">
                    
                  </p>
                  51-75%
                </div>
                <div className="flex items-center text-sm gap-x-2 mt-2">
                  <p className="bg-[hsl(var(--chart-01))] text-[hsl(var(--chart-01))] min-w-5 min-h-5">
                    
                  </p>
                  76-100%
                </div>
              </div>
              <div className="lg:col-span-1 md:col-span-2 col-span-6">
                <p className="text-center text-black/80 font-medium dark:text-muted-foreground">
                  Overall Accuracy
                </p>
                <ChartContainer
                  config={accuracyChartConfig}
                  className="max-h-[300px]"
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
              </div>
              <div className="lg:col-span-1 md:col-span-2 col-span-6">
                <p className="text-center text-black/80 font-medium dark:text-muted-foreground">
                  Shipper Accuracy
                </p>
                <ChartContainer
                  config={accuracyChartConfig}
                  className="max-h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={shipperAccuracyChartData}
                      dataKey="accuracy_count"
                      nameKey="accuracy_range"
                    />
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="lg:col-span-1 md:col-span-2 col-span-6">
                <p className="text-center text-black/80 font-medium dark:text-muted-foreground">
                  Consignee Accuracy
                </p>
                <ChartContainer
                  config={accuracyChartConfig}
                  className="max-h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={consigneeAccuracyChartData}
                      dataKey="accuracy_count"
                      nameKey="accuracy_range"
                    />
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="lg:col-span-1 md:col-span-2 col-span-6">
                <p className="text-center text-black/80 font-medium dark:text-muted-foreground">
                  Bill To Accuracy
                </p>
                <ChartContainer
                  config={accuracyChartConfig}
                  className="max-h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={billtoAccuracyChartData}
                      dataKey="accuracy_count"
                      nameKey="accuracy_range"
                    />
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="lg:col-span-1 md:col-span-2 col-span-6">
                <p className="text-center text-black/80 font-medium dark:text-muted-foreground">
                  Items Accuracy
                </p>
                <ChartContainer
                  config={accuracyChartConfig}
                  className="max-h-[300px] w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={itemsAccuracyChartData}
                      dataKey="accuracy_count"
                      nameKey="accuracy_range"
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
            <div className="overflow-auto max-w-[100%]">
              <DataTable data={data} columns={columns} />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
export default BolManagement;
