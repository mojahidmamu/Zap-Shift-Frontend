import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-2">
          <Link to="/" className="btn btn-primary w-full">
            Go Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-ghost w-full"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;