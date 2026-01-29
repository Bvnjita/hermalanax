import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

const CATEGORIAS = [
    { id: 'todos', nombre: 'Todos', icon: '🧶' },
    { id: 'llaveros', nombre: 'Llaveros', icon: '🔑' },
    { id: 'animales', nombre: 'Animales', icon: '🐻' },
    { id: 'plantas', nombre: 'Plantas', icon: '🌵' },
    { id: 'accesorios', nombre: 'Accesorios', icon: '✨' },
    { id: 'fandom', nombre: 'Fandom', icon: '⭐' },
    { id: 'deco', nombre: 'Deco', icon: '🏠' }
];

const CatalogPage = ({ onView }) => {
    const { products, loading } = useProducts();
    const [categoriaActiva, setCategoriaActiva] = useState('todos');
    const [busqueda, setBusqueda] = useState('');

    const productosFiltrados = useMemo(() => {
        return products.filter(p => {
            const coincideCategoria = categoriaActiva === 'todos' || p.categoria === categoriaActiva;
            const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
            return coincideCategoria && coincideBusqueda;
        });
    }, [products, categoriaActiva, busqueda]);

    return (
        <div className="catalog-page" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
            <section className="products-section section-padding">
                <div className="container">
                    <div className="section-header text-center" style={{ marginBottom: '2rem' }}>
                        <span className="subtitle">Explora todo lo que tenemos</span>
                        <h2 className="section-title">Catálogo Completo 🧶</h2>
                    </div>

                    {/* Buscador */}
                    <div className="search-container" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <input
                            type="text"
                            placeholder="🔍 Buscar amigurumis..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="search-input"
                            style={{
                                padding: '0.8rem 1.5rem',
                                borderRadius: '30px',
                                border: '2px solid var(--color-terracota)',
                                width: '100%',
                                maxWidth: '400px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Filtros */}
                    <div className="filters" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                        {CATEGORIAS.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoriaActiva(cat.id)}
                                className={`filter-btn ${categoriaActiva === cat.id ? 'active' : ''}`}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: categoriaActiva === cat.id ? 'none' : '2px solid #ddd',
                                    background: categoriaActiva === cat.id ? 'var(--color-terracota)' : 'white',
                                    color: categoriaActiva === cat.id ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontWeight: categoriaActiva === cat.id ? 'bold' : 'normal',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {cat.icon} {cat.nombre}
                            </button>
                        ))}
                    </div>

                    {/* Productos */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                            <p style={{ marginTop: '1rem' }}>Cargando productos...</p>
                        </div>
                    ) : productosFiltrados.length > 0 ? (
                        <>
                            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
                                Mostrando {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
                            </p>
                            <div className="products-grid">
                                {productosFiltrados.map(product => (
                                    <ProductCard key={product.id} product={product} onView={onView} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <i className="fa-solid fa-search fa-3x" style={{ color: '#ccc' }}></i>
                            <p style={{ marginTop: '1rem', color: '#666' }}>
                                {products.length === 0
                                    ? 'Aún no hay productos. ¡Añade algunos desde el panel de administración!'
                                    : 'No se encontraron productos con esos criterios'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CatalogPage;
