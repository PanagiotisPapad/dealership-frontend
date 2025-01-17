import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [userType, setUserType] = useState("citizen");
  const [formData, setFormData] = useState({
    vat: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // For dealership
    name: "",
    owner: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userType === "citizen") {
        await axios.post("http://localhost:8080/citizen/register", {
          vat: formData.vat,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
      } else {
        await axios.post("http://localhost:8080/dealership/register", {
          vat: formData.vat,
          name: formData.name,
          owner: formData.owner,
          password: formData.password,
        });
      }
      navigate("/");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Η εγγραφή απέτυχε");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-center">Εγγραφή</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              name="vat"
              placeholder="ΑΦΜ"
              value={formData.vat}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {userType === "citizen" ? (
            <>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Όνομα"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Επώνυμο"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Επωνυμία"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="owner"
                  placeholder="Ιδιοκτήτης"
                  value={formData.owner}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          )}

          <div>
            <input
              type="password"
              name="password"
              placeholder="Κωδικός"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Εγγραφή
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-blue-500 hover:underline"
            >
              Έχετε ήδη λογαριασμό; Συνδεθείτε
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
