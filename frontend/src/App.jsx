import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Plots from './pages/Plots.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import PlotDetail from './pages/PlotDetail.jsx';
import Favorites from './pages/Favorites.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Container maxW="6xl" py={6}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/plots" element={<Plots />} />
          <Route path="/plots/:id" element={<PlotDetail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="seller">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute requiredRole="buyer">
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}
