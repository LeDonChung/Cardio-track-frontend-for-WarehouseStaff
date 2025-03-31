import { Header } from "../components/Header";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMedicine, fetchMedicineById } from "../redux/slice/MedicineSlice";
import { fetchInventoryDetail } from "../redux/slice/InventoryDetailSlice";
import MedicineModal from "../components/MedicineModal";

export const InventoryControlPage = () => {
  const dispatch = useDispatch();
  const inventoryState = useSelector((state) => state.inventoryDetail) || {};
  const { inventoryDetail = [], totalPages = 1 } = inventoryState;
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedInventory, setSelectedInventory] = useState(null);

  useEffect(() => {
    dispatch(fetchInventoryDetail({ page: page - 1, size: 10, sortBy: "id", sortName: "asc", medicineId: searchTerm || null}))
        .then((response) => {
            console.log("Dữ liệu lấy từ API:", response.payload); // Kiểm tra dữ liệu từ API
        });
  }, [dispatch, searchTerm, page]);
  useEffect(() => {
    console.log("Dữ liệu Redux sau khi cập nhật:", inventoryDetail);
  }, [inventoryDetail]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleRowClick = (inventoryItem) => {
    dispatch(fetchMedicineById(inventoryItem.medicine))
      .then((response) => {
        console.log("Chi tiết thuốc:", response.payload);
        setSelectedInventory(response.payload); // Cập nhật modal với thông tin thuốc
      })
      .catch((error) => {
        console.error("Lỗi khi lấy chi tiết thuốc:", error);
      });
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
        <table key={page} className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Medicine ID</th>
                <th className="border p-2">Vị trí</th>
                <th className="border p-2">Giá</th>
                <th className="border p-2">Hạn sử dụng</th>
                <th className="border p-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
            {inventoryDetail.map((item) => (
                <tr key={item.medicine} className="text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => handleRowClick(item)}>
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">{item.medicine}</td>
                  <td className="border p-2">{item.location || "Không có dữ liệu"}</td>
                  <td className="border p-2">{item.price.toLocaleString()} VND</td>
                  <td className="border p-2">{new Date(item.expirationDate).toLocaleDateString()}</td>
                  <td className="border p-2">
                    {item.expired ? "Hết hạn" : item.nearExpiration ? "Sắp hết hạn" : "Còn hạn"}
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

      {selectedInventory && (
        <MedicineModal 
          medicine={selectedInventory} 
          onClose={() => setSelectedInventory(null)} 
        />
      )}
    </div>
  );
};
