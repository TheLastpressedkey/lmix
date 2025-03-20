import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Orders } from './pages/Orders';
import { NewOrder } from './pages/NewOrder';
import { OrderDetails } from './pages/OrderDetails';
import { EditOrder } from './pages/EditOrder';
import { Customers } from './pages/Customers';
import { Users } from './pages/Users';
import { Home } from './pages/Home';
import { TrackOrder } from './pages/TrackOrder';
import { Documentation } from './pages/Documentation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const { id, email, created_at } = session.user;
        setUser({
          id,
          email: email || '',
          role: 'admin', // Hardcoded for admin@lmi.com
          created_at,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { id, email, created_at } = session.user;
        setUser({
          id,
          email: email || '',
          role: 'admin', // Hardcoded for admin@lmi.com
          created_at,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/login" element={<Login />} />

        {/* Protected platform routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<NewOrder />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/orders/:id/edit" element={<EditOrder />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/users" element={
            <ProtectedRoute requireAdmin={true}>
              <Users />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
