import { Link, NavLink } from "react-router-dom"; 
import { useContext, useEffect, useRef, useState } from "react";
import { Sun, Moon, LogOut, User, Settings, ChevronDown, UsersIcon, Bike, UserStar } from "lucide-react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';
import Logo from "../../Logo/Logo";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { logoutUser } from "../../../Firabse/firebase.init";

const NavBar = () => {
    const { user, setUser } = useContext(AuthContext);  
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle logout
    const handleLogout = async () => {
        const { success, error } = await logoutUser();
        if (success) {
            setUser(null); // Clear user from context
            toast.success('Logged out successfully!');
            navigate('/');
            setIsUserMenuOpen(false);
        } else {
            toast.error(error);
        }
    };

    // Navigation options
    const NavOptions = (
        <>
            <li>
                <NavLink 
                    to="/services" 
                    className={({ isActive }) => 
                        `hover:text-purple-400 transition-colors duration-200 ${isActive ? 'text-purple-400 border-b-2 border-purple-400' : ''}`
                    }
                >
                    Services
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/coverage" 
                    className={({ isActive }) => 
                        `hover:text-purple-400 transition-colors duration-200 ${isActive ? 'text-purple-400 border-b-2 border-purple-400' : ''}`
                    }
                >
                    Coverage
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/about" 
                    className={({ isActive }) => 
                        `hover:text-purple-400 transition-colors duration-200 ${isActive ? 'text-purple-400 border-b-2 border-purple-400' : ''}`
                    }
                >
                    About Us
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/send-percel" 
                    className={({ isActive }) => 
                        `hover:text-purple-400 transition-colors duration-200 ${isActive ? 'text-purple-400 border-b-2 border-purple-400' : ''}`
                    }
                >
                    Send Parcel
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/services" 
                    className={({ isActive }) => 
                        `hover:text-purple-400 transition-colors duration-200 ${isActive ? 'text-purple-400 border-b-2 border-purple-400' : ''}`
                    }
                >
                    Services
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/rider" 
                    className={({ isActive }) => 
                        `hover:text-purple-400 transition-colors duration-200 ${isActive ? 'text-purple-400 border-b-2 border-purple-400' : ''}`
                    }
                >
                    Be a Rider
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/blog" 
                    className={({ isActive }) => 
                        `hover:text-purple-400 transition-colors duration-200 ${isActive ? 'text-purple-400 border-b-2 border-purple-400' : ''}`
                    }
                >
                    Blog
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/contact" 
                    className={({ isActive }) => 
                        `hover:text-purple-400 transition-colors duration-200 ${isActive ? 'text-purple-400 border-b-2 border-purple-400' : ''}`
                    }
                >
                    Contact
                </NavLink>
            </li>
        </>
    );

    return (
        <>
            <nav className="navbar fixed z-10 bg-black bg-opacity-50 backdrop-blur-md text-gray-100 w-full shadow-lg">
                <div className="navbar-start">
                    {/* Mobile Menu Dropdown */}
                    <div className="dropdown">
                        <div 
                            tabIndex={0} 
                            role="button" 
                            className="btn btn-ghost lg:hidden text-gray-200"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        {isMobileMenuOpen && (
                            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-gray-900 text-gray-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                {NavOptions}
                            </ul>
                        )}
                    </div>

                    {/* Logo */}
                    <div className="flex items-center gap-2 shrink-0">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="flex items-center gap-3 group cursor-pointer relative"
                            onClick={() => navigate('/')}
                        >
                            {/* Animated border box */}
                            <motion.div
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                            />
                            {/* Neon text */}
                            <div className="relative hidden sm:block">
                                <Logo />
                            </div>
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-300 -z-10"></div>
                        </motion.div>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 font-bold gap-2">
                        {NavOptions}
                    </ul>
                </div>

                <div className="navbar-end flex items-center space-x-3">
                    {user ? (
                        // User is logged in - Show avatar and dropdown
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
                            >
                                {/* User Avatar */}
                                <img
                                    src={user.photoURL || `https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=${(user.displayName || user.email || 'User').charAt(0)}`}
                                    alt={user.displayName || "User"}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                                />
                                <span className="hidden md:inline text-sm font-medium">
                                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                                </span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-gray-700">
                                        <p className="text-sm font-semibold text-white">
                                            {user.displayName || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    
                                    {/* User Dashboard Link */}
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-purple-600 hover:text-white transition-colors"
                                    >
                                        <UsersIcon className="w-4 h-4" />
                                        User Dashboard
                                    </Link>
                                    {/* Divider */}
                                    <div className="border-t border-gray-700 my-1"></div>

                                    {/* Rider Dashboard */}
                                    <Link
                                        to="/rider-dashboard"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-purple-600 hover:text-white transition-colors"
                                    >
                                        <Bike className="w-4 h-4" />
                                        Rider Dashboard
                                    </Link>
                                    {/* Divider */}
                                    <div className="border-t border-gray-700 my-1"></div>

                                    {/* Admin Dashboard */}
                                    <Link
                                        to="/admin-dashboard"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex font-bold underline items-center gap-3 px-4 py-2 text-gray-300 hover:bg-purple-600 hover:text-white transition-colors"
                                    >
                                        <UserStar className="w-4 h-4" />
                                        Admin Dashboard
                                    </Link>
                                    {/* Divider */}
                                    <div className="border-t border-gray-700 my-1"></div>
                                    
                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // ✅ User is NOT logged in - Show login button
                        <div className="flex gap-2">
                            <Link to="/login">
                                <button className="btn btn-accent rounded-lg font-bold text-white hover:bg-purple-600 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600">
                                    Login
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default NavBar;