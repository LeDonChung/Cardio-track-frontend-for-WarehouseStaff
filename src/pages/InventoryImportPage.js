import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventoryImports } from '../redux/slice/InventoryImportSlice'; // Import Redux slice
import '@fortawesome/fontawesome-free/css/all.min.css';
import showToast from "../utils/AppUtils";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Dữ liệu giả lập các đơn mua lô thuốc
const purchaseOrders = [
    {
        id: 'PO001',
        supplier: 'ABC Pharma',
        orderDate: '2025-02-01',
        status: 'Đang xử lý',
        medicines: [
            { name: 'Paracetamol', quantity: 100, price: 1000 },
            { name: 'Ibuprofen', quantity: 50, price: 1500 }
        ]
    },
    {
        id: 'PO002',
        supplier: 'XYZ Corp',
        orderDate: '2025-02-05',
        status: 'Đã nhập',
        medicines: [
            { name: 'Amoxicillin', quantity: 200, price: 25000 },
            { name: 'Vitamin C', quantity: 150, price: 500 }
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
            { name: 'Paracetamol', quantity: 100, status: '23/3/2025', price: 1000 },
            { name: 'Ibuprofen', quantity: 50, status: '12/4/2025', price: 1500 }
        ]
    },
    {
        shelf_id: 'S002',
        location: 'A04T3',
        quantity_product: 200,
        status: 'Đã nhập',
        products: [
            { name: 'Amoxicillin', quantity: 200, status: '27/5/2026', price: 25000 },
            { name: 'Vitamin C', quantity: 150, status: '4/4/2028', price: 500 }
        ]
    }
];

export const InventoryImportPage = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedShelf, setSelectedShelf] = useState(null);

    // Hàm tìm kiếm đơn nhập
    // const handleSearch = (e) => {
    //     const query = e.target.value.toLowerCase();
    //     setSearchQuery(query);
    //     const result = importOrders.filter(order =>
    //         order.warehouse.toLowerCase().includes(query)
    //     );
    //     setFilteredOrders(result);
    // };

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

    const [selectedOrderPurchare, setSelectedOrderPurchare] = useState(null);

    // Hàm mở chi tiết đơn mua
    const openOrderDetails = (order) => {
        setSelectedOrderPurchare(order);
    };

    // Hàm đóng chi tiết đơn mua
    const closeOrderDetails = () => {
        setSelectedOrderPurchare(null);
    };

    // Hàm nhập kho
    const importToWarehouse = (order) => {
        alert(`Nhập kho thành công cho đơn mua ${order.id}`);
    };

    const dispatch = useDispatch();

    // State để theo dõi trang hiện tại và số lượng item mỗi trang
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    // Lấy dữ liệu từ Redux state
    const { inventoryImport = [], loading, error } = useSelector((state) => state.inventoryImport || {});

    // Gửi yêu cầu API khi trang thay đổi
    useEffect(() => {
        dispatch(fetchInventoryImports({ page: currentPage, size: pageSize, sortBy: 'importDate', sortName: 'asc' }));
    }, [dispatch, currentPage]);

    useEffect(() => {
        console.log('inventoryImport data:', inventoryImport);
    }, [inventoryImport]);

    // Hàm chuyển sang trang tiếp theo
    const nextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    // Hàm chuyển về trang trước đó
    const prevPage = () => {
        setCurrentPage(prevPage => (prevPage > 0 ? prevPage - 1 : 0));
    };


    if (loading) return <div>Đang tải...</div>; // Hiển thị khi đang tải dữ liệu
    if (error) return <div>Lỗi: {error.message}</div>; // Hiển thị lỗi nếu có



    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className='bg-gray-50 mx-16 mb-64'>
                {/* Tab Navigation */}
                <div className="flex border-b mb-4">
                    <button
                        className={`py-2 px-4 ${activeTab === 'list' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        Danh sách đơn nhập
                    </button>
                    <button
                        className={`py-2 px-4 ${activeTab === 'purchare-order' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('purchare-order')}
                    >
                        Đơn mua lô thuốc
                    </button>
                    <button
                        className={`py-2 px-4 ${activeTab === 'status' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('status')}
                    >
                        Kiểm soát nhập kho
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
                                {/* <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên kho..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="p-2 border border-gray-300 rounded-md w-1/2"
                                /> */}
                            </div>

                            {/* Bảng danh sách đơn nhập */}
                            <table className="min-w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Số thứ tự</th>
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
                                    {inventoryImport.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">Không có đơn nhập nào</td>
                                        </tr>
                                    ) : (
                                        inventoryImport.map(order => (
                                            <tr key={order.id}>
                                                <td className="px-4 py-2">{inventoryImport.indexOf(order) + 1}</td>
                                                <td className="px-4 py-2">{order.id}</td>
                                                <td className="px-4 py-2">{order.inventory}</td>
                                                <td className="px-4 py-2">{order.status}</td>
                                                <td className="px-4 py-2">{new Date(order.importDate).toLocaleDateString()}</td>
                                                <td className="px-4 py-2">{order.recipient}</td>
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
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Các nút chuyển trang */}
                            {/* Các nút chuyển trang */}
                            <div className="flex justify-center space-x-4 mt-4">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 0}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md disabled:opacity-50"
                                >
                                    <i className="fas fa-chevron-left"></i> Trước
                                </button>
                                <button
                                    onClick={nextPage}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                                >
                                    Tiếp theo <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>

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
                        </div>
                    )}

                    {/* Tab Đơn mua lô thuốc */}
                    {activeTab === 'purchare-order' && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">Danh sách đơn mua lô thuốc</h3>

                            {/* Hiển thị thông tin từng đơn mua */}
                            <div className="space-y-4">
                                {purchaseOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="border p-4 rounded-md shadow-md bg-gray-50"
                                    >
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold">Mã đơn: {order.id}</span>
                                            <span className="text-sm text-gray-500">Ngày đặt: {order.orderDate}</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Nhà cung cấp:</strong> {order.supplier}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Tình trạng:</strong> {order.status}
                                        </div>

                                        {/* Hiển thị danh sách thuốc trong đơn mua */}
                                        <div className="mb-4">
                                            <strong>Danh sách thuốc:</strong>
                                            <ul className="list-disc ml-4">
                                                {order.medicines.map((medicine, index) => (
                                                    <li key={index}>
                                                        {medicine.name} - {medicine.quantity} viên - {medicine.price.toLocaleString()} VND
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Nút nhập vào kho */}
                                        <button
                                            onClick={() => importToWarehouse(order)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Nhập vào kho
                                        </button>
                                    </div>
                                ))}
                            </div>
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

            {/* Chi tiết kệ khi được chọn */}
            {/* Modal chi tiết kệ */}
            {selectedShelf && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-2/3">
                        <h3 className="font-bold text-lg mb-4">Chi tiết kệ - Mã: {selectedShelf.shelf_id}</h3>

                        {/* Hiển thị thông tin kệ */}
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">Sản phẩm</th>
                                    <th className="px-4 py-2 text-left">Số lượng</th>
                                    <th className="px-4 py-2 text-left">Ngày nhập</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedShelf.products.map(product => (
                                    <tr key={product.name}>
                                        <td className="px-4 py-2">{product.name}</td>
                                        <td className="px-4 py-2">{product.quantity}</td>
                                        <td className="px-4 py-2">{product.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeShelfDetails}
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
