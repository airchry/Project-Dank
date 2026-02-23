import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Root() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
            {/* Grain overlay effect */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.15] z-50 grain-overlay"></div>
            
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-b from-black via-black to-pink-950/20"></div>

            {/* Content */}
            <div className="relative z-10">
                <Navbar/>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    <Outlet />
                </main>

                <Footer/>
            </div>
        </div>
    )

}

export default Root;