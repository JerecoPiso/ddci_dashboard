import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
// import ddc_connect from "/new.png";
// import ddc_connect3 from "/ddc_connect3.png";
import apex from "/apex_crop.png";
import { User2, SquareChartGantt, ImageDown, Timer } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { UserCircle, PanelLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Cookies from "js-cookie";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/mode-toggle";
function Main() {
  const [roles, setRoles] = useState<string>();
  const navigate = useNavigate();
  const path = useLocation();
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
    Cookies.remove("token");
    Cookies.remove("_clients");
    Cookies.remove("_selectedClient");
    Cookies.remove("_authorities");
    navigate("/");
  };
  useEffect(() => {
    setRoles(JSON.stringify(Cookies.get("_authorities")));
    if (!Cookies.get("token")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="bg-red-800 dark:bg-background fixed inset-y-0 left-0 z-40 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dashboard/"
                className={`${
                  currentPath === "/dashboard/" ||
                  currentPath === "/dashboard/" ||
                  currentPath === "/dashboard/"
                    ? "bg-accent"
                    : "text-white"
                } flex h-9 w-1  items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Dashboard </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dashboard/bolmanagement"
                className={`${
                  currentPath === "/dashboard/bolmanagement" ||
                  currentPath === "/dashboard/bolmanagement" ||
                  currentPath === "/dashboard/bolmanagement"
                    ? "bg-accent"
                    : "text-white"
                } flex h-9 w-1  items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <SquareChartGantt className="h-5 w-5" />
                <span className="sr-only">BOL Management </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">BOL Management</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dashboard/currentvolume"
                className={`${
                  currentPath === "/dashboard/currentvolume" ||
                  currentPath === "/dashboard/currentvolume" ||
                  currentPath === "/dashboard/currentvolume"
                    ? "bg-accent"
                    : "text-white"
                } flex h-9 w-1  items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <ImageDown className="h-5 w-5" />
                <span className="sr-only">Current Volume </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Current Volume </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dashboard/turnaroundtime"
                className={`${
                  currentPath === "/dashboard/turnaroundtime" ||
                  currentPath === "/dashboard/turnaroundtime" ||
                  currentPath === "/dashboard/turnaroundtime"
                    ? "bg-accent"
                    : "text-white"
                } flex h-9 w-1  items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Timer className="h-5 w-5" />
                <span className="sr-only">Turn Around Time </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Turn Around Time </TooltipContent>
          </Tooltip>
          {(roles?.includes("ROLE_ADMIN") ||
            roles?.includes("ROLE_SYSTEM")) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dashboard/usermanagement"
                  className={`${
                    currentPath === "/dashboard/usermanagement"
                      ? "bg-accent"
                      : "text-white"
                  } flex h-9 w-1  items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8`}
                >
                  <User2 className="h-5 w-5" />
                  <span className="sr-only">Users</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Users</TooltipContent>
            </Tooltip>
          )}
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTitle className="hidden"></SheetTitle>
            <SheetDescription className="hidden"></SheetDescription>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid text-lg font-medium mt-4 gap-y-2">
                <Link
                  to="/dashboard/"
                  className={`${
                    currentPath === "/dashboard/" ||
                    currentPath === "/dashboard/" ||
                    currentPath === "/dashboard/"
                      ? "bg-accent"
                      : "text-white"
                  } flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground p-2 rounded-md`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/bolmanagement"
                  className={`${
                    currentPath === "/dashboard/bolmanagement" ||
                    currentPath === "/dashboard/bolmanagement" ||
                    currentPath === "/dashboard/bolmanagement"
                      ? "bg-accent"
                      : "text-white"
                  } flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground p-2 rounded-md`}
                >
                  <SquareChartGantt className="h-5 w-5" />
                  BOL Management
                </Link>
                <Link
                  to="/dashboard/currentvolume"
                  className={`${
                    currentPath === "/dashboard/currentvolume" ||
                    currentPath === "/dashboard/currentvolume" ||
                    currentPath === "/dashboard/currentvolume"
                      ? "bg-accent"
                      : "text-white"
                  } flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground p-2 rounded-md`}
                >
                  <ImageDown className="h-5 w-5" />
                  Current Volume
                </Link>
                <Link
                  to="/dashboard/turnaroundtime"
                  className={`${
                    currentPath === "/dashboard/turnaroundtime" ||
                    currentPath === "/dashboard/turnaroundtime" ||
                    currentPath === "/dashboard/turnaroundtime"
                      ? "bg-accent"
                      : "text-white"
                  } flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground p-2 rounded-md`}
                >
                  <Timer className="h-5 w-5" />
                  Turn Around Time
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div>
            <p></p>
            <img
              // src={theme === "dark" ? ddc_connect3 : ddc_connect}
              src={theme === "dark" ? apex : apex}
              alt=""
              // className="h-[3.5em] w-full md:-mt-2 mt-0 -ml-[10px]"
              className="h-[5em] w-[14em] md:-mt-2 mt-0  rounded-sm"

            />
          </div>
          <div className="relative ml-auto flex-1 md:grow-0"></div>
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
            <AlertDialogDescription></AlertDialogDescription>
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

        <div className="flex h-full flex-1 flex-col px-[22px] md:flex">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default Main;
