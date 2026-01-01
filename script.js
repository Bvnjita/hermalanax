/* =========================================
   1. BASE DE DATOS (Interna para evitar errores de carga)
   ========================================= */
const PRODUCTOS = [
  // --- LLAVEROS ---
  { id: 1, nombre: "Llavero Mariposa", precio: 1500, categoria: "llaveros", imagen: "img/mariposa.jpg", stock: 10 },
  { id: 2, nombre: "Llavero Margarita", precio: 1500, categoria: "llaveros", imagen: "img/flor_amarilla_blanca.jpg", stock: 10 },
  { id: 3, nombre: "Llavero Ajolote", precio: 2000, categoria: "llaveros", imagen: "img/ajolote.jpg", stock: 5 },
  { id: 4, nombre: "Llavero Corazón", precio: 1000, categoria: "llaveros", imagen: "img/corazones.jpg", stock: 10 },
  { id: 5, nombre: "Llavero Patita", precio: 1500, categoria: "llaveros", imagen: "img/patitas.jpg", stock: 10 },
  { id: 6, nombre: "Llavero Arcoíris", precio: 1000, categoria: "llaveros", imagen: "img/arcoiris.jpg", stock: 10 },
  { id: 7, nombre: "Llavero Cactus", precio: 1500, categoria: "llaveros", imagen: "img/cactus.jpg", stock: 10 },

  // --- ANIMALES ---
  { id: 8, nombre: "Medusa", precio: 2000, categoria: "animales", imagen: "img/pulpo.jpg", stock: 5 },
  { id: 9, nombre: "Ballenita", precio: 1000, categoria: "animales", imagen: "img/ballenita.jpg", stock: 5 },
  { id: 10, nombre: "Mini Pingüino", precio: 1000, categoria: "animales", imagen: "img/pajarito.jpg", stock: 5 },
  { id: 11, nombre: "Pingüino Grande", precio: 6000, categoria: "animales", imagen: "img/pinguino_grande.jpg", stock: 2 }, // Stock bajo para probar alerta
  { id: 12, nombre: "Vaquita", precio: 15000, categoria: "animales", imagen: "img/vaquita.jpg", stock: 3 }, // Stock bajo
  { id: 33, nombre: "Dinosaurios", precio: 3000, categoria: "animales", imagen: "img/dinosaurios.jpg", stock: 5 },
  { id: 34, nombre: "Pulpo", precio: 3000, categoria: "animales", imagen: "img/pulpos.jpg", stock: 5 },

  // --- PLANTAS ---
  { id: 13, nombre: "Girasol de Escritorio", precio: 3500, categoria: "plantas", imagen: "img/girasol_peque.jpg", stock: 5 },
  { id: 14, nombre: "Girasol Grande", precio: 4000, categoria: "plantas", imagen: "img/girasol_grande.jpg", stock: 5 },
  { id: 15, nombre: "Mini Honguitos", precio: 1500, categoria: "plantas", imagen: "img/hongito.jpg", stock: 5 },
  { id: 16, nombre: "Flor Turquesa", precio: 2000, categoria: "plantas", imagen: "img/flor_llavero.jpg", stock: 5 },
  { id: 17, nombre: "Flores Azules", precio: 1500, categoria: "plantas", imagen: "img/flor_azul.jpg", stock: 5 },

  // --- ACCESORIOS ---
  { id: 18, nombre: "Pinche Flor Amarilla", precio: 1500, categoria: "accesorios", imagen: "img/flor_amarilla.jpg", stock: 10 },
  { id: 19, nombre: "Pinche Flores Pequeñas", precio: 1000, categoria: "accesorios", imagen: "img/pinche_flor.jpg", stock: 10 },
  { id: 20, nombre: "Moño", precio: 2500, categoria: "accesorios", imagen: "img/pinche_azul.jpg", stock: 10 },
  { id: 21, nombre: "Moño Amarillo", precio: 1000, categoria: "accesorios", imagen: "img/moño_amarillo.jpg", stock: 10 },

  // --- FANDOM ---
  { id: 22, nombre: "Flor de Fiona", precio: 10000, categoria: "fandom", imagen: "img/flor_fiona.jpg", stock: 1 }, // Solo 1
  { id: 23, nombre: "Chimmy (BT21)", precio: 4000, categoria: "fandom", imagen: "img/perrito.jpg", stock: 5 },
  { id: 24, nombre: "Fruta Ope Ope no Mi", precio: 7000, categoria: "fandom", imagen: "img/ope_ope_no_mi.jpg", stock: 5 },
  { id: 25, nombre: "Sombrero Luffy Pequeño", precio: 2500, categoria: "fandom", imagen: "img/sombrero_luffy.jpg", stock: 5 },
  { id: 32, nombre: "Arthur Morgan", precio: 10000, categoria: "fandom", imagen: "img/arthur.jpg", stock: 0 }, // AGOTADO PARA PROBAR

  // --- DECO ---
  { id: 26, nombre: "Amigurumi Helado", precio: 2000, categoria: "deco", imagen: "img/helado.jpg", stock: 5 },
  { id: 27, nombre: "Diente", precio: 3500, categoria: "deco", imagen: "img/diente.jpg", stock: 5 },
  { id: 28, nombre: "Recuerdo Bautizo", precio: 300, categoria: "deco", imagen: "img/bautizo_babyshower.jpg", stock: 50 },
  { id: 29, nombre: "Amigurumi Sol", precio: 2000, categoria: "deco", imagen: "img/girasol_grande.jpg", stock: 5 },
  { id: 30, nombre: "Mini Calabaza", precio: 1500, categoria: "deco", imagen: "img/calabaza.jpg", stock: 5 },
  { id: 31, nombre: "Fosforero con Imán", precio: 6000, categoria: "deco", imagen: "img/sombreros.jpg", stock: 5 }
];

