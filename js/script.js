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
});
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
document.addEventListener("DOMContentLoaded", function() {
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

