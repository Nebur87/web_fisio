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
  const navKeys = ['inicio', 'sobre_nosotros', 'servicios', 'reservar', 'contacto'];
  navItems.forEach((item, i) => {
    item.textContent = locales[lang].navbar[navKeys[i]];
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
  if (Object.keys(locales).length === 0) {
    await loadLocales();
  }
  applyTranslations(lang);
  applyLegalTranslations(lang);
}

window.setLang = setLang;
  const form = document.querySelector(".reserva form");
  if (!form) return;
  // Bloquear horarios ocupados según fecha y duración
  const fechaInput = form.fecha;
  const horaInput = form.hora;
  const duracionInput = form.duracion;
  // Cargar idioma por defecto
  setLang(currentLang);

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
  // ...existing code...
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      fecha: form.fecha.value,
      hora: form.hora.value,
      duracion: form.duracion.value
    };
    try {
      const res = await fetch("http://localhost:3001/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.ok) {
        alert("¡Reserva enviada correctamente!");
        form.reset();
      } else {
        alert("Error al enviar la reserva: " + result.message);
      }
    } catch (err) {
      alert("Error de conexión con el servidor.");
    }
  });
});

