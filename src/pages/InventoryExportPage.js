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

            <Footer />
        </div>
    );
};
