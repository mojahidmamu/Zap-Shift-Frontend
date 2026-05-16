import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      
      <div className="bg-base-100 shadow-xl rounded-2xl p-8 text-center max-w-md w-full">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <ShieldX size={60} className="text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-red-500">
          Access Denied 🚫
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mt-2">
          You don’t have permission to view this page.
        </p>

        <p className="text-red-500 font-bold mt-2">
            Only Admin can access this page.
        </p>

        {/* Extra message */}
        <p className="text-sm text-gray-400 mt-1">
          If you think this is a mistake, contact admin.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/" className="btn btn-primary">
            Home
          </Link>

          <Link to="/dashboard" className="btn btn-outline">
            Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Forbidden;