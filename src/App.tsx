import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "@/pages/auth/login"
import Main from "@/pages/main";
import CurrentVolume from "@/pages/dashboard/currentvolume";
import Statistics from "@/pages/dashboard/statistics";
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
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}
export default App;
