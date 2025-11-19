function applyLegalTranslations(lang) {
  if (!locales[lang]) return;
  // PRIVACIDAD
  const privTitulo = document.querySelector('.politica-titulo');
  if (privTitulo) privTitulo.textContent = locales[lang].politicas.privacidad.titulo;
  const privIntro = document.querySelector('.politica-intro');
  if (privIntro) privIntro.textContent = locales[lang].politicas.privacidad.intro;
  const privDatosTitulo = document.querySelector('.politica-datos-titulo');
  if (privDatosTitulo) privDatosTitulo.textContent = locales[lang].politicas.privacidad.datos_recogemos;
  const privDatosItem1 = document.querySelector('.politica-datos-item1');
  if (privDatosItem1) privDatosItem1.textContent = locales[lang].politicas.privacidad.lista_datos[0];
  const privDatosItem2 = document.querySelector('.politica-datos-item2');
  if (privDatosItem2) privDatosItem2.textContent = locales[lang].politicas.privacidad.lista_datos[1];
  const privUsosTitulo = document.querySelector('.politica-usos-titulo');
  if (privUsosTitulo) privUsosTitulo.textContent = locales[lang].politicas.privacidad.usos;
  const privUsosItem1 = document.querySelector('.politica-usos-item1');
  if (privUsosItem1) privUsosItem1.textContent = locales[lang].politicas.privacidad.lista_usos[0];
  const privUsosItem2 = document.querySelector('.politica-usos-item2');
  if (privUsosItem2) privUsosItem2.textContent = locales[lang].politicas.privacidad.lista_usos[1];
  const privUsosItem3 = document.querySelector('.politica-usos-item3');
  if (privUsosItem3) privUsosItem3.textContent = locales[lang].politicas.privacidad.lista_usos[2];
  const privDerechosTitulo = document.querySelector('.politica-derechos-titulo');
  if (privDerechosTitulo) privDerechosTitulo.textContent = locales[lang].politicas.privacidad.derechos;
  const privDerechosTexto = document.querySelector('.politica-derechos-texto');
  if (privDerechosTexto) privDerechosTexto.textContent = locales[lang].politicas.privacidad.derechos_texto;
  const privResponsableTitulo = document.querySelector('.politica-responsable-titulo');
  if (privResponsableTitulo) privResponsableTitulo.textContent = locales[lang].politicas.privacidad.responsable;
  const privResponsableTexto = document.querySelector('.politica-responsable-texto');
  if (privResponsableTexto) privResponsableTexto.textContent = locales[lang].politicas.privacidad.responsable_texto;

  // COOKIES
  const cookTitulo = document.querySelector('.cookies-titulo');
  if (cookTitulo) cookTitulo.textContent = locales[lang].politicas.cookies.titulo;
  const cookIntro = document.querySelector('.cookies-intro');
  if (cookIntro) cookIntro.textContent = locales[lang].politicas.cookies.intro;
  const cookTiposTitulo = document.querySelector('.cookies-tipos-titulo');
  if (cookTiposTitulo) cookTiposTitulo.textContent = locales[lang].politicas.cookies.tipos;
  const cookTiposItem1 = document.querySelector('.cookies-tipos-item1');
  if (cookTiposItem1) cookTiposItem1.textContent = locales[lang].politicas.cookies.lista_tipos[0];
  const cookTiposItem2 = document.querySelector('.cookies-tipos-item2');
  if (cookTiposItem2) cookTiposItem2.textContent = locales[lang].politicas.cookies.lista_tipos[1];
  const cookGestionTitulo = document.querySelector('.cookies-gestion-titulo');
  if (cookGestionTitulo) cookGestionTitulo.textContent = locales[lang].politicas.cookies.gestion;
  const cookGestionTexto = document.querySelector('.cookies-gestion-texto');
  if (cookGestionTexto) cookGestionTexto.textContent = locales[lang].politicas.cookies.gestion_texto;
  const cookConsentTitulo = document.querySelector('.cookies-consentimiento-titulo');
  if (cookConsentTitulo) cookConsentTitulo.textContent = locales[lang].politicas.cookies.consentimiento;
  const cookConsentTexto = document.querySelector('.cookies-consentimiento-texto');
  if (cookConsentTexto) cookConsentTexto.textContent = locales[lang].politicas.cookies.consentimiento_texto;

  // AVISO LEGAL
  const avisoTitulo = document.querySelector('.aviso-titulo');
  if (avisoTitulo) avisoTitulo.textContent = locales[lang].politicas.aviso_legal.titulo;
  const avisoDatosTitulo = document.querySelector('.aviso-datos-titulo');
  if (avisoDatosTitulo) avisoDatosTitulo.textContent = locales[lang].politicas.aviso_legal.datos_titular;
  const avisoDatosTexto = document.querySelector('.aviso-datos-texto');
  if (avisoDatosTexto) avisoDatosTexto.innerHTML = locales[lang].politicas.aviso_legal.datos_titular_texto;
  const avisoPropTitulo = document.querySelector('.aviso-propiedad-titulo');
  if (avisoPropTitulo) avisoPropTitulo.textContent = locales[lang].politicas.aviso_legal.propiedad;
  const avisoPropTexto = document.querySelector('.aviso-propiedad-texto');
  if (avisoPropTexto) avisoPropTexto.textContent = locales[lang].politicas.aviso_legal.propiedad_texto;
  const avisoCondTitulo = document.querySelector('.aviso-condiciones-titulo');
  if (avisoCondTitulo) avisoCondTitulo.textContent = locales[lang].politicas.aviso_legal.condiciones;
  const avisoCondTexto = document.querySelector('.aviso-condiciones-texto');
  if (avisoCondTexto) avisoCondTexto.textContent = locales[lang].politicas.aviso_legal.condiciones_texto;
}
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

