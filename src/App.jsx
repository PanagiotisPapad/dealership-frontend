import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarList from "./pages/CarList";
import DealershipDashboard from "./pages/DealershipDashboard";
import Navbar from "./components/Navbar";

function AppContent() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("userType");
  const showNavbar = isLoggedIn && location.pathname !== "/";

  return (
    <div className="min-h-screen bg-gray-100">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/dealership-dashboard" element={<DealershipDashboard />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
