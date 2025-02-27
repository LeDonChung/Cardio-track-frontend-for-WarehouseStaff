import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const StaffManagermentPage = () => {
    const [search, setSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const navigate = useNavigate();  // Initialize useNavigate

    const employees = [
        { id: 1, name: 'Nguyễn Văn A', role: 'Quản lý kho', status: 'Đang làm việc', inventory: 'Kho 1' },
        { id: 2, name: 'Trần Thị B', role: 'Nhân viên bốc xếp', status: 'Đang nghỉ', inventory: 'Kho 2' },
        { id: 3, name: 'Lê Minh C', role: 'Xử lý hàng', status: 'Đang làm việc', inventory: 'Kho 1; Kho 2; Kho3' },
        // Add more employee data here
    ];

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleAddStaff = () => {
        navigate('/staff/add-staff');  // Navigate to AddStaffPage
    };

    const handleEditStaff = (employee) => {
        navigate(`/staff/edit-staff/${employee.id}`, { state: { employee } });  // Pass employee data via state
    };

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className="p-8 mb-64">
                {/* Search Section */}
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhân viên..."
                        className="p-2 border border-gray-300 rounded-lg w-1/3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={handleAddStaff} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                        Thêm nhân viên
                    </button>
                </div>

                {/* Employee List */}
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Tên nhân viên</th>
                                <th className="px-4 py-2 text-left">Vai trò</th>
                                <th className="px-4 py-2 text-left">Trạng thái</th>
                                <th className="px-4 py-2 text-left">Kho hàng làm việc</th>
                                <th className="px-4 py-2 text-left">Thông tin chi tiết</th>
                                <th className="px-4 py-2 text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.filter(employee =>
                                employee.name.toLowerCase().includes(search.toLowerCase()) ||
                                employee.role.toLowerCase().includes(search.toLowerCase())
                            ).map(employee => (
                                <tr key={employee.id} className="border-b">
                                    <td className="px-4 py-2">{employee.name}</td>
                                    <td className="px-4 py-2">{employee.role}</td>
                                    <td className="px-4 py-2">{employee.status}</td>
                                    <td className="px-4 py-2">{employee.inventory}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleSelectEmployee(employee)}
                                            className="text-blue-500"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleEditStaff(employee)}
                                            className="text-blue-500"
                                        >
                                            Chỉnh sửa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Employee Detail Modal */}
                {selectedEmployee && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg w-2/5 max-w-4xl">
                            <h3 className="text-2xl font-bold mb-4">Chi tiết nhân viên</h3>
                            <div className='flex container'>
                                <div className="space-y-4 w-1/2">
                                    <p><strong>Vai trò:</strong> {selectedEmployee.role}</p>
                                    <p><strong>Trạng thái:</strong> {selectedEmployee.status}</p>
                                    <p><strong>Kho hàng làm việc:</strong> {selectedEmployee.inventory}</p>
                                </div>

                                <div className="space-y-4 w-1/2">
                                    <p><strong>Tên nhân viên:</strong> {selectedEmployee.name}</p>
                                    <p><strong>Giới tính:</strong> {selectedEmployee.role}</p>
                                    <p><strong>Ngày sinh:</strong> {selectedEmployee.status}</p>
                                </div>
                            </div>
                            <div className='flex container mt-4'>
                                <button
                                    onClick={() => setSelectedEmployee(null)}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-auto"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}