let carrito = JSON.parse(localStorage.getItem('hermalanax_carrito')) || [];

/* =========================================
   2. SIMULACIÓN DE CARGA (Para Preloader)
   ========================================= */
function cargarProductos() {
    const preloader = document.getElementById('preloader');
    
    // Fingimos una carga breve
    setTimeout(() => {
        console.log("Productos listos.");
        actualizarVistas();
        
        // Quitar preloader
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        // Actualizar contadores de filtro
        actualizarContadoresFiltros();
        
    }, 500);
}

/* =========================================
   3. HEADER INTELIGENTE
   ========================================= */
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (header) {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
});

/* =========================================
   4. REFERENCIAS DOM
   ========================================= */
const sidebarCarrito = document.getElementById('carrito-sidebar');
const listaCarritoDOM = document.querySelector('.cart-body');
const contadorCarrito = document.querySelector('.cart-count');
const totalPrecioDOM = document.querySelector('.cart-total span:last-child');
const overlay = document.getElementById('overlay');
const inputBuscador = document.getElementById('buscador');

/* =========================================
   5. LÓGICA DEL CARRITO (CORE)
   ========================================= */
function guardarCarrito() {
    localStorage.setItem('hermalanax_carrito', JSON.stringify(carrito));
    renderizarCarritoSidebar();
    actualizarContador();
}

function agregarAlCarrito(id) {
    const producto = PRODUCTOS.find(p => p.id === id);
    if (!producto) return;

    if (producto.stock === 0) return alert("Lo sentimos, este producto está agotado.");

    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    mostrarNotificacion(`¡${producto.nombre} agregado! 🧶`);
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            guardarCarrito();
        }
    }
}

/* =========================================
   6. RENDERIZADO (VISUALIZACIÓN)
   ========================================= */

