import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-[#05070d] text-gray-100 scroll-smooth">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-16">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
