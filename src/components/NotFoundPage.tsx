import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-blue-600">404</h1>
        <p className="text-xl mt-4 text-gray-700">Oops! Page not found.</p>
        <p className="mt-2 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
