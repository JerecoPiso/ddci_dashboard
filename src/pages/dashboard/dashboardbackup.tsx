import { ImageDown, SquareChartGantt, Timer } from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
function Dashboard() {
  const path = useLocation();
  const navigate = useNavigate()
  const currentPath = path.pathname;
  useEffect(() => {
    // if(path.pathname === '/dashboard' || path.pathname === '/dashboard/'){ 
    //     navigate("/dashboard/bolmanagement")
    // }
  }, [path.pathname, navigate])
  return (
    <div>
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
        {/* <Link
            to={"/dashboard/accuracy"}
            className={`${
              currentPath.includes("accuracy")
                ? "dark:bg-slate-100 dark:text-slate-900 bg-red-800 text-slate-100"
                : "dark:bg-slate-700 dark:text-white"
            } flex gap-x-2 items-center  border border-slate-900/10 rounded-sm w-auto px-3 py-2 hover:bg-red-800 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900`}
          >
            <CheckCheck className="h-5 w-5" /> Accuracy
          </Link> */}
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
      <div className="flex h-full flex-1 flex-col px-[22px] md:flex pt-3">
        <Outlet />
      </div>
    </div>
  );
}
export default Dashboard;
