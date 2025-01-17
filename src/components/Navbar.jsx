import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("vat");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Car Dealership</div>
        <div className="flex gap-4">
          {userType === "citizen" && (
            <button
              onClick={() => navigate("/cars")}
              className="hover:text-gray-200"
            >
              Αυτοκίνητα
            </button>
          )}
          <button onClick={handleLogout} className="hover:text-gray-200">
            Αποσύνδεση
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
