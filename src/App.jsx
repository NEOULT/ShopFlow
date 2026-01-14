
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import Compra from './components/Compra';
import './App.css';

// Simulación de autenticación (ajusta según tu lógica real)
const useAuth = () => {
  // Cambia esto por tu lógica real de login
  const [isAuthenticated] = useState(false);
  return { isAuthenticated };
};

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    // Redirige a / si no está autenticado
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate ? useNavigate() : null;

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <Catalog 
            onNavigateToAdmin={() => navigate && navigate('/admin')}
            onComprar={id => navigate && navigate(`/compra/${id}`)}
          />
        } />
        <Route path="/compra/:id" element={<Compra />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <>
              <Header 
                onNavigateToCatalog={() => navigate && navigate('/')} 
                onToggleSidebar={() => setSidebarOpen(s => !s)}
                sidebarOpen={sidebarOpen}
              />
              <Dashboard sidebarOpen={sidebarOpen} />
            </>
          </PrivateRoute>
        } />
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
