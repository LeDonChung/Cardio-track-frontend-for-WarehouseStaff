import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventoryImports } from '../redux/slice/InventoryImportSlice'; // Import Redux slice
import { fetchInventoryImportsByPendingStatus } from '../redux/slice/InventoryImportSlice';
import { createInventoryImport } from '../redux/slice/InventoryImportSlice';
import { fetchInventoryImportById } from '../redux/slice/InventoryImportDetailSlice';
import { fetchPurchaseOrderByPendingStatus } from '../redux/slice/PurchaseOrderSlice';
import { fetchPurchaseOrderDetailById } from '../redux/slice/PurchaseOrderDetailSlice';
import { ChangeStatusPurchaseOrder } from '../redux/slice/PurchaseOrderSlice';
import '@fortawesome/fontawesome-free/css/all.min.css';
import showToast from "../utils/AppUtils";
import { fetchMedicineById_client } from '../redux/slice/MedicineSlice';
import { fetchCategoryById_client } from '../redux/slice/CategorySlice';
import { fetchShelfs } from '../redux/slice/ShelfSlice';
import { useLocation } from 'react-router-dom';
import { updateShelfQuantity } from '../redux/slice/ShelfSlice';
import { updateInventoryImportStatus } from '../redux/slice/InventoryImportSlice';
import { createInventoryDetail } from '../redux/slice/InventoryDetailSlice';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


