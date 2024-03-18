import { createBrowserRouter, Routes, Route } from "react-router-dom";
import {
  HomePage,
  RestaurantsPage,
  RestaurantDetails,
  ChefsPage,
} from "../pages";
import { Navbar, Footer } from "../components";
import { Outlet } from "react-router-dom";
import { DishOrderPopup } from "@/components";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        children: [
          {
            path: "/dish/:title",
            element: <DishOrderPopup />,
          },
        ],
      },
      {
        path: "/chefs",
        element: <ChefsPage />,
      },
      {
        path: "/restaurants",
        element: <RestaurantsPage />,
      },
      {
        path: "/restaurant/:title",
        element: <RestaurantDetails />,
      },
      {
        path: "/dish/:title",
        element: <DishOrderPopup />,
      },
    ],
  },
]);

export default router;
