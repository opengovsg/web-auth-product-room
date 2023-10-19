import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PasswordLogin from './pages/PasswordLogin.jsx'

import './index.css'
import EmailOtpLogin from './pages/EmailOtpLogin.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthContextProvider />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: '/pw/login',
        element: <PasswordLogin />,
      },
      {
        path: '/otp/login',
        element: <EmailOtpLogin />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
