import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Main } from "../components/Main"

export const HomePage = () => {
    return (
        <div className="bg-white text-gray-900">
            <Header />
            {/* Main Content */}
            <h1>---Main page/</h1>
            <Main />
            <Footer />
        </div>

    )
}