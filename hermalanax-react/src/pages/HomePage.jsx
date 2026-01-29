import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

const HomePage = ({ onView }) => {
    const { products, loading } = useProducts();

    // Mostrar los primeros 6 productos como "más amados"
    const masAmados = products.slice(0, 6);

    // Mostrar los siguientes 6 como "tejidos de época"
    const tejidosEpoca = products.slice(6, 12);

    return (
        <>
            <section className="hero-section">
                <div className="container hero-content">
                    {/* Overlay para legibilidad */}
                    <div className="hero-overlay" data-aos="fade-up">
                        <span className="badge">100% Hecho a Mano</span>
                        <h1>Amigurumis con <span className="highlight">Alma</span> y Corazón</h1>
                        <p>Cada puntada cuenta una historia. Regala ternura, regala Hermalanax.</p>
                        <div className="hero-buttons">
                            <Link to="/catalogo" className="btn-primary" data-aos="zoom-in" data-aos-delay="200">Ver Catálogo</Link>
                            <a href="#mas-amados" className="btn-secondary" data-aos="zoom-in" data-aos-delay="400">Lo más pedido</a>
                        </div>
                    </div>
                    <div className="hero-image" data-aos="fade-left">
                        <div className="image-blob">
                            <img src="/img/banner.png" alt="Amigurumis destacados" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="tienda" className="products-section section-padding">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">Explora nuestra colección</span>
                        <h2 className="section-title">Tejidos de la Época 🍂</h2>
                    </div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                            <p>Cargando productos...</p>
                        </div>
                    ) : tejidosEpoca.length > 0 ? (
                        <div className="products-grid" data-aos="fade-up">
                            {tejidosEpoca.map(product => (
                                <ProductCard key={product.id} product={product} onView={onView} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                            <i className="fa-solid fa-box-open fa-3x" style={{ color: '#ccc', marginBottom: '1rem' }}></i>
                            <p>Próximamente más productos...</p>
                        </div>
                    )}
                </div>
            </section>

            <section id="mas-amados" className="products-section section-padding" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">Los favoritos de la tienda</span>
                        <h2 className="section-title">Los Más Amados ❤️</h2>
                    </div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                        </div>
                    ) : masAmados.length > 0 ? (
                        <div className="products-grid" data-aos="fade-up">
                            {masAmados.map(product => (
                                <ProductCard key={product.id} product={product} onView={onView} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                            <i className="fa-solid fa-heart fa-3x" style={{ color: '#ccc', marginBottom: '1rem' }}></i>
                            <p>Aún no hay productos. ¡Añade algunos desde el panel!</p>
                        </div>
                    )}
                </div>
            </section>

            <section id="sobre-mi" className="about-section section-padding">
                <div className="container">
                    <div className="about-grid" data-aos="fade-up">
                        <div className="about-image">
                            <img src="/img/foto-sobre-mi.jpg" alt="Creadora de Hermalanax" loading="lazy" />
                        </div>
                        <div className="about-content">
                            <span className="subtitle">La persona detrás de Hermalanax</span>
                            <h2 className="section-title">Sobre Mí 💜</h2>
                            <p>¡Hola! Soy Paula, la creadora detrás de <strong>Hermalanax</strong>.</p>
                            <p>Lo que empezó como un pasatiempo se convirtió en mi mayor pasión: <strong>crear amigurumis únicos</strong> que llenan de ternura cualquier espacio.</p>
                            <p>Cada pieza está hecha a mano con mucho amor, usando materiales de calidad.</p>
                            <div className="about-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{products.length}+</span>
                                    <span className="stat-label">Productos</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">2+</span>
                                    <span className="stat-label">Años de experiencia</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">100%</span>
                                    <span className="stat-label">Hecho a mano</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