let index = 0;
let slides = [];
let carruselInterval;
function iniciarCarrusel() {
  slides = document.querySelectorAll(".carrusel img");
  mostrarSlide(index);
  if (carruselInterval) clearInterval(carruselInterval);
  carruselInterval = setInterval(() => cambiarSlide(1), 4000);
}

function mostrarSlide(i) {
  slides.forEach((img, idx) => {
    img.classList.remove("active");
    if (idx === i) img.classList.add("active");
  });
}

function cambiarSlide(dir) {
  index = (index + dir + slides.length) % slides.length;
  mostrarSlide(index);
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarCarrusel();
    // iniciarCarrusel();
    // Eliminadas referencias a carrusel-prev y carrusel-next porque no existen en el HTML actual
// Fin del DOMContentLoaded
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

function actualizarNavActivo() {
  let currentSection = "home"; // Por defecto, marcamos "Inicio"

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (window.scrollY >= top - height / 3) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + currentSection) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", actualizarNavActivo);
window.addEventListener("load", actualizarNavActivo);
// Manejo de envío de formulario de reserva
let currentLang = 'es';
let locales = {};

async function loadLocales() {
  try {
    const path = window.localesJsonPath || './locales.json';
    const res = await fetch(path);
    locales = await res.json();
  } catch (err) {
    console.error('Error cargando locales.json', err);
  }
}

function applyTranslations(lang) {
  if (!locales[lang]) return;
  // Navbar
  const navItems = document.querySelectorAll('.navbar-nav .nav-link');
  const navKeys = ['inicio', 'sobre_nosotros', 'servicios', 'galeria', 'reservar', 'contacto'];
  navItems.forEach((item, i) => {
    if (navKeys[i]) {
      item.textContent = locales[lang].navbar[navKeys[i]];
    }
  });
  // Hero
  const heroTitle = document.querySelector('.hero-titulo');
  if (heroTitle) heroTitle.textContent = locales[lang].hero.titulo;
  const heroP1 = document.querySelector('.hero-parrafo1');
  if (heroP1) heroP1.textContent = locales[lang].hero.parrafo1;
  const heroP2 = document.querySelector('.hero-parrafo2');
  if (heroP2) heroP2.textContent = locales[lang].hero.parrafo2;
  const botonReservar = document.querySelector('.boton-reservar');
  if (botonReservar) botonReservar.textContent = lang === 'es' ? 'Reserva tu cita' : (lang === 'fr' ? 'Réservez votre rendez-vous' : (lang === 'de' ? 'Termin buchen' : 'Book your appointment'));
  // Servicios
  const servTitle = document.querySelector('.servicios-titulo');
  if (servTitle) servTitle.textContent = locales[lang].servicios.titulo;
  const servBTitle = document.querySelector('.beneficios-titulo');
  if (servBTitle) servBTitle.textContent = locales[lang].servicios.beneficios_titulo;
  const servBText = document.querySelector('.beneficios-texto');
  if (servBText) servBText.textContent = locales[lang].servicios.beneficios_texto;
  const servBText2 = document.querySelector('.beneficios-texto2');
  if (servBText2) servBText2.textContent = locales[lang].servicios.beneficios_texto2 || '';
  const servDTit = document.querySelector('.deportivo-titulo');
  if (servDTit) servDTit.textContent = locales[lang].servicios.deportivo_titulo;
  const servDText = document.querySelector('.deportivo-texto');
  if (servDText) servDText.textContent = locales[lang].servicios.deportivo_texto;
  const servDText2 = document.querySelector('.deportivo-texto2');
  if (servDText2) servDText2.textContent = locales[lang].servicios.deportivo_texto2 || '';
  const servCTit = document.querySelector('.clasico-titulo');
  if (servCTit) servCTit.textContent = locales[lang].servicios.clasico_titulo;
  const servCText = document.querySelector('.clasico-texto');
  if (servCText) servCText.textContent = locales[lang].servicios.clasico_texto;
  const servETit = document.querySelector('.espalda-titulo');
  if (servETit) servETit.textContent = locales[lang].servicios.espalda_titulo;
  const servEText = document.querySelector('.espalda-texto');
  if (servEText) servEText.textContent = locales[lang].servicios.espalda_texto;
  // Reserva
  const reservaTitle = document.querySelector('.reserva-titulo');
  if (reservaTitle) reservaTitle.textContent = locales[lang].reserva.titulo;
  const reservaDuracion = document.querySelector('.reserva-duracion');
  if (reservaDuracion) reservaDuracion.textContent = locales[lang].reserva.duracion;
  const duracion20 = document.querySelector('.duracion-20');
  if (duracion20) duracion20.textContent = lang === 'es' ? '20 minutos' : (lang === 'fr' ? '20 minutes' : (lang === 'de' ? '20 Minuten' : '20 minutes'));
  const duracion30 = document.querySelector('.duracion-30');
  if (duracion30) duracion30.textContent = lang === 'es' ? '30 minutos' : (lang === 'fr' ? '30 minutes' : (lang === 'de' ? '30 Minuten' : '30 minutes'));
  const duracion60 = document.querySelector('.duracion-60');
  if (duracion60) duracion60.textContent = lang === 'es' ? '1 hora' : (lang === 'fr' ? '1 heure' : (lang === 'de' ? '1 Stunde' : '1 hour'));
  const reservaNombre = document.querySelector('.reserva-nombre');
  if (reservaNombre) reservaNombre.textContent = locales[lang].reserva.nombre;
  const reservaEmail = document.querySelector('.reserva-email');
  if (reservaEmail) reservaEmail.textContent = locales[lang].reserva.email;
  const reservaFecha = document.querySelector('.reserva-fecha');
  if (reservaFecha) reservaFecha.textContent = locales[lang].reserva.fecha;
  const reservaHora = document.querySelector('.reserva-hora');
  if (reservaHora) reservaHora.textContent = locales[lang].reserva.hora;
  const reservaBtn = document.querySelector('.reserva-confirmar');
  if (reservaBtn) reservaBtn.textContent = locales[lang].reserva.confirmar;
  // Placeholders
  const inputNombre = document.getElementById('nombre');
  if (inputNombre) inputNombre.placeholder = locales[lang].reserva.nombre;
  const inputEmail = document.getElementById('email');
  if (inputEmail) inputEmail.placeholder = locales[lang].reserva.email;
  // Contacto
  const contactoTitle = document.querySelector('.contacto-titulo');
  if (contactoTitle) contactoTitle.textContent = locales[lang].contacto.titulo;
  const contactoDir = document.querySelector('.contacto-direccion');
  if (contactoDir) contactoDir.innerHTML = locales[lang].contacto.direccion;
  const contactoTel = document.querySelector('.contacto-telefono');
  if (contactoTel) contactoTel.textContent = locales[lang].contacto.telefono;
  const contactoMail = document.querySelector('.contacto-email');
  if (contactoMail) contactoMail.textContent = locales[lang].contacto.email;
  // Galería
  const galleryTitle = document.querySelector('.gallery-title');
  if (galleryTitle) galleryTitle.textContent = locales[lang].galeria.titulo;
  const galleryDescription = document.querySelector('.gallery-description');
  if (galleryDescription) galleryDescription.textContent = locales[lang].galeria.descripcion;
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    const filterKeys = ['filtro_todas', 'filtro_instalaciones', 'filtro_tratamientos', 'filtro_ejercicios', 'filtro_equipos'];
    filterButtons.forEach((btn, i) => {
      if (filterKeys[i] && locales[lang].galeria[filterKeys[i]]) {
        btn.textContent = locales[lang].galeria[filterKeys[i]];
      }
    });
  }
  // Footer
  const footerCopy = document.querySelector('.copyright');
  if (footerCopy) footerCopy.textContent = locales[lang].footer.copyright;
  const footerPriv = document.querySelector('.privacidad');
  if (footerPriv) footerPriv.textContent = locales[lang].footer.privacidad;
  const footerCookies = document.querySelector('.cookies');
  if (footerCookies) footerCookies.textContent = locales[lang].footer.cookies;
  const footerLegal = document.querySelector('.aviso-legal');
  if (footerLegal) footerLegal.textContent = locales[lang].footer.aviso_legal;
}

