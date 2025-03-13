import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8888/api/v1/medicine";
const SEARCH_API_URL = "http://localhost:8888/api/v1/medicine/search";

export const InventoryControlPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchPrice, setSearchPrice] = useState("");
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
      setInventoryData(data.data.data || []);
      setTotalPages(data.data.totalPage || 1);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventoryData([]);
    }
  };

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(
        `${SEARCH_API_URL}?key=${searchTerm}&page=${page}&size=10&sortBy=price&sortName=desc`
      );
      const data = await response.json();
      setInventoryData(data.data.data || []);
      setTotalPages(data.data.totalPage || 1);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setInventoryData([]);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchSearchResults();
    } else {
      fetchInventory();
    }
  }, [page, searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/0`, { method: "PUT" });
      fetchInventory();
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
              {inventoryData.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.price.toFixed(2)}</td>
                  <td className="border p-2">{item.status}</td>
                  <td className="border p-2">
                  <button 
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(item.id)}
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
    </div>
  );
};
