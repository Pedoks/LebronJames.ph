import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout'
import ProtectedRoute from './Components/ProtectedRoute'

//landing
import AboutPage from './Pages/LandingPages/AboutPage'
import ArticlePage from './Pages/LandingPages/ArticlePage'
import HomePage from './Pages/LandingPages/HomePage'
import ArticleListPage from './Pages/LandingPages/ArticleListPage'
import NotFoundPage from './Pages/LandingPages/NotFoundPage' 
import LoginPage from './Pages/LandingPages/LoginPage'
import RegisterPage from './Pages/LandingPages/RegisterPage'
import WelcomePage from './Pages/LandingPages/WelcomePage'

//dashboard
import DashboardPage from './Pages/DashboardPages/DasboardPage'
import ReportsPage from './Pages/DashboardPages/ReportsPage'
import UsersPage from './Pages/DashboardPages/UsersPage'
import DashLayout from './Components/DashLayout'
import DashArticlesPage from './Pages/DashboardPages/DashArticlePage'

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />, 
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/about',
        element: <AboutPage />
      },
      {
        path: '/articles',
        element: <ArticlePage />
      },
      {
        path: '/articles/:id',
        element: <ArticleListPage />,      
      },
      {
        path: '/login',
        element: <LoginPage />, 
      },
      {
        path: '/register',
        element: <RegisterPage />, 
      },
      {
        path: '/welcome',
        element: <WelcomePage />, 
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { 
        index: true, 
        element: <DashboardPage /> 
      },

      { 
        path: 'articles', 
        element: <DashArticlesPage />  // Accessible to anyone logged in
      },
      
      { 
        path: 'users', 
        element: (
          <ProtectedRoute allowedTypes={['admin']}>
            <UsersPage />
          </ProtectedRoute>
        )
      },
      { 
        path: 'reports', 
        element: (
          <ProtectedRoute allowedTypes={['admin']}>
            <ReportsPage />
          </ProtectedRoute>
        )
      },
    ]
  }
];

const router = createBrowserRouter(routes)

function App() {
  return <RouterProvider router={router} />
}

export default App