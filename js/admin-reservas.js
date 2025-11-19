/**
 * Sistema de Gestión de Reservas para Administradores
 * Maneja la carga, filtrado, paginación y manipulación de reservas
 */

let todasLasReservas = [];
let reservasFiltradas = [];
let paginaActual = 1;
const reservasPorPagina = 10;
let reservaAAnular = null;

// Función de inicialización específica para admin-reservas
function initializePage() {
    if (!isAuthenticated) return;
    
    cargarReservas();
    
    // Event listeners para filtros
    const searchInput = document.getElementById('searchInput');
    const filterFecha = document.getElementById('filterFecha');
    const filterDuracion = document.getElementById('filterDuracion');
    
    if (searchInput) searchInput.addEventListener('input', filtrarReservas);
    if (filterFecha) filterFecha.addEventListener('change', filtrarReservas);
    if (filterDuracion) filterDuracion.addEventListener('change', filtrarReservas);
}

// Función para limpiar datos al hacer logout
function clearPageData() {
    todasLasReservas = [];
    reservasFiltradas = [];
    paginaActual = 1;
}

// Cargar todas las reservas
async function cargarReservas() {
    mostrarCargando(true);
    
    try {
        const response = await fetch('/todas-reservas', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.status === 401 || response.status === 403) {
            adminLogout();
            return;
        }
        
        const data = await response.json();
        
        if (data.ok) {
            todasLasReservas = data.reservas;
            reservasFiltradas = [...todasLasReservas];
            actualizarEstadisticas();
            mostrarReservas();
        } else {
            mostrarError('Error al cargar reservas: ' + data.message);
        }
    } catch (error) {
        mostrarError('Error de conexión: ' + error.message);
    }
    
    mostrarCargando(false);
}

// Mostrar indicador de carga
function mostrarCargando(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const reservasContent = document.getElementById('reservasContent');
    
    if (loadingIndicator) loadingIndicator.style.display = show ? 'block' : 'none';
    if (reservasContent) reservasContent.style.display = show ? 'none' : 'block';
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const hoy = new Date().toISOString().split('T')[0];
    const inicioSemana = new Date();
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
    const inicioMes = new Date();
    inicioMes.setDate(1);

    const reservasHoy = todasLasReservas.filter(r => r.fecha === hoy).length;
    const reservasSemana = todasLasReservas.filter(r => 
        new Date(r.fecha) >= inicioSemana
    ).length;
    const reservasMes = todasLasReservas.filter(r => 
        new Date(r.fecha) >= inicioMes
    ).length;

    const totalElement = document.getElementById('totalReservas');
    const hoyElement = document.getElementById('reservasHoy');
    const semanaElement = document.getElementById('reservasSemana');
    const mesElement = document.getElementById('reservasMes');

    if (totalElement) totalElement.textContent = todasLasReservas.length;
    if (hoyElement) hoyElement.textContent = reservasHoy;
    if (semanaElement) semanaElement.textContent = reservasSemana;
    if (mesElement) mesElement.textContent = reservasMes;
}

