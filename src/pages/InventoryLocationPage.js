import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const InventoryLocationPage = () => {
    const [locations, setLocations] = useState([
        { id: 1, location: 'Kệ A1', quantity: 100, status: 'available', notes: 'Dùng cho thuốc kháng sinh', medicines: [{ name: 'Paracetamol', quantity: 50 }, { name: 'Amoxicillin', quantity: 50 }] },
        { id: 2, location: 'Kệ B2', quantity: 50, status: 'full', notes: 'Chứa vitamin và thực phẩm chức năng', medicines: [{ name: 'Vitamin C', quantity: 30 }, { name: 'Omega-3', quantity: 20 }] }
    ]);
    
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("id");
    const [modalData, setModalData] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ id: '', location: '', quantity: '', status: 'available', notes: '', medicines: [] });

    const handleSave = () => {
        if (formData.id) {
            setLocations(locations.map(loc => loc.id === formData.id ? { ...formData, medicines: loc.medicines } : loc));
        } else {
            const newId = locations.length > 0 ? Math.max(...locations.map(loc => loc.id)) + 1 : 1;
            setLocations([...locations, { ...formData, id: newId, medicines: [] }]);
        }
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
                    <button className="bg-blue-500 text-white p-2" onClick={() => { 
                        setIsAdding(true); 
                        setFormData({ id: '', location: '', quantity: '', status: 'available', notes: '', medicines: [] }); 
                    }}>
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
                            <tr key={loc.id} className="border cursor-pointer" onClick={() => setModalData(loc)}>
                                <td className="border p-2">{loc.id}</td>
                                <td className="border p-2">{loc.location}</td>
                                <td className="border p-2">{loc.quantity}</td>
                                <td className="border p-2">{loc.status}</td>
                                <td className="border p-2">{loc.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {modalData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <h2 className="text-lg font-bold mb-2">Chi Tiết Vị Trí</h2>
                            <p><strong>Vị trí:</strong> {modalData.location}</p>
                            <p><strong>Số lượng:</strong> {modalData.quantity}</p>
                            <p><strong>Trạng thái:</strong> {modalData.status}</p>
                            <p><strong>Ghi chú:</strong> {modalData.notes}</p>
                            <h3 className="text-md font-bold mt-2">Danh sách thuốc:</h3>
                            <ul>
                                {modalData.medicines.map((med, index) => (
                                    <li key={index}>{med.name} - {med.quantity}</li>
                                ))}
                            </ul>
                            <button className="bg-gray-500 text-white p-2 mt-4" onClick={() => setModalData(null)}>Đóng</button>
                        </div>
                    </div>
                )}
                {isAdding && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <h2 className="text-lg font-bold mb-2">Thêm Vị Trí</h2>
                            <input type="text" placeholder="Vị trí" className="border p-2 w-full mb-2" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            <input type="number" placeholder="Số lượng" className="border p-2 w-full mb-2" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                            <input type="text" placeholder="Ghi chú" className="border p-2 w-full mb-2" value={formData.notes} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                            <button className="bg-green-500 text-white p-2" onClick={handleSave}>Lưu</button>
                            <button className="bg-gray-500 text-white p-2 ml-2" onClick={() => setIsAdding(false)}>Hủy</button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};