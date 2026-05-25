import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTheme } from "./providers/ThemeProvider";
import { useEffect } from "react";
import Auth from "./pages/auth/auth";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Probation from "./pages/probation management/Probation";
import NoticePeriod from "./pages/notice period/NoticePeriod";

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

  return (
    <Router>
      <ThemeController />
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
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
