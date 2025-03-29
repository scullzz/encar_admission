import Dashboard from 'layout/Dashboard';

import ProtectedRoute from 'ProtectedRoute';
import Tariffs from 'pages/dashboard/Tariffss';
import Contracts from 'pages/dashboard/Contracts';
import Cars from 'pages/dashboard/Cars';
import Settings from 'pages/dashboard/Settings';
import Users from 'pages/dashboard/Users';
import Subscriptions from 'pages/dashboard/Subscriptions';
import Filters from 'pages/dashboard/Filters';
import PayHistory from 'pages/dashboard/PayHistory';
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/tariffs',
      element: <Tariffs />
    },
    {
      path: '/filters',
      element: <Filters />
    },
    {
      path: '/contracts',
      element: <Contracts />
    },
    {
      path: '/cars',
      element: <Cars />
    },
    {
      path: '/settings',
      element: <Settings />
    },
    {
      path: '/users',
      element: <Users />
    },
    {
      path: '/subscriptions',
      element: <Subscriptions />
    },
    {
      path: '/pay_history',
      element: <PayHistory />
    }
  ]
};

export default MainRoutes;
