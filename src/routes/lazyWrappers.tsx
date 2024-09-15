import { lazy } from "react";

// Auth
export const SignIn = lazy(() => import("../modules/Auth/SignIn"));
export const SignUp = lazy(() => import("../modules/Auth/SignUp"));
export const ForgotPassword = lazy(() => import("../modules/Auth/ForgotPassword"));

// User
export const Profile = lazy(() => import("../modules/User/Profile"));
export const ChangePassword = lazy(() => import("../modules/User/ChangePassword"));
export const Settings = lazy(() => import("../modules/User/Settings"));

// Dashboard
export const Dashboard = lazy(() => import("../modules/Dashboard"));

// Utils
export const NotFound = lazy(() => import("../NotFound"));