import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const { cartCount, toggleCart } = useCart();
    const location = useLocation();

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="logo">Hermalanax</Link>

                <nav className="main-nav">
                    <ul>
                        <li><Link to="/" className={isActive('/')}>Inicio</Link></li>
                        <li><Link to="/catalogo" className={isActive('/catalogo')}>Catálogo</Link></li>
                        <li><a href="/#evidencias">Historias</a></li> {/* Use a href for hash link if not handled by router scroll */}
                    </ul>
                </nav>

                <div className="header-actions">
                    <button id="cart-btn" className="icon-btn" aria-label="Abrir carrito" onClick={toggleCart}>
                        <i className="fa-solid fa-basket-shopping"></i>
                        <span className={`cart-count ${cartCount > 0 ? 'bump' : ''}`}>{cartCount}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
