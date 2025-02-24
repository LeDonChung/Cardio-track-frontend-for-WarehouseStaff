import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slice/UserSlice";
import showToast from "../utils/AppUtils";

export const LoginPage = () => {
    const [userLogin, setUserLogin] = useState({
        username: '0867713557',
        password: "ledonchung"
    });

    const error = useSelector(state => state.user.errorResponse);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handlerActionLogin =  async (e) => {
        // chan action mac dinh cua form
        e.preventDefault();
        
        await dispatch(login(userLogin)).unwrap().then((res) => {
            navigate("/");
        }).catch(err => showToast("Tài khoản hoặc mật khẩu không chính xác.", 'error'));
    }

    return (
        <div className="bg-white text-gray-900">
            <Header />
            {/* Main Content */}
            <main className="container mx-auto mt-16">
                <div className="max-w-md mx-auto bg-white p-8 ">
                    <h2 className="text-center text-xl font-bold mb-4 text-custom-size">Đăng nhập với mật khẩu</h2>
                    <form id="formLogin" onSubmit={e => handlerActionLogin(e)}>
                        <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div class="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_phone.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userLogin.username}
                                    onChange={(e) => setUserLogin({ ...userLogin, username: e.target.value })}
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
                                    src="/icon/ic_lock.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userLogin.password}
                                    onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })}
                                    type="password"
                                    id="password"
                                    placeholder="Mật khẩu"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#005AE0] text-white py-2 rounded-[0.5rem]">
                            Đăng nhập
                        </button>
                    </form>
                    <div className="flex justify-between mt-4">
                        <Link to={'/register'} className="text-blue-600">
                            Đăng ký
                        </Link>
                        <a href="#" className="text-blue-600">Quên mật khẩu</a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

