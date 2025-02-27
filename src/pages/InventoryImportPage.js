import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState } from 'react';

// Dữ liệu giả lập đơn nhập với nhiều sản phẩm, bao gồm cả danh mục thuốc
const importOrders = [
    {
        id: 1,
        warehouse: 'Kho A',
        status: 'Đang chờ',
        date: '2025-02-01',
        user: 'Nguyễn Văn A',
        notes: 'Nhập hàng cần thiết',
        products: [
            {
                name: 'Paracetamol',
                quantity: 100,
                unit: 'Viên',
                price: 1000,
                category: 'Thuốc giảm đau',
                manufacturer: 'ABC Pharma',
                expirationDate: '2026-05-01'
            },
            {
                name: 'Ibuprofen',
                quantity: 50,
                unit: 'Viên',
                price: 1500,
                category: 'Thuốc giảm đau',
                manufacturer: 'XYZ Corp',
                expirationDate: '2025-12-15'
            }
        ]
    },
    {
        id: 2,
        warehouse: 'Kho B',
        status: 'Đã nhập',
        date: '2025-02-02',
        user: 'Trần Thị B',
        notes: 'Nhập hàng gấp',
        products: [
            {
                name: 'Amoxicillin',
                quantity: 200,
                unit: 'Hộp',
                price: 25000,
                category: 'Kháng sinh',
                manufacturer: 'MedPharm',
                expirationDate: '2026-07-10'
            },
            {
                name: 'Vitamin C',
                quantity: 150,
                unit: 'Viên',
                price: 500,
                category: 'Vitamin',
                manufacturer: 'Wellness Co',
                expirationDate: '2025-11-30'
            }
        ]
    }
];

// Dữ liệu giả lập kệ kho và sản phẩm trong kệ
const shelves = [
    {
        shelf_id: 'S001',
        location: 'A04T1',
        quantity_product: 150,
        status: 'Đang chờ nhập',
        products: [
            { name: 'Paracetamol', quantity: 100, status: 'Đang nhập', price: 1000 },
            { name: 'Ibuprofen', quantity: 50, status: 'Đang nhập', price: 1500 }
        ]
    },
    {
        shelf_id: 'S002',
        location: 'A04T3',
        quantity_product: 200,
        status: 'Đã nhập',
        products: [
            { name: 'Amoxicillin', quantity: 200, status: 'Đã nhập', price: 25000 },
            { name: 'Vitamin C', quantity: 150, status: 'Đang nhập', price: 500 }
        ]
    }
];

