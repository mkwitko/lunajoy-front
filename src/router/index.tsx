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
    children: [],
  },
]);
