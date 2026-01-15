import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import {
  Home,
  Catalogue,
  VehicleDetail,
  Cart,
  Checkout,
  Auth,
  Profile,
  Orders,
} from './pages';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="catalogue" element={<Catalogue />} />
              <Route path="vehicule/:id" element={<VehicleDetail />} />
              <Route path="panier" element={<Cart />} />
              <Route path="commande" element={<Checkout />} />
              <Route path="connexion" element={<Auth />} />
              <Route path="profil" element={<Profile />} />
              <Route path="mes-commandes" element={<Orders />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
