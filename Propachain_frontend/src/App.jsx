import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import PublicLayout from "./components/layout/PublicLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import PropertyDetails from "./pages/PropertyDetails";
import Profile from "./pages/Profile";
import UploadPage from "./pages/UploadPage";
import Transactions from "./pages/Transactions";
import MyProperties from "./pages/MyProperties";
import { RegistrationGuard } from "./components/RegistrationGuard";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <RegistrationGuard>
        <Routes>
          {/* Public Routes with Header Navigation */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
          </Route>

          {/* Authenticated Routes with Sidebar Navigation */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="my-properties" element={<MyProperties />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </RegistrationGuard>
    </Router>
  );
}

export default App;
