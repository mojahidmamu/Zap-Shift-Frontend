import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { RiEBike2Fill } from 'react-icons/ri'; 
import { logoutUser } from '../Firabse/firebase.init';
import { AuthContext } from '../context/AuthContext/AuthContext';

const RiderSidebar = ({ isOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    // ✅ Navigation items
    const menuItems = [
        { path: '/rider-dashboard', icon: <RiEBike2Fill size={18} />, label: 'My Rider Application' },
        { path: '/rider-dashboard/assign-riders', icon: <RiEBike2Fill size={18} />, label: 'My Assigned Parcels' },
    ];

    // ✅ Bottom actions
    const bottomActions = [
        { path: '/', icon: <Home size={18} />, label: 'Home', action: 'navigate' },
        { icon: <LogOut className="text-red-600" size={18} />, label: 'Logout', action: 'logout', isRed: true },
    ];

    // ✅ Active route check
    const isActive = (path) => location.pathname === path;

    // ✅ Logout handler
    const handleLogout = async () => {
        const { success, error } = await logoutUser();
        if (success) {
            setUser(null);
            toast.success('Logged out successfully!', { position: 'top-center' });
            navigate('/');
        } else {
            toast.error(error || 'Logout failed!', { position: 'top-center' });
        }
    };

    // ✅ Handle click
    const handleItemClick = (item) => {
        if (item.action === 'logout') {
            handleLogout();
        } else {
            navigate(item.path);
        }
    };

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-20 flex flex-col ${
                isOpen ? 'w-64' : 'w-20'
            }`}
        >
            {/* ✅ Logo */}
            <div className="flex items-center justify-center p-4 border-b border-gray-700 h-16">
                {isOpen ? (
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Zap Shift-Rider
                    </span>
                ) : (
                    <span className="text-2xl">📦</span>
                )}
            </div>

            {/* ✅ Menu */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive(item.path)
                                ? 'bg-purple-600 text-white'
                                : 'hover:bg-gray-800 text-gray-300'
                        }`}
                    >
                        {item.icon}
                        {isOpen && <span className="text-sm">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* ✅ Bottom Actions */}
            <div className="border-t border-gray-700 p-4 space-y-1">
                {bottomActions.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleItemClick(item)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            item.isRed
                                ? 'hover:bg-red-900/30 text-red-400'
                                : 'hover:bg-gray-800 text-gray-300'
                        }`}
                    >
                        {item.icon}
                        {isOpen && (
                            <span className={`text-sm ${item.isRed ? 'text-red-500' : ''}`}>
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RiderSidebar;