import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import Base from './Base.jsx'

import Home from './pages/Home.jsx'
import Create from './pages/Create.jsx'
import Lists from './pages/Lists.jsx'
import ViewList from './pages/ViewList.jsx'

import Login from './auth/Login.jsx'
import SignUp from './auth/SignUp.jsx'
import LogOut from './auth/LogOut.jsx'

const router = createBrowserRouter([
  {path: '/', element: <Base />, children:[
    {path: '/home', element: <Home />},
    {path: '/create', element: <Create />},
    {path: '/lists', element: <Lists />},
    {path: '/lists/:id', element: <ViewList />},
  ]},
  {path: '/login', element: <Login />},
  {path: '/register', element: <SignUp />},
  {path: '/logout', element: <LogOut />},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)