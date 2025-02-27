import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState } from 'react';

// Dữ liệu giả lập cho các đơn xuất kho
const exportOrders = [
    {
        id: 'EO001',
        warehouse: 'Kho A',
        date: '2025-02-10',
        customer: 'Nguyễn Văn C',
        status: 'Đã xuất kho',
        products: [
            { name: 'Paracetamol', quantity: 100, price: 1000 },
            { name: 'Ibuprofen', quantity: 50, price: 1500 }
        ]
    },
    {
        id: 'EO002',
        warehouse: 'Kho B',
        date: '2025-02-12',
        customer: 'Trần Thị D',
        status: 'Đang xử lý',
        products: [
            { name: 'Amoxicillin', quantity: 200, price: 25000 },
            { name: 'Vitamin C', quantity: 150, price: 500 }
        ]
    }
];

// Dữ liệu giả lập cho các yêu cầu trả hàng
const returnRequests = [
    {
        id: 'RR001',
        orderId: 'EO001',
        productName: 'Paracetamol',
        quantity: 20,
        reason: 'Sản phẩm bị hư hỏng',
        status: 'Chờ xử lý'
    },
    {
        id: 'RR002',
        orderId: 'EO002',
        productName: 'Vitamin C',
        quantity: 50,
        reason: 'Không phù hợp với nhu cầu',
        status: 'Đã duyệt'
    }
];

// Dữ liệu giả lập cho trạng thái đơn hàng của khách hàng
const customerOrders = [
    {
        id: 'CO001',
        customer: 'Nguyễn Văn C',
        status: 'Đang xử lý',
        orderDate: '2025-02-10',
        shippingDate: null
    },
    {
        id: 'CO002',
        customer: 'Trần Thị D',
        status: 'Đã xuất kho',
        orderDate: '2025-02-12',
        shippingDate: '2025-02-15'
    }
];

export const InventoryExportPage = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedReturnRequest, setSelectedReturnRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);

    // Hàm mở modal chi tiết đơn xuất
    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    // Hàm đóng modal chi tiết đơn xuất
    const closeOrderDetails = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    // Hàm mở modal chi tiết trả hàng
    const openReturnDetails = (request) => {
        setSelectedReturnRequest(request);
        setShowReturnModal(true);
    };

    // Hàm đóng modal chi tiết trả hàng
    const closeReturnDetails = () => {
        setShowReturnModal(false);
        setSelectedReturnRequest(null);
    };

    // Hàm cập nhật trạng thái đơn hàng của khách hàng
    const updateOrderStatus = (orderId, status) => {
        const updatedOrders = customerOrders.map(order => 
            order.id === orderId ? { ...order, status: status } : order
        );
        // Update the state or perform other actions
    };

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className='mb-64'>
                {/* Tab Navigation */}
                <div className="flex border-b mb-4">
                    <button
                        className={`py-2 px-4 ${activeTab === 'list' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        Danh sách đơn xuất
                    </button>
                    <button
                        className={`py-2 px-4 ${activeTab === 'return' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('return')}
                    >
                        Xử lý trả hàng
                    </button>
                    <button
                        className={`py-2 px-4 ${activeTab === 'track' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('track')}
                    >
                        Theo dõi đơn hàng của khách hàng
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                    {/* Tab Danh sách đơn xuất */}
                    {activeTab === 'list' && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">Danh sách đơn xuất</h3>
                            <table className="min-w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Mã đơn</th>
                                        <th className="px-4 py-2 text-left">Kho</th>
                                        <th className="px-4 py-2 text-left">Ngày xuất</th>
                                        <th className="px-4 py-2 text-left">Khách hàng</th>
                                        <th className="px-4 py-2 text-left">Trạng thái</th>
                                        <th className="px-4 py-2 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exportOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-4 py-2">{order.id}</td>
                                            <td className="px-4 py-2">{order.warehouse}</td>
                                            <td className="px-4 py-2">{order.date}</td>
                                            <td className="px-4 py-2">{order.customer}</td>
                                            <td className="px-4 py-2">{order.status}</td>
                                            <td className="px-4 py-2 text-right">
                                                <button
                                                    onClick={() => openOrderDetails(order)}
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
                    )}

                    {/* Tab Xử lý trả hàng */}
                    {activeTab === 'return' && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">Xử lý trả hàng</h3>
                            <div className="space-y-4">
                                {returnRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="border p-4 rounded-md shadow-md bg-gray-50"
                                    >
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold">Mã yêu cầu: {request.id}</span>
                                            <span className="text-sm text-gray-500">Mã đơn: {request.orderId}</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Sản phẩm:</strong> {request.productName}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Số lượng:</strong> {request.quantity}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Lý do trả hàng:</strong> {request.reason}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Trạng thái:</strong> {request.status}
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => openReturnDetails(request)}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                                            >
                                                Xử lý
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab Theo dõi đơn hàng của khách hàng */}
                    {activeTab === 'track' && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">Theo dõi đơn hàng của khách hàng</h3>
                            <table className="min-w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Mã đơn</th>
                                        <th className="px-4 py-2 text-left">Khách hàng</th>
                                        <th className="px-4 py-2 text-left">Ngày đặt</th>
                                        <th className="px-4 py-2 text-left">Ngày xuất</th>
                                        <th className="px-4 py-2 text-right">Cập nhật trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-4 py-2">{order.id}</td>
                                            <td className="px-4 py-2">{order.customer}</td>
                                            <td className="px-4 py-2">{order.orderDate}</td>
                                            <td className="px-4 py-2">{order.shippingDate || 'Chưa xuất kho'}</td>
                                            <td className="px-4 py-2 text-right">
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'Đã xuất kho')}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
                                                >
                                                    Đã xuất kho
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal xem chi tiết đơn xuất */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-2/3">
                        <h3 className="font-bold text-lg mb-4">Chi tiết đơn xuất - Mã: {selectedOrder.id}</h3>
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">Tên thuốc</th>
                                    <th className="px-4 py-2 text-left">Số lượng</th>
                                    <th className="px-4 py-2 text-left">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.products.map((product, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">{product.name}</td>
                                        <td className="px-4 py-2">{product.quantity}</td>
                                        <td className="px-4 py-2">{product.price.toLocaleString()} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeOrderDetails}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xem chi tiết trả hàng */}
            {showReturnModal && selectedReturnRequest && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-2/3">
                        <h3 className="font-bold text-lg mb-4">Chi tiết yêu cầu trả hàng - Mã: {selectedReturnRequest.id}</h3>
                        <div className="mb-4">
                            <strong>Sản phẩm:</strong> {selectedReturnRequest.productName}
                        </div>
                        <div className="mb-4">
                            <strong>Số lượng:</strong> {selectedReturnRequest.quantity}
                        </div>
                        <div className="mb-4">
                            <strong>Lý do trả hàng:</strong> {selectedReturnRequest.reason}
                        </div>
                        <div className="mb-4">
                            <strong>Trạng thái:</strong> {selectedReturnRequest.status}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeReturnDetails}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};
