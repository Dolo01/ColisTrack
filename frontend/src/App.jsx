import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientColisDetail from './pages/client/ClientColisDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminColisCreate from './pages/admin/AdminColisCreate';
import AdminColisDetail from './pages/admin/AdminColisDetail';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Chargement...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />; // Redirect to home if not authorized
  }

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/client/dashboard" /> : <Register />} />

        {/* Client Routes */}
        <Route path="/client/dashboard" element={
          <ProtectedRoute requiredRole="CLIENT">
            <ClientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/client/colis/:id" element={
          <ProtectedRoute requiredRole="CLIENT">
            <ClientColisDetail />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/colis/create" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminColisCreate />
          </ProtectedRoute>
        } />
        <Route path="/admin/colis/:id" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminColisDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
