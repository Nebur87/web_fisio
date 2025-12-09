/**
 * Sistema de Reseñas - Frontend
 * Maneja la visualización y creación de reseñas
 */

let todasLasResenas = [];
let resenasFiltradas = [];
let paginaActual = 1;
const resenasPorPagina = 12;
let ratingSeleccionado = 0;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarResenas();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Filtro por rating
    document.getElementById('filterRating').addEventListener('change', filtrarResenas);
    
    // Rating input en el modal
    const ratingStars = document.querySelectorAll('#ratingInput .fa-star');
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', () => setRating(index + 1));
        star.addEventListener('mouseover', () => hoverRating(index + 1));
    });
    
    document.getElementById('ratingInput').addEventListener('mouseleave', () => {
        updateRatingDisplay(ratingSeleccionado);
    });
    
    // Formulario de reseña
    document.getElementById('resenaForm').addEventListener('submit', enviarResena);
}

// Cargar reseñas desde el servidor
async function cargarResenas() {
    mostrarCargando(true);
    
    try {
        const response = await fetch('http://localhost:3001/resenas', {
            headers: {
                'Accept': 'application/json; charset=utf-8'
            }
        });
        const data = await response.json();
        
        if (data.ok) {
            todasLasResenas = data.resenas;
            resenasFiltradas = [...todasLasResenas];
            
            // Actualizar estadísticas
            actualizarEstadisticas(data.estadisticas);
            
            // Mostrar reseñas
            mostrarResenas();
        } else {
            console.error('Error al cargar reseñas:', data.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
    
    mostrarCargando(false);
}

// Actualizar estadísticas
function actualizarEstadisticas(stats) {
    if (!stats) return;
    
    const promedio = parseFloat(stats.promedio).toFixed(1);
    const total = stats.total;
    
    document.getElementById('ratingPromedio').textContent = promedio;
    document.getElementById('totalResenas').textContent = total;
    
    // Actualizar estrellas del promedio
    const starsContainer = document.getElementById('starsPromedio');
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= Math.round(promedio) ? 'fas fa-star' : 'far fa-star';
        starsContainer.appendChild(star);
    }
    
    // Actualizar barras de rating
    const ratingBars = document.getElementById('ratingBars');
    const ratings = [
        { stars: 5, count: stats.cinco_estrellas || 0 },
        { stars: 4, count: stats.cuatro_estrellas || 0 },
        { stars: 3, count: stats.tres_estrellas || 0 },
        { stars: 2, count: stats.dos_estrellas || 0 },
        { stars: 1, count: stats.una_estrella || 0 }
    ];
    
    ratingBars.innerHTML = '';
    ratings.forEach(rating => {
        const percentage = total > 0 ? (rating.count / total * 100).toFixed(1) : 0;
        
        ratingBars.innerHTML += `
            <div class="rating-bar-item">
                <span>${rating.stars} estrella${rating.stars > 1 ? 's' : ''}</span>
                <div class="rating-bar">
                    <div class="fill" style="width: ${percentage}%"></div>
                </div>
                <span class="rating-count">${rating.count}</span>
            </div>
        `;
    });
}

// Mostrar reseñas
function mostrarResenas() {
    const container = document.getElementById('resenasContainer');
    const inicio = (paginaActual - 1) * resenasPorPagina;
    const fin = inicio + resenasPorPagina;
    const resenasPagina = resenasFiltradas.slice(inicio, fin);
    
    if (resenasPagina.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No se encontraron reseñas</h4>
                <p class="text-muted">Intenta cambiar los filtros o ser el primero en escribir una reseña.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = resenasPagina.map(resena => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="review-card">
                <div class="review-header">
                    <div class="review-avatar">
                        ${resena.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div class="review-info">
                        <h5 class="review-name">${resena.nombre}</h5>
                        <div class="review-rating">
                            ${generarEstrellas(resena.rating)}
                        </div>
                        <small class="review-date text-muted">
                            ${formatearFecha(resena.fecha_creacion)}
                        </small>
                    </div>
                </div>
                <div class="review-body">
                    <p class="review-text">${resena.comentario}</p>
                </div>
            </div>
        </div>
    `).join('');
    
    // Actualizar paginación
    actualizarPaginacion();
}

// Generar estrellas HTML
function generarEstrellas(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<i class="fas fa-star ${i <= rating ? 'text-warning' : 'text-muted'}"></i>`;
    }
    return html;
}

// Formatear fecha
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Filtrar reseñas por rating
function filtrarResenas() {
    const filterRating = document.getElementById('filterRating').value;
    
    if (filterRating === '') {
        resenasFiltradas = [...todasLasResenas];
    } else {
        resenasFiltradas = todasLasResenas.filter(resena => 
            resena.rating == parseInt(filterRating)
        );
    }
    
    paginaActual = 1;
    mostrarResenas();
}

// Actualizar paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(resenasFiltradas.length / resenasPorPagina);
    const pagination = document.getElementById('paginacion');
    
    if (totalPaginas <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Botón anterior
    html += `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a>
        </li>
    `;
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= paginaActual - 1 && i <= paginaActual + 1)) {
            html += `
                <li class="page-item ${i === paginaActual ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="cambiarPagina(${i})">${i}</a>
                </li>
            `;
        } else if (i === paginaActual - 2 || i === paginaActual + 2) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // Botón siguiente
    html += `
        <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

// Cambiar página
function cambiarPagina(nuevaPagina) {
    const totalPaginas = Math.ceil(resenasFiltradas.length / resenasPorPagina);
    
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        paginaActual = nuevaPagina;
        mostrarResenas();
        
        // Scroll al top
        document.getElementById('resenasContainer').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mostrar/ocultar indicador de carga
function mostrarCargando(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
    document.getElementById('resenasContainer').style.display = show ? 'none' : 'block';
}

// Mostrar modal de formulario
function mostrarFormularioResena() {
    const modal = new bootstrap.Modal(document.getElementById('resenaModal'));
    modal.show();
}

// Manejar rating input
function setRating(rating) {
    ratingSeleccionado = rating;
    document.getElementById('selectedRating').value = rating;
    updateRatingDisplay(rating);
}

function hoverRating(rating) {
    updateRatingDisplay(rating);
}

function updateRatingDisplay(rating) {
    const stars = document.querySelectorAll('#ratingInput .fa-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('text-muted');
            star.classList.add('text-warning');
        } else {
            star.classList.remove('text-warning');
            star.classList.add('text-muted');
        }
    });
}

// Enviar reseña
async function enviarResena(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitResena');
    const originalText = submitBtn.innerHTML;
    
    // Mostrar estado de carga
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
    
    const formData = {
        nombre: document.getElementById('resenaName').value.trim(),
        email: document.getElementById('resenaEmail').value.trim(),
        rating: parseInt(document.getElementById('selectedRating').value),
        comentario: document.getElementById('resenaComentario').value.trim()
    };
    
    try {
        const response = await fetch('http://localhost:3001/resenas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.ok) {
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('resenaModal'));
            modal.hide();
            
            // Limpiar formulario
            document.getElementById('resenaForm').reset();
            ratingSeleccionado = 0;
            updateRatingDisplay(0);
            
            // Mostrar mensaje de éxito
            mostrarAlerta('success', '¡Gracias! Tu reseña ha sido enviada y será revisada antes de publicarse.');
        } else {
            mostrarAlerta('error', data.message || 'Error al enviar la reseña');
        }
    } catch (error) {
        mostrarAlerta('error', 'Error de conexión. Inténtalo de nuevo.');
    }
    
    // Restaurar botón
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
}

// Mostrar alertas
function mostrarAlerta(tipo, mensaje) {
    const alertClass = tipo === 'success' ? 'alert-success' : 'alert-danger';
    const icon = tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    const alertHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas ${icon} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}