// --- ESTA ES LA FUNCIÓN QUE TE FALTABA ---
function renderizarEnContenedor(listaProductos, contenedorID) {
    const contenedor = document.getElementById(contenedorID);
    if (!contenedor) return; 

    contenedor.innerHTML = '';
    
    if (listaProductos.length === 0) {
        contenedor.innerHTML = `
            <p class="no-results" style="grid-column: 1/-1; text-align:center; padding: 2rem;" data-aos="fade-in">
                No encontramos coincidencias :(
            </p>
        `;
        return;
    }

    listaProductos.forEach((prod, index) => {
        const card = document.createElement('article');
        card.classList.add('product-card');
        
        // Estado Agotado
        if (prod.stock === 0) {
            card.classList.add('agotado');
        }

        // Animaciones AOS
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 50); 
        
        // Alerta de Stock Bajo
        let mensajeStockHTML = '';
        if (prod.stock > 0 && prod.stock <= 3) {
            mensajeStockHTML = `<p class="low-stock" style="color:#e67e22; font-size:0.8rem; font-weight:bold;"><i class="fa-solid fa-fire"></i> ¡Solo quedan ${prod.stock}!</p>`;
        }

        // Botón Compartir
        const btnShare = `
            <button class="btn-share" onclick="compartirProducto('${prod.nombre}')" title="Compartir" style="background:#f5f5f5; border:none; width:35px; height:35px; border-radius:50%; cursor:pointer;">
                <i class="fa-solid fa-share-nodes"></i>
            </button>
        `;

        card.innerHTML = `
            <div class="card-image">
                <img src="${prod.imagen}" alt="${prod.nombre}">
            </div>
            <div class="card-info">
                <h3>${prod.nombre}</h3>
                <p class="price">${formatoMoneda(prod.precio)}</p>
                ${mensajeStockHTML}
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 10px;">
                    <button class="btn-add" onclick="agregarAlCarrito(${prod.id})">
                        Añadir <i class="fa-solid fa-plus"></i>
                    </button>
                    <button class="btn-view" onclick="abrirVistaPrevia(${prod.id})" title="Ver detalle">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                    ${btnShare}
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function renderizarCarritoSidebar() {
    if (!listaCarritoDOM) return;

    // 1. CÁLCULO INICIAL DEL TOTAL (Para evitar errores)
    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });

    // 2. AUTO-CORRECCIÓN DE LA BARRA DE PROGRESO
    let progressContainer = document.querySelector('.shipping-progress');
    if (!progressContainer) {
        const cartHeader = document.querySelector('.cart-header');
        if (cartHeader) {
            cartHeader.insertAdjacentHTML('afterend', `
                <div class="shipping-progress">
                    <p id="progress-text" style="font-size:0.85rem; text-align:center; margin-bottom:5px;">Calculando regalo...</p>
                    <div class="progress-bar-bg" style="width:100%; height:8px; background:#e0e0e0; border-radius:10px; overflow:hidden;">
                        <div class="progress-fill" id="progress-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #5c8d89, #a8e063); transition:width 0.5s;"></div>
                    </div>
                </div>
            `);
        }
    }

    // 3. RENDERIZADO DE ITEMS
    listaCarritoDOM.innerHTML = '';
    
    if (carrito.length === 0) {
        listaCarritoDOM.innerHTML = `
            <div class="empty-cart-state" style="text-align:center; padding:2rem;">
                <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Cesta vacía" style="width: 100px; opacity: 0.8; margin-bottom: 1rem;">
                <p class="empty-msg">Tu canasta está vacía</p>
                <button onclick="toggleCart()" class="btn-primary" style="margin-top:1rem; font-size:0.9rem;">Ir a vitrinear</button>
            </div>`;
    } else {
        carrito.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = `display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;`;
            itemDiv.innerHTML = `
                <img src="${item.imagen}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
                <div style="flex:1;">
                    <h4 style="font-size: 0.9rem; margin-bottom: 0.2rem;">${item.nombre}</h4>
                    <span style="color: var(--color-musgo); font-weight:bold; font-size: 0.9rem;">${formatoMoneda(item.precio)}</span>
                </div>
                <div style="display:flex; align-items:center; gap: 0.5rem; background: #f5f5f5; padding: 0.2rem; border-radius: 20px;">
                    <button onclick="cambiarCantidad(${item.id}, -1)" style="border:none; background:none; cursor:pointer; padding: 0 8px; font-weight:bold;">-</button>
                    <span style="font-size: 0.9rem;">${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${item.id}, 1)" style="border:none; background:none; cursor:pointer; padding: 0 8px; font-weight:bold;">+</button>
                </div>
                <button onclick="eliminarDelCarrito(${item.id})" style="color: #ff6b6b; border:none; background:none; cursor:pointer; margin-left: 0.5rem;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            listaCarritoDOM.appendChild(itemDiv);
        });
    }

    // 4. ACTUALIZAR PRECIO TOTAL TEXTO
    if (totalPrecioDOM) totalPrecioDOM.textContent = formatoMoneda(total);

    // 5. ACTUALIZAR VISUALMENTE LA BARRA
    const meta = 30000; 
    const restante = Math.max(0, meta - total);
    const porcentaje = Math.min((total / meta) * 100, 100);
    
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');

    if (progressText && progressFill) {
        progressFill.style.width = `${porcentaje}%`;

        if (total === 0) {
            progressText.innerHTML = `Te faltan <strong>${formatoMoneda(meta)}</strong> para tu regalo 🎁`;
            progressFill.style.background = ""; 
        } else if (total >= meta) {
            progressText.innerHTML = `¡Felicidades! 🎉 <strong>¡Te ganaste el regalo!</strong>`;
            progressFill.style.background = "#FFD700"; 
        } else {
            progressText.innerHTML = `¡Solo faltan <strong>${formatoMoneda(restante)}</strong> para el regalo! 🎁`;
            progressFill.style.background = ""; 
        }
    }
}

