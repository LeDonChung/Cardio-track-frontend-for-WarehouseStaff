import { Header } from "../components/Header";
import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  getMedicinesByCategory,
} from "../redux/slice/CategorySlice";
import { useDispatch, useSelector } from "react-redux";

export const DivideCategoryPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories) || [];
  const medicinesByCategory =
    useSelector((state) => state.category.medicinesByCategory) || [];

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch categories khi mở trang
  useEffect(() => {
    dispatch(
      fetchCategories({ page: 0, size: 50, sortBy: "id", sortName: "asc" })
    );
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory !== null) {
      dispatch(getMedicinesByCategory({ categoryId: selectedCategory, page: 0, size: 10, sortBy: "id", sortName: "asc" }));
    }
  }, [selectedCategory, dispatch]);
  
  // Kiểm tra Redux store
  useEffect(() => {
    console.log("Redux medicinesByCategory:", medicinesByCategory);
  }, [medicinesByCategory]);
  const handleCategoryClick = (categoryId) => {
    if (categoryId === selectedCategory) return;
    console.log("categoryId", categoryId);
    setSelectedCategory(categoryId);
  };

  const handleNext = () => {
    if (currentIndex + 10 < categories.length) {
      setCurrentIndex((prev) => prev + 10);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 10);
    }
  };

  const displayedCategories = categories.slice(currentIndex, currentIndex + 10);

  return (
    <div className="bg-white text-gray-900">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Medicine Categories</h1>
        <div className="flex items-center gap-2 mb-6">
          {/* Nút Trước */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-2 border rounded-lg ${
              currentIndex === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            ◀
          </button>

          {/* Danh mục thuốc */}
          {displayedCategories.map((cat) => (
            <button
              key={cat.id}
              className={`p-2 border rounded-lg flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <img
                src={cat.icon}
                alt={cat.title}
                className="w-6 h-6 rounded-full"
              />
              {cat.title}
            </button>
          ))}

          {/* Nút Tiếp */}
          <button
            onClick={handleNext}
            disabled={currentIndex + 10 >= categories.length}
            className={`p-2 border rounded-lg ${
              currentIndex + 10 >= categories.length
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            ▶
          </button>
        </div>

        {/* Hiển thị danh sách thuốc nếu đã chọn danh mục */}
        {selectedCategory && (
          <>
            <h2 className="text-xl font-semibold mb-2">Medicines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {medicinesByCategory.length > 0 ? (
                medicinesByCategory.map((med) => (
                  <div key={med.id} className="border p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">
                      ID Thuốc: {med.medicine}
                    </h3>{" "}
                    {/* Hiển thị ID thay vì `name` */}
                    <p className="font-semibold">Giá: {med.price} VND</p>
                    <p className="text-sm">Vị trí: {med.location}</p>
                    <p
                      className={
                        med.quantity > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      Số lượng: {med.quantity}
                    </p>
                    <p className="text-sm">
                      Hạn sử dụng:{" "}
                      {new Date(med.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  Không có thuốc trong danh mục này.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
