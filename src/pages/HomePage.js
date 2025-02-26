import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { MainHome } from "../components/MainHome"

export const HomePage = () => {
    return (
        <div className="bg-white text-gray-900">
            <Header />
            {/* Main Content */}
            <MainHome/>
            <Footer />
        </div>

    )
}