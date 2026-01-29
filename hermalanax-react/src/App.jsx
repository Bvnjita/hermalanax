import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductsProvider, useProducts } from './context/ProductsContext';
import { GiftsProvider } from './context/GiftsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { formatoMoneda } from './utils';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-crema)'
      }}>
        <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente Layout interno
const Layout = () => {
  const [modalProduct, setModalProduct] = useState(null);
  const { products } = useProducts();

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }, []);

  const openModal = (product) => {
    setModalProduct(product);
  };

  const closeModal = () => {
    setModalProduct(null);
  };

  // Productos relacionados (misma categoría, excluyendo el actual)
  const relatedProducts = useMemo(() => {
    if (!modalProduct) return [];
    return products
      .filter(p => p.categoria === modalProduct.categoria && p.id !== modalProduct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [modalProduct, products]);

  return (
    <>
      <Header />
      <CartSidebar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage onView={openModal} />} />
          <Route path="/catalogo" element={<CatalogPage onView={openModal} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <Footer />

      {/* Modal Global Mejorado */}
      {modalProduct && (
        <div className="modal-overlay active" onClick={(e) => { if (e.target.className.includes('modal-overlay')) closeModal(); }}>
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="close-modal" onClick={closeModal}>&times;</button>

            <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Imagen Principal */}
              <div className="modal-img-container" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <img src={modalProduct.imagen} alt={modalProduct.nombre} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
              </div>

              {/* Info del Producto */}
              <div className="modal-info" style={{ padding: '1rem 0' }}>
                <span className="modal-cat" style={{ background: 'var(--color-bg-alt)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{modalProduct.categoria}</span>
                <h2 style={{ marginTop: '1rem', fontSize: '1.8rem' }}>{modalProduct.nombre}</h2>
                <p className="modal-price" style={{ fontSize: '1.5rem', color: 'var(--color-musgo)', fontWeight: 'bold', margin: '1rem 0' }}>{formatoMoneda(modalProduct.precio)}</p>
                <p className="modal-desc" style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Hecho a mano con 100% de dedicación. Materiales hipoalergénicos y seguros para todas las edades.
                </p>

                {modalProduct.stock > 0 && modalProduct.stock <= 3 && (
                  <p style={{ color: '#e67e22', fontWeight: 'bold', marginBottom: '1rem' }}>
                    <i className="fa-solid fa-fire"></i> ¡Solo quedan {modalProduct.stock} unidades!
                  </p>
                )}

                {modalProduct.stock === 0 && (
                  <p style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '1rem' }}>
                    <i className="fa-solid fa-ban"></i> Agotado
                  </p>
                )}

                <div className="modal-actions">
                  <AddToCartBtn product={modalProduct} />
                </div>
              </div>
            </div>

            {/* Productos Relacionados */}
            {relatedProducts.length > 0 && (
              <div className="related-products-section" style={{ marginTop: '2rem', borderTop: '1px dashed #ddd', paddingTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-titulo)', textAlign: 'center' }}>También te puede gustar 💕</h4>
                <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  {relatedProducts.map(rel => (
                    <div
                      key={rel.id}
                      className="mini-card"
                      onClick={() => openModal(rel)}
                      style={{ cursor: 'pointer', background: 'white', borderRadius: '10px', padding: '8px', textAlign: 'center', border: '1px solid #eee', transition: 'transform 0.2s' }}
                    >
                      <img src={rel.imagen} alt={rel.nombre} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                      <h5 style={{ fontSize: '0.75rem', marginBottom: '4px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rel.nombre}</h5>
                      <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-musgo)', margin: 0 }}>{formatoMoneda(rel.precio)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Botón wrapper para usar el contexto dentro del modal
const AddToCartBtn = ({ product }) => {
  const { addToCart } = useCart();

  if (product.stock === 0) {
    return (
      <button className="btn-primary full-width" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
        Agotado <i className="fa-solid fa-ban"></i>
      </button>
    );
  }

  return (
    <button className="btn-primary full-width" onClick={() => addToCart(product.id)}>
      ¡Lo quiero! <i className="fa-solid fa-heart"></i>
    </button>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <ProductsProvider>
        <GiftsProvider>
          <CartProvider>
            <Layout />
          </CartProvider>
        </GiftsProvider>
      </ProductsProvider>
    </AuthProvider>
  );
};

export default App;
