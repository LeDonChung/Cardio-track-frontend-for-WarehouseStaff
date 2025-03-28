import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchaseOrders } from '../redux/slice/PurchaseOrderSlice';
import { fetchPurchaseOrderDetailById } from '../redux/slice/PurchaseOrderDetailSlice';
import { fetchMedicineById_client } from '../redux/slice/MedicineSlice';
import { fetchCategoryById_client } from '../redux/slice/CategorySlice';

export const SuplierPage = () => {
    const [activeTab, setActiveTab] = useState('history');
    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
    const [isQualityCheckOpen, setIsQualityCheckOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const dispatch = useDispatch();

    // Lấy dữ liệu từ Redux store
    const { supplier, loading, error } = useSelector((state) => state.supplier);
    const { purchaseOrderByPendingStatus } = useSelector((state) => state.purchaseOrderByPendingStatus);
    const { purchaseOrderDetail } = useSelector((state) => state.purchaseOrderDetail);
    const { medicines } = useSelector((state) => state.medicine);
    const { categorys } = useSelector((state) => state.categorys);


    // Gửi yêu cầu API khi trang thay đổi
    useEffect(() => {
        dispatch(fetchPurchaseOrders({ page: currentPage, size: pageSize, sortBy: 'orderDate', sortName: 'desc' }));
    }, [dispatch, currentPage]);


    // Hàm chuyển sang trang tiếp theo
    const nextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    // Hàm chuyển về trang trước đó
    const prevPage = () => {
        setCurrentPage(prevPage => (prevPage > 0 ? prevPage - 1 : 0));
    };

    // Mở modal chi tiết đơn hàng
    const openDetailModal = (purchaseOrder) => {
        dispatch(fetchPurchaseOrderDetailById(purchaseOrder.id));
        purchaseOrder.purchaseOrderDetails.forEach((detail) => {
            const medicineId = detail.medicine;
            const categoryId = detail.category;

            // Kiểm tra nếu thuốc đã có trong state
            const medicine = medicines.find(item => item.id === medicineId);
            const category = categorys.find(item => item.id === categoryId);

            if (!medicine) {
                // Nếu thuốc chưa có trong state, gọi fetchMedicineById để tải thông tin
                dispatch(fetchMedicineById_client(medicineId));
            }

            if (!category) {
                // Nếu danh mục chưa có trong state, gọi fetchCategoryById để tải thông tin
                dispatch(fetchCategoryById_client(categoryId));
            }
        });
        setIsOrderDetailOpen(true);
    };

    console.log("medicnie:", medicines);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className="p-8 mb-64">
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
                {/* Tab Content */}
                {activeTab === 'history' && (
                    <div>
                        <div className="flex">
                            <h2 className="text-2xl font-bold mb-4">Lịch sử giao dịch</h2>
                        </div>
                        <div className="space-y-4">
                            {/* Item List */}
                            {purchaseOrderByPendingStatus?.data?.map((purchaseOrder, index) => {
                                // Chuyển đổi ngày giờ từ UTC sang múi giờ VN (UTC+7) và lấy chỉ phần ngày tháng năm
                                const orderDateVN = new Date(purchaseOrder.orderDate).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

                                // Xử lý hiển thị status
                                let statusLabel = "";
                                switch (purchaseOrder.status) {
                                    case "PENDING":
                                        statusLabel = "Đang xử lý";
                                        break;
                                    case "APPROVED":
                                        statusLabel = "Đã chấp nhận";
                                        break;
                                    case "CANCELED":
                                        statusLabel = "Đã hủy";
                                        break;
                                    default:
                                        statusLabel = "Không xác định";
                                        break;
                                }

                                return (
                                    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold">{purchaseOrder.supplierName}</h3>
                                            <h4 className="ml-auto">{orderDateVN}</h4>
                                            <h4 className="ml-auto">Trạng thái: {statusLabel}</h4>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <p className="text-sm text-gray-600">{purchaseOrder.supplierAddress}</p>
                                                <p className="text-sm text-gray-600">{purchaseOrder.supplierContactInfo}</p>
                                                <p className="text-sm text-gray-600">Số thuốc mua: {purchaseOrder.purchaseOrderDetails.length}</p>
                                                <p className="text-sm text-gray-600">
                                                    Số lượng danh mục: {
                                                        [...new Set(purchaseOrder.purchaseOrderDetails.map(detail => detail.category))].length
                                                    }
                                                </p>
                                            </div>
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => openDetailModal(purchaseOrder)}
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
                                );
                            })}

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
                        </div>
                    </div>
                )}

                {activeTab === 'classification' && (
                    <div>
                        <div className="flex justify-between items-center mb-4 space-x-4">
                            <h2 className="text-2xl font-bold mb-4 w-1/3">Phân loại</h2>
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhà cung cấp..."
                                className="mt-4 p-2 w-full border border-gray-300 rounded-lg w-1/3"
                            />

                            <input
                                type="text"
                                placeholder="Tìm kiếm danh mục..."
                                className="mt-4 p-2 w-full border border-gray-300 rounded-lg w-1/3"
                            />
                        </div>
                        <div className="space-y-4">
                            {/* Classification Content */}
                            <div className="bg-gray-100 p-4 rounded-lg shadow">
                                <h3 className="font-semibold mb-2">Danh mục thuốc</h3>
                                <ul className="space-y-2">
                                    <li>Danh mục 1: Nhà cung cấp A, Nhà cung cấp B</li>
                                    <li>Danh mục 2: Nhà cung cấp C</li>
                                    <li>Danh mục 3: Nhà cung cấp D, Nhà cung cấp E</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            {/* Modals */}
            <OrderDetailModal isOpen={isOrderDetailOpen} onClose={() => setIsOrderDetailOpen(false)} purchaseOrderDetail={purchaseOrderDetail} medicines={medicines} categorys={categorys} />
            <QualityCheckModal isOpen={isQualityCheckOpen} onClose={() => setIsQualityCheckOpen(false)} />
        </div>
    );
}

// Modal Chi tiết đơn hàng
const OrderDetailModal = ({ isOpen, onClose, purchaseOrderDetail, medicines, categorys }) => {

    if (!isOpen) return null;
    console.log("medicines no:", medicines);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-2/3 max-w-4xl">
                <h3 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h3>

                <div className="space-y-2 mt-4">
                    <h4 className="font-semibold">Danh sách sản phẩm cung cấp</h4>
                    <div className="overflow-x-auto max-h-64">
                        <table className="w-full table-auto border-collapse">
                            {/* Header */}
                            <thead className="bg-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2 text-left">Tên thuốc</th>
                                    <th className="px-4 py-2 text-left">Danh mục</th>
                                    <th className="px-4 py-2 text-left">Số lượng</th>
                                    <th className="px-4 py-2 text-left">Đơn giá</th>
                                    <th className="px-4 py-2 text-left">Giảm giá</th>
                                    <th className="px-4 py-2 text-left">Ngày hết hạn</th>
                                </tr>
                            </thead>
                            {/* Body with scroll */}
                            <tbody className="overflow-y-auto">
                                {purchaseOrderDetail.map((orderDetail, index) => {
                                    // Tìm thuốc theo medicineId
                                    const medicine = medicines.find(med => med.id === orderDetail.medicine);
                                    const category = categorys.find(cat => cat.id === orderDetail.category);
                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">{medicine ? medicine.name : 'Chưa có tên thuốc'}</td>
                                            <td className="px-4 py-2">{category ? category.title : 'Chưa có tên loại'}</td>
                                            <td className="px-4 py-2">{orderDetail.quantity}</td>
                                            <td className="px-4 py-2">{orderDetail.price}</td>
                                            <td className="px-4 py-2">{orderDetail.discount}</td>
                                            <td className="px-4 py-2">{orderDetail.expirationDate}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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


