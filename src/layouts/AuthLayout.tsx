import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
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
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
