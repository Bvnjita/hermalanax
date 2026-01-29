import { createContext, useState, useEffect, useContext } from 'react';
import { useProducts } from './ProductsContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { products } = useProducts();

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('hermalanax_carrito');
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('hermalanax_carrito', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (id) => {
        const producto = products.find(p => p.id === id);
        if (!producto) return;
        if (producto.stock === 0) {
            alert("Lo sentimos, este producto está agotado.");
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === id);
            if (existing) {
                return prev.map(item => item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item);
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });

        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, change) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = item.cantidad + change;
                if (newQuantity <= 0) return null;
                return { ...item, cantidad: newQuantity };
            }
            return item;
        }).filter(Boolean));
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const cartTotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CartContext.Provider value={{
            cart,
            isCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
