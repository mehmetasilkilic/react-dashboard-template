import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/path-to-your-logo.svg"
            alt="Your Company Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Dashboard
          </h2>
        </div>

        <Outlet />

        <div className="text-center">
          <Link
            to="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