export const InventoryImportPage = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(importOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedShelf, setSelectedShelf] = useState(null);

    // Hàm tìm kiếm đơn nhập
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const result = importOrders.filter(order =>
            order.warehouse.toLowerCase().includes(query)
        );
        setFilteredOrders(result);
    };

    // Hàm mở modal chi tiết đơn nhập
    const openModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    // Hàm đóng modal chi tiết đơn nhập
    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    // Hàm mở chi tiết kệ
    const openShelfDetails = (shelf) => {
        setSelectedShelf(shelf);
    };

    // Hàm đóng modal chi tiết kệ
    const closeShelfDetails = () => {
        setSelectedShelf(null);
    };

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className='p-8 mb-64'>
                {/* Tab Navigation */}
                <div className="flex border-b mb-4">
                    <button
                        className={`py-2 px-4 ${activeTab === 'list' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        Danh sách đơn nhập
                    </button>
                    <button
                        className={`py-2 px-4 ${activeTab === 'status' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('status')}
                    >
                        Tình trạng nhập kho
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                    {/* Tab Danh sách đơn nhập */}
                    {activeTab === 'list' && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">Danh sách đơn nhập</h3>

                            {/* Tìm kiếm đơn nhập */}
                            <div className="mb-4 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên kho..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="p-2 border border-gray-300 rounded-md w-1/2"
                                />
                            </div>

                            {/* Bảng danh sách đơn nhập */}
                            <table className="min-w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Mã đơn</th>
                                        <th className="px-4 py-2 text-left">Kho</th>
                                        <th className="px-4 py-2 text-left">Tình trạng</th>
                                        <th className="px-4 py-2 text-left">Ngày nhập</th>
                                        <th className="px-4 py-2 text-left">Người phụ trách</th>
                                        <th className="px-4 py-2 text-left">Ghi chú</th>
                                        <th className="px-4 py-2 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-4 py-2">{order.id}</td>
                                            <td className="px-4 py-2">{order.warehouse}</td>
                                            <td className="px-4 py-2">{order.status}</td>
                                            <td className="px-4 py-2">{order.date}</td>
                                            <td className="px-4 py-2">{order.user}</td>
                                            <td className="px-4 py-2">{order.notes}</td>
                                            <td className="px-4 py-2 text-right">
                                                <button
                                                    onClick={() => openModal(order)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Chú thích */}
                            <div className="mt-4 text-sm text-gray-500">
                                <p>* Mã đơn là mã duy nhất của mỗi đơn nhập.</p>
                                <p>* Tình trạng nhập kho: Đang chờ, Đã nhập, Bị lỗi...</p>
                            </div>
                        </div>
                    )}

                    {/* Tab Tình trạng nhập kho */}
                    {activeTab === 'status' && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">Tình trạng nhập kho</h3>

                            {/* Danh sách kệ */}
                            <div className="mb-4">
                                <h4 className="font-semibold text-lg mb-2">Danh sách kệ</h4>
                                <table className="min-w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-left">Mã kệ</th>
                                            <th className="px-4 py-2 text-left">Vị trí</th>
                                            <th className="px-4 py-2 text-left">Số lượng sản phẩm</th>
                                            <th className="px-4 py-2 text-left">Sức chứa</th>
                                            <th className="px-4 py-2 text-left">Trạng thái</th>
                                            <th className="px-4 py-2 text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shelves.map(shelf => (
                                            <tr key={shelf.shelf_id}>
                                                <td className="px-4 py-2">{shelf.shelf_id}</td>
                                                <td className="px-4 py-2">{shelf.location}</td>
                                                <td className="px-4 py-2">{shelf.quantity_product}</td>
                                                <td className="px-4 py-2">300</td>
                                                <td className="px-4 py-2">{shelf.status}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        onClick={() => openShelfDetails(shelf)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Chi tiết kệ khi được chọn */}
                            {selectedShelf && (
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Chi tiết kệ: {selectedShelf.shelf_id}</h4>
                                    <div className="mb-4">
                                        <h5 className="font-medium text-lg mb-2">Danh sách sản phẩm</h5>
                                        <table className="min-w-full table-auto border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="px-4 py-2 text-left">Tên thuốc</th>
                                                    <th className="px-4 py-2 text-left">Số lượng</th>
                                                    <th className="px-4 py-2 text-left">Trạng thái</th>
                                                    <th className="px-4 py-2 text-left">Giá</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedShelf.products.map((product, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-2">{product.name}</td>
                                                        <td className="px-4 py-2">{product.quantity}</td>
                                                        <td className="px-4 py-2">{product.status}</td>
                                                        <td className="px-4 py-2">{product.price.toLocaleString()} VND</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={closeShelfDetails}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            {/* Modal xem chi tiết đơn nhập */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-2/3">
                        <h3 className="font-bold text-lg mb-4">Chi tiết đơn nhập - Mã: {selectedOrder.id}</h3>
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">Tên thuốc</th>
                                    <th className="px-4 py-2 text-left">Danh mục</th>
                                    <th className="px-4 py-2 text-left">Nhà sản xuất</th>
                                    <th className="px-4 py-2 text-left">Số lượng</th>
                                    <th className="px-4 py-2 text-left">Đơn vị tính</th>
                                    <th className="px-4 py-2 text-left">Giá</th>
                                    <th className="px-4 py-2 text-left">Hạn sử dụng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.products.map((product, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">{product.name}</td>
                                        <td className="px-4 py-2">{product.category}</td>
                                        <td className="px-4 py-2">{product.manufacturer}</td>
                                        <td className="px-4 py-2">{product.quantity}</td>
                                        <td className="px-4 py-2">{product.unit}</td>
                                        <td className="px-4 py-2">{product.price.toLocaleString()} VND</td>
                                        <td className="px-4 py-2">{product.expirationDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
