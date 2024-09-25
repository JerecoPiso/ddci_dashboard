import { BrowserRouter, Routes, Route } from "react-router-dom";
import BolManagement from "@/pages/dashboard/chartandtables/bolmanagement";
import CurrentVolume from "@/pages/dashboard/chartandtables/currentvolume";
import Login from "@/pages/auth/login";
import Main from "@/pages/main";
// import TaskPage from '@/components/tasks/page'
// import Accuracy from "@/pages/dashboard/chartandtables/accuracy";
// import Statistics from "@/pages/dashboard/chartandtables/statistics";
import TurnAroundTime from "./pages/dashboard/chartandtables/turnaroundtime";
import { ThemeProvider } from "@/components/theme-provider";
import UserManagement from "./pages/dashboard/sidebarlinks/usermanagement";
import Dashboard from "./pages/dashboard/dashboard";
import Admin from "./pages/dashboard/admin";
import { useEffect, createContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
//local
// const api = "http://192.168.23.84:8007/apex/api/v1/"
//server
const api = "http://210.213.193.4:8007/apex/api/v1/";
export const BaseUrlContext = createContext(api);
function App() {
  useEffect(() => {
    if (Cookies.get("token")) {
      try {
        const intervalId = setInterval(async () => {
          await axios.post(`${api}credential/refresh-token`, [], {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
        }, 120000);
        return () => {
          clearInterval(intervalId);
        };
      } catch (err) {
        console.log(err);
      }
    }
  }, []);
  return (
    <>
      <BaseUrlContext.Provider value={api}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <BrowserRouter basename="/apex/">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Main />}>
                <Route path="" element={<Dashboard />}></Route>
                <Route index path="bolmanagement" element={<BolManagement />} />
                {/* <Route path="statistics" element={<Statistics />} />
                <Route path="accuracy" element={<Accuracy />} /> */}
                <Route path="currentvolume" element={<CurrentVolume />} />
                <Route path="turnaroundtime" element={<TurnAroundTime />} />
                <Route path="" element={<Admin />}>
                  <Route
                    index
                    path="usermanagement"
                    element={<UserManagement />}
                  />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </BaseUrlContext.Provider>
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter basename="/ddci/">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Main />}>
              <Route path="" element={<Dashboard />}></Route>
              <Route index path="bolmanagement" element={<BolManagement />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="accuracy" element={<Accuracy />} />
              <Route path="currentvolume" element={<CurrentVolume />} />
              <Route path="turnaroundtime" element={<TurnAroundTime />} />
              <Route path="" element={<Admin />}>
                <Route
                  index
                  path="usermanagement"
                  element={<UserManagement />}
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider> */}
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter basename="/ddci/">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Main />}>
              <Route path="" element={<Dashboard />}>
                <Route index path="bolmanagement" element={<BolManagement />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="accuracy" element={<Accuracy />} />
                <Route path="currentvolume" element={<CurrentVolume />} />
                <Route path="turnaroundtime" element={<TurnAroundTime />} />
              </Route>
              <Route path="" element={<Admin />}>
                <Route
                  index
                  path="usermanagement"
                  element={<UserManagement />}
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider> */}
    </>
  );
}
export default App;
