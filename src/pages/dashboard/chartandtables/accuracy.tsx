/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
import Cookies from "js-cookie";
import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AccuracyData, generateAccuracyData } from "@/variables/bol";
import Loading from "@/components/loading";
import axios from "axios";
interface Clients {
  name: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Accuracy() {
  const ranges = ["_025", "_2650", "_51_75", "_76100"];
  const colors = [
    "var(--color-_025)",
    "var(--color-_2650)",
    "var(--color-_51_75)",
    "var(--color-_76100)",
  ];
  const [loading, setLoading] = useState<boolean>(false);
  const [, setClients] = useState<Clients[]>([]);
  const hasFetchedData = useRef(false);
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
  const updateAccuracy = (index: number, type: string, total: number) => {
    if (type === "accuracy") {
      setAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index
            ? { ...data, accuracy_count:total }
            : data
        )
      );
    } else if (type === "shipper") {
      setShipperAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index ? { ...data, accuracy_count: total } : data
        )
      );
    } else if (type === "consignee") {
      setConsigneeAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index
            ? { ...data, accuracy_count: total }
            : data
        )
      );
    } else if (type === "billto") {
      setBilltoAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index
            ? { ...data, accuracy_count: total}
            : data
        )
      );
    } else if (type === "items") {
      setItemsAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index
            ? { ...data, accuracy_count: total}
            : data
        )
      );
    }
  };
 
  const getAccuracy = async () => {
    setLoading(true);
   
    const data = [
      {
        minValue: 0.00,
        maxValue: 0.25,
      },
      {
        minValue: 0.26,
        maxValue: 0.50,
      },
      {
        minValue: 0.51,
        maxValue: 0.75,
      },
      {
        minValue: 0.76,
        maxValue: 1.00,
      },
    ];
    const values = ["0.00-0.25", "0.26-0.50", "0.51-0.76", "0.76-1.00"];
    const overallAccuracy = await axios.post(
        `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/accuracy/ESTES/2024-08-06`,
  
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (overallAccuracy.status == 200) {
        const _overall_accuracy = overallAccuracy.data.details;
        for (let i = 0; i < values.length; i++) {
          updateAccuracy(i, "accuracy", _overall_accuracy[values[i]]);
        }
      }
    const shipperAccuracy = await axios.post(
      `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/attribute/ESTES/2024-08-06/shipper-accuracy`,

      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (shipperAccuracy.status == 200) {
      const _shipper_accuracy = shipperAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "shipper", _shipper_accuracy[values[i]]);
      }
    }
    const consigneeAccuracy = await axios.post(
      `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/attribute/ESTES/2024-08-06/consignee-accuracy`,

      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (consigneeAccuracy.status == 200) {
      const values = ["0.00-0.25", "0.26-0.50", "0.51-0.76", "0.76-1.00"];
      const _consignee_accuracy = consigneeAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "consignee", _consignee_accuracy[values[i]]);
      }
    }
    const billtoAccuracy = await axios.post(
      `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/attribute/ESTES/2024-08-06/billto-accuracy`,

      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (billtoAccuracy.status == 200) {
      const values = ["0.00-0.25", "0.26-0.50", "0.51-0.76", "0.76-1.00"];
      const _billto_accuracy = billtoAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "billto", _billto_accuracy[values[i]]);
      }
    }
    const itemsAccuracy = await axios.post(
      `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/attribute/ESTES/2024-08-06/items-accuracy`,

      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (itemsAccuracy.status == 200) {
      const values = ["0.00-0.25", "0.26-0.50", "0.51-0.75", "0.76-1.00"];
      const _items_accuracy = itemsAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "items", _items_accuracy[values[i]]);
      }
    }
   
    setLoading(false);
  };
  
  useEffect(() => {
    if (hasFetchedData.current === false) {
      const __clients = JSON.parse(Cookies.get("_clients") || "");
      const clientsList: Clients[] = [];
      __clients.forEach((el: any) => {
        clientsList.push(el);
      });
      setClients(clientsList);
      getAccuracy();
      hasFetchedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Accuracy</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center fixed w-full h-full bg-slate-900/30 left-0 top-0 z-40">
            <Loading size={150} />
          </div>
        ) : (
          ""
        )}
        {/* <Sheet>
          <SheetTrigger className="bg-red-800 text-white dark:bg-slate-700 pb-2 pt-[5px] px-3 mb-2 rounded-sm">
            Change Client
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Change Client</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {clients.map((el: any, index: number) => (
                <div className="items-top flex space-x-2" key={index}>
                  <Checkbox />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {el}
                    </label>
                  </div>
                </div>
              ))}
              <Button
                type="submit"
                className="w-full disabled:opacity-60 bg-red-800 hover:bg-red-800 dark:bg-slate-800 text-white mt-4"
              >
                SET
              </Button>
            </div>
          </SheetContent>
        </Sheet> */}
        <Card className="flex flex-col">
          <CardContent className="flex-1 p-4">
           
            <div className="grid grid-cols-12 gap-x-2">
              <div className="lg:col-span-1 md:col-span-2 col-span-12">
                <p className=" text-black/80 font-medium dark:text-muted-foreground">
                  Legend
                </p>
                <div className="flex items-center text-sm gap-x-2 mt-2">
                  <p className="bg-[hsl(var(--chart-04))] text-[hsl(var(--chart-04))] min-w-5 min-h-5"></p>
                  0-25%
                </div>
                <div className="flex items-center text-sm gap-x-2 mt-2">
                  <p className="bg-[hsl(var(--chart-03))] text-[hsl(var(--chart-03))] min-w-5 min-h-5"></p>
                  26-50%
                </div>
                <div className="flex items-center text-sm gap-x-2 mt-2">
                  <p className="bg-[hsl(var(--chart-02))] text-[hsl(var(--chart-02))] min-w-5 min-h-5"></p>
                  51-75%
                </div>
                <div className="flex items-center text-sm gap-x-2 mt-2">
                  <p className="bg-[hsl(var(--chart-01))] text-[hsl(var(--chart-01))] min-w-5 min-h-5"></p>
                  76-100%
                </div>
              </div>
              <div className="lg:col-span-11 md:col-span-10 col-span-12">
                <div className="grid grid-cols-12">
                  <div className="flex justify-center items-center lg:col-span-4 md:col-span-5 col-span-12">
                    <div className=" w-full">
                      <p className="text-center text-black/80 font-medium dark:text-muted-foreground">
                        Overall Accuracy
                      </p>
                      <ChartContainer
                        config={accuracyChartConfig}
                        className="max-h-[700px]"
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
                  </div>
                  <div className="lg:col-span-8 md:col-span-7 col-span-12">
                    <div className="grid grid-cols-2">
                      <div className="md:col-span-1 col-span-2">
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
                      </div>
                      <div className="md:col-span-1 col-span-2">
                        {" "}
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
                      </div>
                      <div className="md:col-span-1 col-span-2">
                        {" "}
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
                      </div>
                      <div className="md:col-span-1 col-span-2">
                        {" "}
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
                    </div>
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
export default Accuracy;
