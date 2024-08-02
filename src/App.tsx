import { BrowserRouter, Routes, Route } from "react-router-dom";
import BolManagement from "@/pages/dashboard/chartandtables/bolmanagement";
import CurrentVolume from "@/pages/dashboard/chartandtables/currentvolume";
import Login from "@/pages/auth/login"
import Main from "@/pages/main";
// import TaskPage from '@/components/tasks/page'
import Statistics from "@/pages/dashboard/chartandtables/statistics";
import TurnAroundTime from "./pages/dashboard/chartandtables/turnaroundtime";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Main />}>
              <Route index path="statistics" element={<Statistics />} />
              <Route index path="currentvolume" element={<CurrentVolume />} />
              <Route index path="bolmanagement" element={<BolManagement />} />
              <Route index path="turnaroundtime" element={<TurnAroundTime />} />
              {/* <Route index path="haha" element={<TaskPage />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}
export default App;
