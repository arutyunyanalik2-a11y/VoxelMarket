import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './conteyner/components/Navbar/Navbar';
import AdminLogin from './conteyner/components/Admin/AdminLogin';
import Menu from './conteyner/components/Menu/Menu';
import AdminDashboard from './conteyner/components/Admin/AdminDashbord';
import LoginPage from './conteyner/components/pages/LoginPage';
import RegisterPage from './conteyner/components/pages/Register';
import ProfilePage from './conteyner/components/pages/ProfilePage';
import ProductDetail from './conteyner/components/Menu/ProductDetail';
import Cart from './conteyner/components/Menu/Cart';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;