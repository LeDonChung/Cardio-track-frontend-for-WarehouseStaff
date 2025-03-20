import React from "react";
import { Link } from "react-router-dom";
import inventoryImage from "../sources/images/kho-hang-slide.png";

export const MainHome = () => {
    return (
        <div className="flex flex-col h-screen mb-16">
            {/* Hình ảnh kho phía trên cùng */}
            <div className="bg-cover bg-center h-48" style={{ backgroundImage: `url(${inventoryImage})` }}>
                <div className="h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <h1 className="text-white text-4xl font-bold">Quản lý Kho Thuốc</h1>
                </div>
            </div>

            <div className="flex flex-1 mx-16">
                {/* Main Content */}
                <main className="flex-1 p-6 bg-gray-50">
                    <h1 className="text-2xl font-bold mb-4">Tổng quan kho thuốc</h1>

                    {/* Thông tin tổng quan */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white shadow rounded-lg">
                            <h2 className="text-lg font-semibold">Tổng số lượng thuốc</h2>
                            <p className="text-2xl text-blue-600">1,250</p>
                        </div>
                        <div className="p-4 bg-white shadow rounded-lg">
                            <h2 className="text-lg font-semibold">Thuốc sắp hết hạn</h2>
                            <p className="text-2xl text-red-600">15</p>
                        </div>
                        <div className="p-4 bg-white shadow rounded-lg">
                            <h2 className="text-lg font-semibold">Lô hàng chờ nhập</h2>
                            <p className="text-2xl text-green-600">3</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white shadow rounded-lg">
                            <h2 className="text-lg font-semibold">Đơn hàng chờ xử lý</h2>
                            <p className="text-2xl text-orange-600">8</p>
                        </div>
                        <div className="p-4 bg-white shadow rounded-lg">
                            <h2 className="text-lg font-semibold">Tỷ lệ thuốc hỏng</h2>
                            <p className="text-2xl text-gray-600">2%</p>
                        </div>
                    </div>

                    {/* Các button to để navigation */}
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <Link to="/suplier" className="block p-6 bg-blue-500 text-white text-center rounded-lg shadow hover:bg-blue-600">
                            <h2 className="text-xl font-semibold">Nhà cung cấp</h2>
                        </Link>

                        <Link to="/staff" className="block p-6 bg-green-500 text-white text-center rounded-lg shadow hover:bg-green-600">
                            <h2 className="text-xl font-semibold">Nhân sự</h2>
                        </Link>

                        
                        <Link to="/divide-category-medicine" className="block p-6 bg-purple-500 text-white text-center rounded-lg shadow hover:bg-purple-600">
                            <h2 className="text-xl font-semibold">Phân loại thuốc</h2>
                        </Link>

                        <Link to="/report" className="block p-6 bg-teal-500 text-white text-center rounded-lg shadow hover:bg-teal-600">
                            <h2 className="text-xl font-semibold">Thống kê</h2>
                        </Link>

                    </div>
                </main>
            </div>
        </div>
    );
};
