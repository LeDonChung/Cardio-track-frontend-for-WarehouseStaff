import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/slice/UserInventorySlice';
import { verifyUser } from '../redux/slice/UserInventorySlice';
import { getUser } from '../redux/slice/UserSlice';

export const StaffManagermentPage = () => {
    const [search, setSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const navigate = useNavigate();  // Initialize useNavigate
    const dispatch = useDispatch();

    const { userInventory, loading, error } = useSelector((state) => state.userInventory);
    const { user } = useSelector((state) => state.user);

    const handleSelectEmployee = (employee) => {
        dispatch(getUser(employee.user));
        setSelectedEmployee(employee);
    };

    const handleAddStaff = () => {
        navigate('/staff/add-staff');  // Navigate to AddStaffPage
    };

    const handleEditStaff = (employee) => {
        navigate(`/staff/edit-staff/${employee.id}`, { state: { employee } });  // Pass employee data via state
    };

    // xác minh
    useEffect(() => {
        dispatch(verifyUser(""));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchUsers({}));
    }, [dispatch]);


    console.log("user", user);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className="p-8 mx-16 mb-64">
                {/* Search Section */}
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhân viên..."
                        className="p-2 border border-gray-300 rounded-lg w-1/3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Employee List */}
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Nhân viên</th>
                                <th className="px-4 py-2 text-left">Vai trò</th>
                                <th className="px-4 py-2 text-left">Thông tin chi tiết</th>
                                <th className="px-4 py-2 text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userInventory.filter(employee =>
                                employee.user.toString().toLowerCase().includes(search.toLowerCase()) ||
                                employee.role.toLowerCase().includes(search.toLowerCase())
                            ).map(employee => (
                                <tr key={employee.id} className="border-b">
                                    <td className="px-4 py-2">{employee.user}</td>
                                    <td className="px-4 py-2">
                                        {employee.role === "ADMIN" ? "Quản lý kho" :
                                            employee.role === "STAFF" ? "Nhân viên bốc xếp" :
                                                employee.role === "VIEWER" ? "Giám sát" :
                                                    employee.role}
                                    </td>
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
                                    <p><strong>Vai trò: </strong>
                                        {selectedEmployee.role === "ADMIN" ? "Quản lý kho" :
                                        selectedEmployee.role === "STAFF" ? "Nhân viên bốc xếp" :
                                        selectedEmployee.role === "VIEWER" ? "Giám sát" :
                                        selectedEmployee.role}
                                    </p>
                                    <p><strong>Kho hàng làm việc:</strong> {selectedEmployee.inventory}</p>
                                </div>

                                <div className="space-y-4 w-1/2">
                                    <p><strong>Tên nhân viên:</strong> {user.fullName}</p>
                                    <p><strong>Giới tính: </strong> 
                                        {user.gender === "Female" ? "Nam" :
                                        user.gender === "Male" ? "Nữ" :
                                        user.gender}
                                    </p>
                                    <p><strong>Ngày sinh:</strong> {user.dob}</p>
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