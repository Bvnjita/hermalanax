import React from 'react';
import { useCart } from '../context/CartContext';
import { formatoMoneda } from '../utils';

const ProductCard = ({ product, onView, delay }) => {
    const { addToCart } = useCart();

    const compartirProducto = (nombre) => {
        if (navigator.share) {
            navigator.share({
                title: 'Hermalanax Amigurumis',
                text: `¡Mira este ${nombre} que encontré! 🧶`,
                url: window.location.href
            }).catch(console.error);
        } else {
            alert("Link copiado al portapapeles 📋");
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <article className={`product-card ${product.stock === 0 ? 'agotado' : ''}`} data-aos="fade-up" data-aos-delay={delay}>
            <div className="card-image">
                <img src={product.imagen} alt={product.nombre} loading="lazy" />
            </div>
            <div className="card-info">
                <h3>{product.nombre}</h3>
                <p className="price">{formatoMoneda(product.precio)}</p>
                {product.stock > 0 && product.stock <= 3 && (
                    <p className="low-stock" style={{ color: '#e67e22', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <i className="fa-solid fa-fire"></i> ¡Solo quedan {product.stock}!
                    </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <button className="btn-add" onClick={() => addToCart(product.id)}>
                        Añadir <i className="fa-solid fa-plus"></i>
                    </button>
                    <button className="btn-view" onClick={() => onView(product)} title="Ver detalle">
                        <i className="fa-regular fa-eye"></i>
                    </button>
                    <button className="btn-share" onClick={() => compartirProducto(product.nombre)} title="Compartir" style={{ background: '#f5f5f5', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>
                        <i className="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
