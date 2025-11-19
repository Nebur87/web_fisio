/**
 * Sistema de Autenticación para Administradores
 * Maneja login, logout y verificación de tokens
 */

let authToken = null;
let isAuthenticated = false;

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    // Configurar el formulario de login si existe
    setupLoginForm();
    
    authToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    
    if (!authToken) {
        showLoginForm();
        return;
    }

    // Verificar si el token es válido
    try {
        const response = await fetch('/admin/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            localStorage.removeItem('adminToken');
            sessionStorage.removeItem('adminToken');
            showLoginForm();
            return;
        }

        // Si llegamos aquí, el token es válido
        isAuthenticated = true;
        showAdminPanel();
        
        // Inicializar página específica si existe la función
        if (typeof initializePage === 'function') {
            initializePage();
        }
    } catch (error) {
        console.error('Error verificando token:', error);
        localStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminToken');
        showLoginForm();
    }
});

// Configurar formulario de login
function setupLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
}

// Manejar login de admin
async function handleAdminLogin(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('adminLoginBtn');
    const spinner = document.getElementById('loginSpinner');
    const btnText = document.getElementById('loginBtnText');
    
    // Mostrar estado de carga
    submitBtn.disabled = true;
    spinner.style.display = 'inline-block';
    btnText.textContent = 'Iniciando sesión...';
    
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const rememberMe = document.getElementById('rememberAdmin').checked;
    
    try {
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Guardar token
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('adminToken', data.token);
            authToken = data.token;
            
            // Mostrar panel de admin
            showAdminPanel();
            
            // Inicializar página específica si existe la función
            if (typeof initializePage === 'function') {
                initializePage();
            }
        } else {
            throw new Error(data.message || 'Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en login:', error);
        alert('Error: ' + error.message);
    } finally {
        // Restaurar estado del botón
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        btnText.textContent = 'Iniciar Sesión';
    }
}

// Mostrar formulario de login
function showLoginForm() {
    const loginSection = document.getElementById('adminLoginSection');
    const adminContent = document.getElementById('adminContent');
    
    if (loginSection) loginSection.style.display = 'block';
    if (adminContent) adminContent.style.display = 'none';
    
    isAuthenticated = false;
}

// Mostrar panel de admin
function showAdminPanel() {
    const loginSection = document.getElementById('adminLoginSection');
    const adminContent = document.getElementById('adminContent');
    
    if (loginSection) loginSection.style.display = 'none';
    if (adminContent) adminContent.style.display = 'block';
    
    isAuthenticated = true;
}

// Logout de admin
function adminLogout() {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    authToken = null;
    showLoginForm();
    
    // Limpiar datos específicos de la página
    if (typeof clearPageData === 'function') {
        clearPageData();
    }
}

// Toggle password visibility
function togglePassword(fieldId, toggleId) {
    const field = document.getElementById(fieldId);
    const toggle = document.getElementById(toggleId);
    
    if (field && toggle) {
        if (field.type === 'password') {
            field.type = 'text';
            toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            field.type = 'password';
            toggle.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }
}