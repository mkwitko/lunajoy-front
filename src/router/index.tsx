import { AppLayout } from "@/pages/protected/_layout";
import Home from "@/pages/protected/home/home";
import { PublicLayout } from "@/pages/public/_layout";
import SignIn from "@/pages/public/sign-in";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/authentication",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
    ],
  },
  {
    path: "",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);
