import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routesConfig } from "./routesConfig";

const router = createBrowserRouter(routesConfig);

export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
