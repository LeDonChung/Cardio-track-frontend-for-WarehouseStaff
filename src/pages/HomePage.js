import { Footer } from "../components/Footer"
import { Header } from "../components/Header"

export const HomePage = () => {
    return (
        <div className="bg-white text-gray-900">
            <Header />
            {/* Main Content */}
            <h1>This is home page</h1>
            <Footer />
        </div>

    )
}