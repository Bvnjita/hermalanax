import React, { createContext, useState, useEffect, useContext } from 'react';
import { getGifts } from '../firebase/giftService';

const GiftsContext = createContext();

export const useGifts = () => useContext(GiftsContext);

export const GiftsProvider = ({ children }) => {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadGifts = async () => {
        try {
            setLoading(true);
            const data = await getGifts();
            // Solo mostrar regalos disponibles
            setGifts(data.filter(g => g.disponible !== false));
        } catch (error) {
            console.error('Error cargando regalos:', error);
            setGifts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGifts();
    }, []);

    const refreshGifts = () => {
        loadGifts();
    };

    const value = {
        gifts,
        loading,
        refreshGifts
    };

    return (
        <GiftsContext.Provider value={value}>
            {children}
        </GiftsContext.Provider>
    );
};
