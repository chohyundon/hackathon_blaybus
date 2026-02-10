import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Scene from "./components/elements/scene/scene";
import LearnList from "./learn-list/List";
import Learn from "./components/learn/Learn";
import Home from "./components/main/Home";
import AuthCallback from "./components/auth/AuthCallback";

const router = createBrowserRouter([
  { path: "/scene", element: <Scene /> },
  { path: "/learn-list", element: <LearnList /> },
  { path: "/learn", element: <Learn /> },
  { path: "/auth/callback", element: <AuthCallback /> },
  { path: "/", element: <Home /> },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
