import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateShelf, addShelf, fetchShelfs } from "../redux/slice/ShelfSlice";

export const ShelfModal = ({ isOpen, onClose, shelf }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: "",
    location: "",
    totalProduct: "",
    capacity: "",
    status: "EMPTY",
    notes: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shelf) {
      setFormData({
        id: shelf.id || "",
        location: shelf.location || "",
        totalProduct: shelf.totalProduct || "",
        capacity: shelf.capacity || "",
        status: shelf.status || "EMPTY",
        notes: shelf.notes || "",
      });
    } else {
      setFormData({
        location: "",
        totalProduct: "",
        capacity: "",
        status: "EMPTY",
        notes: "",
      });
    }
  }, [shelf]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      if (shelf) {
        await dispatch(updateShelf(formData)).unwrap(); // Chờ API hoàn thành
      } else {
        await dispatch(addShelf(formData)).unwrap(); // Chờ API hoàn thành
      }
      await dispatch(
        fetchShelfs({ page: 0, size: 10, sortBy: "id", sortName: "asc" })
      );
      onClose(); // Đóng modal khi thành công
    } catch (err) {
      console.log("Lỗi khi gọi API:", err);
      setError(err.message || "Có lỗi xảy ra!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {shelf ? "Chỉnh sửa vị trí kho" : "Thêm vị trí kho"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="block text-sm font-medium text-gray-700">
          Vị trí
        </label>
        <input
          type="text"
          name="location"
          placeholder="Vị trí"
          className="border p-2 w-full mb-2"
          value={formData.location}
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700">
          Số lượng
        </label>
        <input
          type="number"
          name="totalProduct"
          placeholder="Số lượng"
          className="border p-2 w-full mb-2"
          value={formData.totalProduct}
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700">
          Sức chứa
        </label>
        <input
          type="number"
          name="capacity"
          placeholder="Sức chứa"
          className="border p-2 w-full mb-2"
          value={formData.capacity}
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700">
          Trạng thái
        </label>
        <select
          name="status"
          className="border p-2 w-full mb-2"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="EMPTY">EMPTY</option>
          <option value="FULL">FULL</option>
        </select>

        <label className="block text-sm font-medium text-gray-700">
          Ghi chú
        </label>
        <textarea
          name="notes"
          placeholder="Ghi chú"
          className="border p-2 w-full mb-2"
          value={formData.notes}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-400 text-white p-2 rounded"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};
