import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import About from './components/About';
import Root from './components/Root';
import ErrorPage from './components/ErrorPage'; 
import Match from './components/Match';
import Profile from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "match",
        element: <Match />,
      },
      {
        path:"profile",
        element: <Profile />
      },
      {
        path: "login/SignUp",
        element: <SignUp />,
      },
      {
        path: "profile/login",
        element: <Login />,
      },
      {
        path: "/match/login",
        element: <Login />,
      }

    ],
  },
]);

const App = () => (
  <RouterProvider router={router} />
);

export default App;
