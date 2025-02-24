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
      </div>
    </div>
  );
};
