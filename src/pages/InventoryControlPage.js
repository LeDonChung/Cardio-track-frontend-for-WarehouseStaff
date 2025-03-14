import { Header } from "../components/Header";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedicines, deleteMedicine } from "../redux/slice/MedicineSlice";
import MedicineModal from "../components/MedicineModal";

export const InventoryControlPage = () => {
  const dispatch = useDispatch();
  const medicineState = useSelector((state) => state.medicine) || {};
  const { medicines = [], totalPages = 1 } = medicineState;
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    dispatch(fetchMedicines({ searchTerm, page, size: 10, sortBy: "name", sortName: "asc" }));
    console.log(medicines);
  }, [dispatch, searchTerm, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteMedicine(id));
  };

  const handleRowClick = (medicine) => {
    setSelectedMedicine(medicine);
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col">
      <Header />
      <div className="p-6 max-w-6xl mx-auto pb-32">
        <h1 className="text-2xl font-bold mb-4">Kiểm Soát Tồn Kho</h1>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border rounded p-2 w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Tên</th>
                <th className="border p-2">Giá</th>
                <th className="border p-2">Trạng thái</th>
                <th className="border p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((item) => (
                <tr key={item.id} className="text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => handleRowClick(item)}>
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.price.toFixed(2)}</td>
                  <td className="border p-2">{item.status}</td>
                  <td className="border p-2">
                    <button 
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 bg-gray-300 rounded mx-2 ${
              page <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Trước
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button
            className={`px-4 py-2 bg-gray-300 rounded mx-2 ${
              page >= totalPages
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Sau
          </button>
        </div>
      </div>

      {selectedMedicine && (
        <MedicineModal 
          medicine={selectedMedicine} 
          onClose={() => setSelectedMedicine(null)} 
        />
      )}
    </div>
  );
};
