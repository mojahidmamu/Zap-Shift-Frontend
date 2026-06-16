import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Package, Truck, Users, MapPin, 
    ClipboardList, DollarSign, Settings, FileText, 
    HelpCircle, TrendingUp, Home, LogOut, 
    CreditCard,
    Bike, Mail,
    UsersIcon,
    UserStar
} from 'lucide-react';  
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { logoutUser } from '../Firabse/firebase.init';
import useRole from '../hook/useRole';
import { RiEBike2Fill, RiEBikeFill } from 'react-icons/ri';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const { role, isLoading } = useRole();
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    // Main navigation items
    const menuItems = [
        { path: '/admin-dashboard', icon: <UserStar size={18} />, label: 'Admin Dashboard' },  
        { path: '/admin-dashboard/users-management', icon: <UsersIcon size={18} />, label: 'All Users' },
        { path: '/admin-dashboard/parcels', icon: <Package size={18} />, label: 'All Parcels' },
        // { path: '/dashboard/customers', icon: <Users size={18} />, label: 'Customers' },
        { path: '/admin-dashboard/payment-history', icon: <CreditCard size={18} />, label: 'Payment History' },
        { path: '/admin-dashboard/tracking', icon: <MapPin size={18} />, label: 'Live Tracking' },
        { path: '/admin-dashboard/rider-applications', icon: <RiEBike2Fill size={18} />, label: 'Rider Applications' },
        { path: '/admin-dashboard/assign-riders', icon: <RiEBike2Fill size={18} />, label: 'Assign Rider' },
        { path: '/admin-dashboard/delivery-riders', icon: <Truck size={18} />, label: 'Delivery Riders' },
        { path: '/admin-dashboard/contact-list', icon: <Mail size={18} />, label: 'Contact List' },
        { path: '/admin-dashboard/settings', icon: <Settings size={18} />, label: 'Settings' }, 
        
    ];

    // Bottom action items
    const bottomActions = [
        { path: '/', icon: <Home size={18} />, label: 'Home', action: 'navigate' },
        { path: '#', icon: <LogOut className='text-red-600' size={18} />,  label: 'Logout', action: 'logout' ,  isRed: true },
    ];

     const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        const { success, error } = await logoutUser();
        if (success) {
            setUser(null);
            toast.success('Logged out successfully!', { position: 'top-center' });
            navigate('/');
        } else {
            toast.error(error, { position: 'top-center' });
        }
    };

    const handleItemClick = (item) => {
        if (item.action === 'logout') {
            handleLogout();
        } else {
            navigate(item.path);
        }
    };

    return (
        <div className={`fixed left-0 top-0 h-full bg-purple-900 text-white transition-all duration-300 z-20 flex flex-col ${
            isOpen ? 'w-64' : 'w-20'
        }`}>
            {/* Logo / Brand */}
            <div className="flex items-center justify-center p-4 border-b border-gray-700 h-16">
                {isOpen ? (
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-400 bg-clip-text text-transparent">
                        Zap Shift Admin
                    </span>
                ) : (
                    <span className="text-2xl">📦</span>
                )}
            </div>

            {/* Navigation Menu - grows to fill space */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 font-bold underline py-2 rounded-lg transition-all duration-200 ${
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

             {/* Bottom Actions (Home & Logout) */}
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
                        {isOpen && <span className={`text-sm ${item.isRed ? 'text-red-500' : ''}`}>
                            {item.label}
                        </span>}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminSidebar;