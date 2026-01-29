import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../firebase/productService';
import { formatoMoneda } from '../utils';
import GiftsManager from '../components/GiftsManager';

const CATEGORIAS = ['llaveros', 'animales', 'plantas', 'accesorios', 'fandom', 'deco'];

// Lista de imágenes disponibles en /public/img/
const IMAGENES_LOCALES = [
    'ajolote.jpg', 'arcoiris.jpg', 'arthur.jpg', 'ballenita.jpg', 'banner.png',
    'bautizo_babyshower.jpg', 'cactus.jpg', 'calabaza.jpg', 'corazones.jpg',
    'diente.jpg', 'dinosaurios.jpg', 'flor_amarilla_blanca.jpg', 'flor_amarilla.jpg',
    'flor_azul.jpg', 'flor_fiona.jpg', 'flor_llavero.jpg', 'girasol_grande.jpg',
    'girasol_peque.jpg', 'helado.jpg', 'hongito.jpg', 'mariposa.jpg',
    'moño_amarillo.jpg', 'ope_ope_no_mi.jpg', 'pajarito.jpg', 'patitas.jpg',
    'perrito.jpg', 'pinche_azul.jpg', 'pinche_flor.jpg', 'pinguino_grande.jpg',
    'pulpo.jpg', 'pulpos.jpg', 'sol.jpg', 'sombrero_luffy.jpg', 'sombreros.jpg', 'vaquita.jpg'
];

const DashboardPage = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        stock: '',
        categoria: 'llaveros',
        imagen: ''
    });
    const [imageMode, setImageMode] = useState('local'); // 'local' o 'url'
    const [customUrl, setCustomUrl] = useState('');

    // Modal de confirmación de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Tab activo
    const [activeTab, setActiveTab] = useState('productos');

    // Proteger ruta
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Cargar productos
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            // No mostrar error, simplemente mostrar lista vacía
            console.error('Error cargando productos:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ nombre: '', precio: '', stock: '', categoria: 'llaveros', imagen: IMAGENES_LOCALES[0] });
        setImageMode('local');
        setCustomUrl('');
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            nombre: product.nombre,
            precio: product.precio.toString(),
            stock: product.stock.toString(),
            categoria: product.categoria,
            imagen: product.imagen
        });
        // Detectar si es URL local o externa
        if (product.imagen.startsWith('/img/') || product.imagen.startsWith('img/')) {
            setImageMode('local');
            setCustomUrl('');
        } else {
            setImageMode('url');
            setCustomUrl(product.imagen);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            // Determinar la URL de la imagen
            let imageUrl = '';
            if (imageMode === 'local') {
                imageUrl = `/img/${formData.imagen}`;
            } else {
                imageUrl = customUrl || '/img/mariposa.jpg'; // Fallback
            }

            const productData = {
                nombre: formData.nombre,
                precio: parseInt(formData.precio),
                stock: parseInt(formData.stock),
                categoria: formData.categoria,
                imagen: imageUrl
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await addProduct(productData);
            }

            await loadProducts();
            setShowModal(false);
        } catch (err) {
            setError('Error guardando producto. Verifica los permisos de Firestore.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct(productToDelete.id);
            await loadProducts();
            setShowDeleteModal(false);
            setProductToDelete(null);
        } catch (err) {
            setError('Error eliminando producto');
            console.error(err);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="dashboard-page" style={{ minHeight: '100vh', background: 'var(--color-bg-crema)', paddingTop: '2rem' }}>
            {/* Header */}
            <div className="container" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-titulo)', color: 'var(--color-madera-oscuro)', marginBottom: '0.5rem' }}>
                            Panel de Administración 🛠️
                        </h1>
                        <p style={{ color: '#666' }}>
                            Bienvenido, <strong>{user?.email}</strong>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button onClick={openAddModal} className="btn-primary">
                            <i className="fa-solid fa-plus"></i> Añadir Producto
                        </button>
                        <button onClick={() => navigate('/')} style={{
                            background: 'var(--color-musgo)',
                            color: 'white',
                            border: 'none',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                            <i className="fa-solid fa-store"></i> Ver Tienda
                        </button>
                        <button onClick={handleLogout} style={{
                            background: 'transparent',
                            border: '2px solid #dc2626',
                            color: '#dc2626',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                            <i className="fa-solid fa-right-from-bracket"></i> Salir
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="container" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', background: '#f8f5f2', padding: '0.5rem', borderRadius: '15px', border: '2px solid #e8e0d8' }}>
                    <button
                        onClick={() => setActiveTab('productos')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            background: activeTab === 'productos' ? '#5d7052' : 'transparent',
                            color: activeTab === 'productos' ? 'white' : '#888',
                            boxShadow: activeTab === 'productos' ? '0 4px 12px rgba(93, 112, 82, 0.3)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        <i className="fa-solid fa-box"></i> Productos
                    </button>
                    <button
                        onClick={() => setActiveTab('regalos')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            background: activeTab === 'regalos' ? '#c67b5c' : 'transparent',
                            color: activeTab === 'regalos' ? 'white' : '#888',
                            boxShadow: activeTab === 'regalos' ? '0 4px 12px rgba(198, 123, 92, 0.3)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        <i className="fa-solid fa-gift"></i> Regalos (+$30k)
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="container" style={{ marginBottom: '1rem' }}>
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '10px' }}>
                        <i className="fa-solid fa-exclamation-triangle"></i> {error}
                    </div>
                </div>
            )}

            {/* Contenido según tab activo */}
            {activeTab === 'regalos' ? (
                <div className="container">
                    <GiftsManager />
                </div>
            ) : (
                <>
                    {/* Products Table */}
                    <div className="container">
                        <div style={{ background: 'white', borderRadius: '15px', boxShadow: 'var(--shadow-suave)', overflow: 'hidden' }}>
                            {loading ? (
                                <div style={{ padding: '3rem', textAlign: 'center' }}>
                                    <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                                    <p style={{ marginTop: '1rem' }}>Cargando productos...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center' }}>
                                    <i className="fa-solid fa-box-open fa-3x" style={{ color: '#ccc' }}></i>
                                    <p style={{ marginTop: '1rem', color: '#666' }}>No hay productos. ¡Añade el primero!</p>
                                    <button onClick={openAddModal} className="btn-primary" style={{ marginTop: '1rem' }}>
                                        <i className="fa-solid fa-plus"></i> Añadir Producto
                                    </button>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                                        <thead>
                                            <tr style={{ background: 'var(--color-bg-alt)', textAlign: 'left' }}>
                                                <th style={{ padding: '1rem' }}>Imagen</th>
                                                <th style={{ padding: '1rem' }}>Producto</th>
                                                <th style={{ padding: '1rem' }}>Categoría</th>
                                                <th style={{ padding: '1rem' }}>Precio</th>
                                                <th style={{ padding: '1rem' }}>Stock</th>
                                                <th style={{ padding: '1rem' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '1rem' }}>
                                                        <img
                                                            src={product.imagen}
                                                            alt={product.nombre}
                                                            style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                                                            onError={(e) => { e.target.src = '/img/mariposa.jpg'; }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{product.nombre}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            background: 'var(--color-bg-alt)',
                                                            padding: '4px 10px',
                                                            borderRadius: '15px',
                                                            fontSize: '0.85rem',
                                                            textTransform: 'capitalize'
                                                        }}>
                                                            {product.categoria}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem', color: 'var(--color-musgo)', fontWeight: 'bold' }}>
                                                        {formatoMoneda(product.precio)}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            color: product.stock === 0 ? '#dc2626' : product.stock <= 3 ? '#f59e0b' : '#22c55e',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <button
                                                            onClick={() => openEditModal(product)}
                                                            style={{
                                                                background: 'var(--color-musgo)',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '8px 12px',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer',
                                                                marginRight: '8px'
                                                            }}
                                                            title="Editar"
                                                        >
                                                            <i className="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(product)}
                                                            style={{
                                                                background: '#dc2626',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '8px 12px',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Eliminar"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', textAlign: 'center', boxShadow: 'var(--shadow-suave)' }}>
                                <i className="fa-solid fa-box" style={{ fontSize: '2rem', color: 'var(--color-musgo)' }}></i>
                                <h3 style={{ margin: '0.5rem 0' }}>{products.length}</h3>
                                <p style={{ color: '#666', margin: 0 }}>Productos</p>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', textAlign: 'center', boxShadow: 'var(--shadow-suave)' }}>
                                <i className="fa-solid fa-exclamation-circle" style={{ fontSize: '2rem', color: '#f59e0b' }}></i>
                                <h3 style={{ margin: '0.5rem 0' }}>{products.filter(p => p.stock <= 3 && p.stock > 0).length}</h3>
                                <p style={{ color: '#666', margin: 0 }}>Stock Bajo</p>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', textAlign: 'center', boxShadow: 'var(--shadow-suave)' }}>
                                <i className="fa-solid fa-ban" style={{ fontSize: '2rem', color: '#dc2626' }}></i>
                                <h3 style={{ margin: '0.5rem 0' }}>{products.filter(p => p.stock === 0).length}</h3>
                                <p style={{ color: '#666', margin: 0 }}>Agotados</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5000,
                    padding: '1rem'
                }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-titulo)' }}>
                            {editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {/* Nombre */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nombre *</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '10px', boxSizing: 'border-box' }}
                                    placeholder="Ej: Llavero Mariposa"
                                />
                            </div>

                            {/* Precio y Stock */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Precio (CLP) *</label>
                                    <input
                                        type="number"
                                        value={formData.precio}
                                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                        required
                                        min="0"
                                        style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '10px', boxSizing: 'border-box' }}
                                        placeholder="1500"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Stock *</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                        min="0"
                                        style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '10px', boxSizing: 'border-box' }}
                                        placeholder="10"
                                    />
                                </div>
                            </div>

                            {/* Categoría */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Categoría *</label>
                                <select
                                    value={formData.categoria}
                                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '10px', boxSizing: 'border-box' }}
                                >
                                    {CATEGORIAS.map(cat => (
                                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Imagen - Selector de modo */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Imagen</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('local')}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            border: `2px solid ${imageMode === 'local' ? 'var(--color-musgo)' : '#eee'}`,
                                            background: imageMode === 'local' ? 'var(--color-bg-alt)' : 'white',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: imageMode === 'local' ? 'bold' : 'normal'
                                        }}
                                    >
                                        📁 Imagen Local
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('url')}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            border: `2px solid ${imageMode === 'url' ? 'var(--color-musgo)' : '#eee'}`,
                                            background: imageMode === 'url' ? 'var(--color-bg-alt)' : 'white',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: imageMode === 'url' ? 'bold' : 'normal'
                                        }}
                                    >
                                        🔗 URL Externa
                                    </button>
                                </div>

                                {imageMode === 'local' ? (
                                    <select
                                        value={formData.imagen}
                                        onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '10px', boxSizing: 'border-box' }}
                                    >
                                        {IMAGENES_LOCALES.map(img => (
                                            <option key={img} value={img}>{img}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="url"
                                        value={customUrl}
                                        onChange={(e) => setCustomUrl(e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '10px', boxSizing: 'border-box' }}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                )}
                            </div>

                            {/* Preview */}
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Vista previa:</p>
                                <img
                                    src={imageMode === 'local' ? `/img/${formData.imagen}` : (customUrl || '/img/mariposa.jpg')}
                                    alt="Preview"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #eee' }}
                                    onError={(e) => { e.target.src = '/img/mariposa.jpg'; }}
                                />
                            </div>

                            {/* Botones */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: '#eee',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn-primary"
                                    style={{ flex: 1, padding: '1rem' }}
                                >
                                    {saving ? (
                                        <><i className="fa-solid fa-spinner fa-spin"></i> Guardando...</>
                                    ) : (
                                        <><i className="fa-solid fa-save"></i> Guardar</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Eliminación */}
            {showDeleteModal && productToDelete && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 6000,
                    padding: '1rem'
                }} onClick={(e) => { if (e.target === e.currentTarget) cancelDelete(); }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗑️</div>
                        <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-titulo)' }}>
                            ¿Eliminar producto?
                        </h3>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            Estás a punto de eliminar <strong>"{productToDelete.nombre}"</strong>. Esta acción no se puede deshacer.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={cancelDelete}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    background: '#eee',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fa-solid fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
