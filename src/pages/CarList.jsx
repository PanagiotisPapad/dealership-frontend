import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CarList() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const navigate = useNavigate();
  const citizenVat = localStorage.getItem("vat");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (!userType || userType !== "citizen") {
      navigate("/");
      return;
    }
    fetchCars();
  }, [navigate]);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/cars");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleTestDrive = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const handleBookTestDrive = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/book/testDrive/${selectedCar.id}`,
        null,
        {
          params: {
            citizenVat,
            date: bookingDate,
          },
        }
      );
      alert("Το test drive προγραμματίστηκε με επιτυχία!");
      setShowModal(false);
      setSelectedCar(null);
      setBookingDate("");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Σφάλμα κατά την κράτηση του test drive");
    }
  };

  const handlePurchase = async (carId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/book/purchase/${carId}`,
        null,
        {
          params: {
            citizenVat,
          },
        }
      );
      alert("Η αγορά ολοκληρώθηκε με επιτυχία!");
      fetchCars(); // Refresh car list to update quantities
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Σφάλμα κατά την αγορά του αυτοκινήτου");
    }
  };

  const [searchCriteria, setSearchCriteria] = useState({
    brandName: "",
    model: "",
    fuel: "",
    maxPrice: "",
  });

  const handleSearch = async () => {
    try {
      let url = "http://localhost:8080/api/cars/search?";
      const params = new URLSearchParams();

      if (searchCriteria.brandName)
        params.append("brandName", searchCriteria.brandName);
      if (searchCriteria.model) params.append("model", searchCriteria.model);
      if (searchCriteria.fuel) params.append("fuel", searchCriteria.fuel);
      if (searchCriteria.maxPrice)
        params.append("maxPrice", searchCriteria.maxPrice);

      const response = await axios.get(`${url}${params}`);
      setCars(response.data);
    } catch (error) {
      console.error("Error searching cars:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Διαθέσιμα Αυτοκίνητα</h1>

      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Αναζήτηση Αυτοκινήτων</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Μάρκα"
              value={searchCriteria.brandName}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  brandName: e.target.value,
                })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Μοντέλο"
              value={searchCriteria.model}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, model: e.target.value })
              }
              className="p-2 border rounded"
            />
            <select
              value={searchCriteria.fuel}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, fuel: e.target.value })
              }
              className="p-2 border rounded"
            >
              <option value="">Όλα τα καύσιμα</option>
              <option value="PETROL">Βενζίνη</option>
              <option value="DIESEL">Πετρέλαιο</option>
              <option value="HYBRID">Υβριδικό</option>
              <option value="ELECTRIC">Ηλεκτρικό</option>
            </select>
            <input
              type="number"
              placeholder="Μέγιστη τιμή"
              value={searchCriteria.maxPrice}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  maxPrice: e.target.value,
                })
              }
              className="p-2 border rounded"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                setSearchCriteria({
                  brandName: "",
                  model: "",
                  fuel: "",
                  maxPrice: "",
                });
                fetchCars();
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Καθαρισμός
            </button>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Αναζήτηση
            </button>
          </div>
        </div>
      </div>

      {/* Car List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">
              {car.brandName} {car.model}
            </h2>
            <p>Καύσιμο: {car.fuel}</p>
            <p>Κινητήρας: {car.engine}</p>
            <p>Θέσεις: {car.seats}</p>
            <p>Τιμή: €{car.price}</p>
            <p>Πληροφορίες: {car.additionalInfo}</p>
            <p>Διαθέσιμα: {car.amount}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleTestDrive(car)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Test Drive
              </button>
              <button
                onClick={() => handlePurchase(car.id)}
                disabled={car.amount <= 0}
                className={`px-4 py-2 rounded ${
                  car.amount > 0
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Αγορά
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Drive Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Κράτηση Test Drive</h2>
            <p className="mb-4">
              {selectedCar.brandName} {selectedCar.model}
            </p>
            <input
              type="datetime-local"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleBookTestDrive}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Κράτηση
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarList;
