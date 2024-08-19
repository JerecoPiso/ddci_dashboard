/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CircleCheckBig,
  ScanText,
  ImageUp,
  Calendar as CalendarIcon,
  TriangleAlert,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
import { useEffect, useState, useRef, useContext } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getProdDate, setCookie, getSelectedDate,getSelectedClient } from "@/variables/dates";
// import { useNavigate } from "react-router-dom";
import { BaseUrlContext } from "@/App";
import ClientSelector from "@/components/ClientSelector";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
interface Clients {
  name: string;
}
function CurrentVolume() {
  const baseUrl = useContext(BaseUrlContext);

  // const navigate = useNavigate();
  const hasFetchedData = useRef(false);
  const [date, setDate] = useState<Date | undefined>(getSelectedDate());
  const [client, setClient] = useState<string>(getSelectedClient());
  const [, setClients] = useState<Clients[]>([]);
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
  const getVolumes = async () => {
    try {
      const _prod_date = getProdDate(date);
      const clientName = client ? client : getDefaultClient();

      const response = await axios.post(
        `${baseUrl}document/count-documents-by/count/${clientName}/${_prod_date}`,
        [],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (response.status === 200) {
        updateAccuracy(0, response.data.details["UPLOADED"]);
        updateAccuracy(1, response.data.details["OCRED"]);
        updateAccuracy(2, response.data.details["EDITED"]);
      }
      hasFetchedData.current = false;
    } catch (err: any) {
      console.log(err);
      toast("Error!", {
        style: { color: "red", backgroundColor: "#ffeae4" },
        className: "my-classname",
        description: "An error has occured",
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
  const updateAccuracy = (index: number, total: number) => {
    setChartData((prevChartData) =>
      prevChartData.map((data, i) =>
        i === index ? { ...data, count: total } : data
      )
    );
  };
  const handleClient = (_client: string) => {
    hasFetchedData.current = false;
    setCookie("_selectedClient", _client)

    setClient(_client);
  };
  const handleDate = (day: any) => {
    setDate(day ?? new Date());
    setCookie("_selectedDate", day ?? new Date());
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
        if (Cookies.get("_selectedClient")) {
          setClient(Cookies.get("_selectedClient") || "");
        } else {
          setClient(__clients[0]);
        }
      }
    }

    // setClient(__clients[0])
  }, [client]);
  useEffect(() => {
    if (!hasFetchedData.current) {
      getVolumes();
      hasFetchedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, client]);
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>
          <div className="flex md:flex-row flex-col md:justify-between justify-normal md:items-center items-start gap-2">
            <p>Current Volume</p>
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
        <div className="grid grid-cols-12 gap-2">
          <div className="md:col-span-2 col-span-12 flex flex-col">
            <div>
              <div className="flex gap-x-2 items-center  border rounded-md shadow-sm p-2">
                <ImageUp
                  size={48}
                  className="text-blue-600 dark:text-muted-foreground"
                />
                <div>
                  <p className="text-lg text-muted-foreground">Uploaded</p>
                  <p className=" text-muted-foreground text-lg">
                    {chartData[0].count}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-2 items-center  border rounded-md shadow-sm p-2 mt-2">
                <ScanText
                  size={48}
                  className="text-green-600 dark:text-muted-foreground"
                />
                <div>
                  <p className="text-lg text-muted-foreground">Ocred</p>
                  <p className=" text-muted-foreground text-lg">
                    {chartData[1].count}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-2 items-center  border rounded-md shadow-sm p-2 mt-2">
                <CircleCheckBig
                  size={48}
                  className="text-red-600 dark:text-muted-foreground"
                />
                <div>
                  <p className="text-lg text-muted-foreground">Billed</p>
                  <p className=" text-muted-foreground text-lg">
                    {chartData[2].count}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-10 col-span-12">
            <Card>
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
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                      <LabelList
                        position="middle"
                        dataKey="count"
                        fontSize={14}
                        fontWeight={500}
                        className="fill-background"
                        fillOpacity={1}
                      />
                    </Bar>
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
