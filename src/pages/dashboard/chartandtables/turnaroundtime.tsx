/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect, useRef, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, TriangleAlert } from "lucide-react";
import { Pie, PieChart, LabelList } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getProdDate, getSelectedDate, setCookie, getSelectedClient } from "@/variables/dates";
// import { useNavigate } from "react-router-dom";
import { BaseUrlContext } from "@/App";

import ClientSelector from "@/components/ClientSelector";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
type ChartData = {
  index: number;
  count: number;
  time_range: string;
  fill: string;
};
interface Clients {
  name: string;
}
const generateChartData = (
  time_range: string[],
  colors: string[]
): ChartData[] => {
  return time_range.map((time_range, index) => ({
    index,
    count: 0,
    time_range: time_range,
    fill: colors[index] || "var(--default-color)",
  }));
};
function TurnAroundTime() {
  const baseUrl = useContext(BaseUrlContext);
  const hasFetchedData = useRef(false);
  // const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(getSelectedDate());
  const [client, setClient] = useState<string>(getSelectedClient());
  const [, setClients] = useState<Clients[]>([]);
  const _colors = ["#0A2647", "#144272", "#205295", "#2C74B3"];
  const ranges = ["Under 2 mins", "2-5 mins", "5-10 mins", "10 mins above"];
  const [elapsedTimeChartData, setElapsedTimeChartData] = useState<ChartData[]>(
    () => generateChartData(ranges, _colors)
  );
  const [capturingChartData, setChapturingChartData] = useState<ChartData[]>(
    () => generateChartData(ranges, _colors)
  );
  const [processingChartData, setProcessingChartData] = useState<ChartData[]>(
    () => generateChartData(ranges, _colors)
  );
  const [validationChartData, setValidationChartData] = useState<ChartData[]>(
    () => generateChartData(ranges, _colors)
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
    _10mins_above: {
      label: "15 mins above",
    },
  } satisfies ChartConfig;
  const updateElapse = (index: number, type: string, total: number) => {
    if (type === "elapse") {
      setElapsedTimeChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index ? { ...data, count: total } : data
        )
      );
    } else if (type === "capturing") {
      setChapturingChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index ? { ...data, count: total } : data
        )
      );
    } else if (type === "processing") {
      setProcessingChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index ? { ...data, count: total } : data
        )
      );
    } else if (type === "validation") {
      setValidationChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index ? { ...data, count: total } : data
        )
      );
    }
  };
  const getElapseTime = async () => {
    try {
      const data = [
        {
          minValue: 0,
          maxValue: 120,
        },
        {
          minValue: 121,
          maxValue: 300,
        },
        {
          minValue: 301,
          maxValue: 600,
        },
        {
          minValue: 601,
          maxValue: 100000,
        },
      ];
      const values = [
        "0.00-120.00",
        "121.00-300.00",
        "301.00-600.00",
        "601.00-100000.00",
      ];
      const _prod_date = getProdDate(date);
      const clientName = client ? client : getDefaultClient();

      const elapse = await axios.post(
        `${baseUrl}document/count-documents-by/elapse/${clientName}/${_prod_date}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (elapse.status == 200) {
        const _elapse = elapse.data.details;
        for (let i = 0; i < values.length; i++) {
          updateElapse(i, "elapse", _elapse[values[i]]);
        }
      }
      const capturing = await axios.post(
        `${baseUrl}document/count-documents-by/attribute/${clientName}/${_prod_date}/upload-elapse`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (capturing.status == 200) {
        // console.log(capturing.data.details)
        const _capturing = capturing.data.details;
        for (let i = 0; i < values.length; i++) {
          updateElapse(i, "capturing", _capturing[values[i]]);
        }
      }
      const processing = await axios.post(
        `${baseUrl}document/count-documents-by/attribute/${clientName}/${_prod_date}/ocr-elapse`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (processing.status == 200) {
        const _processing = processing.data.details;
        for (let i = 0; i < values.length; i++) {
          updateElapse(i, "processing", _processing[values[i]]);
        }
      }
      const validation = await axios.post(
        `${baseUrl}document/count-documents-by/attribute/${clientName}/${_prod_date}/edit-elapse`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (validation.status == 200) {
        const _validation = validation.data.details;
        for (let i = 0; i < values.length; i++) {
          updateElapse(i, "validation", _validation[values[i]]);
        }
      }
      hasFetchedData.current = false;
    } catch (err: any) {
      console.log(err);
      toast("Error!", {
        style: { color: "red", backgroundColor: "#ffeae4" },
        className: "my-classname",
        description: 'An error has occured',
        duration: 3000,
        icon: <TriangleAlert className="w-5 h-5" />,
        closeButton: false,
      });
      
      // if (err.response.status === 403) {
      //   Cookies.remove("_clients");
      //   Cookies.remove("token");
      //   navigate("/");
      // }
    }
  };
  const handleClient = (_client: string) => {
    hasFetchedData.current = false;
    setCookie("_selectedClient", _client)
    setClient(_client);
  };
  const handleDate = (day: any) => {
    setDate(day ?? new Date());
    setCookie("_selectedDate", day ?? new Date())
  };
  const getDefaultClient = () => {
    const __clients = JSON.parse(Cookies.get("_clients") || "");
    return __clients[0];
  };
  useEffect(() => {
    if (Cookies.get("token")) {
      const __clients = JSON.parse(Cookies.get("_clients") || "");
      const clientsList: Clients[] = [];
      __clients.forEach((el: any) => {
        clientsList.push(el);
      });
      setClients(clientsList);
      if (client == "") {
        if(Cookies.get("_selectedClient")){
          setClient(Cookies.get("_selectedClient") || '')
        }else{
          setClient(__clients[0]);
        }
      }
    }
    // setClient(__clients[0])
  }, [client]);
  useEffect(() => {
    if (!hasFetchedData.current) {
      getElapseTime();
   
      hasFetchedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, client]);
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>
          <div className="flex md:flex-row flex-col md:justify-between justify-normal md:items-center items-start gap-2">
            <p>Turn Arround Time</p>
            <div className="flex items-center gap-x-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date}
                    onSelect={handleDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <ClientSelector
                onClientChange={handleClient}
                activeClient={client}
              />
            </div>
          </div>
        </CardTitle>
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
                          fontWeight={900}
                        >
                          <LabelList
                            dataKey="count"
                            className="fill-background"
                            stroke="none"
                            fontWeight="bold"
                            fontSize={14}
                            formatter={(value: any) => {
                              if (value > 0) {
                                return value;
                              } else {
                                return "";
                              }
                            }}
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
                          data={capturingChartData}
                          dataKey="count"
                          nameKey="time_range"
                        >
                          <LabelList
                            dataKey="count"
                            className="fill-background"
                            stroke="none"
                            fontWeight="bold"
                            fontSize={14}
                            formatter={(value: any) => {
                              if (value > 0) {
                                return value;
                              } else {
                                return "";
                              }
                            }}
                          />
                          {/* <LabelList
                            dataKey="count"
                            className="fill-background"
                            stroke="none"
                            fontWeight="bold"
                            fontSize={14}
                          /> */}
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
                          data={processingChartData}
                          dataKey="count"
                          nameKey="time_range"
                        >
                          <LabelList
                            dataKey="count"
                            className="fill-background"
                            stroke="none"
                            fontWeight="bold"
                            fontSize={14}
                            formatter={(value: any) => {
                              if (value > 0) {
                                return value;
                              } else {
                                return "";
                              }
                            }}
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
                      className="mx-auto aspect-square max-h-[550px]  dark:text-primary"
                    >
                      <PieChart className="w-[40em]">
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent nameKey="count" hideLabel />
                          }
                        />
                        <Pie
                          data={validationChartData}
                          dataKey="count"
                          nameKey="time_range"
                        >
                          <LabelList
                            dataKey="count"
                            className="fill-background dark:text-primary"
                            stroke="normal"
                            fontWeight="bold"
                            fontSize={14}
                            formatter={(value: any) => {
                              if (value > 0) {
                                return value;
                              } else {
                                return "";
                              }
                            }}
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
