import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="container">
                <p>
                    &copy; 2024 <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Hermalanax</Link>. Hecho a mano en Chile.
                </p>
                <div className="social-links">
                    <a href="https://www.instagram.com/hermalanax" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
                    <a href="https://www.tiktok.com/@paulaaarcely" target="_blank" rel="noreferrer"><i className="fa-brands fa-tiktok"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
