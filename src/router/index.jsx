import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Inventory = lazy(() => import("@/components/pages/Inventory"));
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"));
const Sales = lazy(() => import("@/components/pages/Sales"));
const Analytics = lazy(() => import("@/components/pages/Analytics"));
const Production = lazy(() => import("@/components/pages/Production"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-amber-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-amber-800 font-medium">Loading Flavor Junkie CRM...</p>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "inventory",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Inventory />
      </Suspense>
    ),
  },
  {
    path: "product/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProductDetail />
      </Suspense>
    ),
  },
  {
    path: "sales",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Sales />
      </Suspense>
    ),
  },
  {
    path: "analytics",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Analytics />
      </Suspense>
    ),
  },
  {
    path: "production",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Production />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes,
  },
];

export const router = createBrowserRouter(routes);