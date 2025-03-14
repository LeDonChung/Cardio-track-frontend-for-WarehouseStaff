import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { fetchShelfs } from "../redux/slice/ShelfSlice";

export const InventoryLocationPage = () => {
  const dispatch = useDispatch();
  const shelfState = useSelector((state) => state.shelf) || {};
  const { shelves = [], totalPages = 1 } = shelfState;
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [modalData, setModalData] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    location: "",
    quantity: "",
    status: "available",
    notes: "",
    medicines: [],
  });

  useEffect(() => {
    dispatch(fetchShelfs({ page, size: 10, sortBy: "id", sortName: "asc" }));
    console.log(shelves);
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSave = () => {};

  const filteredLocations = shelves
    .filter((loc) => loc.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "id") return a.id - b.id;
      if (sortKey === "quantity") return a.quantity - b.quantity;
      if (sortKey === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Danh Sách Vị Trí Kho</h1>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm vị trí..."
            className="border p-2 w-full"
          />
          <select
            className="border p-2"
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="id">Sắp xếp theo ID</option>
            <option value="quantity">Sắp xếp theo Số lượng</option>
            <option value="status">Sắp xếp theo Trạng thái</option>
          </select>
          <button
            className="bg-blue-500 text-white p-2"
            onClick={() => {
              setIsAdding(true);
              setFormData({
                id: "",
                location: "",
                quantity: "",
                status: "available",
                notes: "",
                medicines: [],
              });
            }}
          >
            Thêm Vị Trí
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Vị trí</th>
              <th className="border p-2">Số lượng</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations.map((loc) => (
              <tr
                key={loc.id}
                className="border cursor-pointer"
                onClick={() => setModalData(loc)}
              >
                <td className="border p-2">{loc.id}</td>
                <td className="border p-2">{loc.location}</td>
                <td className="border p-2">{loc.totalProduct}</td>
                <td className="border p-2">{loc.status}</td>
                <td className="border p-2">{loc.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalData && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-2">Chi Tiết Vị Trí</h2>
              <p>
                <strong>Vị trí:</strong> {modalData.location}
              </p>
              <p>
                <strong>Số lượng:</strong> {modalData.quantity}
              </p>
              <p>
                <strong>Trạng thái:</strong> {modalData.status}
              </p>
              <p>
                <strong>Ghi chú:</strong> {modalData.notes}
              </p>
              <h3 className="text-md font-bold mt-2">Danh sách thuốc:</h3>
              <ul>
                {modalData.medicines.map((med, index) => (
                  <li key={index}>
                    {med.name} - {med.quantity}
                  </li>
                ))}
              </ul>
              <button
                className="bg-gray-500 text-white p-2 mt-4"
                onClick={() => setModalData(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
        {isAdding && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-2">Thêm Vị Trí</h2>
              <input
                type="text"
                placeholder="Vị trí"
                className="border p-2 w-full mb-2"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Số lượng"
                className="border p-2 w-full mb-2"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Ghi chú"
                className="border p-2 w-full mb-2"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
              <button
                className="bg-green-500 text-white p-2"
                onClick={handleSave}
              >
                Lưu
              </button>
              <button
                className="bg-gray-500 text-white p-2 ml-2"
                onClick={() => setIsAdding(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 bg-gray-300 rounded mx-2 ${
              page <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Trước
          </button>
          <span>
            Trang {page + 1} / {totalPages}
          </span>
          <button
            className={`px-4 py-2 bg-gray-300 rounded mx-2 ${
              page >= totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Sau
          </button>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};
