import React, { useState, useEffect } from 'react';
import { getGifts, addGift, updateGift, deleteGift } from '../firebase/giftService';

// Lista de imágenes disponibles para regalos
const IMAGENES_REGALOS = [
    'mariposa.jpg', 'flor_llavero.jpg', 'corazones.jpg', 'patitas.jpg',
    'pinche_azul.jpg', 'pinche_flor.jpg', 'sol.jpg', 'hongito.jpg'
];

const GiftsManager = () => {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingGift, setEditingGift] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        imagen: IMAGENES_REGALOS[0],
        disponible: true
    });

    // Modal de confirmación de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [giftToDelete, setGiftToDelete] = useState(null);

    useEffect(() => {
        loadGifts();
    }, []);

    const loadGifts = async () => {
        try {
            setLoading(true);
            const data = await getGifts();
            setGifts(data);
        } catch (err) {
            console.error('Error cargando regalos:', err);
            setGifts([]);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingGift(null);
        setFormData({ nombre: '', imagen: IMAGENES_REGALOS[0], disponible: true });
        setShowModal(true);
    };

    const openEditModal = (gift) => {
        setEditingGift(gift);
        const imageName = gift.imagen.replace('/img/', '');
        setFormData({
            nombre: gift.nombre,
            imagen: IMAGENES_REGALOS.includes(imageName) ? imageName : IMAGENES_REGALOS[0],
            disponible: gift.disponible !== false
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const giftData = {
                nombre: formData.nombre,
                imagen: `/img/${formData.imagen}`,
                disponible: formData.disponible
            };

            if (editingGift) {
                await updateGift(editingGift.id, giftData);
            } else {
                await addGift(giftData);
            }

            await loadGifts();
            setShowModal(false);
        } catch (err) {
            setError('Error guardando regalo');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const openDeleteModal = (gift) => {
        setGiftToDelete(gift);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!giftToDelete) return;
        try {
            await deleteGift(giftToDelete.id);
            await loadGifts();
            setShowDeleteModal(false);
            setGiftToDelete(null);
        } catch (err) {
            setError('Error eliminando regalo');
            console.error(err);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setGiftToDelete(null);
    };

    return (
        <div>
            {/* Header de sección */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-titulo)', color: 'var(--color-madera-oscuro)', marginBottom: '0.5rem' }}>
                        🎁 Gestión de Regalos
                    </h2>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Los clientes pueden elegir un regalo gratis cuando su compra supera los $30.000
                    </p>
                </div>
                <button onClick={openAddModal} className="btn-primary">
                    <i className="fa-solid fa-plus"></i> Añadir Regalo
                </button>
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                    <i className="fa-solid fa-exclamation-triangle"></i> {error}
                </div>
            )}

            {/* Lista de regalos */}
            <div style={{ background: 'white', borderRadius: '15px', boxShadow: 'var(--shadow-suave)', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                        <p style={{ marginTop: '1rem' }}>Cargando regalos...</p>
                    </div>
                ) : gifts.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <i className="fa-solid fa-gift fa-3x" style={{ color: '#ccc' }}></i>
                        <p style={{ marginTop: '1rem', color: '#666' }}>No hay regalos configurados. ¡Añade el primero!</p>
                        <button onClick={openAddModal} className="btn-primary" style={{ marginTop: '1rem' }}>
                            <i className="fa-solid fa-plus"></i> Añadir Regalo
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', padding: '1.5rem' }}>
                        {gifts.map(gift => (
                            <div key={gift.id} style={{
                                background: 'var(--color-bg-alt)',
                                borderRadius: '12px',
                                padding: '1rem',
                                textAlign: 'center',
                                position: 'relative',
                                opacity: gift.disponible === false ? 0.5 : 1
                            }}>
                                {gift.disponible === false && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: '#dc2626',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        fontSize: '0.7rem'
                                    }}>
                                        Oculto
                                    </span>
                                )}
                                <img
                                    src={gift.imagen}
                                    alt={gift.nombre}
                                    style={{ width: '100px', height: '100px', borderRadius: '10px', objectFit: 'cover', marginBottom: '0.5rem' }}
                                    onError={(e) => { e.target.src = '/img/mariposa.jpg'; }}
                                />
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{gift.nombre}</h4>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => openEditModal(gift)}
                                        style={{
                                            background: 'var(--color-musgo)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(gift)}
                                        style={{
                                            background: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Añadir/Editar */}
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
                        maxWidth: '400px',
                        width: '100%'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-titulo)' }}>
                            {editingGift ? '✏️ Editar Regalo' : '🎁 Nuevo Regalo'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nombre *</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '10px', boxSizing: 'border-box' }}
                                    placeholder="Ej: Llavero Sorpresa"
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Imagen</label>
                                <select
                                    value={formData.imagen}
                                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '10px', boxSizing: 'border-box' }}
                                >
                                    {IMAGENES_REGALOS.map(img => (
                                        <option key={img} value={img}>{img}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                                <img
                                    src={`/img/${formData.imagen}`}
                                    alt="Preview"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.disponible}
                                        onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontWeight: '600' }}>Disponible para clientes</span>
                                </label>
                            </div>

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
            {showDeleteModal && giftToDelete && (
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
                            ¿Eliminar regalo?
                        </h3>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            Estás a punto de eliminar <strong>"{giftToDelete.nombre}"</strong>.
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

export default GiftsManager;
