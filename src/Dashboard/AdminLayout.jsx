import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Content */}
            <div className={`flex-1 transition-all duration-300 ${
                sidebarOpen ? 'ml-64' : 'ml-20'
            }`}>
                {/* Topbar */}
                <div className="bg-white shadow p-4 flex items-center">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu />
                    </button>
                    <h1 className="ml-4 font-bold">Admin Panel</h1>
                </div>

                {/* Pages */}
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;