import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppWithDnd from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <AppWithDnd />
  </StrictMode>
);
