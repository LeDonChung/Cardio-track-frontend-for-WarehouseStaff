import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { fetchShelfs } from "../redux/slice/ShelfSlice";
import { ShelfModal } from "../components/ShelfModal";

export const InventoryLocationPage = () => {
    const dispatch = useDispatch();
    const shelfState = useSelector((state) => state.shelf) || {};
    const { shelves = [], totalPages = 1 } = shelfState;
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedShelf, setSelectedShelf] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchShelfs({ page: page - 1, size: 10, sortBy: "id", sortName: "asc", location: search || null }))
            .then((response) => {
                console.log("Dữ liệu lấy từ API:", response.payload);
            });
    }, [dispatch, page, search]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    const openModal = (shelf = null) => {
        setSelectedShelf(shelf);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedShelf(null);
    };

    return (
        <div className="bg-white text-gray-900 min-h-screen">
            <Header />
            <main className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Danh Sách Vị Trí Kho</h1>
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm vị trí..."
                        className="border p-2 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white p-2"
                        onClick={() => openModal()}
                    >
                        Thêm Vị Trí
                    </button>
                </div>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-left">ID</th>
                            <th className="border p-2 text-left">Vị trí</th>
                            <th className="border p-2 text-right">Số lượng</th>
                            <th className="border p-2 text-right">Sức chứa</th>
                            <th className="border p-2 text-left">Trạng thái</th>
                            <th className="border p-2 text-left">Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shelves.map((loc) => (
                            <tr
                                key={loc.id}
                                className="border cursor-pointer"
                                onClick={() => openModal(loc)}
                            >
                                <td className="border p-2">{loc.id}</td>
                                <td className="border p-2">{loc.location}</td>
                                <td className="border p-2 text-right">{loc.totalProduct}</td>
                                <td className="border p-2 text-right">{loc.capacity}</td>
                                <td className="border p-2">
                                    {loc.status === 'FULL' ? 'Đã đầy' : loc.status === 'EMPTY' ? 'Còn trống' : 'Không xác định'}
                                </td>
                                <td className="border p-2">{loc.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    <button
                        className={`px-4 py-2 bg-gray-300 rounded mx-2 ${page <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        Trước
                    </button>
                    <span>
                        Trang {page} / {totalPages}
                    </span>
                    <button
                        className={`px-4 py-2 bg-gray-300 rounded mx-2 ${page >= totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Sau
                    </button>
                </div>
            </main>
            {modalOpen && (
                <ShelfModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    shelf={selectedShelf}
                />
            )}
            {/* <Footer /> */}
        </div>
    );
};
