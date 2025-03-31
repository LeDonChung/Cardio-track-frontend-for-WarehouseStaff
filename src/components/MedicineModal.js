import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateMedicine, fetchMedicineById } from "../redux/slice/MedicineSlice";

const MedicineModal = ({ medicine, onClose }) => {
  const dispatch = useDispatch();
  const [editedMedicine, setEditedMedicine] = useState({ ...medicine });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMedicine({
      ...editedMedicine,
      [name]: name === "price" || name === "discount" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSave = () => {
    dispatch(updateMedicine(editedMedicine))
      .unwrap()
      .then(() => {
        console.log("Cập nhật thành công:", editedMedicine);
        onClose(); // Đóng modal sau khi cập nhật thành công
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật thuốc:", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Chi tiết thuốc</h2>

        <label className="block mb-2">ID</label>
        <input
          type="text"
          name="id"
          value={editedMedicine.id}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          disabled
        />
        <label className="block mb-2">Tên thuốc</label>
        <input
          type="text"
          name="name"
          value={editedMedicine.name}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />

        <label className="block mt-4 mb-2">Giá</label>
        <input
          type="number"
          name="price"
          value={editedMedicine.price}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
        <label className="block mt-4 mb-2">Giảm giá</label>
        <input
          type="number"
          name="discount"
          value={editedMedicine.discount}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
        <label className="block mt-4 mb-2">Dạng</label>
        <input
          type="text"
          name="form"
          value={editedMedicine.init}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
        <label className="block mt-4 mb-2">Mô tả</label>
        <input
          type="text"
          name="description"
          value={editedMedicine.des}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
        <label className="block mt-4 mb-2">Mô tả ngắn</label>
        <input
          type="text"
          name="shortDescription"
          value={editedMedicine.desShort}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
        <label className="block mt-4 mb-2">Trạng thái</label>
        <input
          type="text"
          name="status"
          value={editedMedicine.status}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />

        <div className="flex justify-end mt-6">
          <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={onClose}>
            Hủy
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineModal;
