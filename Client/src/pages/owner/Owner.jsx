import { Outlet } from "react-router-dom";
import SideNavbar from "../../components/SideNavbar";
import Footer from "./Footer";

const Owner = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-black">
            <div className="flex flex-1">
                <SideNavbar />
                <main className="flex-1 p-4 md:p-8 lg:p-10 bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-gray-900 transition-colors duration-300 min-w-0">
                    <div className="w-full max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Owner;
