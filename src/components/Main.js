import React from "react";
import { Link } from "react-router-dom";

export const Main = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 shadow-md">
          <nav>
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard" className="block p-2 bg-blue-500 text-white rounded">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="block p-2 bg-blue-500 text-white rounded">
                  Quản lý kho
                </Link>
              </li>
              <li>
                <Link to="/import" className="block p-2 bg-blue-500 text-white rounded">
                  Nhập hàng
                </Link>
              </li>
              <li>
                <Link to="/export" className="block p-2 bg-blue-500 text-white rounded">
                  Xuất hàng
                </Link>
              </li>
              <li>
                <Link to="/inventory-check" className="block p-2 bg-blue-500 text-white rounded">
                  Kiểm kê
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Tổng quan kho thuốc</h1>
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
        </main>
      </div>
    </div>
  );
};
