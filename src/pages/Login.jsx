import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userType, setUserType] = useState("citizen"); // or 'dealership'
  const [vat, setVat] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/${userType}/login`,
        null,
        {
          params: {
            vat,
            password,
          },
        }
      );
      if (response.data === "Login successful") {
        // Store user info if needed
        localStorage.setItem("userType", userType);
        localStorage.setItem("vat", vat);
        // Redirect based on user type
        navigate(userType === "citizen" ? "/cars" : "/dealership-dashboard");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-center">Σύνδεση</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="citizen">Πολίτης</option>
              <option value="dealership">Αντιπροσωπεία</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="ΑΦΜ"
              value={vat}
              onChange={(e) => setVat(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Κωδικός"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Σύνδεση
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            Δεν έχετε λογαριασμό; Εγγραφείτε
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
