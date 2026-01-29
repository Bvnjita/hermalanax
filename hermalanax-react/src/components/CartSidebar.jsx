import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useGifts } from '../context/GiftsContext';
import { formatoMoneda } from '../utils';

const CartSidebar = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { gifts } = useGifts();

    const [selectedGift, setSelectedGift] = useState(null);
    const [showGiftModal, setShowGiftModal] = useState(false);

    const meta = 30000;

    // Quitar regalo automáticamente si el total baja de la meta
    useEffect(() => {
        if (cartTotal < meta && selectedGift) {
            setSelectedGift(null);
        }
    }, [cartTotal, selectedGift]);
    const restante = Math.max(0, meta - cartTotal);
    const porcentaje = Math.min((cartTotal / meta) * 100, 100);
    const hasReachedGoal = cartTotal >= meta;

    let progressText = `Te faltan <strong>${formatoMoneda(meta)}</strong> para tu regalo 🎁`;
    let fillStyle = {};

    if (cartTotal === 0) {
        progressText = `Te faltan <strong>${formatoMoneda(meta)}</strong> para tu regalo 🎁`;
    } else if (hasReachedGoal) {
        progressText = selectedGift
            ? `¡Regalo elegido! 🎁 <strong>${selectedGift.nombre}</strong>`
            : `¡Felicidades! 🎉 <strong>¡Elige tu regalo!</strong>`;
        fillStyle = { background: "#FFD700" };
    } else {
        progressText = `¡Solo faltan <strong>${formatoMoneda(restante)}</strong> para el regalo! 🎁`;
    }

    const openGiftModal = () => {
        if (hasReachedGoal && gifts.length > 0) {
            setShowGiftModal(true);
        }
    };

    const selectGift = (gift) => {
        setSelectedGift(gift);
        setShowGiftModal(false);
    };

    const finalizarCompra = () => {
        if (cart.length === 0) return alert("¡Agrega amigurumis primero!");

        let mensaje = "Hola Hermalanax! 👋 Quiero pedir:%0A%0A";
        cart.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            mensaje += `• ${item.cantidad}x ${item.nombre} - ${formatoMoneda(subtotal)}%0A`;
        });
        mensaje += `%0A*TOTAL: ${formatoMoneda(cartTotal)}*`;

        // Añadir regalo si aplica
        if (hasReachedGoal && selectedGift) {
            mensaje += `%0A%0A🎁 *REGALO ELEGIDO:* ${selectedGift.nombre}`;
        }

        setTimeout(() => {
            window.open(`https://wa.me/56937010443?text=${mensaje}`, '_blank');
        }, 1500);
    };

    return (
        <>
            <aside id="carrito-sidebar" className={`cart-sidebar ${isCartOpen ? 'active' : ''}`}>
                <div className="cart-header">
                    <h3>Tu Canasta</h3>
                    <button id="close-cart" className="close-btn" onClick={toggleCart}>&times;</button>
                </div>

                {/* Barra de progreso - clickeable si cumple meta */}
                <div
                    className="shipping-progress"
                    onClick={openGiftModal}
                    style={{ cursor: hasReachedGoal && gifts.length > 0 ? 'pointer' : 'default' }}
                >
                    <p id="progress-text" dangerouslySetInnerHTML={{ __html: progressText }}></p>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-fill"
                            style={{ width: `${porcentaje}%`, ...fillStyle }}
                        ></div>
                    </div>
                    {hasReachedGoal && gifts.length > 0 && !selectedGift && (
                        <button
                            className="btn-primary"
                            style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                            onClick={(e) => { e.stopPropagation(); openGiftModal(); }}
                        >
                            <i className="fa-solid fa-gift"></i> Elegir mi regalo
                        </button>
                    )}
                    {selectedGift && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', background: '#f0fdf4', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid #86efac' }}>
                            <img src={selectedGift.imagen} alt={selectedGift.nombre} style={{ width: '35px', height: '35px', borderRadius: '6px', objectFit: 'cover' }} />
                            <span style={{ fontSize: '0.85rem', flex: 1, fontWeight: '500' }}>{selectedGift.nombre}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); openGiftModal(); }}
                                style={{
                                    background: '#5d7052',
                                    color: 'white',
                                    border: 'none',
                                    padding: '4px 10px',
                                    borderRadius: '15px',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fa-solid fa-arrows-rotate"></i> Cambiar
                            </button>
                        </div>
                    )}
                </div>

                <div className="cart-body">
                    {cart.length === 0 ? (
                        <div className="empty-cart-state" style={{ textAlign: 'center', padding: '2rem' }}>
                            <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Cesta vacía" style={{ width: '100px', opacity: 0.8, marginBottom: '1rem' }} />
                            <p className="empty-msg">Tu canasta está vacía</p>
                            <button onClick={toggleCart} className="btn-primary" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Ir a vitrinear</button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                <img src={item.imagen} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} alt={item.nombre} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.nombre}</h4>
                                    <span style={{ color: 'var(--color-musgo)', fontWeight: 'bold', fontSize: '0.9rem' }}>{formatoMoneda(item.precio)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f5f5f5', padding: '0.2rem', borderRadius: '20px' }}>
                                    <button onClick={() => updateQuantity(item.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0 8px', fontWeight: 'bold' }}>-</button>
                                    <span style={{ fontSize: '0.9rem' }}>{item.cantidad}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0 8px', fontWeight: 'bold' }}>+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} style={{ color: '#ff6b6b', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '0.5rem' }}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total:</span>
                        <span>{formatoMoneda(cartTotal)}</span>
                    </div>
                    <button className="btn-primary full-width" onClick={finalizarCompra}>Finalizar Compra</button>
                </div>
            </aside>

            {/* Overlay */}
            <div
                id="overlay"
                className="overlay"
                style={{ visibility: isCartOpen ? 'visible' : 'hidden', opacity: isCartOpen ? '1' : '0' }}
                onClick={toggleCart}
            ></div>

            {/* Modal de Selección de Regalo */}
            {showGiftModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem'
                }} onClick={() => setShowGiftModal(false)}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '85vh',
                        overflowY: 'auto'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '3rem' }}>🎁</div>
                            <h2 style={{ fontFamily: 'var(--font-titulo)', marginBottom: '0.5rem' }}>¡Elige tu regalo!</h2>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                Por tu compra sobre $30.000, te ganaste un regalo. ¡Elige uno!
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
                            {gifts.map(gift => (
                                <div
                                    key={gift.id}
                                    onClick={() => selectGift(gift)}
                                    style={{
                                        background: selectedGift?.id === gift.id ? '#f0fdf4' : 'white',
                                        border: selectedGift?.id === gift.id ? '3px solid #5d7052' : '2px solid #eee',
                                        borderRadius: '16px',
                                        padding: '1.2rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        transform: selectedGift?.id === gift.id ? 'scale(1.02)' : 'scale(1)'
                                    }}
                                >
                                    <img
                                        src={gift.imagen}
                                        alt={gift.nombre}
                                        style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', marginBottom: '0.8rem' }}
                                        onError={(e) => { e.target.src = '/img/mariposa.jpg'; }}
                                    />
                                    <p style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0, color: selectedGift?.id === gift.id ? '#5d7052' : '#333' }}>{gift.nombre}</p>
                                    {selectedGift?.id === gift.id && (
                                        <span style={{ display: 'inline-block', marginTop: '0.5rem', background: '#5d7052', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem' }}>
                                            ✓ Seleccionado
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowGiftModal(false)}
                            style={{
                                marginTop: '1.5rem',
                                width: '100%',
                                padding: '1rem',
                                background: '#eee',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartSidebar;
