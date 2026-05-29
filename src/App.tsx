import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTheme } from "./providers/ThemeProvider";
import { useEffect } from "react";
import Auth from "./pages/Auth/auth";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Probation from "./pages/Probation Management/Probation";
import NoticePeriod from "./pages/Notice Period/NoticePeriod";
import LetterManagementDashboard from "./pages/Letter Management/LetterManagementDashboard";
import LetterGenerator from "./pages/Letter Management/LetterGenerator";
import LetterManagement from "./pages/Letter Management";
import LetterPreview from "./pages/Letter Management/LetterPreview";
import AddSignature from "./pages/Signature Master/AddSignature";
import SignatureList from "./pages/Signature Master/SignatureList";
import { Toaster } from "sonner";
import MasterDashboard from "./pages/Master/MasterDashboard";
import EmployeeMaster from "./pages/Master/Employee Master/EmployeeMaster";
import AddEmployee from "./pages/Master/Employee Master/AddEmployee";

function ThemeController() {
  const location = useLocation()
  const { setTheme } = useTheme()

  useEffect(() => {
    const lightRoutes = ["/login", "/otp", "/forgot-password"]
    const root = window.document.documentElement

    if (lightRoutes.includes(location.pathname)) {
      root.classList.remove("dark")
      root.classList.add("light")
    } else {
      const savedTheme = localStorage.getItem("vite-ui-theme") || "light"
      setTheme(savedTheme as "dark" | "light")
    }
  }, [location.pathname, setTheme])

  return null
}

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <ThemeController />
      <Toaster theme={theme} richColors closeButton position="top-right" />
      <Routes>
        {/* Redirect base URL to login page or dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<Auth component="login" />} />
        <Route path="/otp" element={<Auth component="otp" />} />
        <Route path="/forgot-password" element={<Auth component="forgotPassword" />} />

        {/* Protected Dashboard and Sidebar routes in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/probation-management" element={<Probation />} />
          <Route path="/notice-period/resignation" element={<NoticePeriod />} />
          <Route path="/letter-management" element={<LetterManagementDashboard />} />
          <Route path="/master" element={<MasterDashboard />} />

          <Route path="/letter">
            <Route path="editor" element={<LetterManagement />} />
            <Route path="generate" element={<LetterGenerator />} />
            <Route path="preview" element={<LetterPreview />} />
          </Route>

          <Route path="/signature">
            <Route path="add" element={<AddSignature />} />
            <Route path="list" element={<SignatureList />} />
          </Route>

          <Route path="/employee">
            <Route path="master" element={<EmployeeMaster />} />
            <Route path="add" element={<AddEmployee />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
