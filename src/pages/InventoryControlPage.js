import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState } from 'react';

const initialData = [
    { id: 1, name: "Paracetamol", quantity: 50, location: "A1", status: "Available", price: 10.5, expiration_date: "2025-12-01", notes: "OK", des: "Thuốc giảm đau", des_short: "Giảm đau", discount: 5, init: 100, primary_image: "paracetamol.jpg", reviews: 10, sky: "ABC123", slug: "paracetamol", star: 4.5, brand_id: 1, category_id: 2 },
    { id: 2, name: "Amoxicillin", quantity: 20, location: "B3", status: "Low Stock", price: 15.0, expiration_date: "2024-08-15", notes: "Restock soon", des: "Kháng sinh", des_short: "Kháng sinh mạnh", discount: 10, init: 50, primary_image: "amoxicillin.jpg", reviews: 20, sky: "XYZ789", slug: "amoxicillin", star: 4.7, brand_id: 2, category_id: 3 }
  ];

export const InventoryControlPage = () => {
    const [inventoryData, setInventoryData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
      id: "", name: "", quantity: "", location: "", status: "", price: "", expiration_date: "", notes: ""
    });
  
    const handleDelete = (id) => {
      setInventoryData(inventoryData.filter((item) => item.id !== id));
    };
  
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const handleEdit = (item) => {
      setIsEditing(true);
      setCurrentItem(item.id);
      setFormData(item);
      setIsFormVisible(true);
    };
  
    const handleAddNew = () => {
      setIsEditing(false);
      setFormData({ id: "", name: "", quantity: "", location: "", status: "", price: "", expiration_date: "", notes: "" });
      setIsFormVisible(true);
    };
  
    const handleSave = () => {
      if (isEditing) {
        setInventoryData(
          inventoryData.map((item) => (item.id === currentItem ? { ...formData, id: currentItem } : item))
        );
      } else {
        setInventoryData([...inventoryData, { ...formData, id: inventoryData.length + 1 }]);
      }
      setIsFormVisible(false);
    };
  
    const filteredData = inventoryData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || item.status.toLowerCase() === selectedCategory.toLowerCase())
    );
  
    return (
      <div className="bg-white text-gray-900 min-h-screen">
        <Header />
        <div className="p-6 max-w-6xl mx-auto">
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddNew}>Thêm mới</button>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Tên</th>
                  <th className="border p-2">Số lượng</th>
                  <th className="border p-2">Vị trí</th>
                  <th className="border p-2">Trạng thái</th>
                  <th className="border p-2">Giá</th>
                  <th className="border p-2">Hạn sử dụng</th>
                  <th className="border p-2">Ghi chú</th>
                  <th className="border p-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="border p-2">{item.id}</td>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">{item.location}</td>
                    <td className="border p-2">{item.status}</td>
                    <td className="border p-2">${item.price.toFixed(2)}</td>
                    <td className="border p-2">{item.expiration_date}</td>
                    <td className="border p-2">{item.notes}</td>
                    <td className="border p-2">
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(item)}>Sửa</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
        {isFormVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-2">{isEditing ? "Chỉnh sửa" : "Thêm mới"} sản phẩm</h2>
                <input type="text" placeholder="Tên" className="border p-2 w-full mb-2" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="number" placeholder="Số lượng" className="border p-2 w-full mb-2" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                <input type="text" placeholder="Vị trí" className="border p-2 w-full mb-2" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                <input type="text" placeholder="Trạng thái" className="border p-2 w-full mb-2" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                <input type="number" placeholder="Giá" className="border p-2 w-full mb-2" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                <input type="date" placeholder="Hạn sử dụng" className="border p-2 w-full mb-2" value={formData.expiration_date} onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })} />
                <input type="text" placeholder="Ghi chú" className="border p-2 w-full mb-2" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                <div className="flex justify-end space-x-2">
                  <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsFormVisible(false)}>Hủy</button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSave}>{isEditing ? "Lưu" : "Thêm"}</button>
                </div>
              </div>
            </div>
          )}
      </div>
    );
}