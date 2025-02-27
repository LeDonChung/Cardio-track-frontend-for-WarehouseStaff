import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ReportPage = () => {
    const [selectedReport, setSelectedReport] = useState('inventory');
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [sortBy, setSortBy] = useState(false);

    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Lượng hàng nhập',
                data: [50, 60, 70, 80, 90, 100, 110],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Lượng hàng xuất',
                data: [40, 55, 65, 75, 85, 95, 105],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Báo cáo thống kê'
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                position: 'top',
            }
        }
    };

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <div className="flex">
                {/* Thanh menu bên trái */}
                <div className="w-1/4 p-4 bg-gray-100">
                    <h2 className="text-xl font-bold mb-4">Báo cáo</h2>
                    <ul className="space-y-4">
                        <li>
                            <button
                                onClick={() => setSelectedReport('inventory')}
                                className={`w-full text-left px-4 py-2 ${selectedReport === 'inventory' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Lượng hàng nhập
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSelectedReport('export')}
                                className={`w-full text-left px-4 py-2 ${selectedReport === 'export' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Lượng hàng xuất
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSelectedReport('supplier')}
                                className={`w-full text-left px-4 py-2 ${selectedReport === 'supplier' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Thống kê nhà cung cấp
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSelectedReport('staff')}
                                className={`w-full text-left px-4 py-2 ${selectedReport === 'staff' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Thống kê nhân sự
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Phần bên phải: Biểu đồ và các mục thống kê */}
                <div className="w-3/4 p-4">
                    {/* Chọn khoảng thời gian (Tuần, Tháng, Năm) */}
                    <div className="mb-4 flex justify-between items-center">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setSelectedPeriod('week')}
                                className={`px-4 py-2 rounded ${selectedPeriod === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Tuần
                            </button>
                            <button
                                onClick={() => setSelectedPeriod('month')}
                                className={`px-4 py-2 rounded ${selectedPeriod === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Tháng
                            </button>
                            <button
                                onClick={() => setSelectedPeriod('year')}
                                className={`px-4 py-2 rounded ${selectedPeriod === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Năm
                            </button>
                        </div>

                        {/* Checkbox để sắp xếp */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="sort-by"
                                checked={sortBy}
                                onChange={() => setSortBy(!sortBy)}
                                className="form-checkbox h-5 w-5"
                            />
                            <label htmlFor="sort-by">Sắp xếp theo số lượng</label>
                        </div>
                    </div>

                    {/* Biểu đồ thống kê */}
                    <div className="mb-6">
                        <Bar data={data} options={options} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
