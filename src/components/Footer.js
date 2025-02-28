export const Footer = () => {
    return (
        <footer className="bg-white mt-16 py-8 fixed bottom-0 right-0 left-0">
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                    <h3 className="font-bold mb-2">VỀ CHÚNG TÔI</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-blue-600 text-custom-size">Giới thiệu về kho thuốc</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Chính sách vận hành kho</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Chính sách bảo mật</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Điều khoản sử dụng</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2">DANH MỤC SẢN PHẨM</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-blue-600 text-custom-size">Thuốc kê đơn</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Thuốc không kê đơn</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Vật tư y tế</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Dược mỹ phẩm</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2">TÌM HIỂU THÊM</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-blue-600 text-custom-size">Hướng dẫn sử dụng</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Cẩm nang dược phẩm</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Tin tức và sự kiện ngành dược</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Tra cứu thuốc</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2">HỖ TRỢ KHÁCH HÀNG</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-blue-600 text-custom-size">Tư vấn sử dụng thuốc: 18006927</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Góp ý và phản hồi: 18004127</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2">KẾT NỐI VỚI CHÚNG TÔI</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-blue-600 text-custom-size">
                            <img
                                src="/icon/ic_facebook.png"
                                alt="Facebook"
                                className="h-6 w-6"
                            />
                        </a>
                        <a href="#" className="text-blue-600 text-custom-size">
                            <img
                                src="/icon/ic_zalo.png"
                                alt="Zalo"
                                className="h-6 w-6"
                            />
                        </a>
                        <a href="#" className="text-blue-600 text-custom-size">
                            <img
                                src="/icon/ic_email.png"
                                alt="Email"
                                className="h-6 w-6"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
