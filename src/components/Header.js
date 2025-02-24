import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const navigate = useNavigate();
    const handlerActionLogout = () => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
        }

        navigate('/login')
    }
    return (
        <header className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="/logo/logo_90_90 1.png"
                        alt="Thera Care Logo"
                        className="h-10 w-10"
                    />
                    <span className="text-white text-lg font-bold ml-2">
                        NHÀ THUỐC
                        <br />
                        THERA CARE
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
                            className="p-2 rounded-full w-[48rem] pl-10" // Thêm padding bên trái để tránh chồng lên biểu tượng
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </span>
                    </div>
                </div>
                <div className="flex items-center">
                    {
                        localStorage.getItem('token') ?
                            (
                                <button className="text-white flex justify-between items-center" onClick={e => handlerActionLogout()}>
                                    <img
                                        src="/icon/ic_user.png"
                                        alt="Thera Care Logo"
                                        className="h-10 w-10 mx-1"
                                    />
                                    Đăng xuất
                                </button>
                            )
                            :
                            (
                                <button className="text-white flex justify-between items-center" onClick={e => navigate('/login')}>
                                    <img
                                        src="/icon/ic_user.png"
                                        alt="Thera Care Logo"
                                        className="h-10 w-10 mx-1"
                                    />
                                    Đăng nhập
                                </button>
                            )
                    }

                    <button className="bg-[#002AFF] text-blue-600 ml-4 px-4 py-2 rounded-full">
                        <FontAwesomeIcon icon={faCartShopping} className='mr-1' color='#fff' />
                        <span className='text-white'>Giỏ hàng</span>
                    </button>
                </div>
            </div>
        </header>
    );
};