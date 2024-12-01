import { RouteObject } from "react-router-dom";

// Layouts
import { AuthLayout, DashboardLayout } from "../layouts";

// Pages
import {
  ChangePassword,
  Dashboard,
  ForgotPassword,
  Profile,
  Settings,
  SignIn,
} from "./lazyWrappers";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFound from "../NotFound";

export const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          {
            path: "user",
            children: [
              { index: true, element: <Profile /> },
              { path: "change-password", element: <ChangePassword /> },
              { path: "settings", element: <Settings /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "sign-in", element: <SignIn /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];
