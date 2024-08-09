/* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getProdDate } from "@/variables/dates";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { formatDate, convertSeconds } from "@/utils/date";
import { Pie, PieChart } from "recharts";
import { DataTable } from "@/components/datatable/bolmanagement/data-table";
import { columns } from "@/components/datatable/bolmanagement/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BOL, AccuracyData, generateAccuracyData } from "@/variables/bol";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/loading";
import axios from "axios";
import ClientSelector from "@/components/ClientSelector";
interface Clients {
  name: string;
}
interface DocumentSaveDates {
  dates: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BolManagement() {
  const navigate = useNavigate();
  const ranges = ["_025", "_2650", "_51_75", "_76100"];
  const colors = [
    "var(--color-_025)",
    "var(--color-_2650)",
    "var(--color-_51_75)",
    "var(--color-_76100)",
  ];
  const [date, setDate] = useState<Date>();
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<string>("ALL");
  const [rowSize, setRowSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  // const [bols, setBols] = useState<BOL[]>([]);
  const [client, setClient] = useState<string>("");
  const [, setClients] = useState<Clients[]>([]);
  const [bols, setBols] = useState<BOL[]>([]);

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
          i === index ? { ...data, accuracy_count: total } : data
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
          i === index ? { ...data, accuracy_count: total } : data
        )
      );
    } else if (type === "billto") {
      setBilltoAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index ? { ...data, accuracy_count: total } : data
        )
      );
    } else if (type === "items") {
      setItemsAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index ? { ...data, accuracy_count: total } : data
        )
      );
    }
  };
  const getBOL = async (api: string) => {
    try {
      setLoading(true);
      const _prod_date = getProdDate(date);
      const clientName = client ? client : getDefaultClient();
      const link: string =
        api === "getDocument"
          ? `http://192.168.23.84:8007/ddcic/api/v1/document/get/${clientName}/${_prod_date}/${page}/${rowSize}`
          : `http://192.168.23.84:8007/ddcic/api/v1/document/get/${clientName}/${_prod_date}/${status}/${page}/${rowSize}`;
      const response = await axios.get(link, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        // console.log(response.data.details);
        const _bols: BOL[] = [];
        if (response.data.details) {
          setPageCount(response.data.details.pageCount);
          response.data.details.list.forEach((el: any) => {
            let accuracy_total: number = 0;
            let elapse: number = 0;
            const document_save_dates: DocumentSaveDates[] = [];
            let _turnAroundSeconds: number = 0
            if (Object.keys(el.attributes).length > 0) {
              accuracy_total =
                ((parseFloat(el.attributes["billto-accuracy"]) +
                  parseFloat(el.attributes["consignee-accuracy"]) +
                  parseFloat(el.attributes["instructions-lines-accuracy"]) +
                  parseFloat(el.attributes["items-accuracy"]) +
                  parseFloat(el.attributes["reference-accuracy"]) +
                  parseFloat(el.attributes["shipper-accuracy"])) /
                  6) *
                100;
              elapse =
                parseFloat(el.attributes["edit-elapse"]) +
                parseFloat(el.attributes["ocr-elapse"]) +
                parseFloat(el.attributes["upload-elapse"]);
              el.processes.forEach((e: any) => {
                if (e.name === "DOCUMENT_SAVE") {
                  document_save_dates.push(e.endTime);
                }
              });
              const dates: Date[] = document_save_dates.map(
                (dateTime) => new Date(dateTime.toString())
              );
              const maxDate: Date = new Date(
                Math.max(...dates.map((date) => date.getTime()))
              );
              const _createdAt = new Date(el.createdAt);
              const _processEndTime = new Date(maxDate.toISOString().slice(0, 19));
              _turnAroundSeconds  = _processEndTime.getTime() - _createdAt.getTime();
            }
            // const _accuracy: number = accuracy_total;
            // console.log(`${el.priority}`)
            _bols.push({
              document: el.document,
              client: el.client,
              type: el.type,
              production: el.production,
              status: el.status,
              createdat: formatDate(el.createdAt),
              accuracy: accuracy_total.toFixed(2),
              elapse: convertSeconds(elapse),
              turnaroundtime: convertSeconds(_turnAroundSeconds/1000),
              priority: el.priority > 0 ? 'Yes' : 'No'
            });
          });
        } else {
          setPage(1);
          setPageCount(0);
        }
        setBols(_bols);
      }
      const data = [
        {
          minValue: 0.0,
          maxValue: 0.25,
        },
        {
          minValue: 0.26,
          maxValue: 0.5,
        },
        {
          minValue: 0.51,
          maxValue: 0.75,
        },
        {
          minValue: 0.76,
          maxValue: 1.0,
        },
      ];
      const values = ["0.00-0.25", "0.26-0.50", "0.51-0.75", "0.76-1.00"];
      const shipperAccuracy = await axios.post(
        `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/attribute/${clientName}/${_prod_date}/shipper-accuracy`,

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
        `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/attribute/${clientName}/${_prod_date}/consignee-accuracy`,

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
        `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/attribute/${clientName}/${_prod_date}/billto-accuracy`,

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
        `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/attribute/${clientName}/${_prod_date}/items-accuracy`,

        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (itemsAccuracy.status == 200) {
        const values = ["0.00-0.25", "0.26-0.50", "0.51-0.76", "0.76-1.00"];
        const _items_accuracy = itemsAccuracy.data.details;
        for (let i = 0; i < values.length; i++) {
          updateAccuracy(i, "items", _items_accuracy[values[i]]);
        }
      }
      const overallAccuracy = await axios.post(
        `http://192.168.23.84:8007/ddcic/api/v1/document/count-documents-by/accuracy/${clientName}/${_prod_date}`,

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
      hasFetchedData.current = false;
      setLoading(false);
    } catch (err: any) {
      if (err.response.status === 403) {
        Cookies.remove("_clients");
        Cookies.remove("token");
        navigate("/");
      }
    }
  };
  const filterChange = (filter: string) => {
    console.log(filter);
  };
  const onFilterStatus = (status: string) => {
    hasFetchedData.current = false;
    setStatus(status);
    setPage(1);
  };
  const changePage = (movement: string, rowSize?: string) => {
    if (movement === "next") {
      setPage((prevPage) => prevPage + 1);
    } else if (movement === "prev") {
      setPage((prevPage) => prevPage - 1);
    } else if (movement === "first") {
      setPage(1);
    } else if (movement === "last") {
      setPage(pageCount);
    } else if (movement) {
      setPage(1);
      setRowSize(Number(rowSize));
    }
    hasFetchedData.current = false;
  };
  const handleClient = (_client: string) => {
    hasFetchedData.current = false;
    setClient(_client);
  };
  const getDefaultClient = () => {
    const __clients = JSON.parse(Cookies.get("_clients") || "");
    return __clients[0];
  };
  // const setCookie = (cookieValue: string) => {
  //   const currentDate = new Date();
  //   const expirationDate = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
  //   Cookies.set("activeClient", cookieValue, {
  //     path: "/",
  //     expires: expirationDate,
  //   });
  // }
  useEffect(() => {
    const __clients = JSON.parse(Cookies.get("_clients") || "");
    const clientsList: Clients[] = [];
    __clients.forEach((el: any) => {
      clientsList.push(el);
    });
    setClients(clientsList);
    if (client == "") {
      setClient(__clients[0]);
    }
    // setClient(__clients[0 ])
  }, [client]);
  useEffect(() => {
    if (hasFetchedData.current === false) {
      getBOL(status === "ALL" ? "getDocument" : "getDocumentByStatus");
      hasFetchedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowSize, status, date, client]);
  const data = bols.map((item) => ({
    document: item.document,
    client: item.client,
    type: item.type,
    production: item.production,
    status: item.status,
    createdat: item.createdat,
    accuracy: item.accuracy,
    elapse: item.elapse,
    turnaroundtime: item.turnaroundtime,
    priority: item.priority
  }));
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>
          <div className="flex md:flex-row flex-col md:justify-between justify-normal md:items-center items-start gap-2">
            <p>BOL Management</p>
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
                    onSelect={setDate}
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
        {loading ? (
          <div className="flex justify-center items-center fixed w-full h-full bg-slate-900/30 left-0 top-0 z-40">
            <Loading size={150} />
          </div>
        ) : (
          ""
        )}
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
            <div className="overflow-auto max-w-[100%]">
              <DataTable
                data={data}
                columns={columns}
                filterChange={filterChange}
                changePage={changePage}
                pageCount={pageCount}
                pageNumber={page}
                onFilterStatus={onFilterStatus}
              />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
export default BolManagement;
