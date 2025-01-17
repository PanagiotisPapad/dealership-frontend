import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DealershipDashboard() {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    brandName: "",
    model: "",
    fuel: "PETROL",
    engine: "",
    seats: "",
    price: "",
    additionalInfo: "",
    amount: "",
  });
  const [updateAmount, setUpdateAmount] = useState({});

  const navigate = useNavigate();
  const dealershipVat = localStorage.getItem("vat");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (!userType || userType !== "dealership") {
      navigate("/");
      return;
    }
    fetchCars();
  }, [navigate]);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/cars");
      console.log("All cars:", response.data);
      console.log("Current dealership VAT:", dealershipVat);

      // Changed the filter to use dealership_vat directly
      const dealershipCars = response.data.filter(
        (car) => car.dealershipVat === dealershipVat
      );
      console.log("Filtered cars:", dealershipCars);
      setCars(dealershipCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8080/api/addCar?dealershipVat=${dealershipVat}`,
        {
          brandName: newCar.brandName,
          model: newCar.model,
          fuel: newCar.fuel,
          engine: newCar.engine,
          seats: parseInt(newCar.seats),
          price: parseInt(newCar.price),
          additionalInfo: newCar.additionalInfo,
          amount: parseInt(newCar.amount),
        }
      );

      fetchCars();
      // Reset form
      setNewCar({
        brandName: "",
        model: "",
        fuel: "PETROL",
        engine: "",
        seats: "",
        price: "",
        additionalInfo: "",
        amount: "",
      });
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Σφάλμα κατά την προσθήκη αυτοκινήτου");
    }
  };

  const handleUpdateAmount = async (carId) => {
    try {
      if (updateAmount[carId]) {
        await axios.put(
          `http://localhost:8080/api/updateCarAmount/${carId}?newAmount=${updateAmount[carId]}`
        );
        fetchCars();
        setUpdateAmount((prev) => ({ ...prev, [carId]: "" }));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Σφάλμα κατά την ενημέρωση ποσότητας");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Πίνακας Ελέγχου Αντιπροσωπείας
      </h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Προσθήκη Νέου Αυτοκινήτου
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              id="brandName"
              placeholder="Μάρκα"
              value={newCar.brandName}
              onChange={(e) =>
                setNewCar({ ...newCar, brandName: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Μοντέλο"
              value={newCar.model}
              onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <select
              value={newCar.fuel}
              onChange={(e) => setNewCar({ ...newCar, fuel: e.target.value })}
              className="p-2 border rounded"
              required
            >
              <option value="PETROL">Βενζίνη</option>
              <option value="DIESEL">Πετρέλαιο</option>
              <option value="HYBRID">Υβριδικό</option>
              <option value="ELECTRIC">Ηλεκτρικό</option>
            </select>
            <input
              type="text"
              placeholder="Κινητήρας"
              value={newCar.engine}
              onChange={(e) => setNewCar({ ...newCar, engine: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Θέσεις"
              value={newCar.seats}
              onChange={(e) => setNewCar({ ...newCar, seats: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Τιμή"
              value={newCar.price}
              onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Επιπλέον Πληροφορίες"
              value={newCar.additionalInfo}
              onChange={(e) =>
                setNewCar({ ...newCar, additionalInfo: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Ποσότητα"
              value={newCar.amount}
              onChange={(e) => setNewCar({ ...newCar, amount: e.target.value })}
              className="p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Προσθήκη Αυτοκινήτου
          </button>
        </form>
      </div>

      {/* Cars List */}
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

            {/* Amount Update Section */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ενημέρωση Διαθέσιμων
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={updateAmount[car.id] || ""}
                  onChange={(e) =>
                    setUpdateAmount({
                      ...updateAmount,
                      [car.id]: e.target.value,
                    })
                  }
                  className="flex-1 p-2 border rounded"
                  min="0"
                  placeholder="Νέα ποσότητα"
                />
                <button
                  onClick={() => handleUpdateAmount(car.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Ενημέρωση
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DealershipDashboard;
