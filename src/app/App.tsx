import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "../routes/app.routes";
import AppNavbar from "@components/AppNavbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppNavbar />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
