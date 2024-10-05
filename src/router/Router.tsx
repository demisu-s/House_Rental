import { createBrowserRouter } from 'react-router-dom';
import { AddProperty, Dashboard, ErrorPage, LandingPage, Login, Register, SellProperty, RentProperty, Settings, EditProfile } from "../pages";
import { REGISTER_ROUTE, ADD_PROPERTY_ROUTE, RENT_PROPERTY_ROUTE, SELL_PROPERTY_ROUTE, SIGN_IN_ROUTE, LANDING_ROUTE, DASHBOARD_ROUTE, SETTINGS_ROUTE, AUTH_ROUTE, PROPERTIES_ROUTE, POSTS_ROUTE, PROPERTY_DETAILS_WITH_ID_ROUTE, EDIT_PROPERTY_WITH_ID_ROUTE, EDIT_RENT_WITH_ID_ROUTE, EDIT_SELL_WITH_ID_ROUTE, RENT_DETAILS_WITH_ID_ROUTE, SELL_DETAILS_WITH_ID_ROUTE, EDIT_PROFILE_ROUTE } from './routeConstants';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthenticationLayout } from '@/pages/layout/AuthenticationLayout';
import { Properties } from '@/pages/properties/Properties';
import { Posts } from '@/pages/posts/Posts';
import { DashboardLayout } from '@/pages/layout/DashboardLayout';
import { PropertiesDetails } from '../pages/properties/PropertiesDetails';
import { PropertyEdit } from '@/pages/properties/PropertyEdit';
import { SellEdit } from '@/pages/posts/SellEdit';
import { RentEdit } from '@/pages/posts/RentEdit';
import { RentDetails } from '@/pages/posts/RentDetails';
import { SellDetails } from '@/pages/posts/SellDetails';


export const router = createBrowserRouter([
  {
    path: LANDING_ROUTE,
    element: (
      <LandingPage />
    ),
    errorElement: <ErrorPage />
  },

  {
    path: AUTH_ROUTE,
    element: <AuthenticationLayout />,
    children: [
      {
        path: SIGN_IN_ROUTE,
        element: <Login />,
      },
      {
        path: REGISTER_ROUTE,
        element: <Register />,
      },
    ],
    errorElement: <ErrorPage />
  },
  {
    path: DASHBOARD_ROUTE,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: DASHBOARD_ROUTE,
        element: <Dashboard />
      },
      {
        path: PROPERTIES_ROUTE,
        element: <Properties />,
      },
      {
        path: POSTS_ROUTE,
        element: <Posts />,
      },
      {
        path: SETTINGS_ROUTE,
        element: <Settings />
      },
      {
        path: EDIT_PROFILE_ROUTE,
        element: <EditProfile />
      },
      {
        path: ADD_PROPERTY_ROUTE,
        element: <AddProperty />,
        errorElement: <ErrorPage />
      },
      {
        path: SELL_PROPERTY_ROUTE,
        element: <SellProperty />,
        errorElement: <ErrorPage />
      },
      {
        path: RENT_PROPERTY_ROUTE,
        element: <RentProperty />,
        errorElement: <ErrorPage />
      },
      {
        path: PROPERTY_DETAILS_WITH_ID_ROUTE,
        element: <PropertiesDetails />
      },
      {
        path: RENT_DETAILS_WITH_ID_ROUTE,
        element: <RentDetails />
      },
      {
        path: SELL_DETAILS_WITH_ID_ROUTE,
        element: <SellDetails />
      },
      {
        path: EDIT_PROPERTY_WITH_ID_ROUTE,
        element: <PropertyEdit />
      },
      {
        path: EDIT_SELL_WITH_ID_ROUTE,
        element: <SellEdit />
      },
      {
        path: EDIT_RENT_WITH_ID_ROUTE,
        element: <RentEdit />
      },
    ],
    errorElement: <ErrorPage />
  },
  {
    path: "*",
    element: <ErrorPage />
  }
]);