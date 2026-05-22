import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./app/App.tsx";
import { Toaster } from "@components/Sooner.tsx";
import { Provider } from "react-redux";
import { store } from "@store/store.ts";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </>,
);
