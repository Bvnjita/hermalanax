import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from './config';

const GIFTS_COLLECTION = 'gifts';

// Obtener todos los regalos disponibles
export const getGifts = async () => {
    try {
        const q = query(collection(db, GIFTS_COLLECTION), orderBy('nombre'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo regalos:', error);
        throw error;
    }
};

// Añadir un nuevo regalo
export const addGift = async (giftData) => {
    try {
        const docRef = await addDoc(collection(db, GIFTS_COLLECTION), {
            ...giftData,
            disponible: true,
            createdAt: new Date()
        });
        return { id: docRef.id, ...giftData };
    } catch (error) {
        console.error('Error añadiendo regalo:', error);
        throw error;
    }
};

// Actualizar un regalo
export const updateGift = async (giftId, giftData) => {
    try {
        const giftRef = doc(db, GIFTS_COLLECTION, giftId);
        await updateDoc(giftRef, {
            ...giftData,
            updatedAt: new Date()
        });
        return { id: giftId, ...giftData };
    } catch (error) {
        console.error('Error actualizando regalo:', error);
        throw error;
    }
};

// Eliminar un regalo
export const deleteGift = async (giftId) => {
    try {
        const giftRef = doc(db, GIFTS_COLLECTION, giftId);
        await deleteDoc(giftRef);
        return giftId;
    } catch (error) {
        console.error('Error eliminando regalo:', error);
        throw error;
    }
};
