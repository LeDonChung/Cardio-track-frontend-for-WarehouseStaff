import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(null); // Quản lý trạng thái của submenu
    const navigate = useNavigate();

    const handlerActionLogout = () => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
        }

        navigate('/login');
    };

    const toggleSubMenu = (index) => {
        if (isSubMenuOpen === index) {
            setIsSubMenuOpen(null); // Nếu submenu đã mở, đóng lại
        } else {
            setIsSubMenuOpen(index); // Mở submenu
        }
    };

    return (
        <header className="bg-blue-600 p-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center ml-0">
                    <img
                        src="/logo/logo_90_90 1.png"
                        alt="Kho Quản Lý Logo"
                        className="h-10 w-10"
                    />
                    <span className="text-white text-lg font-bold ml-2">
                        QUẢN LÝ KHO
                        <br />
                        NHÀ THUỐC THERA CARE
                    </span>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="relative flex-grow ml-4 mr-32">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm, loại sản phẩm..."
                        className="p-2 rounded-full w-full pl-10"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                </div>

                {/* Menu đăng nhập/đăng xuất */}
                <div className="ml-auto">
                    {localStorage.getItem('token') ? (
                        <button className="text-white flex justify-between items-center" onClick={handlerActionLogout}>
                            <img
                                src="/icon/ic_user.png"
                                alt="User Icon"
                                className="h-10 w-10 mx-1"
                            />
                            Đăng xuất
                        </button>
                    ) : (
                        <button className="text-white flex justify-between items-center" onClick={() => navigate('/login')}>
                            <img
                                src="/icon/ic_user.png"
                                alt="User Icon"
                                className="h-10 w-10 mx-1"
                            />
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>

            {/* Thanh menu ngang */}
            <nav className="hidden md:flex space-x-4 mt-4 ml-4">
                {/* Trang chur */}
                <button
                    className="text-white p-2 hover:bg-blue-700 rounded"
                    onClick={() => navigate('/')}
                >
                    Home
                </button>


                {/* Quản lý kho */}
                <div className="relative">
                    <button
                        className="text-white p-2 hover:bg-blue-700 rounded"
                        onClick={() => toggleSubMenu(1)} // Gọi toggle cho submenu Quản lý kho
                    >
                        Quản lý kho
                    </button>
                    {isSubMenuOpen === 1 && (
                        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                            <ul className="space-y-2 p-2">
                                <li>
                                    <button
                                        className="w-full text-left p-2 text-gray-800 hover:bg-blue-100 rounded"
                                        onClick={() => navigate('/inventory-location')}
                                    >
                                        Phân bổ và vị trí
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className="w-full text-left p-2 text-gray-800 hover:bg-blue-100 rounded"
                                        onClick={() => navigate('/inventory-control')}
                                    >
                                        Kiểm soát tồn kho
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Nhập - xuất hàng */}
                <div className="relative">
                    <button
                        className="text-white p-2 hover:bg-blue-700 rounded"
                        onClick={() => toggleSubMenu(2)} // Gọi toggle cho submenu Nhập hàng
                    >
                        Nhập - xuất thuốc
                    </button>
                    {isSubMenuOpen === 2 && (
                        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                            <ul className="space-y-2 p-2">
                                <li>
                                    <button
                                        className="w-full text-left p-2 text-gray-800 hover:bg-blue-100 rounded"
                                        onClick={() => navigate('/import')}
                                    >
                                        Nhập kho
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className="w-full text-left p-2 text-gray-800 hover:bg-blue-100 rounded"
                                        onClick={() => navigate('/export')}
                                    >
                                        Xuất kho
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Quản lý Thuốc và danh mục thuốc */}
                <div className="relative">
                    <button
                        className="text-white p-2 hover:bg-blue-700 rounded"
                        onClick={() => toggleSubMenu(4)} // Gọi toggle cho submenu Quản lý Sản phẩm
                    >
                        Quản lý Thuốc và danh mục thuốc
                    </button>
                    {isSubMenuOpen === 4 && (
                        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                            <ul className="space-y-2 p-2">
                                <li>
                                    <button
                                        className="w-full text-left p-2 text-gray-800 hover:bg-blue-100 rounded"
                                        onClick={() => navigate('/divide-category-medicine')}
                                    >
                                        Phân loại thuốc/loại thuốc
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left p-2 text-gray-800 hover:bg-blue-100 rounded"
                                        onClick={() => navigate('/medicine-location')}
                                    >
                                        Quản lý giá thuốc
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Kiểm kê */}
                <div className="relative">
                    <button
                        className="text-white p-2 hover:bg-blue-700 rounded"
                        onClick={() => toggleSubMenu(5)} // Gọi toggle cho submenu Kiểm kê
                    >
                        Kiểm kê
                    </button>
                    {isSubMenuOpen === 5 && (
                        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                            <ul className="space-y-2 p-2">
                                <li>
                                    <button
                                        className="w-full text-left p-2 text-gray-800 hover:bg-blue-100 rounded"
                                        onClick={() => navigate('/suplier')}
                                    >
                                        Nhà cung cấp
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left p-2 text-gray-800 hover:bg-blue-100 rounded"
                                        onClick={() => navigate('/staff')}
                                    >
                                        Quản lý nhân sự
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left p-2 text-gray-800 hover:bg-blue-100 rounded"
                                        onClick={() => navigate('/report')}
                                    >
                                        Các báo cáo - phân tích
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};
