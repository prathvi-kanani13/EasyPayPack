import "./App.css";
import Auth from "./pages/Auth/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth component="login" />} />
        <Route path="/otp" element={<Auth component="otp" />} />
        <Route path="/forgot-password" element={<Auth component="forgotPassword" />} />
      </Routes>
    </Router>
  );
}

export default App;
