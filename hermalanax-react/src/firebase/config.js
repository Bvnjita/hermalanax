// Importar funciones de Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBIkAgq5z7SDUM2IDgKBl2F33H9fONWuVI",
    authDomain: "hermalanax-36ab1.firebaseapp.com",
    projectId: "hermalanax-36ab1",
    storageBucket: "hermalanax-36ab1.firebasestorage.app",
    messagingSenderId: "857483320732",
    appId: "1:857483320732:web:de03dfdd9dd1c64c363c59"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
