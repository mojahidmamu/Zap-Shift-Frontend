import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main content area with dynamic margin based on sidebar state */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Topbar */}
                <div className="bg-white shadow p-4 flex items-center sticky top-0 z-10">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="focus:outline-none">
                        <Menu className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="ml-4 font-semibold text-gray-800">Dashboard</h1>
                </div>

                {/* Page content - nested routes will render here */}
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;