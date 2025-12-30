import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PermissionRoute from './routes/PermissionRoute';
import { PERMISSIONS } from './utils/constants';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Pages
import Login from './pages/Login';
import AccessDenied from './pages/AccessDenied';
import Users from './pages/admin/Users';
import Roles from './pages/admin/Roles';
import AuditLogs from './pages/admin/AuditLogs';

// Temporary Dashboard components until specific pages are built
const Dashboard = () => (
  <div className="space-y-4">
    <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
    <p className="text-muted-foreground">Welcome to the administrative control center.</p>
  </div>
);

const Home = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
    <h2 className="text-4xl font-bold">Welcome to MyApp</h2>
    <p className="text-xl text-muted-foreground">You are now logged in. Explore the application using the menu.</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/access-denied',
    element: <AccessDenied />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <UserLayout />,
        children: [
          { index: true, element: <Home /> },
        ],
      },
      {
        path: '/admin',
        element: <PermissionRoute permissionKey={PERMISSIONS.USERS_READ} />, // Basic admin access check
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              {
                path: 'users',
                element: <PermissionRoute permissionKey={PERMISSIONS.USERS_READ} />,
                children: [{ index: true, element: <Users /> }],
              },
              {
                path: 'roles',
                element: <PermissionRoute permissionKey={PERMISSIONS.ROLES_READ} />,
                children: [{ index: true, element: <Roles /> }],
              },
              {
                path: 'audit',
                element: <PermissionRoute permissionKey={PERMISSIONS.AUDIT_READ} />,
                children: [{ index: true, element: <AuditLogs /> }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