function actualizarContador() {
    if (!contadorCarrito) return;
    const cuenta = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = cuenta;
    contadorCarrito.classList.remove('bump');
    void contadorCarrito.offsetWidth; 
    contadorCarrito.classList.add('bump');
}

function actualizarVistas() {
    // Renderizar destacados (solo 6)
    if (document.getElementById('destacados-grid')) {
        renderizarEnContenedor(PRODUCTOS.slice(0, 6), 'destacados-grid');
    }
    // Renderizar catálogo completo
    if (document.getElementById('catalogo-grid')) {
        renderizarEnContenedor(PRODUCTOS, 'catalogo-grid');
    }
}

function actualizarContadoresFiltros() {
    const conteo = {};
    ['llaveros', 'animales', 'plantas', 'accesorios', 'fandom', 'deco'].forEach(cat => conteo[cat] = 0);
    PRODUCTOS.forEach(p => { if (conteo[p.categoria] !== undefined) conteo[p.categoria]++; });

    const botones = document.querySelectorAll('.btn-filter');
    botones.forEach(btn => {
        const cat = btn.getAttribute('data-cat');
        if (cat === 'todos') {
            btn.innerHTML = `Todos <span class="filter-count" style="background:rgba(0,0,0,0.1); border-radius:10px; padding:2px 6px; font-size:0.75rem; margin-left:5px;">${PRODUCTOS.length}</span>`;
        } else if (conteo[cat] !== undefined) {
            btn.innerHTML = `${btn.textContent.split(' ')[0]} <span class="filter-count" style="background:rgba(0,0,0,0.1); border-radius:10px; padding:2px 6px; font-size:0.75rem; margin-left:5px;">${conteo[cat]}</span>`;
        }
    });
}

/* =========================================
   7. UTILIDADES
   ========================================= */
function formatoMoneda(valor) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
}

function mostrarNotificacion(mensaje) {
    let notificacion = document.getElementById('notificacion-toast');
    if (!notificacion) {
        notificacion = document.createElement('div');
        notificacion.id = 'notificacion-toast';
        notificacion.classList.add('toast');
        document.body.appendChild(notificacion);
    }
    notificacion.innerHTML = `<i class="fa-solid fa-check"></i> ${mensaje}`;
    notificacion.classList.add('mostrar');
    setTimeout(() => notificacion.classList.remove('mostrar'), 2500);
}

function toggleCart() {
    if (!sidebarCarrito) return;
    sidebarCarrito.classList.toggle('active');
    overlay.style.visibility = sidebarCarrito.classList.contains('active') ? 'visible' : 'hidden';
    overlay.style.opacity = sidebarCarrito.classList.contains('active') ? '1' : '0';
}

function compartirProducto(nombre) {
    if (navigator.share) {
        navigator.share({
            title: 'Hermalanax Amigurumis',
            text: `¡Mira este ${nombre} que encontré! 🧶`,
            url: window.location.href
        }).catch(console.error);
    } else {
        mostrarNotificacion("Link copiado al portapapeles 📋");
        navigator.clipboard.writeText(window.location.href);
    }
}

function finalizarCompra() {
    if (carrito.length === 0) return alert("¡Agrega amigurumis primero!");

    // EFECTO CONFETI
    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    let mensaje = "Hola Hermalanax! 👋 Quiero pedir:%0A%0A";
    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        mensaje += `• ${item.cantidad}x ${item.nombre} - ${formatoMoneda(subtotal)}%0A`;
        total += subtotal;
    });
    mensaje += `%0A*TOTAL: ${formatoMoneda(total)}*`;
    
    setTimeout(() => {
        window.open(`https://wa.me/56937010443?text=${mensaje}`, '_blank');
    }, 1500);
}

