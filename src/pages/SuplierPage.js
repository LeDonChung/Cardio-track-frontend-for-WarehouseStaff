import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState } from 'react';

export const SuplierPage = () => {
    const [activeTab, setActiveTab] = useState('history');
    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
    const [isQualityCheckOpen, setIsQualityCheckOpen] = useState(false);

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className="p-8">
                <div className="mb-6">
                    {/* Tab Switcher */}
                    <div className="flex space-x-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`py-2 px-4 font-medium ${activeTab === 'history' ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
                        >
                            Lịch sử giao dịch
                        </button>
                        <button
                            onClick={() => setActiveTab('classification')}
                            className={`py-2 px-4 font-medium ${activeTab === 'classification' ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
                        >
                            Phân loại
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'history' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Lịch sử giao dịch</h2>
                        <div className="space-y-4">
                            {/* Item List */}
                            {[1, 2, 3].map((item, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h3 className="font-semibold">Supplier {index + 1} .......................................</h3>
                                            <p className="text-sm text-gray-600">Address {index + 1}</p>
                                            <p className="text-sm text-gray-600">Contact {index + 1}</p>
                                            <p className="text-sm text-gray-600">Tổng lượng hàng cung cấp: 300</p>
                                            <p className="text-sm text-gray-600">Thuộc: 3 danh mục thuốc</p>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => setIsOrderDetailOpen(true)}
                                                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                                            >
                                                Xem chi tiết đơn hàng
                                            </button>
                                            <button
                                                onClick={() => setIsQualityCheckOpen(true)}
                                                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                                            >
                                                Kiểm kê chất lượng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'classification' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Phân loại</h2>
                        <div className="space-y-4">
                            {/* Classification Content */}
                            <div className="bg-gray-100 p-4 rounded-lg shadow">
                                <h3 className="font-semibold mb-2">Danh mục thuốc</h3>
                                <ul className="space-y-2">
                                    <li>Danh mục 1: Nhà cung cấp A, Nhà cung cấp B</li>
                                    <li>Danh mục 2: Nhà cung cấp C</li>
                                    <li>Danh mục 3: Nhà cung cấp D, Nhà cung cấp E</li>
                                </ul>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm nhà cung cấp..."
                                    className="mt-4 p-2 w-full border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            {/* Modals */}
            <OrderDetailModal isOpen={isOrderDetailOpen} onClose={() => setIsOrderDetailOpen(false)} />
            <QualityCheckModal isOpen={isQualityCheckOpen} onClose={() => setIsQualityCheckOpen(false)} />
        </div>
    );
}

// Modal Chi tiết đơn hàng
const OrderDetailModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-2/3 max-w-4xl">
                <h3 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h3>
                {/* Các thông tin chi tiết */}
                <div className="flex justify-between mb-4">
                    <p><strong>Thời gian giao dịch:</strong> 07:50 01/01/2025</p>
                    <p><strong>Người mua:</strong> Quản lý 2</p>
                </div>
                <p><strong>Chủ thể:</strong> Công ty ABC, Nhà cung cấp XYZ</p>

                <div className="space-y-2 mt-4">
                    <h4 className="font-semibold">Danh sách sản phẩm cung cấp</h4>
                    <table className="w-full table-auto border-collapse">
                        {/* Header */}
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left">Sản phẩm</th>
                                <th className="px-4 py-2 text-left">Danh mục</th>
                                <th className="px-4 py-2 text-left">Số lượng</th>
                                <th className="px-4 py-2 text-left">Đơn giá</th>
                            </tr>
                        </thead>
                        {/* Body */}
                        <tbody>
                            {[1, 2, 3].map((product, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-2">Sản phẩm {index + 1}</td>
                                    <td className="px-4 py-2">Thuốc giảm đau</td>
                                    <td className="px-4 py-2">100</td>
                                    <td className="px-4 py-2">500</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex container mt-4">
                    <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg ml-auto">Đóng</button>
                </div>
            </div>
        </div>
    );
};

// Modal Kiểm kê chất lượng
const QualityCheckModal = ({ isOpen, onClose }) => {
    const [isCategorySelected, setIsCategorySelected] = useState(true); // Trạng thái cho checkbox
    const [isMedicineSelected, setIsMedicineSelected] = useState(false); // Trạng thái cho checkbox

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-2/3 max-w-4xl relative">
                <h3 className="text-2xl font-bold mb-4">Kiểm kê chất lượng</h3>

                <button className="mb-4 bg-green-500 text-white py-2 px-4 rounded-lg">
                    In file
                </button>

                <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p><strong>Sản phẩm hỏng:</strong> Sản phẩm 1</p>
                        <p><strong>Danh mục:</strong> Thuốc đau đầu</p>
                        <p><strong>Chú thích:</strong> Hư hỏng do quá hạn sử dụng</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p><strong>Sản phẩm hỏng:</strong> Sản phẩm 2</p>
                        <p><strong>Danh mục:</strong> Thuốc giảm đau</p>
                        <p><strong>Chú thích:</strong> Bị vỡ trong quá trình vận chuyển</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p><strong>Sản phẩm hỏng:</strong> Sản phẩm 3</p>
                        <p><strong>Danh mục:</strong> Thuốc Xương khớp</p>
                        <p><strong>Chú thích:</strong> Bị vỡ trong quá trình vận chuyển</p>
                    </div>
                </div>

                {/* Thêm đánh giá */}
                <div className="mt-4">
                    <h4 className="font-semibold">Thêm đánh giá</h4>
                    
                    {/* Checkbox chọn loại đánh giá */}
                    <div className="flex space-x-4 mb-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="category"
                                checked={isCategorySelected}
                                onChange={() => {
                                    setIsCategorySelected(true);
                                    setIsMedicineSelected(false);
                                }}
                                className="mr-2"
                            />
                            <label htmlFor="category">Đánh giá theo danh mục</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="medicine"
                                checked={isMedicineSelected}
                                onChange={() => {
                                    setIsCategorySelected(false);
                                    setIsMedicineSelected(true);
                                }}
                                className="mr-2"
                            />
                            <label htmlFor="medicine">Đánh giá theo từng thuốc</label>
                        </div>
                    </div>

                    {/* Phần chọn danh mục thuốc (hiện khi chọn đánh giá theo danh mục) */}
                    {isCategorySelected && (
                        <div className="flex space-x-4 mb-4">
                            <div className='w-1/2'>
                                <label className="block">Danh mục thuốc</label>
                                <select className="w-full p-2 mt-2 border border-gray-300 rounded-lg">
                                    <option value="category1">Danh mục 1</option>
                                    <option value="category2">Danh mục 2</option>
                                </select>
                            </div>
                            <div className='w-1/2'>
                                <label className="block">Loại</label>
                                <select className="w-full p-2 mt-2 border border-gray-300 rounded-lg">
                                    <option value="damaged">Hư hỏng</option>
                                    <option value="expired">Hết hạn</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Phần đánh giá cho từng sản phẩm (hiện khi chọn đánh giá theo từng thuốc) */}
                    {isMedicineSelected && (
                        <div className="flex space-x-4 mb-4">
                            <div className='w-1/3'>
                                <label className="block">Danh mục thuốc</label>
                                <select className="w-full p-2 mt-2 border border-gray-300 rounded-lg">
                                    <option value="category1">Danh mục 1</option>
                                    <option value="category2">Danh mục 2</option>
                                </select>
                            </div>
                            <div className='w-1/3'>
                                <label className="block">Thuốc</label>
                                <select className="w-full p-2 mt-2 border border-gray-300 rounded-lg">
                                    <option value="medicine1">Thuốc 1</option>
                                    <option value="medicine2">Thuốc 2</option>
                                </select>
                            </div>
                            <div className='w-1/3'>
                                <label className="block">Loại</label>
                                <select className="w-full p-2 mt-2 border border-gray-300 rounded-lg">
                                    <option value="damaged">Hư hỏng</option>
                                    <option value="expired">Hết hạn</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Nút thêm đánh giá */}
                    <div className="flex space-x-4">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Thêm đánh giá kiểm tra</button>
                    </div>
                </div>

                {/* Nút đóng modal */}
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded-lg">Đóng</button>
                </div>
            </div>
        </div>
    );
};


