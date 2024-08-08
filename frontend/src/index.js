import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store";
import { Provider } from "react-redux";

import reportWebVitals from "./reportWebVitals";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CreateSubscription from "./pages/CreateSubscription";
import Subscribe from "./pages/Subscribe";
import SubscribeDiscord from "./pages/SubscribeDiscord";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/create-subscription",
    element: <CreateSubscription />,
  },
  {
    path: "/subscribe/:id",
    element: <Subscribe />,
  },
  {
    path: "/discord-verification",
    element: <SubscribeDiscord />
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
      <ToastContainer />
      <RouterProvider router={router} />
    </Provider>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