async function setLang(lang) {
  currentLang = lang;
  // Guardar idioma en localStorage
  localStorage.setItem('lang', lang);
  
  if (Object.keys(locales).length === 0) {
    await loadLocales();
  }
  applyTranslations(lang);
  if (typeof locales === 'object' && Object.keys(locales).length > 0) {
    applyLegalTranslations(lang);
  }
  
  // Actualizar apariencia de botones de idioma
  updateLanguageButtons(lang);
}

function updateLanguageButtons(selectedLang) {
  const langButtons = document.querySelectorAll('.idiomas-bar a');
  langButtons.forEach(button => {
    const img = button.querySelector('img');
    if (img) {
      // Remover clase activa de todos
      button.classList.remove('active');
      img.style.opacity = '0.6';
      img.style.transform = 'scale(1)';
      
      // Determinar qué idioma representa este botón
      const buttonLang = button.onclick.toString().match(/setLang\('(\w+)'\)/)?.[1];
      if (buttonLang === selectedLang) {
        button.classList.add('active');
        img.style.opacity = '1';
        img.style.transform = 'scale(1.1)';
      }
    }
  });
}

window.setLang = setLang;
  // Detectar idioma guardado en localStorage (si existe)
  let storedLang = localStorage.getItem('lang');
  if (storedLang && ['es','fr','de','en'].includes(storedLang)) {
    currentLang = storedLang;
  }
  setLang(currentLang);
  // Código de reserva solo si existe el formulario
  const form = document.querySelector(".reserva form");
  if (!form) return;
  // Bloquear horarios ocupados según fecha y duración
  const fechaInput = form.fecha;
  const horaInput = form.hora;
  const duracionInput = form.duracion;

  function generarHorasDisponibles() {
    let horas = [];
    for (let h = 9; h < 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        let horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        horas.push(horaStr);
      }
    }
    return horas;
  }

  async function actualizarHorasDisponibles() {
    if (!fechaInput.value || !duracionInput.value) {
      // Si no hay fecha o duración, mostrar todas las horas posibles
      const horas = generarHorasDisponibles();
      horaInput.innerHTML = '';
      horas.forEach(h => {
        let opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        horaInput.appendChild(opt);
      });
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/horarios-ocupados?fecha=${fechaInput.value}`);
      const result = await res.json();
      if (!result.ok) return;
      const ocupados = result.horarios;
      const horas = generarHorasDisponibles();
      let disponibles = horas.filter(hora => {
        let nuevaInicio = toMinutes(hora);
        let nuevaFin = nuevaInicio + parseInt(duracionInput.value);
        for (let r of ocupados) {
          let resInicio = toMinutes(r.hora);
          let resFin = resInicio + r.duracion;
          if (nuevaInicio < resFin && nuevaFin > resInicio) return false;
        }
        return true;
      });
      horaInput.innerHTML = '';
      disponibles.forEach(h => {
        let opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        horaInput.appendChild(opt);
      });
    } catch (err) {}
  }

  function toMinutes(horaStr) {
    let [h, m] = horaStr.split(':').map(Number);
    return h * 60 + m;
  }

  fechaInput.addEventListener('change', actualizarHorasDisponibles);
  duracionInput.addEventListener('change', actualizarHorasDisponibles);
  // Inicializar al cargar
  actualizarHorasDisponibles();
});

// ================================
// SISTEMA DE RESERVAS MEJORADO
// ================================

// Variables globales para el sistema de reservas
let currentStep = 1;
const totalSteps = 4;
let reservaData = {};
let clientAuthenticated = false;
let clientData = {};

// Inicializar sistema de reservas mejorado
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('reservaForm')) {
    initializeReservationSystem();
  }
});

function initializeReservationSystem() {
  // Verificar si el usuario ya está autenticado
  checkClientAuthentication();
  
  // Configurar login de cliente
  setupClientLogin();
  
  const form = document.getElementById('reservaForm');
  if (form) {
    const fechaInput = document.getElementById('fecha');
    
    // Establecer fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', today);
    
    // Event listeners
    setupEventListeners();
    
    // Validaciones en tiempo real
    setupRealTimeValidation();
    
    // Configurar fecha inicial
    updateAvailableHours();
  }
}

function checkClientAuthentication() {
  const savedClientData = localStorage.getItem('clientData');
  
  if (savedClientData) {
    try {
      clientData = JSON.parse(savedClientData);
      clientAuthenticated = true;
      showReservationForm();
      displayUserInfo();
    } catch (error) {
      localStorage.removeItem('clientData');
      showLoginForm();
    }
  } else {
    showLoginForm();
  }
}

function setupClientLogin() {
  const loginForm = document.getElementById('clientLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleClientLogin);
  }
}

async function handleClientLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('clientEmail').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  
  if (!email || !phone) {
    showLoginError('Por favor, completa todos los campos');
    return;
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showLoginError('Por favor, introduce un email válido');
    return;
  }
  
  // Validar teléfono (formato básico)
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
  if (!phoneRegex.test(phone)) {
    showLoginError('Por favor, introduce un teléfono válido');
    return;
  }
  
  // Guardar datos del cliente
  clientData = {
    email: email,
    phone: phone,
    name: extractNameFromEmail(email),
    timestamp: new Date().getTime()
  };
  
  localStorage.setItem('clientData', JSON.stringify(clientData));
  clientAuthenticated = true;
  
  // Mostrar formulario de reserva
  showReservationForm();
  displayUserInfo();
  
  // Prellenar datos en el formulario
  prefillUserData();
}

function extractNameFromEmail(email) {
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
}

function showLoginForm() {
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('reservaFormSection').style.display = 'none';
  document.getElementById('userInfo').style.display = 'none';
}

function showReservationForm() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('reservaFormSection').style.display = 'block';
  document.getElementById('userInfo').style.display = 'block';
}

function displayUserInfo() {
  if (clientData.name) {
    document.getElementById('loggedUserName').textContent = clientData.name;
  }
}

function prefillUserData() {
  if (clientAuthenticated && clientData) {
    // Prellenar nombre y email en el formulario de reserva
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    
    if (nombreInput) nombreInput.value = clientData.name || '';
    if (emailInput) emailInput.value = clientData.email || '';
    if (telefonoInput) telefonoInput.value = clientData.phone || '';
    
    // Marcar como válidos
    [nombreInput, emailInput, telefonoInput].forEach(input => {
      if (input && input.value) {
        input.classList.add('is-valid');
      }
    });
  }
}

function logoutClient() {
  localStorage.removeItem('clientData');
  clientAuthenticated = false;
  clientData = {};
  
  // Limpiar formulario
  const form = document.getElementById('reservaForm');
  if (form) {
    form.reset();
  }
  
  // Resetear pasos
  currentStep = 1;
  showStep(1);
  updateProgressIndicator(1);
  
  // Mostrar login
  showLoginForm();
  hideLoginError();
}

function showLoginError(message) {
  const errorDiv = document.getElementById('loginError');
  const errorMessage = document.getElementById('loginErrorMessage');
  
  if (errorDiv && errorMessage) {
    errorMessage.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto-hide después de 5 segundos
    setTimeout(hideLoginError, 5000);
  }
}

function hideLoginError() {
  const errorDiv = document.getElementById('loginError');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

function setupEventListeners() {
  const form = document.getElementById('reservaForm');
  const fechaInput = document.getElementById('fecha');
  const duracionInputs = document.querySelectorAll('input[name="duracion"]');
  
  // Cambio de duración
  duracionInputs.forEach(input => {
    input.addEventListener('change', function() {
      reservaData.duracion = this.value;
      updateAvailableHours();
      updateStepProgress();
    });
  });
  
  // Cambio de fecha
  fechaInput.addEventListener('change', function() {
    reservaData.fecha = this.value;
    updateAvailableHours();
    updateStepProgress();
  });
  
  // Cambio de hora
  document.getElementById('hora').addEventListener('change', function() {
    reservaData.hora = this.value;
    updateStepProgress();
  });
  
  // Campos de datos personales
  document.getElementById('nombre').addEventListener('input', function() {
    reservaData.nombre = this.value;
    validateField(this);
    updateStepProgress();
  });
  
  document.getElementById('email').addEventListener('input', function() {
    reservaData.email = this.value;
    validateField(this);
    updateStepProgress();
  });
  
  // Términos y condiciones
  document.getElementById('aceptarTerminos').addEventListener('change', function() {
    reservaData.aceptarTerminos = this.checked;
    updateStepProgress();
  });
  
  // Envío del formulario
  form.addEventListener('submit', handleFormSubmit);
}

function setupRealTimeValidation() {
  const inputs = document.querySelectorAll('.form-control, .form-select');
  
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      if (this.classList.contains('is-invalid')) {
        validateField(this);
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  
  // Validaciones específicas por tipo
  switch(field.type) {
    case 'email':
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailPattern.test(value);
      break;
    case 'text':
      isValid = value.length >= 2;
      break;
    case 'date':
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      isValid = selectedDate >= today;
      break;
    default:
      isValid = field.checkValidity();
  }
  
  // Aplicar clases de validación
  if (isValid) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
  } else {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
  }
  
  return isValid;
}

async function updateAvailableHours() {
  const fechaInput = document.getElementById('fecha');
  const horaSelect = document.getElementById('hora');
  const loadingIndicator = document.getElementById('horariosLoading');
  
  if (!fechaInput.value || !reservaData.duracion) {
    horaSelect.innerHTML = '<option value="">Selecciona una fecha y duración primero</option>';
    return;
  }
  
  // Mostrar indicador de carga
  loadingIndicator.style.display = 'block';
  horaSelect.disabled = true;
  
  try {
    const response = await fetch(`http://localhost:3001/horarios-ocupados?fecha=${fechaInput.value}`);
    const data = await response.json();
    
    if (data.ok) {
      const horariosOcupados = data.horarios;
      const horariosDisponibles = generateAvailableHours(horariosOcupados, parseInt(reservaData.duracion));
      
      // Actualizar opciones
      horaSelect.innerHTML = '<option value="">Selecciona una hora</option>';
      
      if (horariosDisponibles.length === 0) {
        horaSelect.innerHTML += '<option value="" disabled>No hay horarios disponibles</option>';
      } else {
        horariosDisponibles.forEach(hora => {
          horaSelect.innerHTML += `<option value="${hora}">${hora}</option>`;
        });
      }
    }
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    horaSelect.innerHTML = '<option value="" disabled>Error al cargar horarios</option>';
  } finally {
    loadingIndicator.style.display = 'none';
    horaSelect.disabled = false;
  }
}

