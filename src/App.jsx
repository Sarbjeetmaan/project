import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { Navbar } from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Home from './Pages/Home';
import Cart from './Pages/cart';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HomeContextProvider from './Context/HomeContext';

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/cart'];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/airpods" element={<ShopCategory category="airpod" />} />
        <Route path="/camera" element={<ShopCategory category="camera" />} />
        <Route path="/earphones" element={<ShopCategory category="earphone" />} />
        <Route path="/mobile" element={<ShopCategory category="mobile" />} />
        <Route path="/mouse" element={<ShopCategory category="mouse" />} />
        <Route path="/printers" element={<ShopCategory category="printer" />} />
        <Route path="/processor" element={<ShopCategory category="processor" />} />
        <Route path="/refrigerator" element={<ShopCategory category="refrigerator" />} />
        <Route path="/trimmers" element={<ShopCategory category="trimmer" />} />
        <Route path="/watches" element={<ShopCategory category="watches" />} />
        <Route path="/speakers" element={<ShopCategory category="speaker" />} />
        <Route path="/tv" element={<ShopCategory category="tv" />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
      {shouldShowFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <HomeContextProvider>
      <Router>
        <AppContent />
      </Router>
    </HomeContextProvider>
  );
}

export default App;
