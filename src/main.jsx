import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Scene from "./components/elements/scene/scene";
import LearnList from "./learn-list/List";

const router = createBrowserRouter([
  { path: "/", element: <Scene /> },
  { path: "/learn-list", element: <LearnList /> },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