/* =========================================
   8. VISTA PREVIA (MODAL)
   ========================================= */
const modalPreview = document.getElementById('modal-preview');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalCat = document.getElementById('modal-cat');
const modalAddBtn = document.getElementById('modal-add-btn');
const modalCloseBtn = document.getElementById('close-modal');
let productoActualId = null;

function abrirVistaPrevia(id) {
    const producto = PRODUCTOS.find(p => p.id === id);
    if (!producto) return;

    productoActualId = id; 
    if(modalImg) modalImg.src = producto.imagen;
    if(modalTitle) modalTitle.textContent = producto.nombre;
    if(modalPrice) modalPrice.textContent = formatoMoneda(producto.precio);
    if(modalCat) modalCat.textContent = producto.categoria || 'General';
    if(modalPreview) modalPreview.classList.add('active');

    // RELACIONADOS
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid) {
        relatedGrid.innerHTML = ''; 
        const relacionados = PRODUCTOS
            .filter(p => p.categoria === producto.categoria && p.id !== id)
            .sort(() => 0.5 - Math.random()) 
            .slice(0, 3); 

        relacionados.forEach(rel => {
            const mini = document.createElement('div');
            mini.classList.add('mini-card');
            mini.onclick = () => abrirVistaPrevia(rel.id);
            mini.innerHTML = `
                <img src="${rel.imagen}" alt="${rel.nombre}">
                <h5>${rel.nombre}</h5>
                <p>${formatoMoneda(rel.precio)}</p>
            `;
            relatedGrid.appendChild(mini);
        });
    }
}

function cerrarVistaPrevia() {
    if(modalPreview) modalPreview.classList.remove('active');
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', cerrarVistaPrevia);
if (modalPreview) modalPreview.addEventListener('click', (e) => { if (e.target === modalPreview) cerrarVistaPrevia(); });
if (modalAddBtn) modalAddBtn.addEventListener('click', () => { if (productoActualId) { agregarAlCarrito(productoActualId); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarVistaPrevia(); });

/* =========================================
   9. INICIALIZACIÓN
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); 
    renderizarCarritoSidebar();
    actualizarContador();

    const btnAbrir = document.getElementById('cart-btn');
    const btnCerrar = document.getElementById('close-cart');
    if (btnAbrir) btnAbrir.addEventListener('click', toggleCart);
    if (btnCerrar) btnCerrar.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);
    
    const btnCheckout = document.querySelector('.cart-footer .btn-primary');
    if (btnCheckout) btnCheckout.addEventListener('click', finalizarCompra);

    if (inputBuscador) {
        inputBuscador.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase();
            const filtrados = PRODUCTOS.filter(p => 
                p.nombre.toLowerCase().includes(texto) || 
                (p.categoria && p.categoria.toLowerCase().includes(texto))
            );
            renderizarEnContenedor(filtrados, 'catalogo-grid');
        });
    }

    const botonesFiltro = document.querySelectorAll('.btn-filter');
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const categoria = e.target.getAttribute('data-cat');
            if (categoria === 'todos') {
                renderizarEnContenedor(PRODUCTOS, 'catalogo-grid');
            } else {
                const filtrados = PRODUCTOS.filter(p => p.categoria === categoria);
                renderizarEnContenedor(filtrados, 'catalogo-grid');
            }
        });
    });
});

/* =========================================
   10. CONTACTO Y VOLVER ARRIBA
   ========================================= */
const formContacto = document.getElementById('form-contacto');
if (formContacto) {
    const btnEnviar = document.getElementById('btn-enviar');
    formContacto.addEventListener('submit', function(event) {
        event.preventDefault();
        const textoOriginal = btnEnviar.innerHTML;
        btnEnviar.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
        
        // Simulación (O usar EmailJS si tienes las keys)
        setTimeout(() => {
            btnEnviar.innerHTML = '¡Enviado! <i class="fa-solid fa-check"></i>';
            mostrarNotificacion('¡Mensaje enviado! 📨');
            formContacto.reset();
            setTimeout(() => btnEnviar.innerHTML = textoOriginal, 3000);
        }, 1500);
    });
}

const btnScrollTop = document.getElementById('btn-scroll-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) btnScrollTop?.classList.add('show');
    else btnScrollTop?.classList.remove('show');
});
if(btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}