export const InventoryImportPage = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedShelf, setSelectedShelf] = useState(null);
    const [selectedOrderPurchare, setSelectedOrderPurchare] = useState(null);
    const [showPurchaseOrderModal, setShowPurchaseOrderModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [shelfForProduct, setShelfForProduct] = useState({});
    const [isChecked, setIsChecked] = useState("all");

    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location]);

    // State để theo dõi trang hiện tại và số lượng item mỗi trang
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    // Lấy dữ liệu từ Redux state
    const { inventoryImport = [], loading, error } = useSelector((state) => state.inventoryImport || {});
    const { inventoryImportDetail = [], loading: detailLoading, error: detailError } = useSelector((state) => state.inventoryImportDetail || {});
    const { purchaseOrderByPendingStatus = [], loading: orderPendingLoading, error: orderPendingError } = useSelector((state) => state.purchaseOrderByPendingStatus);
    const { purchaseOrderDetail = [], loading: purchaseDetailLoading, error: purchaseDetailLoadingError } = useSelector((state) => state.purchaseOrderDetail || {});
    const { inventoryDetail = [] } = useSelector((state) => state.inventoryDetail || {});
    const { medicines } = useSelector((state) => state.medicine);
    const { categorys } = useSelector((state) => state.categorys);
    const { shelves = [] } = useSelector((state) => state.shelf);


    // Gửi yêu cầu API khi trang thay đổi
    useEffect(() => {
        if (isChecked === 'all') {
            dispatch(fetchInventoryImports({ page: currentPage, size: pageSize, sortBy: 'importDate', sortName: 'desc' }));
        } else if (isChecked === 'pending') {
            dispatch(fetchInventoryImportsByPendingStatus({ page: currentPage, size: pageSize, sortBy: 'importDate', sortName: 'desc' }));
        }
    }, [dispatch, currentPage, isChecked]);

    useEffect(() => {
        if (activeTab === 'purchare-order') {
            dispatch(fetchPurchaseOrderByPendingStatus({ page: 0, size: 1000, sortBy: 'id', sortName: 'desc' }));  // Lấy dữ liệu khi tab được chọn
        }
    }, [activeTab, dispatch]);

    useEffect(() => {
        dispatch(fetchPurchaseOrderByPendingStatus({ page: 0, size: 1000, sortBy: 'orderDate', sortName: 'desc' }));
    }, [purchaseOrderByPendingStatus]);  // Log dữ liệu sau khi đã lấy xong

    useEffect(() => {
        dispatch(fetchShelfs({ page: 0, size: 10000, sortBy: "notes", sortName: "asc" }));
    }, [dispatch]);



    // Handle cancel order with confirmation
    const handleCancelOrder = (orderId, event) => {
        event.stopPropagation();
        const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy đơn mua này?");
        if (confirmCancel) {
            const status = "CANCELED";
            dispatch(ChangeStatusPurchaseOrder({ id: orderId, status }))
                .then(() => {
                    // Sau khi hủy thành công, tải lại danh sách đơn hàng
                    dispatch(fetchPurchaseOrderByPendingStatus());
                    showToast("Đơn mua đã bị hủy.", 'success');
                })
                .catch(() => {
                    showToast("Đã có lỗi xảy ra khi hủy đơn.", 'error');
                });
        }
    };

    // Hàm nhập kho
    const importToWarehouse = (order, event) => {
        event.stopPropagation();

        const confirmCancel = window.confirm("Bạn có chắc chắn muốn xác nhận đơn mua này?");
        if (confirmCancel) {
            const status = "APPROVED";

            // Đổi trạng thái đơn hàng thành APPROVED
            dispatch(ChangeStatusPurchaseOrder({ id: order.id, status }))
                .then(() => {
                    // Sau khi duyệt đơn mua thành công, tạo đơn nhập kho
                    dispatch(createInventoryImport(order))
                        .then(() => {
                            dispatch(fetchInventoryImports({ page: currentPage, size: pageSize, sortBy: 'importDate', sortName: 'desc' }));
                            showToast("Đơn mua đã được xác nhận để chờ nhập kho.", 'success');
                        })
                        .catch((error) => {
                            console.error("Lỗi khi tạo đơn nhập kho:", error);
                            showToast("Đã có lỗi xảy ra khi tạo đơn nhập kho.", 'error');
                        });
                })
                .catch(() => {
                    showToast("Đã có lỗi xảy ra khi xác nhận đơn.", 'error');
                });
        }
    };



    // Hàm chuyển sang trang tiếp theo
    const nextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    // Hàm chuyển về trang trước đó
    const prevPage = () => {
        setCurrentPage(prevPage => (prevPage > 0 ? prevPage - 1 : 0));
    };

    // Hàm mở modal chi tiết đơn nhập
    const openModal = (order) => {
        setSelectedOrder(order);
        dispatch(fetchInventoryImportById(order.id)); // Fetch chi tiết đơn nhập
        order.inventoryImportDetails.forEach((detail) => {
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
        setShowModal(true);
    };

    // Hàm đóng modal chi tiết đơn nhập
    const closeModal = () => {
        setShowModal(false);
        setShowImportModal(false);
        setSelectedOrder(null);
    };

    //Mở modal nhập hàng
    const openModalImport = (order, event) => {
        event.stopPropagation();
        setSelectedOrder(order);
        dispatch(fetchInventoryImportById(order.id)); // Fetch chi tiết đơn nhập
        order.inventoryImportDetails.forEach((detail) => {
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
        setShowImportModal(true);
    };

    const handleSubmitImport = () => {
        const shelfs = Object.keys(shelfForProduct).map(productId => ({
            medincineId: shelfForProduct[productId]?.thuocId,
            quantity: shelfForProduct[productId]?.quantity,
            shelfId: shelfForProduct[productId]?.shelfId,
        }));

        // Kiểm tra xem đã chọn đầy đủ kệ cho tất cả các sản phẩm chưa
        if (shelfs.length !== inventoryImportDetail.length) {
            showToast("Bạn chưa chọn đủ kệ cho tất cả các thuốc.", "error");
            return;
        }

        const updatedInventoryDetails = inventoryImportDetail.map(detail => {
            const medicineStr = detail.medicine.toString();
            const matchingShelf = shelfs.find(item => item.medincineId.toString() === medicineStr);
            if (!matchingShelf) {
                console.error(`Không tìm thấy shelf cho sản phẩm ${detail.medicine}`);
            }
            return {
                ...detail,
                shelfId: matchingShelf?.shelfId,
            };
        });

        const confirmCancel = window.confirm("Bạn có chắc chắn về xử lý nhập kho này?");
        if (confirmCancel) {
            const status = "IMPORTED";

            // Đổi trạng thái đơn hàng thành IMPORTED
            dispatch(updateInventoryImportStatus({ id: selectedOrder.id, status }))
                .then(() => {
                    // Tạo chi tiết nhập kho
                    dispatch(createInventoryDetail(updatedInventoryDetails))
                        .then(() => {
                            shelfs.forEach(shelf => {
                                dispatch(updateShelfQuantity({
                                    id: shelf.shelfId,
                                    quantity: shelf.quantity
                                }))
                                    .then((response) => {
                                        console.log('Cập nhật thành công:', response);
                                    })
                                    .catch((error) => {
                                        console.error('Lỗi khi cập nhật kệ:', error);
                                        showToast("Đã có lỗi xảy ra khi cập nhật kệ.", 'error');
                                    });
                            });
                        })
                        .catch((error) => {
                            console.error("Lỗi khi tạo chi tiết nhập kho:", error);
                            showToast("Đã có lỗi xảy ra khi tạo chi tiết nhập kho.", 'error');
                        });
                })
                .catch((error) => {
                    console.error("Lỗi khi thay đổi trạng thái đơn nhập kho:", error);
                    showToast("Đã có lỗi xảy ra khi thay đổi trạng thái đơn nhập kho.", 'error');
                });
            window.location.reload()
            showToast('Nhập kho thành công', 'success');
            closeModal();
        }
    };



    // Hàm đóng modal chi tiết kệ
    const closeShelfDetails = () => {
        setSelectedShelf(null);
    };

    // Hàm mở chi tiết đơn mua
    const openOrderDetails = (order) => {
        setSelectedOrderPurchare(order);
        dispatch(fetchPurchaseOrderDetailById(order.id));  // Fetch chi tiết đơn mua
        setShowPurchaseOrderModal(true);
    };

    // Hàm đóng chi tiết đơn mua
    const closeOrderDetails = () => {
        setShowPurchaseOrderModal(false);
        setSelectedOrderPurchare(null);
    };

    const handleShelfChange = (e, productId, medicineId, quantity) => {
        const selectedShelfId = e.target.value;

        // Cập nhật kệ cho sản phẩm tương ứng
        setShelfForProduct(prevState => ({
            ...prevState,
            [productId]: {
                medicineId: productId,
                thuocId: medicineId,
                quantity: quantity,
                shelfId: selectedShelfId
            }
        }));
    };


    if (loading) return <div>Đang tải...</div>; // Hiển thị khi đang tải dữ liệu
    if (error) return <div>Lỗi: {error.message}</div>; // Hiển thị lỗi nếu có
    if (detailError) return <div>Lỗi: {detailError.message}</div>; // Hiển thị lỗi chi tiết nếu có

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
                            <div className="mb-4 flex justify-between">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo mã đơn hoặc tên nhà cung cấp..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md w-1/2"
                                />
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="orderFilter"
                                            checked={isChecked === 'all'}
                                            onChange={() => setIsChecked('all')}
                                            className="mr-1"
                                        />
                                        Tất cả
                                    </label>

                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="orderFilter"
                                            checked={isChecked === 'pending'}
                                            onChange={() => setIsChecked('pending')}
                                            className="mr-1"
                                        />
                                        Đơn đang xử lý
                                    </label>
                                </div>
                            </div>

                            {/* Bảng danh sách đơn nhập */}
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-left">Số thứ tự</th>
                                        <th className="border px-4 py-2 text-left">Mã đơn</th>
                                        <th className="border px-4 py-2 text-left">Nhà cung cấp</th>
                                        <th className="border px-4 py-2 text-left">Tình trạng</th>
                                        <th className="border px-4 py-2 text-left">Ngày nhập</th>
                                        <th className="border px-4 py-2 text-left">Người phụ trách</th>
                                        <th className="border px-4 py-2 text-left">Ghi chú</th>
                                        <th className="border px-4 py-2 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventoryImport.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">Không có đơn nào</td>
                                        </tr>
                                    ) : (
                                        inventoryImport.filter(o =>
                                            o.supplierName.toLowerCase().includes(search.toLowerCase()) ||
                                            o.id.toString() === search)
                                            // inventoryImport
                                            .map(order => (
                                                <tr className="hover:bg-gray-200 cursor-pointer" key={order.id} onClick={() => openModal(order)}>
                                                    <td className="border px-4 py-2">{inventoryImport.indexOf(order) + 1}</td>
                                                    <td className="border px-4 py-2">{order.id}</td>
                                                    <td className="border px-4 py-2">{order.supplierName}</td>
                                                    <td className="border px-4 py-2">{order.status}</td>
                                                    <td className="border px-4 py-2">{new Date(order.importDate).toLocaleDateString()}</td>
                                                    <td className="border px-4 py-2">{order.recipient}</td>
                                                    <td className="border px-4 py-2">{order.notes}</td>
                                                    <td className="border px-4 py-2 text-right">
                                                        {order.status === "PENDING" && (
                                                            <button
                                                                onClick={(event) => openModalImport(order, event)}
                                                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                                            >
                                                                Tiến hành nhập
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                    )}
                                </tbody>
                            </table>

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
                                            <th className="border px-4 py-2 text-left">Mã kệ</th>
                                            <th className="border px-4 py-2 text-left">Vị trí</th>
                                            <th className="border px-4 py-2 text-left">Số lượng sản phẩm</th>
                                            <th className="border px-4 py-2 text-left">Sức chứa</th>
                                            <th className="border px-4 py-2 text-left">Trạng thái</th>
                                            <th className="border px-4 py-2 text-right">Cập nhật</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shelves.map(shelf => (
                                            <tr key={shelf.shelf_id}>
                                                <td className="border px-4 py-2">{shelf.id}</td>
                                                <td className="border px-4 py-2">{shelf.location}</td>
                                                <td className="border px-4 py-2">{shelf.totalProduct}</td>
                                                <td className="border px-4 py-2">{shelf.capacity}</td>
                                                <td className="border px-4 py-2">{shelf.status}</td>
                                                <td className={`border px-4 py-2 text-right ${shelf.notes.includes('+') ? 'text-green-500 font-bold' : ''}`}>{shelf.notes}</td>
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
                                {purchaseOrderByPendingStatus.length === 0 ? (
                                    <div>Không có đơn mua lô thuốc nào.</div>
                                ) : (
                                    purchaseOrderByPendingStatus.map((order, index) => {
                                        // Chuyển đổi ngày giờ từ UTC sang múi giờ VN (UTC+7)
                                        const orderDateVN = new Date(order.orderDate).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
                                    
                                        return (
                                            <div key={index} className="border p-4 rounded-md shadow-md bg-gray-50 cursor-pointer hover:bg-gray-200" onClick={() => openOrderDetails(order)}>
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-semibold">Mã đơn: {order.id}</span>
                                                    <span className="text-sm text-gray-500">Ngày đặt: {orderDateVN}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Nhà cung cấp:</strong> {order.supplierName}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Tình trạng:</strong> Đang xử lý - {order.status}
                                                </div>
                                    
                                                {/* Nút nhập vào kho */}
                                                <button
                                                    onClick={(event) => importToWarehouse(order, event)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                                >
                                                    Xác nhận đơn mua
                                                </button>
                                    
                                                {/* Nút hủy đơn */}
                                                <button
                                                    onClick={(event) => handleCancelOrder(order.id, event)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                                                >
                                                    Hủy đơn
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
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
                        <h3 className="font-bold text-lg mb-4">Chi tiết đơn nhập - Mã đơn nhập: {selectedOrder.id}</h3>

                        {/* Kiểm tra trạng thái tải chi tiết */}
                        {detailLoading ? (
                            <div>Đang tải chi tiết...</div>
                        ) : inventoryImportDetail ? (
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-left">Mã đơn nhập</th>
                                        <th className="border px-4 py-2 text-left">Mã thuốc</th>
                                        <th className="border px-4 py-2 text-left">Danh mục</th>
                                        <th className="border px-4 py-2 text-left">Số lượng</th>
                                        <th className="border px-4 py-2 text-left">Giá</th>
                                        <th className="border px-4 py-2 text-left">Giảm giá</th>
                                        <th className="border px-4 py-2 text-left">Hạn sử dụng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventoryImportDetail.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-2 text-center">Không có sản phẩm</td>
                                        </tr>
                                    ) : (
                                        inventoryImportDetail.map((product, index) => {
                                            const medicineq = medicines.find(med => med.id === product.medicine);
                                            const category = categorys.find(cat => cat.id === product.category);
                                            return (
                                                <tr key={product.id}>
                                                    <td className="border px-4 py-2">{product.inventoryImportId}</td>
                                                    <td className="border px-4 py-2">{medicineq ? medicineq.name : 'Chưa có tên thuốc'}</td>
                                                    <td className="border px-4 py-2">{category ? category.title : 'Chưa có danh mục'}</td>
                                                    <td className="border px-4 py-2">{product.quantity}</td>
                                                    <td className="border px-4 py-2">{product.price.toLocaleString()} VND</td>
                                                    <td className="border px-4 py-2">{product.discount.toLocaleString()} VND</td>
                                                    <td className="border px-4 py-2">{product.expirationDate}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>

                            </table>
                        ) : (
                            <div>Không có chi tiết.</div>
                        )}

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

            {/* Modal nhập kho */}
            {showImportModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-2/3">
                        <h3 className="font-bold text-lg mb-4">Nhập hàng vào kho - Mã đơn nhập: {selectedOrder.id}</h3>

                        {/* Kiểm tra trạng thái tải chi tiết */}
                        {detailLoading ? (
                            <div>Đang tải chi tiết...</div>
                        ) : inventoryImportDetail ? (
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-left">Mã thuốc</th>
                                        <th className="border px-4 py-2 text-left">Danh mục</th>
                                        <th className="border px-4 py-2 text-left">Số lượng</th>
                                        <th className="border px-4 py-2 text-left">Chọn kệ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventoryImportDetail.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-2 text-center">Không có sản phẩm</td>
                                        </tr>
                                    ) : (
                                        inventoryImportDetail.map((product, index) => {
                                            const medicineq = medicines.find(med => med.id === product.medicine);
                                            const category = categorys.find(cat => cat.id === product.category);
                                            return (
                                                <tr key={product.id}>
                                                    <td className="border px-4 py-2">{medicineq ? medicineq.name : 'Chưa có tên thuốc'}</td>
                                                    <td className="border px-4 py-2">{category ? category.title : 'Chưa có danh mục'}</td>
                                                    <td className="border px-4 py-2">{product.quantity}</td>
                                                    <td className="border px-4 py-2">
                                                        {/* ComboBox chọn kệ */}
                                                        <select
                                                            value={shelfForProduct[product.id]?.shelfId || ''}
                                                            onChange={(e) => handleShelfChange(e, product.id, medicineq.id, product.quantity)}
                                                            className="w-full h-10 max-w-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        >
                                                            <option value="">Chọn kệ</option>
                                                            {shelves
                                                                .filter(shelf => (shelf.capacity - shelf.totalProduct) >= product.quantity) // Lọc kệ thỏa mãn điều kiện
                                                                .map(shelf => (
                                                                    <option key={shelf.id} value={shelf.id}>
                                                                        {shelf.location}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>

                            </table>
                        ) : (
                            <div>Không có chi tiết.</div>
                        )}

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleSubmitImport}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                            >
                                Xác nhận
                            </button>
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


            {/* Modal xem chi tiết đơn mua */}
            {showPurchaseOrderModal && selectedOrderPurchare && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-2/3">
                        <h3 className="font-bold text-lg mb-4">Chi tiết đơn mua - Mã đơn: {selectedOrderPurchare.id}</h3>

                        {/* Kiểm tra trạng thái tải chi tiết đơn mua */}
                        {purchaseDetailLoading ? (
                            <div>Đang tải chi tiết...</div>
                        ) : purchaseOrderDetail ? (
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-left">Mã thuốc</th>
                                        <th className="border px-4 py-2 text-left">Số lượng</th>
                                        <th className="border px-4 py-2 text-left">Giá</th>
                                        <th className="border px-4 py-2 text-left">Giảm giá</th>
                                        <th className="border px-4 py-2 text-left">Hạn sử dụng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrderDetail.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-2 text-center">Không có sản phẩm</td>
                                        </tr>
                                    ) : (
                                        purchaseOrderDetail.map((product) => (
                                            <tr key={product.id}>
                                                <td className="border px-4 py-2">{product.medicine}</td>
                                                <td className="border px-4 py-2">{product.quantity}</td>
                                                <td className="border px-4 py-2">{product.price.toLocaleString()} VND</td>
                                                <td className="border px-4 py-2">{product.discount.toLocaleString()} VND</td>
                                                <td className="border px-4 py-2">{product.expirationDate}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div>Không có chi tiết.</div>
                        )}

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