function generateAvailableHours(ocupados, duracion) {
  const horarios = [];
  const inicio = 9 * 60; // 9:00 AM en minutos
  const fin = 18 * 60;   // 6:00 PM en minutos
  const intervalo = 30;  // Intervalos de 30 minutos
  
  for (let minutos = inicio; minutos <= fin - duracion; minutos += intervalo) {
    const horaInicio = minutos;
    const horaFin = minutos + duracion;
    
    // Verificar si hay conflicto con horarios ocupados
    let disponible = true;
    for (let ocupado of ocupados) {
      const ocupadoInicio = toMinutes(ocupado.hora);
      const ocupadoFin = ocupadoInicio + ocupado.duracion;
      
      if (horaInicio < ocupadoFin && horaFin > ocupadoInicio) {
        disponible = false;
        break;
      }
    }
    
    if (disponible) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      horarios.push(`${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }
  }
  
  return horarios;
}

function toMinutes(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

function nextStep(step) {
  // Verificar autenticación antes de continuar
  if (!clientAuthenticated) {
    alert('Debes identificarte primero para hacer una reserva');
    return;
  }
  
  if (!validateCurrentStep()) {
    return;
  }
  
  if (step <= totalSteps) {
    showStep(step);
    updateProgressIndicator(step);
    
    // Si es el paso de confirmación, actualizar resumen
    if (step === 4) {
      updateSummary();
    }
  }
}

function prevStep(step) {
  if (step >= 1) {
    showStep(step);
    updateProgressIndicator(step);
  }
}

function showStep(step) {
  // Ocultar todos los pasos
  document.querySelectorAll('.form-step').forEach(stepEl => {
    stepEl.classList.remove('active');
  });
  
  // Mostrar el paso actual
  document.getElementById(`step${step}`).classList.add('active');
  currentStep = step;
}

function updateProgressIndicator(step) {
  document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
    stepEl.classList.remove('active', 'completed');
    
    if (index + 1 === step) {
      stepEl.classList.add('active');
    } else if (index + 1 < step) {
      stepEl.classList.add('completed');
    }
  });
}

function validateCurrentStep() {
  switch(currentStep) {
    case 1:
      if (!reservaData.duracion) {
        alert('Por favor, selecciona la duración de la cita.');
        return false;
      }
      break;
      
    case 2:
      if (!reservaData.fecha || !reservaData.hora) {
        alert('Por favor, selecciona fecha y hora.');
        return false;
      }
      break;
      
    case 3:
      const nombreValido = validateField(document.getElementById('nombre'));
      const emailValido = validateField(document.getElementById('email'));
      
      if (!nombreValido || !emailValido) {
        alert('Por favor, completa correctamente todos los campos obligatorios.');
        return false;
      }
      break;
      
    case 4:
      if (!reservaData.aceptarTerminos) {
        alert('Debes aceptar los términos y condiciones.');
        return false;
      }
      break;
  }
  
  return true;
}

function updateStepProgress() {
  // Actualizar los datos del resumen en tiempo real
  reservaData.telefono = document.getElementById('telefono').value;
  reservaData.notas = document.getElementById('notas').value;
}

function updateSummary() {
  const precios = { 20: '35€', 30: '50€', 60: '80€' };
  
  document.getElementById('resumenDuracion').textContent = `${reservaData.duracion} minutos`;
  document.getElementById('resumenFecha').textContent = formatearFecha(reservaData.fecha);
  document.getElementById('resumenHora').textContent = reservaData.hora;
  document.getElementById('resumenNombre').textContent = reservaData.nombre;
  document.getElementById('resumenEmail').textContent = reservaData.email;
  document.getElementById('resumenPrecio').textContent = precios[reservaData.duracion];
}

function formatearFecha(fecha) {
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!clientAuthenticated) {
    alert('Debes identificarte primero para hacer una reserva');
    return;
  }
  
  if (!validateCurrentStep()) {
    return;
  }
  
  const submitButton = document.getElementById('btnConfirmar');
  const originalText = submitButton.innerHTML;
  
  // Mostrar estado de carga
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
  
  try {
    const response = await fetch('http://localhost:3001/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: reservaData.nombre || clientData.name,
        email: reservaData.email || clientData.email,
        fecha: reservaData.fecha,
        hora: reservaData.hora,
        duracion: reservaData.duracion,
        telefono: reservaData.telefono || clientData.phone,
        notas: reservaData.notas || ''
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      // Mostrar modal de éxito
      const successModal = new bootstrap.Modal(document.getElementById('successModal'));
      successModal.show();
      
      // Resetear formulario después de cerrar el modal
      document.getElementById('successModal').addEventListener('hidden.bs.modal', function() {
        resetForm();
      });
    } else {
      throw new Error(result.message || 'Error al procesar la reserva');
    }
  } catch (error) {
    alert('Error al enviar la reserva: ' + error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  }
}

function resetForm() {
  // Resetear datos
  reservaData = {};
  currentStep = 1;
  
  // Resetear formulario
  const form = document.getElementById('reservaForm');
  if (form) {
    form.reset();
  }
  
  // Resetear validaciones
  document.querySelectorAll('.form-control, .form-select').forEach(field => {
    field.classList.remove('is-valid', 'is-invalid');
  });
  
  // Volver al primer paso
  showStep(1);
  updateProgressIndicator(1);
  
  // Limpiar select de horas
  const horaSelect = document.getElementById('hora');
  if (horaSelect) {
    horaSelect.innerHTML = '<option value="">Selecciona una hora</option>';
  }
  
  // Prellenar datos del usuario autenticado
  if (clientAuthenticated) {
    setTimeout(prefillUserData, 100);
  }
};

// ================================
// FUNCIONALIDAD DE LA GALERÍA
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar galería solo si estamos en la página de galería
    if (document.querySelector('.gallery-section')) {
        initializeGallery();
    }
});

function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    // Añadir event listeners a las imágenes de la galería
    galleryItems.forEach(item => {
        // Añadir el título como atributo data-title para el CSS
        const img = item.querySelector('img');
        const title = img.getAttribute('data-title');
        item.setAttribute('data-title', title);

        // Event listener para abrir modal al hacer click
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = img.getAttribute('data-title');
            const description = img.getAttribute('data-description');
            const src = img.src;
            const alt = img.alt;

            modalImage.src = src;
            modalImage.alt = alt;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            modal.show();
        });

        // Animación de entrada
        setTimeout(() => {
            item.classList.add('fade-in');
        }, Math.random() * 500);
    });

    // Funcionalidad de filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar imágenes
            filterGalleryItems(filter);
        });
    });

    // Lazy loading para las imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                imageObserver.observe(img);
            }
        });
    }
}

function filterGalleryItems(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            item.style.display = 'block';
            setTimeout(() => {
                item.classList.remove('fade-out');
                item.classList.add('fade-in');
            }, 50);
        } else {
            item.classList.remove('fade-in');
            item.classList.add('fade-out');
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Añadir funcionalidad de teclado para navegación en el modal
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('imageModal');
    if (modal.classList.contains('show')) {
        if (e.key === 'Escape') {
            bootstrap.Modal.getInstance(modal).hide();
        } else if (e.key === 'ArrowLeft') {
            navigateGallery('prev');
        } else if (e.key === 'ArrowRight') {
            navigateGallery('next');
        }
    }
});

function navigateGallery(direction) {
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item')).filter(item => 
        item.style.display !== 'none'
    );
    const modalImage = document.getElementById('modalImage');
    const currentSrc = modalImage.src;
    
    let currentIndex = visibleItems.findIndex(item => 
        item.querySelector('img').src === currentSrc
    );
    
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % visibleItems.length;
    } else {
        currentIndex = currentIndex <= 0 ? visibleItems.length - 1 : currentIndex - 1;
    }
    
    const nextItem = visibleItems[currentIndex];
    if (nextItem) {
        nextItem.click();
    }
}

// ===========================
// CARRUSEL DE RESEÑAS
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const reviewsContainer = document.querySelector('.reviews-container');
    const prevBtn = document.getElementById('reviewsPrev');
    const nextBtn = document.getElementById('reviewsNext');
    
    if (!reviewsContainer || !prevBtn || !nextBtn) return;
    
    let currentPosition = 0;
    const reviewCards = document.querySelectorAll('.review-card');
    const cardWidth = 370; // 350px + 20px gap
    const visibleCards = getVisibleCards();
    const maxPosition = Math.max(0, reviewCards.length - visibleCards);
    
    function getVisibleCards() {
        const containerWidth = reviewsContainer.parentElement.clientWidth;
        return Math.floor(containerWidth / cardWidth);
    }
    
    function updateCarousel() {
        const translateX = -currentPosition * cardWidth;
        reviewsContainer.style.transform = `translateX(${translateX}px)`;
        
        // Actualizar estado de los botones
        prevBtn.disabled = currentPosition === 0;
        nextBtn.disabled = currentPosition >= maxPosition;
        
        prevBtn.style.opacity = currentPosition === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentPosition >= maxPosition ? '0.5' : '1';
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateCarousel();
        }
    });
    
    // Auto-scroll del carrusel cada 5 segundos
    setInterval(() => {
        if (currentPosition >= maxPosition) {
            currentPosition = 0;
        } else {
            currentPosition++;
        }
        updateCarousel();
    }, 5000);
    
    // Actualizar en resize
    window.addEventListener('resize', () => {
        const newVisibleCards = getVisibleCards();
        const newMaxPosition = Math.max(0, reviewCards.length - newVisibleCards);
        
        if (currentPosition > newMaxPosition) {
            currentPosition = newMaxPosition;
        }
        
        updateCarousel();
    });
    
    // Inicializar
    updateCarousel();
    
    // Animación de entrada de las barras de rating
    const ratingBars = document.querySelectorAll('.rating-bar .fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fillBar 1.5s ease-out forwards';
            }
        });
    });
    
    ratingBars.forEach(bar => observer.observe(bar));
});

