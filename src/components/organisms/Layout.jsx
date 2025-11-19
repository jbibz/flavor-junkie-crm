import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/organisms/MobileMenu";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BottomNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;