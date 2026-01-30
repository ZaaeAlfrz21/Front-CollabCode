import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import EditorPage from './pages/EditorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage'; // <--- 1. JANGAN LUPA IMPORT INI

// --- KOMPONEN PENJAGA (SATPAM) ---
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
      return (
          <div style={{
              height: '100vh', display: 'flex', justifyContent: 'center', 
              alignItems: 'center', background: '#1e1e1e', color: 'white'
          }}>
              Checking Access...
          </div>
      );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Halaman Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Halaman Private (Protected) */}
            
            {/* 1. Dashboard */}
            <Route 
              path="/" 
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              } 
            />

            {/* 2. User Page / Profil (BARU) */}
            <Route 
              path="/user" 
              element={
                <RequireAuth>
                  <UserPage />
                </RequireAuth>
              } 
            />

            {/* 3. Editor */}
            <Route 
              path="/editor/:roomId" 
              element={
                <RequireAuth>
                  <EditorPage />
                </RequireAuth>
              } 
            />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;