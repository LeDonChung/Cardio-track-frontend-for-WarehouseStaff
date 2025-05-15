import React, { useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import { updateUser } from '../redux/slice/UserInventorySlice';
import { useDispatch } from 'react-redux';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import showToast from "../utils/AppUtils";

export const EditStaffPage = () => {
    const location = useLocation();
    const { employee } = location.state || {};
    const [name, setName] = useState(employee.user);
    const [role, setRole] = useState(employee.role);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Xử lý sự kiện cập nhật nhân viên
    const handleEditStaff = async (e) => {
        e.preventDefault();
    
        // Cắt chuỗi role để chỉ lấy phần đầu tiên (vai trò chính)
        const roleValue = role.split(" - ")[0];  // Lấy phần trước dấu " -"
    
        try {
            // Gọi action Redux để cập nhật thông tin nhân viên với role đã được cắt
            await dispatch(updateUser({ id: employee.user, role: roleValue }));
            navigate('/staff');
            showToast('Cập nhật thành công', 'success'); // Hiển thị thông báo thành công

        } catch (error) {
            console.error('Cập nhật không thành công:', error);
        }
    };
    
    
    

    const roles = ['ADMIN - Quản lý kho', 'STAFF - Nhân viên bốc xếp', 'VIEWER - Giám sát'];


    return (
        <div className="bg-white text-gray-900 ">
            <Header />
            <main className="p-8 mb-48">
                <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Cập nhật nhân sự</h2>
                    <form onSubmit={handleEditStaff} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium">Nhân viên</label>
                            <input
                                type="text"
                                value={employee.user}
                                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled
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

                        <button type="submit" className="bg-blue-500 text-white py-3 px-6 rounded-lg mt-4 w-full hover:bg-blue-600">
                            Cập nhật
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
