import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "sonner";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <CookiesProvider >
        <App />
        <Toaster position="top-center" />
      </CookiesProvider>
    </TooltipProvider>
  </React.StrictMode>
);
