import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import PublicList from './components/PublicList';
import PublicDetail from './components/PublicDetail';
import AdminLayout from './components/AdminLayout';
import AdminList from './components/AdminList';
import AdminForm from './components/AdminForm';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <PublicList /> },
      { path: 'SCP/:id', element: <PublicDetail /> },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminList /> },
          { path: 'new', element: <AdminForm /> },
          { path: 'edit/:id', element: <AdminForm /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
