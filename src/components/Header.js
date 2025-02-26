import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const navigate = useNavigate();
    const handlerActionLogout = () => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
        }

        navigate('/login');
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
        </header>
    );
};
