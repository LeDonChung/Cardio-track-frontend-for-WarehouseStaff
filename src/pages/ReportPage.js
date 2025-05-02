import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ChartDataLabels);


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const reportLabels = {
    order_purchase: 'Đơn mua hàng',
    import: 'Đơn nhập',
    count_import: 'Số lượng thuốc nhập',
    supplier: 'Nhà cung cấp',
    medicine_status: 'Trạng thái thuốc',
};

export const ReportPage = () => {
    const [reportData, setReportData] = useState({
        week: [],
        month: [],
        year: [],
        cancelWeek: [],
        cancelMonth: [],
        cancelYear: []
    });

    const [selectedReport, setSelectedReport] = useState('import');
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [sortBy, setSortBy] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let urls = [];

            if (selectedReport === 'order_purchase') {
                urls = [
                    'http://localhost:8888/api/v1/report-order/count-week',
                    'http://localhost:8888/api/v1/report-order/count-month',
                    'http://localhost:8888/api/v1/report-order/count-year',
                    'http://localhost:8888/api/v1/report-order/count-cancelled-week',
                    'http://localhost:8888/api/v1/report-order/count-cancelled-month',
                    'http://localhost:8888/api/v1/report-order/count-cancelled-year'
                ];
            } else if (selectedReport === 'import') {
                urls = [
                    'http://localhost:8888/api/v1/report-import/count-week',
                    'http://localhost:8888/api/v1/report-import/count-month',
                    'http://localhost:8888/api/v1/report-import/count-year',
                    'http://localhost:8888/api/v1/report-import/count-cancelled-week',
                    'http://localhost:8888/api/v1/report-import/count-cancelled-month',
                    'http://localhost:8888/api/v1/report-import/count-cancelled-year'
                ];
            } else if (selectedReport === 'count_import') {
                urls = [
                    'http://localhost:8888/api/v1/report-medicine-import/count-week',
                    'http://localhost:8888/api/v1/report-medicine-import/count-month',
                    'http://localhost:8888/api/v1/report-medicine-import/count-year'
                ];
            } else if (selectedReport === 'supplier') {
                urls = [
                    'http://localhost:8888/api/v1/report-order/count-medicine-import-by-supplier',
                    'http://localhost:8888/api/v1/report-order/count-cancelled-by-supplier'
                ];
            } else if (selectedReport === 'medicine_status') {
                urls = [
                    'http://localhost:8888/api/v1/report-medicine-status/count-medicine-status-by-expiration-date'
                ];
            }

            try {
                const responses = await Promise.all(urls.map(url => fetch(url)));
                const data = await Promise.all(responses.map(res => res.json()));

                if (selectedReport === 'supplier') {
                    setReportData({
                        week: data[0],
                        // month: data[1],
                        year: [],
                        cancelWeek: [],
                        cancelMonth: [],
                        cancelYear: []
                    });
                }

                if (selectedReport === 'count_import') {
                    setReportData({
                        week: data[0],
                        month: data[1],
                        year: data[2],
                        cancelWeek: [],
                        cancelMonth: [],
                        cancelYear: []
                    });
                } else {
                    setReportData({
                        week: data[0],
                        month: data[1],
                        year: data[2],
                        cancelWeek: data[3],
                        cancelMonth: data[4],
                        cancelYear: data[5]
                    });
                }
            } catch (error) {
                console.error('Lỗi khi fetch dữ liệu:', error);
            }
        };

        fetchData();
    }, [selectedReport]);

    const getChartData = () => {
        let rawData = reportData[selectedPeriod] || [];
        let cancelData = reportData[`cancel${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}`] || [];

        if (sortBy) {
            rawData = [...rawData].sort((a, b) => {
                const aCount = selectedPeriod === 'year' ? a[1] : a[2];
                const bCount = selectedPeriod === 'year' ? b[1] : b[2];
                return bCount - aCount;
            });
        }

        let labels = [], importCounts = [], cancelCounts = [];

        if (selectedPeriod === 'week' || selectedPeriod === 'month') {
            labels = rawData.map(([year, value]) => selectedPeriod === 'week' ? `Tuần ${value}/${year}` : `Tháng ${value}/${year}`);
            importCounts = rawData.map(item => item[2] ?? item[1]);
            cancelCounts = cancelData.map(item => item[2] ?? 0);
        } else if (selectedPeriod === 'year') {
            labels = rawData.map(([year]) => `${year}`);
            importCounts = rawData.map(item => item[1] ?? 0);
            cancelCounts = cancelData.map(item => item[1] ?? 0);
        }

        if (selectedReport === 'supplier') {
            const importData = reportData.week || [];
            const cancelData = reportData.month || [];

            const supplierNames = importData.map(item => item[0]);
            const importCounts = importData.map(item => item[1]);

            const cancelCounts = supplierNames.map(name => {
                const match = cancelData.find(c => c[0] === name);
                return match ? match[1] : 0;
            });

            return {
                labels: supplierNames,
                datasets: [
                    {
                        label: 'Số lượng thuốc đã cung cấp',
                        data: importCounts,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Số lượng thuốc bị đổi trả',
                        data: cancelCounts,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Màu đỏ nhạt
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }
                ]
            };
        } else if (selectedReport === 'count_import') {
            return {
                labels,
                datasets: [
                    {
                        label: reportLabels[selectedReport] || 'Không xác định',
                        data: importCounts,
                        backgroundColor: 'rgba(0, 0, 255, 0.5)', // Màu xanh đậm nhạt
                        borderColor: 'rgba(0, 0, 255, 1)',

                        borderWidth: 1,
                    }
                ]
            };

        } else if (selectedReport === 'medicine_status') {
            const statusData = reportData.week || [];

            const labels = statusData.map(item => item[0]); // ["Còn hạn", "Gần hết hạn", "Hết hạn"]
            const quantities = statusData.map(item => item[1]); // [88221, 2188, 69]

            return {
                labels,
                datasets: [
                    {
                        label: 'Số lượng thuốc theo tình trạng',
                        data: quantities,
                        backgroundColor: [
                            'rgba(46, 204, 113, 0.6)',   // Còn hạn - Xanh lá đậm 
                            'rgba(255, 206, 86, 0.6)',   // Gần hết hạn - Vàng sáng
                            'rgba(231, 76, 60, 0.6)'     // Hết hạn - Đỏ tươi
                        ],
                        borderColor: [
                            'rgba(46, 204, 113, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(231, 76, 60, 1)'
                        ],
                        borderWidth: 1,
                    }
                ]
            };
        }
        else {
            return {
                labels,
                datasets: [
                    {
                        label: reportLabels[selectedReport] || 'Không xác định',
                        data: importCounts,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    ...(selectedReport !== 'count_import' ? [{
                        label: 'Đơn bị hủy',
                        data: cancelCounts,
                        backgroundColor: 'rgba(255, 159, 64, 0.5)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1,
                    }] : [])
                ]
            };
        }
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Báo cáo thống kê ${reportLabels[selectedReport] || 'dữ liệu'}${(selectedReport !== 'count_import' && selectedReport !== 'medicine_status') ? ' & bị huỷ' : ''}`,
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: {
                    bottom: 10
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                position: 'top',
            },
            datalabels: (selectedReport === 'medicine_status')
                ? {
                    anchor: 'end',
                    align: 'top',
                    formatter: value => value,
                    color: '#000',
                    font: {
                        weight: 'bold'
                    }
                }
                : {
                    display: false // <== tắt hẳn datalabels ở tab khác
                }
        }
    };


    return (
        <div className="bg-white text-gray-900">
            <Header />
            <div className="flex mb-64">
                {/* Sidebar */}
                <div className="w-1/4 p-4 bg-gray-100">
                    <h2 className="text-xl font-bold mb-4">Báo cáo</h2>
                    <ul className="space-y-4">
                        {['import', 'order_purchase', 'count_import', 'supplier', 'medicine_status'].map(report => (
                            <li key={report}>
                                <button
                                    onClick={() => setSelectedReport(report)}
                                    className={`w-full text-left px-4 py-2 ${selectedReport === report ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {reportLabels[report]}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content */}
                <div className="w-3/4 p-4">
                    <div className="mb-4 flex justify-between items-center">
                        {selectedReport !== 'supplier' && selectedReport !== 'medicine_status' && (
                            <div className="flex space-x-4">
                                {['week', 'month', 'year'].map(period => (
                                    <button
                                        key={period}
                                        onClick={() => setSelectedPeriod(period)}
                                        className={`px-4 py-2 rounded ${selectedPeriod === period ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {period === 'week' ? 'Tuần' : period === 'month' ? 'Tháng' : 'Năm'}
                                    </button>
                                ))}
                            </div>
                        )}

                        {selectedReport !== 'supplier' && selectedReport !== 'medicine_status' && (
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
                        )}
                    </div>

                    <div className="mb-6">
                        <Bar data={getChartData()} options={options} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
