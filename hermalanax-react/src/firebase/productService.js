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

const PRODUCTS_COLLECTION = 'products';

// Obtener todos los productos
export const getProducts = async () => {
    try {
        const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('nombre'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        throw error;
    }
};

// Añadir un nuevo producto
export const addProduct = async (productData) => {
    try {
        const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
            ...productData,
            createdAt: new Date()
        });
        return { id: docRef.id, ...productData };
    } catch (error) {
        console.error('Error añadiendo producto:', error);
        throw error;
    }
};

// Actualizar un producto
export const updateProduct = async (productId, productData) => {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        await updateDoc(productRef, {
            ...productData,
            updatedAt: new Date()
        });
        return { id: productId, ...productData };
    } catch (error) {
        console.error('Error actualizando producto:', error);
        throw error;
    }
};

// Eliminar un producto
export const deleteProduct = async (productId) => {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        await deleteDoc(productRef);
        return productId;
    } catch (error) {
        console.error('Error eliminando producto:', error);
        throw error;
    }
};

// Poblar Firestore con productos iniciales (ejecutar una vez)
export const seedProducts = async (products) => {
    try {
        const batch = products.map(product =>
            addDoc(collection(db, PRODUCTS_COLLECTION), product)
        );
        await Promise.all(batch);
        console.log('Productos sembrados correctamente');
    } catch (error) {
        console.error('Error sembrando productos:', error);
        throw error;
    }
};
