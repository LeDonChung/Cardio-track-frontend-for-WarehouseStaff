import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8888/api/v1/medicine";

export const InventoryControlPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    quantity: "",
    location: "",
    status: "",
    price: "",
    expiration_date: "",
    notes: "",
  });
  const fetchInventory = async () => {
    try {
      const response = await fetch(
        `${API_URL}?page=${page}&size=10&sortBy=name&sortName=asc`
      );
      const data = await response.json();
      console.log("API Response:", data); // Kiểm tra dữ liệu
      console.log("totalPages:", data.data.totalPage); // Kiểm tra dữ liệu
      setInventoryData(data.data.data || []); // Nếu data.items undefined, đặt thành []
      setTotalPages(data.data.totalPage || 1);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventoryData([]); // Tránh lỗi khi API gặp vấn đề
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page]);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      console.log("Chuyển sang trang:", newPage);
      setPage(newPage);
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" ||
        item.status.toLowerCase() === selectedCategory.toLowerCase())
  );

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
            onChange={handleSearch}
          />
          <select
            className="border rounded p-2"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="available">Còn hàng</option>
            <option value="low stock">Sắp hết hàng</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Thêm mới
          </button>
        </div>

        {isFormVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-2">
                {isEditing ? "Chỉnh sửa" : "Thêm mới"} sản phẩm
              </h2>
              <input
                type="text"
                placeholder="Tên"
                className="border p-2 w-full mb-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
                placeholder="Vị trí"
                className="border p-2 w-full mb-2"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Trạng thái"
                className="border p-2 w-full mb-2"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Giá"
                className="border p-2 w-full mb-2"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="Hạn sử dụng"
                className="border p-2 w-full mb-2"
                value={formData.expiration_date}
                onChange={(e) =>
                  setFormData({ ...formData, expiration_date: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Ghi chú"
                className="border p-2 w-full mb-2"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsFormVisible(false)}
                >
                  Hủy
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  {isEditing ? "Lưu" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}

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
              {inventoryData.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">${item.price.toFixed(2)}</td>
                  <td className="border p-2">{item.status}</td>
                  <td className="border p-2">
                    <button className="bg-red-500 text-white px-2 py-1 rounded">
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
      {/* <Footer /> */}
    </div>
  );
};
