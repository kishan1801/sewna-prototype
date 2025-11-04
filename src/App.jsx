import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import DesignerDiscovery from "./pages/DesignerDiscovery";
import DesignerProfile from "./pages/DesignerProfile";
import DesignerDashboard from "./pages/DesignerDashboard";
import Toast from "./components/Toast";
import "./styles/globals.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/discover" element={<DesignerDiscovery />} />
        <Route path="/designer/:id" element={<DesignerProfile />} />
        <Route path="/designer-dashboard" element={<DesignerDashboard />} />
      </Routes>

      <Toast />
    </BrowserRouter>
  );
}
