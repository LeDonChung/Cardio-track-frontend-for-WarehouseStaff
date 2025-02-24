export const Footer = () => {
    return (
        < footer className="bg-white mt-16 py-8 fixed bottom-0 right-0 left-0" >
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                    <h3 className="font-bold mb-2">VỀ CHÚNG TÔI</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-blue-600 text-custom-size">Giới thiệu</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Quy chế hoạt động</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Chính sách đặt cọc</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Chính sách nội dung</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2">DANH MỤC</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-blue-600 text-custom-size">Thực phẩm chức năng</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Dược mỹ phẩm</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Thuốc</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Chăm sóc cá nhân</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2">TÌM HIỂU THÊM</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-blue-600 text-custom-size">Góc sức khỏe</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Tra cứu thuốc</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Bệnh thường gặp</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Tin tức sự kiện</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2">TỔNG ĐÀI</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-blue-600 text-custom-size">Tư vấn mua hàng 18006927</a></li>
                        <li><a href="#" className="text-blue-600 text-custom-size">Góp ý: 18004127</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2">KẾT NỐI VỚI CHÚNG TÔI</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-blue-600 text-custom-size"><img
                            src="/icon/ic_facebook.png"
                            alt="Thera Care Logo"
                            className="h-6 w-6"
                        /></a>
                        <a href="#" className="text-blue-600 text-custom-size"><img
                            src="/icon/ic_zalo.png"
                            alt="Thera Care Logo"
                            className="h-6 w-6"
                        /></a>
                    </div>
                </div>
            </div>
        </footer >
    )
}