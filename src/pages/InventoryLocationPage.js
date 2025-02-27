import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const InventoryLocationPage = () => {
    const [locations, setLocations] = useState([
        { id: 1, location: 'Kệ A1', quantity: 100, status: 'available', notes: 'Dùng cho thuốc kháng sinh', medicines: [{ name: 'Paracetamol', quantity: 50 }, { name: 'Amoxicillin', quantity: 50 }] },
        { id: 2, location: 'Kệ B2', quantity: 50, status: 'full', notes: 'Chứa vitamin và thực phẩm chức năng', medicines: [{ name: 'Vitamin C', quantity: 30 }, { name: 'Omega-3', quantity: 20 }] },
        { id: 3, location: 'Kệ C3', quantity: 75, status: 'available', notes: 'Thuốc giảm đau', medicines: [{ name: 'Ibuprofen', quantity: 40 }, { name: 'Aspirin', quantity: 35 }] },
        { id: 4, location: 'Kệ D4', quantity: 120, status: 'full', notes: 'Thuốc cảm cúm', medicines: [{ name: 'Decolgen', quantity: 60 }, { name: 'Tiffy', quantity: 60 }] },
        { id: 5, location: 'Kệ E5', quantity: 90, status: 'available', notes: 'Kháng sinh phổ rộng', medicines: [{ name: 'Ciprofloxacin', quantity: 45 }, { name: 'Azithromycin', quantity: 45 }] },
        { id: 6, location: 'Kệ F6', quantity: 110, status: 'full', notes: 'Dành cho thuốc huyết áp', medicines: [{ name: 'Losartan', quantity: 55 }, { name: 'Amlodipine', quantity: 55 }] },
        { id: 7, location: 'Kệ G7', quantity: 80, status: 'available', notes: 'Thuốc tiểu đường', medicines: [{ name: 'Metformin', quantity: 40 }, { name: 'Insulin', quantity: 40 }] },
        { id: 8, location: 'Kệ H8', quantity: 95, status: 'available', notes: 'Thuốc tim mạch', medicines: [{ name: 'Aspirin', quantity: 50 }, { name: 'Clopidogrel', quantity: 45 }] },
        { id: 9, location: 'Kệ I9', quantity: 60, status: 'maintenance', notes: 'Đang bảo trì', medicines: [] },
        { id: 10, location: 'Kệ J10', quantity: 70, status: 'available', notes: 'Dành cho thuốc kháng viêm', medicines: [{ name: 'Prednisone', quantity: 35 }, { name: 'Dexamethasone', quantity: 35 }] },
    ]);
    
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("id");
    const [modalData, setModalData] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ id: '', location: '', quantity: '', status: 'available', notes: '' });

    const handleSave = () => {
        if (formData.id) {
            setLocations(locations.map(loc => loc.id === formData.id ? formData : loc));
        } else {
            const newId = locations.length > 0 ? Math.max(...locations.map(loc => loc.id)) + 1 : 1;
            setLocations([...locations, { ...formData, id: newId, medicines: [] }]);
        }
        setModalData(null);
        setIsAdding(false);
    };

    const filteredLocations = locations
        .filter(loc => loc.location.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortKey === 'id') return a.id - b.id;
            if (sortKey === 'quantity') return a.quantity - b.quantity;
            if (sortKey === 'status') return a.status.localeCompare(b.status);
            return 0;
        });

    return (
        <div className="bg-white text-gray-900 min-h-screen">
            <Header />
            <main className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Danh Sách Vị Trí Kho</h1>
                <div className="mb-4 flex gap-2">
                    <input type="text" placeholder="Tìm kiếm vị trí..." className="border p-2 w-full" onChange={e => setSearch(e.target.value)} />
                    <select className="border p-2" onChange={e => setSortKey(e.target.value)}>
                        <option value="id">Sắp xếp theo ID</option>
                        <option value="quantity">Sắp xếp theo Số lượng</option>
                        <option value="status">Sắp xếp theo Trạng thái</option>
                    </select>
                    <button className="bg-blue-500 text-white p-2" onClick={() => { setIsAdding(true); setFormData({ id: '', location: '', quantity: '', status: 'available', notes: '' }); }}>
                        Thêm Vị Trí
                    </button>
                </div>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Vị trí</th>
                            <th className="border p-2">Số lượng</th>
                            <th className="border p-2">Trạng thái</th>
                            <th className="border p-2">Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLocations.map((loc) => (
                            <tr key={loc.id} className="border cursor-pointer" onClick={() => { setModalData(loc); setFormData(loc); }}>
                                <td className="border p-2">{loc.id}</td>
                                <td className="border p-2">{loc.location}</td>
                                <td className="border p-2">{loc.quantity}</td>
                                <td className="border p-2">{loc.status}</td>
                                <td className="border p-2">{loc.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isAdding && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <h2 className="text-lg font-bold mb-2">Thêm Vị Trí</h2>
                            <input type="text" placeholder="Vị trí" className="border p-2 w-full mb-2" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            <input type="number" placeholder="Số lượng" className="border p-2 w-full mb-2" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} />
                            <select className="border p-2 w-full mb-2" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="available">Available</option>
                                <option value="full">Full</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                            <textarea placeholder="Ghi chú" className="border p-2 w-full mb-2" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
                            <button className="bg-green-500 text-white p-2 mr-2" onClick={handleSave}>Lưu</button>
                            <button className="bg-gray-500 text-white p-2" onClick={() => setIsAdding(false)}>Hủy</button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};
