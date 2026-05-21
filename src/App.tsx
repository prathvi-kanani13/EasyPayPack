import "./App.css";
import Auth from "./pages/Auth/auth";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
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
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
