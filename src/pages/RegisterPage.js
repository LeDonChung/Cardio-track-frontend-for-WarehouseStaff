import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/AppUtils";
import { register, sendOtp } from "../redux/slice/UserSlice";

export const RegisterPage = () => {
    const [userRegister, setUserRegister] = useState({
        username: '0867713557',
        password: "ledonchung",
        fullName: "Le Don Chung",
        rePassword: "ledonchung",
        otp: "",
    });
    const error = useSelector(state => state.user.errorResponse);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handlerActionSendOtp = async () => {
        const phone = userRegister.username;
        if (!phone) {
            showToast("Vui lòng nhập số điện thoại.", 'error');
            return;
        }

        await dispatch(sendOtp(phone)).unwrap().then((res) => {
            showToast("Gửi mã OTP thành công.", 'success');
        }).catch(err => showToast(err.error || "Gửi mã OTP không thành công.", 'error'));
    };
    const handlerActionRegister = async (e) => {
        e.preventDefault();
        if (userRegister.password !== userRegister.rePassword) {
            showToast("Mật khẩu không trùng khớp.", 'error');
            return;
        }

        await dispatch(register(userRegister)).unwrap().then((res) => {
            showToast("Đăng ký thành công.", 'success');
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }).catch(err => showToast(err.error || "Đăng ký không thành công.", 'error'));

    };

    return (
        <div className="bg-white text-gray-900">
            <Header />
            {/* Main Content */}
            <main className="container mx-auto mt-16">
                <div className="max-w-md mx-auto bg-white p-8 ">
                    <h2 className="text-center text-xl font-bold mb-4 text-custom-size">Đăng ký</h2>
                    <form id="formRegister" onSubmit={(e) => handlerActionRegister(e)}>
                        <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div class="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_phone.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.username}
                                    onChange={(e) => setUserRegister({ ...userRegister, username: e.target.value })}
                                    type="text"
                                    id="phoneNumber"
                                    placeholder="Số điện thoại"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>
                        <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div class="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_user_register.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.fullName}
                                    onChange={(e) => setUserRegister({ ...userRegister, fullName: e.target.value })}
                                    type="text"
                                    id="fullName"
                                    placeholder="Họ và tên"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>
                        <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div class="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_lock.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.password}
                                    onChange={(e) => setUserRegister({ ...userRegister, password: e.target.value })}
                                    type="password"
                                    id="password"
                                    placeholder="Mật khẩu"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>
                        <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div class="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_lock.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.rePassword}
                                    onChange={(e) => setUserRegister({ ...userRegister, rePassword: e.target.value })}
                                    type="password"
                                    id="rePassword"
                                    placeholder="Nhập lại mật khẩu"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>
                        <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div class="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_otp.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.otp}
                                    onChange={(e) => setUserRegister({ ...userRegister, otp: e.target.value })}
                                    type="text"
                                    id="otp"
                                    size={6}
                                    placeholder="Nhập OTP"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                                <button type="button" onClick={(e) => handlerActionSendOtp()}>
                                    <img
                                        src="/icon/ic_send.png"
                                        alt="Thera Care Logo"
                                        className="h-6 w-6 hover:cursor-pointer" />
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#005AE0] text-white py-2 rounded-[0.5rem]">
                            Đăng ký
                        </button>
                    </form>
                    <div className="flex justify-between mt-4">
                        <Link to={'/login'}>
                            <a className="text-blue-600">Đăng nhập</a>
                        </Link>
                        <a href="#" className="text-blue-600">Quên mật khẩu</a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

