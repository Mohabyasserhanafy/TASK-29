import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import MainStore from "./stores/MainStore.jsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MainStore>
      <App />
    </MainStore>
  </BrowserRouter>,
);
