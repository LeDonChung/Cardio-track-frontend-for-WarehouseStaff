import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const AddStaffPage = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [selectedInventory, setSelectedInventory] = useState([]);
    const navigate = useNavigate();

    const availableInventories = ['Kho 1', 'Kho 2', 'Kho 3', 'Kho 4'];  // Danh sách kho có sẵn
    const roles = ['Quản lý kho', 'Nhân viên bốc xếp', 'Xử lý hàng'];
    const statuses = ['Đang làm việc', 'Nghỉ phép', 'Thôi việc']; // Các trạng thái có sẵn

    const handleAddStaff = (e) => {
        e.preventDefault();  // Ngăn form tự động reload
        // Handle adding new staff here
        // Sau khi thêm, chuyển hướng về trang StaffManagementPage
        navigate('/staff');
    };

    const handleInventoryChange = (e) => {
        const selectedValue = e.target.value;
        if (!selectedInventory.includes(selectedValue)) {
            setSelectedInventory((prevSelected) => [...prevSelected, selectedValue]);
        }
    };

    const handleRemoveInventory = (inventoryToRemove) => {
        setSelectedInventory((prevSelected) => prevSelected.filter(inventory => inventory !== inventoryToRemove));
    };

    return (
        <div className="bg-white text-gray-900 min-h-screen">
            <Header />
            <main className="p-8 mb-64">
                <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Thêm nhân viên mới</h2>
                    <form onSubmit={handleAddStaff} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium">Tên nhân viên</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Vai trò</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Chọn vai trò</option>
                                {roles.map((roleOption, index) => (
                                    <option key={index} value={roleOption}>
                                        {roleOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Trạng thái</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Chọn trạng thái</option>
                                {statuses.map((statusOption, index) => (
                                    <option key={index} value={statusOption}>
                                        {statusOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Chọn kho hàng làm việc</label>
                            <select
                                value=""
                                onChange={handleInventoryChange}
                                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn kho</option>
                                {availableInventories.map((inventory, index) => (
                                    <option key={index} value={inventory}>
                                        {inventory}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Hiển thị các kho đã chọn */}
                        {selectedInventory.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium">Kho đã chọn</label>
                                <div className="space-y-2">
                                    {selectedInventory.map((inventory, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span>{inventory}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveInventory(inventory)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button type="submit" className="bg-blue-500 text-white py-3 px-6 rounded-lg mt-4 w-full hover:bg-blue-600">
                            Xác nhận
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
