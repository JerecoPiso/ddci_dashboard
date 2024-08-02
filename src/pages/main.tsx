import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ddc_connect from "../../public/new.png";
import ddc_connect3 from "../../public/ddc_connect3.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserCircle,
  SquareChartGantt,
  ImageDown,
  Package2,
  PanelLeft,
  Home,
  LayoutDashboard,
  ShoppingCart,
  Package,
  LineChart,
  Users2,
  Timer
  // Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCookies } from "react-cookie";
// import Cookies from "node_modules/@types/js-cookie";
// Cookies.get("token")
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/mode-toggle";
// import Cookies from "js-cookie";
function Main() {
  const [cookies, , removeCookie] = useCookies(["token"], {
    doNotUpdate: true,
  });
  const path = useLocation();
  const navigate = useNavigate();
  const currentPath = path.pathname;
  const [logout, setLogout] = useState<boolean>(false);
  const handleLogout = () => {
    setLogout(logout ? false : true);
  };
  const [theme, setThemeValue] = useState<string | null>(
    localStorage.getItem("vite-ui-theme")
  );
  const handleThemeChange = (value: string) => {
    setThemeValue(value); // Update state with the value from the child
  };
  const logoutUser = () => {
    removeCookie("token", { maxAge: 0 });
  };
  useEffect(() => {
    if (!cookies.token) {
      navigate("/");
    }
  }, [cookies.token, currentPath, navigate]);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="bg-red-800 dark:bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9  items-center justify-center bg-accent rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <DatabaseZap className="h-5 w-5" />
                <span className="sr-only">Data Validation</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Data Validation</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Customers</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">User Validation</TooltipContent>
          </Tooltip> */}
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div>
            <img
              src={theme === "dark" ? ddc_connect3 : ddc_connect}
              alt=""
              className="h-[3.5em] w-full -mt-2 -ml-[10px]"
            />
          </div>
          <div className="relative ml-auto flex-1 md:grow-0">
          </div>
          <ModeToggle onThemeChange={handleThemeChange} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <UserCircle className="h-5 w-5"></UserCircle>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <AlertDialog open={logout}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleLogout}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-800 hover:bg-red-900 dark:bg-slate-800 dark:text-white"
                onClick={logoutUser}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex flex-wrap gap-1 p-4 sm:px-6 sm:py-0 md:gap-1">
        {/* <Link
            to={"/dashboard/statistics"}
            className={`${
              currentPath.includes("statistics")
                ? "dark:bg-slate-100 dark:text-slate-900 bg-red-800 text-slate-100"
                : "dark:bg-slate-700 dark:text-white"
            } flex gap-x-2 items-center  border border-slate-900/10 rounded-sm w-auto px-3 py-2 hover:bg-red-800 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900`}
          >
            <LineChart className="h-5 w-5" /> Statistics
          </Link> */}
          <Link
            to={"/dashboard/bolmanagement"}
            className={`${
              currentPath.includes("bolmanagement")
                ? "dark:bg-slate-100 dark:text-slate-900 bg-red-800 text-slate-100"
                : "dark:bg-slate-700 dark:text-white"
            } flex gap-x-2 items-center  border border-slate-900/10 rounded-sm w-auto px-3 py-2 hover:bg-red-800 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900`}
          >
            <SquareChartGantt className="h-5 w-5" /> BOL Management
          </Link>
          <Link
            to={"/dashboard/currentvolume"}
            className={`${
              currentPath.includes("currentvolume")
                ? "dark:bg-slate-100 dark:text-slate-900 bg-red-800 text-slate-100"
                : "dark:bg-slate-700 dark:text-white"
            } flex gap-x-2 items-center  border border-slate-900/10 rounded-sm w-auto px-3 py-2 hover:bg-red-800 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900`}
          >
            <ImageDown className="h-5 w-5" />
            Current Volume
          </Link>
          <Link
            to={"/dashboard/turnaroundtime"}
            className={`${
              currentPath.includes("turnaroundtime")
                ? "dark:bg-slate-100 dark:text-slate-900 bg-red-800 text-slate-100"
                : "dark:bg-slate-700 dark:text-white"
            } flex gap-x-2 items-center  border border-slate-900/10 rounded-sm w-auto px-3 py-2 hover:bg-red-800 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900`}
          >
            <Timer className="h-5 w-5" />
            Turn Around Time
          </Link>
        </div>
        <div className="flex h-full flex-1 flex-col px-[22px] md:flex">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default Main;
