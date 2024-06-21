import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './globals.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './components/error-page.jsx';
import Login from './routes/Login.jsx';
import Home from './routes/Home.jsx';
import CourseDetails from './routes/CourseDetails.jsx';
import Dashboard from './routes/Dashboard.jsx';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: `/details/:courseId`,
        element: <CourseDetails />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