// Mostrar reservas en la tabla
function mostrarReservas() {
    const tbody = document.getElementById('reservasTableBody');
    const noReservasMsg = document.getElementById('noReservasMessage');
    const reservasContent = document.getElementById('reservasContent');
    
    if (!tbody) return;

    if (reservasFiltradas.length === 0) {
        if (reservasContent) reservasContent.style.display = 'none';
        if (noReservasMsg) noReservasMsg.style.display = 'block';
        return;
    }

    if (reservasContent) reservasContent.style.display = 'block';
    if (noReservasMsg) noReservasMsg.style.display = 'none';

    const inicio = (paginaActual - 1) * reservasPorPagina;
    const fin = inicio + reservasPorPagina;
    const reservasPagina = reservasFiltradas.slice(inicio, fin);

    // Generar filas de la tabla
    tbody.innerHTML = reservasPagina.map(reserva => {
        const estado = obtenerEstado(reserva.fecha);
        return `
            <tr>
                <td><strong>#${reserva.id}</strong></td>
                <td>${reserva.nombre}</td>
                <td>${reserva.email}</td>
                <td>${formatearFecha(reserva.fecha)}</td>
                <td>${reserva.hora}</td>
                <td><span class="badge-duracion">${reserva.duracion} min</span></td>
                <td><span class="status-badge ${estado.class}">${estado.text}</span></td>
                <td>
                    <button class="btn-anular" onclick="confirmarAnulacion(${reserva.id}, '${reserva.nombre}', '${reserva.fecha}', '${reserva.hora}')">
                        <i class="fas fa-times me-1"></i>Anular
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    actualizarPaginacion();
}

// Obtener estado de la reserva
function obtenerEstado(fecha) {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaReserva = fecha;

    if (fechaReserva === hoy) {
        return { class: 'status-today', text: 'Hoy' };
    } else if (fechaReserva > hoy) {
        return { class: 'status-upcoming', text: 'Próxima' };
    } else {
        return { class: 'status-past', text: 'Pasada' };
    }
}

// Formatear fecha
function formatearFecha(fecha) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Filtrar reservas
function filtrarReservas() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterFecha = document.getElementById('filterFecha')?.value || '';
    const filterDuracion = document.getElementById('filterDuracion')?.value || '';

    reservasFiltradas = todasLasReservas.filter(reserva => {
        // Filtro de búsqueda
        const matchSearch = !searchTerm || 
            reserva.nombre.toLowerCase().includes(searchTerm) ||
            reserva.email.toLowerCase().includes(searchTerm);

        // Filtro de fecha
        const matchFecha = !filterFecha || (() => {
            const fechaReserva = new Date(reserva.fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            switch(filterFecha) {
                case 'hoy':
                    return fechaReserva.toDateString() === hoy.toDateString();
                case 'manana':
                    const manana = new Date(hoy);
                    manana.setDate(manana.getDate() + 1);
                    return fechaReserva.toDateString() === manana.toDateString();
                case 'semana':
                    const finSemana = new Date(hoy);
                    finSemana.setDate(finSemana.getDate() + 7);
                    return fechaReserva >= hoy && fechaReserva <= finSemana;
                case 'mes':
                    return fechaReserva.getMonth() === hoy.getMonth() && 
                           fechaReserva.getFullYear() === hoy.getFullYear();
                default:
                    return true;
            }
        })();

        // Filtro de duración
        const matchDuracion = !filterDuracion || 
            reserva.duracion.toString() === filterDuracion;

        return matchSearch && matchFecha && matchDuracion;
    });

    paginaActual = 1;
    mostrarReservas();
}

// Actualizar paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
    const pagination = document.getElementById('pagination');
    
    if (!pagination) return;

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
    const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
    
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        paginaActual = nuevaPagina;
        mostrarReservas();
    }
}

// Confirmar anulación de reserva
function confirmarAnulacion(id, nombre, fecha, hora) {
    reservaAAnular = id;
    const reservaDetails = document.getElementById('reservaDetails');
    if (reservaDetails) {
        reservaDetails.innerHTML = `
            <strong>Cliente:</strong> ${nombre}<br>
            <strong>Fecha:</strong> ${formatearFecha(fecha)}<br>
            <strong>Hora:</strong> ${hora}
        `;
    }
    const modal = document.getElementById('confirmModal');
    if (modal) {
        new bootstrap.Modal(modal).show();
    }
}

// Confirmar anulación (evento del modal)
document.addEventListener('DOMContentLoaded', function() {
    const confirmBtn = document.getElementById('confirmAnular');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async function() {
            if (!reservaAAnular) return;

            try {
                const response = await fetch('/anular-reserva', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ id: reservaAAnular })
                });
                
                if (response.status === 401 || response.status === 403) {
                    adminLogout();
                    return;
                }

                const data = await response.json();

                if (data.ok) {
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
                    if (modalInstance) modalInstance.hide();
                    mostrarExito('Reserva anulada correctamente');
                    cargarReservas(); // Recargar datos
                } else {
                    mostrarError('Error al anular reserva: ' + data.message);
                }
            } catch (error) {
                mostrarError('Error de conexión: ' + error.message);
            }

            reservaAAnular = null;
        });
    }
});

// Limpiar filtros
function limpiarFiltros() {
    const searchInput = document.getElementById('searchInput');
    const filterFecha = document.getElementById('filterFecha');
    const filterDuracion = document.getElementById('filterDuracion');
    
    if (searchInput) searchInput.value = '';
    if (filterFecha) filterFecha.value = '';
    if (filterDuracion) filterDuracion.value = '';
    
    filtrarReservas();
}

// Mostrar mensajes
function mostrarExito(mensaje) {
    // Implementar notificación de éxito
    alert(mensaje);
}

function mostrarError(mensaje) {
    // Implementar notificación de error
    alert(mensaje);
}