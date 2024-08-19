/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckCheckIcon,
  FileX2,
  ImageDown,
  ChartNoAxesCombined,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  // Area,
  // AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  // CartesianGrid,
  LabelList,
  // Line,
  // LineChart,
  Pie,
  PieChart,
  // PolarAngleAxis,
  // RadialBar,
  // RadialBarChart,
  Rectangle,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  getProdDate,
  getPreviousDate,
  getSelectedDate,
  setCookie,
  getSelectedClient,
} from "@/variables/dates";
import { Separator } from "@/components/ui/separator";
import ClientSelector from "@/components/ClientSelector";
import Cookies from "js-cookie";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Loading from "@/components/loading";
import { BaseUrlContext } from "@/App";
import { AccuracyData, generateAccuracyData } from "@/variables/bol";
import {
  Collapsible,
  CollapsibleContent,
  // CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Clients,
  Counts,
  HourlyArrival,
  ranges,
  colors,
  countComparer,
} from "@/variables/dashboard";
// import DailyBilled from "@/components/charts/dailybilled";
// import { CaretSortIcon } from "@radix-ui/react-icons";
function Dashboard() {
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  };
  const [isToggleAccuracy, setIsToggleAccuracy] = useState(false);
  const baseUrl = useContext(BaseUrlContext);
  const hasFetched = useRef(false);
  const [client, setClient] = useState<string>(getSelectedClient());
  const [loading, setLoading] = useState<boolean>(true);
  const [, setClients] = useState<Clients[]>([]);
  const [date, setDate] = useState<Date | undefined>(getSelectedDate());
  const [hourlyArrival, setHourlyArrival] = useState<HourlyArrival[]>([]);
  const [hourlyArrivalTotal, setHourlyArrivalTotal] = useState<number>(0);
  const [totalReceive, setTotalReceive] = useState<number>(0);
  // const hasFetchedData = useRef(false);
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
  const [instrustionsAccuracyChartData, setInstrustionsAccuracyChartData] =
    useState<AccuracyData[]>(() => generateAccuracyData(ranges, colors));
  const [referenceAccuracyChartData, setReferenceAccuracyChartData] = useState<
    AccuracyData[]
  >(() => generateAccuracyData(ranges, colors));
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
    } else if (type === "instructions") {
      setInstrustionsAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index ? { ...data, accuracy_count: total } : data
        )
      );
    } else if (type === "reference") {
      setReferenceAccuracyChartData((prevChartData) =>
        prevChartData.map((data, i) =>
          i === index ? { ...data, accuracy_count: total } : data
        )
      );
    }
  };
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
  // const [previousTotalReceive, setPreviousTotalReceive] = useState<number>()
  const [previousHourlyArrivalTotal, setPreviousHourlyArrivalTotal] =
    useState<number>(0);
  const [counts, setCounts] = useState<Counts>({
    billed: 0,
    rejects: 0,
    accuracy: 0,
    receives: 0,
    error: 0,
    uploaded: 0,
    ocred: 0,
  });
  const [previousDayCounts, setPreviousDayCounts] = useState<Counts>({
    billed: 0,
    rejects: 0,
    accuracy: 0,
    receives: 0,
    error: 0,
    uploaded: 0,
    ocred: 0,
  });
  const handleClient = (_client: string) => {
    hasFetched.current = false;
    setCookie("_selectedClient", _client);
    setClient(_client);
  };
  const getDefaultClient = () => {
    const __clients = JSON.parse(Cookies.get("_clients") || "");
    return __clients[0];
  };
  const getHourlyArrival = async () => {
    const _prod_date = getProdDate(date);
    const _previous_date = getPreviousDate(_prod_date);
    const clientName = client ? client : getDefaultClient();
    const response = await axios.get(
      `${baseUrl}document/dashboard/hourly-arrival/${clientName}/${_prod_date}`,
      headers
    );
    const yesterday = await axios.get(
      `${baseUrl}document/dashboard/hourly-arrival/${clientName}/${_previous_date}`,
      headers
    );
    const _hourly: HourlyArrival[] = [];
    let _hourlyArrivalTotal: number = 0;
    let _previousHourlyTotal: number = 0;
    response.data.details.forEach((el: any) => {
      const _hr: number = Number(el[0])
      _hourly.push({
        time:
        _hr < 12 ? (_hr >= 0 ? _hr : "0") + " AM" : (_hr == 12 ? _hr : _hr - 12) + " PM",
        count: el[1],
      });
      _hourlyArrivalTotal += el[1];
    });
    yesterday.data.details.forEach((el: any[]) => {
      _previousHourlyTotal += el[1];
    });
    setHourlyArrivalTotal(_hourlyArrivalTotal);
    setPreviousHourlyArrivalTotal(_previousHourlyTotal);
    // console.log(_hourly);
    setHourlyArrival(_hourly);
    // hasFetched.current = false;
  };
  const documentCounts = async () => {
    const _prod_date = getProdDate(date);
    const _previous_date = getPreviousDate(_prod_date);
    const clientName = client ? client : getDefaultClient();
    const response = await axios.post(
      `${baseUrl}document/count-documents-by/count/${clientName}/${_prod_date}`,
      [],
      headers
    );
    const yesterday = await axios.post(
      `${baseUrl}document/count-documents-by/count/${clientName}/${_previous_date}`,
      [],
      headers
    );
    if (response.data.details) {
      // console.log(response.data.details);
      const _values = response.data.details;
      const _totalReceive =
        _values.EDITED +
        _values.ERROR +
        _values.OCRED +
        _values.REJECTED +
        _values.UPLOADED;
      setTotalReceive(
        _values.EDITED +
          _values.ERROR +
          _values.OCRED +
          _values.REJECTED +
          _values.UPLOADED
      );
      setCounts({
        billed: _values.EDITED,
        rejects: _values.REJECTED,
        accuracy: _values.ACCURACY * 100,
        receives: _totalReceive,
        error: _values.ERROR,
        uploaded: _values.UPLOADED,
        ocred: _values.OCRED,
      });
    }
    if (yesterday.data.details) {
      const _values = yesterday.data.details;
      const _totalReceive =
        _values.EDITED +
        _values.ERROR +
        _values.OCRED +
        _values.REJECTED +
        _values.UPLOADED;
      // setPreviousTotalReceive(_values.EDITED + _values.ERROR + _values.OCRED + _values.REJECTED + _values.UPLOADED);
      setPreviousDayCounts({
        billed: _values.EDITED,
        rejects: _values.REJECTED,
        accuracy: _values.ACCURACY * 100,
        receives: _totalReceive,
        error: _values.ERROR,
        uploaded: _values.UPLOADED,
        ocred: _values.OCRED,
      });
    }
    // hasFetched.current = false;
  };
  const getBOL = async () => {
    const _prod_date = getProdDate(date);
    const clientName = client ? client : getDefaultClient();
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
      `${baseUrl}document/count-documents-by/attribute/${clientName}/${_prod_date}/shipper-accuracy`,
      JSON.stringify(data),
      headers
    );
    if (shipperAccuracy.status == 200) {
      const _shipper_accuracy = shipperAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "shipper", _shipper_accuracy[values[i]]);
      }
    }
    const consigneeAccuracy = await axios.post(
      `${baseUrl}document/count-documents-by/attribute/${clientName}/${_prod_date}/consignee-accuracy`,
      JSON.stringify(data),
      headers
    );
    if (consigneeAccuracy.status == 200) {
      const _consignee_accuracy = consigneeAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "consignee", _consignee_accuracy[values[i]]);
      }
    }
    const billtoAccuracy = await axios.post(
      `${baseUrl}document/count-documents-by/attribute/${clientName}/${_prod_date}/billto-accuracy`,
      JSON.stringify(data),
      headers
    );
    if (billtoAccuracy.status == 200) {
      const _billto_accuracy = billtoAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "billto", _billto_accuracy[values[i]]);
      }
    }
    const itemsAccuracy = await axios.post(
      `${baseUrl}document/count-documents-by/attribute/${clientName}/${_prod_date}/items-accuracy`,
      JSON.stringify(data),
      headers
    );
    if (itemsAccuracy.status == 200) {
      const _items_accuracy = itemsAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "items", _items_accuracy[values[i]]);
      }
    }
    //
    const instructionsAccuracy = await axios.post(
      `${baseUrl}document/count-documents-by/attribute/${clientName}/${_prod_date}/instructions-lines-accuracy`,

      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (instructionsAccuracy.status == 200) {
      const _instructions_accuracy = instructionsAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "instructions", _instructions_accuracy[values[i]]);
      }
    }
    const referenceAccuracy = await axios.post(
      `${baseUrl}document/count-documents-by/attribute/${clientName}/${_prod_date}/reference-accuracy`,

      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (referenceAccuracy.status == 200) {
      const _reference_accuracy = referenceAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "reference", _reference_accuracy[values[i]]);
      }
    }

    //
    const overallAccuracy = await axios.post(
      `${baseUrl}document/count-documents-by/accuracy/${clientName}/${_prod_date}`,
      JSON.stringify(data),
      headers
    );
    if (overallAccuracy.status == 200) {
      const _overall_accuracy = overallAccuracy.data.details;
      for (let i = 0; i < values.length; i++) {
        updateAccuracy(i, "accuracy", _overall_accuracy[values[i]]);
      }
    }
    hasFetched.current = false;
  };
  const handleDate = (day: any) => {
    setDate(day ?? new Date());
    setCookie("_selectedDate", day ?? new Date());
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
        setClient(__clients[0]);
      }
    }
  }, [client]);
  useEffect(() => {
    if (!hasFetched.current) {
      getHourlyArrival();
      documentCounts();
      getBOL();
      hasFetched.current = true;
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, date]);
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center fixed w-full h-full bg-slate-900/30 left-0 top-0 z-40">
          <Loading size={150} />
        </div>
      ) : (
        ""
      )}
      <div
        className="fixed right-5 bottom-5 dark:bg-slate-800 p-2 rounded-md z-50 dark:border-none
      "
      >
        <div className="flex items-center gap-x-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[220px] justify-start text-left font-normal border border-red-800 dark:border-none",
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
          <ClientSelector onClientChange={handleClient} activeClient={client} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Billed Documents
            </CardTitle>
            <CheckCheckIcon className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.billed}</div>
            <p className="text-xs text-muted-foreground">
              {countComparer(counts.billed, previousDayCounts.billed)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reject Documents
            </CardTitle>
            <FileX2 className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.rejects}</div>
            <p className="text-xs text-muted-foreground">
              {countComparer(counts.rejects, previousDayCounts.rejects)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receives</CardTitle>
            <ImageDown className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.receives}</div>
            <p className="text-xs text-muted-foreground">
              {countComparer(counts.receives, previousDayCounts.receives)}{" "}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <ChartNoAxesCombined className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {counts.accuracy.toFixed(2)} %
            </div>
            <p className="text-xs text-muted-foreground">
              {countComparer(counts.accuracy, previousDayCounts.accuracy)}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="md:col-span-5 col-span-12 flex gap-4 flex-col">
          <Card x-chunk="charts-01-chunk-0">
            <CardHeader className="space-y-0 pb-2">
              <CardDescription>Today</CardDescription>
              <CardTitle className="text-4xl tabular-nums">
                {hourlyArrivalTotal}{" "}
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  total BOL's
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={262}>
                <ChartContainer
                  config={{
                    steps: {
                      label: "Steps",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <BarChart
                    accessibilityLayer
                    margin={{
                      left: -4,
                      right: -4,
                    }}
                    data={hourlyArrival}
                  >
                    <CartesianGrid vertical={false} />
                    <Bar
                      dataKey="count"
                      fill="var(--color-steps)"
                      radius={5}
                      activeBar={<Rectangle fillOpacity={0.8} />}
                    />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent hideIndicator />}
                      cursor={false}
                    />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1">
              <CardDescription>
                {countComparer(hourlyArrivalTotal, previousHourlyArrivalTotal)}
              </CardDescription>
              {/* <CardDescription>
                You need{" "}
                <span className="font-medium text-foreground">12,584</span> more
                steps to reach your goal.
              </CardDescription> */}
            </CardFooter>
          </Card>
          {/* <DailyBilled /> */}
        </div>
        <div className="md:col-span-4 col-span-12 flex flex-col gap-4">
          <Card x-chunk="charts-01-chunk-4">
            <CardContent className="flex gap-4 p-4 pb-2">
              <ChartContainer
                config={{
                  uploaded: {
                    label: "Uploaded",
                    color: "hsl(var(--chart-1))",
                  },
                  ocred: {
                    label: "Ocred",
                    color: "hsl(var(--chart-2))",
                  },
                  billed: {
                    label: "Billed",
                    color: "hsl(var(--chart-3))",
                  },
                  error: {
                    label: "Error",
                    color: "hsl(var(--chart-4))",
                  },
                  rejected: {
                    label: "Rejected",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[140px] w-full"
              >
                <BarChart
                  margin={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 10,
                  }}
                  data={[
                    {
                      activity: "uploaded",
                      value: (counts.uploaded / totalReceive) * 100,
                      // label: "8/12 hr",
                      fill: "var(--color-uploaded)",
                    },
                    {
                      activity: "ocred",
                      value: (counts.ocred / totalReceive) * 100,
                      // label: "46/60 min",
                      fill: "var(--color-ocred)",
                    },
                    {
                      activity: "billed",
                      value: (counts.billed / totalReceive) * 100,
                      // label: "245/360 kcal",
                      fill: "var(--color-billed)",
                    },
                    {
                      activity: "error",
                      value: (counts.error / totalReceive) * 100,
                      // label: "245/360 kcal",
                      fill: "var(--color-error)",
                    },
                    {
                      activity: "rejected",
                      value: (counts.rejects / totalReceive) * 100,
                      // label: "245/360 kcal",
                      fill: "var(--color-rejected)",
                    },
                  ]}
                  layout="vertical"
                  barSize={32}
                  barGap={2}
                >
                  <XAxis type="number" dataKey="value" hide />
                  <YAxis
                    width={70}
                    dataKey="activity"
                    type="category"
                    tickLine={false}
                    tickMargin={4}
                    axisLine={false}
                    className="capitalize w-[60px]"
                  />
                  <Bar dataKey="value" radius={5}>
                    <LabelList
                      position="insideLeft"
                      dataKey="label"
                      fill="white"
                      offset={8}
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-row border-t p-4">
              <div className="flex w-full items-center gap-2">
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-xs text-muted-foreground">Uploaded</div>
                  <div className="flex items-baseline gap-1 text-xs font-bold tabular-nums leading-none">
                    {counts.uploaded}
                    <span className="text-xs font-normal text-muted-foreground">
                      / {totalReceive}
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-xs text-muted-foreground">Ocred</div>
                  <div className="flex items-baseline gap-1 text-xs font-bold tabular-nums leading-none">
                    {counts.ocred}
                    <span className="text-xs font-normal text-muted-foreground">
                      / {totalReceive}
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-xs text-muted-foreground">Billed</div>
                  <div className="flex items-baseline gap-1 text-xs font-bold tabular-nums leading-none">
                    {counts.billed}
                    <span className="text-xs font-normal text-muted-foreground">
                      / {totalReceive}
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-xs text-muted-foreground">Error</div>
                  <div className="flex items-baseline gap-1 text-xs font-bold tabular-nums leading-none">
                    {counts.error}
                    <span className="text-xs font-normal text-muted-foreground">
                      / {totalReceive}
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-xs text-muted-foreground">Rejected</div>
                  <div className="flex items-baseline gap-1 text-xs font-bold tabular-nums leading-none">
                    {counts.rejects}
                    <span className="text-xs font-normal text-muted-foreground">
                      / {totalReceive}
                    </span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
          {/* <Card x-chunk="charts-01-chunk-5">
            <CardContent className="flex gap-4 p-4">
              <div className="grid items-center gap-2">
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-sm text-muted-foreground">Regular</div>
                  <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                    562/600
                    <span className="text-sm font-normal text-muted-foreground">
                      bol
                    </span>
                  </div>
                </div>
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-sm text-muted-foreground">Special</div>
                  <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                    73/60
                    <span className="text-sm font-normal text-muted-foreground">
                      bol
                    </span>
                  </div>
                </div>
                <div className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-sm text-muted-foreground">Haz-mat</div>
                  <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                    8/12
                    <span className="text-sm font-normal text-muted-foreground">
                      bol
                    </span>
                  </div>
                </div>
              </div>
              <ChartContainer
                config={{
                  move: {
                    label: "Move",
                    color: "hsl(var(--chart-1))",
                  },
                  exercise: {
                    label: "Exercise",
                    color: "hsl(var(--chart-2))",
                  },
                  stand: {
                    label: "Stand",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="mx-auto aspect-square w-full max-w-[80%] max-h-[250px]"
              >
                <RadialBarChart
                  margin={{
                    left: -10,
                    right: -10,
                    top: -10,
                    bottom: -10,
                  }}
                  data={[
                    {
                      activity: "stand",
                      value: (11 / 12) * 100,
                      fill: "var(--color-stand)",
                    },
                    {
                      activity: "exercise",
                      value: (46 / 60) * 100,
                      fill: "var(--color-exercise)",
                    },
                    {
                      activity: "move",
                      value: (245 / 360) * 100,
                      fill: "var(--color-move)",
                    },
                  ]}
                  innerRadius="20%"
                  barSize={24}
                  startAngle={90}
                  endAngle={450}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    dataKey="value"
                    tick={false}
                  />
                  <RadialBar dataKey="value" background cornerRadius={5} />
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </Card> */}
          {/* <Card x-chunk="charts-01-chunk-7">
            <CardHeader className="space-y-0 pb-0">
              <CardDescription>Time</CardDescription>
              <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                8
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  hr
                </span>
                35
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  min
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChartContainer
                config={{
                  time: {
                    label: "Time",
                    color: "hsl(var(--chart-2))",
                  },
                }}
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
                  <XAxis dataKey="date" hide />
                  <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
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
            </CardContent>
          </Card> */}
        </div>
        <div className="md:col-span-3 col-span-12 flex flex-col gap-4">
          <Collapsible
            open={isToggleAccuracy}
            onOpenChange={setIsToggleAccuracy}
            className="space-y-2"
          >
            <button
              onClick={() => setIsToggleAccuracy(!isToggleAccuracy)}
              className="flex items-center justify-center bg-red-800 text-white hover:bg-red-900 dark:bg-slate-700 dark:hover:bg-slate-800 w-full rounded-md text-xs py-2 dark:text-slate-200"
            >
              View all accuracy{" "}
              {!isToggleAccuracy ? <ChevronDown /> : <ChevronUp />}{" "}
            </button>
            <Card x-chunk="charts-01-chunk-7" className="flex flex-col">
              <CardHeader className="p-2">
                <CardDescription>Overall Accuracy</CardDescription>
                <div>
                  <p className=" text-black/80 font-medium dark:text-muted-foreground text-xs">
                    Legend
                  </p>
                  <div className="flex gap-2">
                    <div className="flex items-center text-xs gap-x-2 mt-2 ">
                      <p className="bg-[hsl(var(--chart-04))] text-[hsl(var(--chart-04))] min-w-4 min-h-4 rounded-full"></p>
                      0-25%
                    </div>
                    <div className="flex items-center text-xs gap-x-2 mt-2">
                      <p className="bg-[hsl(var(--chart-03))] text-[hsl(var(--chart-03))] min-w-4 min-h-4 rounded-full"></p>
                      26-50%
                    </div>
                    <div className="flex items-center text-xs gap-x-2 mt-2">
                      <p className="bg-[hsl(var(--chart-02))] text-[hsl(var(--chart-02))] min-w-4 min-h-4 rounded-full"></p>
                      51-75%
                    </div>
                    <div className="flex items-center text-xs gap-x-2 mt-2">
                      <p className="bg-[hsl(var(--chart-01))] text-[hsl(var(--chart-01))] min-w-4 min-h-4 rounded-full"></p>
                      76-100%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
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
                      //
                      data={accuracyChartData}
                      dataKey="accuracy_count"
                      nameKey="accuracy_range"
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <CollapsibleContent className="space-y-2">
              <Card x-chunk="charts-01-chunk-7">
                <CardHeader className="p-2">
                  <CardDescription>Shipper Accuracy</CardDescription>
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
                        // label
                        data={shipperAccuracyChartData}
                        dataKey="accuracy_count"
                        nameKey="accuracy_range"
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card x-chunk="charts-01-chunk-7">
                <CardHeader className="p-2">
                  <CardDescription>Consignee Accuracy</CardDescription>
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
                        // label
                        data={consigneeAccuracyChartData}
                        dataKey="accuracy_count"
                        nameKey="accuracy_range"
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card x-chunk="charts-01-chunk-7">
                <CardHeader className="p-2">
                  <CardDescription>Bill to Accuracy</CardDescription>
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
                        // label
                        data={billtoAccuracyChartData}
                        dataKey="accuracy_count"
                        nameKey="accuracy_range"
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card x-chunk="charts-01-chunk-7">
                <CardHeader className="p-2">
                  <CardDescription>Items Accuracy</CardDescription>
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
                        // label
                        data={itemsAccuracyChartData}
                        dataKey="accuracy_count"
                        nameKey="accuracy_range"
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card x-chunk="charts-01-chunk-7">
                <CardHeader className="p-2">
                  <CardDescription>Reference Accuracy</CardDescription>
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
                        // label
                        data={referenceAccuracyChartData}
                        dataKey="accuracy_count"
                        nameKey="accuracy_range"
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card x-chunk="charts-01-chunk-7">
                <CardHeader className="p-2">
                  <CardDescription>
                    Special Instructions Accuracy
                  </CardDescription>
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
                        // label
                        data={instrustionsAccuracyChartData}
                        dataKey="accuracy_count"
                        nameKey="accuracy_range"
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
