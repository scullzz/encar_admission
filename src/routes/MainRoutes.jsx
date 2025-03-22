import Dashboard from 'layout/Dashboard';

import ProtectedRoute from 'ProtectedRoute';
import Tariffs from 'pages/dashboard/Tariffss';
import Contracts from 'pages/dashboard/Contracts';
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
      path: '/contracts',
      element: <Contracts />
    }
  ]
};

export default MainRoutes;
