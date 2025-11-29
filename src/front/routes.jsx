// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { Layout } from "./pages/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Groups } from "./pages/Groups";
import { Finances } from "./pages/Finances";
import { Config } from "./pages/Config"
import Home from "./pages/Home";
import { Chat } from "./pages/Chat";
import ResetPassword from "./pages/ResetPassword";
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} /> {/* Ruta explícita */}
        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}

        <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/finances"
          element={
            <PrivateRoute>
              <Finances />
            </PrivateRoute>
          }
        />
        <Route
          path="/config"
          element={
            <PrivateRoute>
              <Config />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <PrivateRoute>
              <Groups />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/resetPassword/:token*" element={<ResetPassword />} />

    </>


  )
);