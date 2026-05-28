import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HarvestingProvider } from "./context/HarvestingContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HarvestingProvider>
      <App />
    </HarvestingProvider>
  </StrictMode>,
);
