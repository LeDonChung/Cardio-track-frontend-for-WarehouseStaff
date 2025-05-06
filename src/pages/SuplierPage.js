import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchaseOrders } from '../redux/slice/PurchaseOrderSlice';
import { fetchPurchaseOrderDetailById } from '../redux/slice/PurchaseOrderDetailSlice';
import { fetchMedicineById_client } from '../redux/slice/MedicineSlice';
import { fetchCategoryById_client } from '../redux/slice/CategorySlice';
import { verifySupplier } from '../redux/slice/SupplierSlice';
import {getTotalQuantity} from '../redux/slice/InventoryDetailSlice';
import showToast from "../utils/AppUtils";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

export const SuplierPage = () => {
    const [activeTab, setActiveTab] = useState('history');
    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
    const [isQualityCheckOpen, setIsQualityCheckOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const dispatch = useDispatch();

    const [totalReviewedProducts, setTotalReviewedProducts] = useState(0); // State để lưu tổng số sản phẩm đã đánh giá

    // Lấy dữ liệu từ Redux store
    const { supplier, loading, error } = useSelector((state) => state.supplier);
    const { purchaseOrder } = useSelector((state) => state.purchaseOrder);
    const { purchaseOrderDetail } = useSelector((state) => state.purchaseOrderDetail);
    const { medicines } = useSelector((state) => state.medicine);
    const { categorys } = useSelector((state) => state.categorys);
    const { totalProduct = 0 } = useSelector((state) => state.inventoryDetail || {});

    // Lấy tổng số lượng thuốc từ Redux
    useEffect(() => {
        dispatch(getTotalQuantity());
    }, [dispatch]);

    // xác minh
    useEffect(() => {
        dispatch(verifySupplier(""));
    }, [dispatch]);

    const [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        if (purchaseOrder?.data) {
            setAllOrders(prev => {
                const newOrders = purchaseOrder.data;
                const merged = [...prev, ...newOrders];
                const uniqueOrders = Array.from(new Map(merged.map(order => [order.id, order])).values());
                return uniqueOrders;
            });
        }
    }, [purchaseOrder]);

    useEffect(() => {
        const totalReviewed = allOrders
            .flatMap(order => order.purchaseOrderDetails || [])
            .filter(detail => detail.review).length;

        setTotalReviewedProducts(totalReviewed);
    }, [allOrders]);


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

    // Mở modal kiểm kê chất lượng
    const QualityCheckOpen = (purchaseOrder) => {
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
        setIsQualityCheckOpen(true);
    };

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
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'history' && (
                    <div>
                        <div className="flex">
                            <h2 className="text-2xl font-bold mb-4">Lịch sử giao dịch</h2>

                            <h5 className="ml-auto text-lg font-semibold">
                                <h5>
                                    Tổng sản phẩm lỗi: {totalReviewedProducts} (Tỷ lệ {((totalReviewedProducts / totalProduct) * 100).toFixed(5)}%)
                                </h5>

                            </h5>


                        </div>
                        <div className="space-y-4">
                            {/* Item List */}
                            {purchaseOrder?.data?.map((purchaseOrder, index) => {
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
                                                    onClick={() => QualityCheckOpen(purchaseOrder)}
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
            </main>

            <Footer />

            {/* Modals */}
            <OrderDetailModal isOpen={isOrderDetailOpen} onClose={() => setIsOrderDetailOpen(false)} purchaseOrderDetail={purchaseOrderDetail} medicines={medicines} categorys={categorys} />
            <QualityCheckModal isOpen={isQualityCheckOpen} onClose={() => setIsQualityCheckOpen(false)} purchaseOrderDetail={purchaseOrderDetail} medicines={medicines} categorys={categorys} purchaseOrder={purchaseOrder} currentPage={currentPage} pageSize={pageSize} />
        </div>
    );
}

// Modal Chi tiết đơn hàng
const OrderDetailModal = ({ isOpen, onClose, purchaseOrderDetail, medicines, categorys }) => {

    if (!isOpen) return null;

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

const QualityCheckModal = ({ isOpen, onClose, purchaseOrderDetail, medicines, categorys, purchaseOrder, currentPage, pageSize }) => {
    const [isCategorySelected, setIsCategorySelected] = useState(true);
    const [isMedicineSelected, setIsMedicineSelected] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [categoryReviewType, setCategoryReviewType] = useState('');
    const [medicineReviewType, setMedicineReviewType] = useState('');
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const dispatch = useDispatch();

    const resetForm = () => {
        setIsCategorySelected(true);
        setIsMedicineSelected(false);
        setSelectedCategory('');
        setSelectedMedicine('');
        setCategoryReviewType('');
        setMedicineReviewType('');
        setFilteredMedicines([]);
    };


    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        setSelectedMedicine('');
        const medicinesInCategory = medicines.filter(med =>
            med.categories.some(cat => cat.id.toString() === value.toString())
        );
        setFilteredMedicines(medicinesInCategory);
    };

    const handleSubmitReview = async () => {
        const isReviewByCategory = isCategorySelected;
        const reviewType = isReviewByCategory ? categoryReviewType : medicineReviewType;

        // Validation
        if (isReviewByCategory) {
            if (!selectedCategory) {
                showToast("Vui lòng chọn danh mục cần đánh giá!", 'error');
                return;
            }
            if (!reviewType) {
                showToast("Vui lòng chọn loại đánh giá!", 'error');
                return;
            }
        } else {
            if (!selectedCategory || !selectedMedicine) {
                showToast("Vui lòng chọn danh mục và thuốc cần đánh giá!", 'error');
                return;
            }
            if (!reviewType) {
                showToast("Vui lòng chọn loại đánh giá!", 'error');
                return;
            }
        }

        const reviewData = {
            category: isCategorySelected ? selectedCategory : null,
            medicine: isMedicineSelected ? selectedMedicine : null,
            review: reviewType,
        };

        try {
            await fetch(`http://localhost:8888/api/v1/purchase-order/${purchaseOrderDetail[0]?.purchaseOrderId}/review`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData),
            });

            showToast("Thêm đánh giá thành công!", 'success');

            dispatch(fetchPurchaseOrders({ page: currentPage, size: pageSize, sortBy: 'orderDate', sortName: 'desc' }));
            resetForm();
            onClose();
        } catch (error) {
            console.error('Lỗi khi thêm đánh giá:', error);
        }
    };

    if (!isOpen) return null;

    const categoryOptions = Array.from(new Set(purchaseOrderDetail.map(detail => detail.category)))
        .map(id => categorys.find(cat => cat.id === id))
        .filter(Boolean);

    const handlePrintFile = () => {
        const tableBody = [];

        // Header
        tableBody.push([
            { text: "Sản phẩm", style: "tableHeader" },
            { text: "Danh mục", style: "tableHeader" },
            { text: "Chú thích", style: "tableHeader" }
        ]);

        purchaseOrderDetail.forEach(detail => {
            if (detail.review) {
                const med = medicines.find(m => m.id === detail.medicine);
                const cat = categorys.find(c => c.id === detail.category);
                tableBody.push([
                    med?.name || "Không rõ",
                    cat?.title || "Không rõ",
                    detail.review
                ]);
            }
        });

        const docDefinition = {
            content: [
                { text: "Phiếu kiểm kê chất lượng", style: "header" },
                {
                    table: {
                        headerRows: 1,
                        widths: ["*", "*", "*"],
                        body: tableBody
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: "white",
                    fillColor: "#1976d2", // màu xanh header
                    alignment: "center"
                }
            },
            defaultStyle: {
                font: "Roboto"
            }
        };

        pdfMake.createPdf(docDefinition).download("kiem-ke-chat-luong.pdf");
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-2/3 max-w-4xl relative">
                <h3 className="text-2xl font-bold mb-4">Kiểm kê chất lượng</h3>

                <button className="mb-4 bg-green-500 text-white py-2 px-4 rounded-lg" onClick={handlePrintFile}
                >
                    In file
                </button>

                <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                    {purchaseOrderDetail.map((detail, idx) => {
                        const med = medicines.find(m => m.id === detail.medicine);
                        const cat = categorys.find(c => c.id === detail.category);
                        if (!detail.review) return null;
                        return (
                            <div key={idx} className="bg-gray-100 p-4 rounded-lg mb-4">
                                <p><strong>Sản phẩm hỏng:</strong> {med?.name || 'Không rõ'}</p>
                                <p><strong>Danh mục:</strong> {cat?.title || 'Không rõ'}</p>
                                <p><strong>Chú thích:</strong> {detail.review}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4">
                    <h4 className="font-semibold">Thêm đánh giá</h4>

                    <div className="flex space-x-4 mb-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="category"
                                checked={isCategorySelected}
                                onChange={() => {
                                    setIsCategorySelected(true);
                                    setIsMedicineSelected(false);
                                    setSelectedMedicine('');
                                    setMedicineReviewType('');
                                    setFilteredMedicines([]);
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
                                    setCategoryReviewType('');
                                    setFilteredMedicines([]);
                                }}
                                className="mr-2"
                            />
                            <label htmlFor="medicine">Đánh giá theo từng thuốc</label>
                        </div>
                    </div>

                    {isCategorySelected && (
                        <div className="flex space-x-4 mb-4">
                            <div className="w-1/2">
                                <label className="block">Danh mục thuốc</label>
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categoryOptions.map((cat, i) => (
                                        <option key={i} value={cat.id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label className="block">Loại</label>
                                <select
                                    value={categoryReviewType}
                                    onChange={(e) => setCategoryReviewType(e.target.value)}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Chọn loại</option>
                                    <option value="Hư hỏng">Hư hỏng</option>
                                    <option value="Hết hạn">Hết hạn</option>
                                    <option value="Không đảm bảo chất lượng">Không đảm bảo chất lượng</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {isMedicineSelected && (
                        <div className="flex space-x-4 mb-4">
                            <div className="w-1/3">
                                <label className="block">Danh mục thuốc</label>
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categoryOptions.map((cat, i) => (
                                        <option key={i} value={cat.id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-1/3">
                                <label className="block">Thuốc</label>
                                <select
                                    value={selectedMedicine}
                                    onChange={(e) => setSelectedMedicine(e.target.value)}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Chọn thuốc</option>
                                    {filteredMedicines.map((med, i) => (
                                        <option key={i} value={med.id}>{med.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-1/3">
                                <label className="block">Loại</label>
                                <select
                                    value={medicineReviewType}
                                    onChange={(e) => setMedicineReviewType(e.target.value)}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Chọn loại</option>
                                    <option value="Hư hỏng">Hư hỏng</option>
                                    <option value="Hết hạn">Hết hạn</option>
                                    <option value="Không đảm bảo chất lượng">Không đảm bảo chất lượng</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={handleSubmitReview}>
                            Thêm đánh giá kiểm tra
                        </button>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button className="bg-red-500 text-white py-2 px-4 rounded-lg" onClick={() => { resetForm(); onClose(); }}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default QualityCheckModal;


