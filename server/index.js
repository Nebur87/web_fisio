const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3001;

// Configuración de admin (usuario y contraseña fijos)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'fisio2025';
const ADMIN_TOKEN = 'admin-token-2025'; // Token simple para demo

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/../'));

// Endpoint de login de admin
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }
});

// Endpoint para verificar token de admin
app.post('/admin/verify', (req, res) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '');
  if (token === ADMIN_TOKEN) {
    return res.json({ ok: true });
  } else {
    return res.status(401).json({ ok: false });
  }
});

// Ruta para obtener todas las reservas (solo uso interno)
app.get('/todas-reservas', async (req, res) => {
  // Protección: requiere token admin
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, message: 'No autorizado' });
  }
  try {
    const [rows] = await db.query('SELECT id, nombre, email, fecha, DATE_FORMAT(hora, "%H:%i") as hora, duracion FROM reservas');
    res.json({ ok: true, reservas: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al obtener reservas', error });
  }
});

// Ruta para consultar horarios ocupados en una fecha
app.get('/horarios-ocupados', async (req, res) => {
  const { fecha } = req.query;
  if (!fecha) return res.status(400).json({ ok: false, message: 'Fecha requerida' });
  try {
    const [rows] = await db.query(
      'SELECT hora, duracion FROM reservas WHERE fecha = ?',
      [fecha]
    );
    res.json({ ok: true, horarios: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al consultar horarios', error });
  }
});

// Ruta para guardar una reserva
app.post('/send', async (req, res) => {
  const { nombre, email, fecha, hora, duracion } = req.body;
  try {
    // Comprobar solapamiento
    const [rows] = await db.query(
      'SELECT hora, duracion FROM reservas WHERE fecha = ?',
      [fecha]
    );
    const nuevaInicio = toMinutes(hora);
    const nuevaFin = nuevaInicio + parseInt(duracion);
    for (let r of rows) {
      let resInicio = toMinutes(r.hora);
      let resFin = resInicio + r.duracion;
      if (nuevaInicio < resFin && nuevaFin > resInicio) {
        return res.status(409).json({ ok: false, message: 'Fecha y hora no disponibles' });
      }
    }
    // Guardar reserva
    await db.query(
      'INSERT INTO reservas (nombre, email, fecha, hora, duracion) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, fecha, hora, duracion]
    );
    // Enviar email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ovb.rubenfernandez@gmail.com',
        pass: 'qkgroywxoolhqwvf'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    // Email a la empresa
    let mailOptionsEmpresa = {
      from: email,
      to: 'ovb.rubenfernandez@gmail.com',
      subject: 'Nueva reserva desde la web',
      text: `Nombre: ${nombre}\nEmail: ${email}\nFecha: ${fecha}\nHora: ${hora}\nDuración: ${duracion} minutos`
    };
    // Email al cliente
    let mailOptionsCliente = {
      from: 'ovb.rubenfernandez@gmail.com',
      to: email,
      subject: 'Confirmación de reserva en Clínica de Fisioterapia',
      text: `Hola ${nombre},\n\nTu reserva ha sido registrada correctamente.\n\nFecha: ${fecha}\nHora: ${hora}\nDuración: ${duracion} minutos\n\nGracias por confiar en nosotros.\n\nClínica de Fisioterapia`
    };
    try {
      let infoEmpresa = await transporter.sendMail(mailOptionsEmpresa);
      console.log('Correo enviado a empresa:', infoEmpresa.response);
    } catch (err) {
      console.error('Error enviando correo a empresa:', err);
    }
    try {
      let infoCliente = await transporter.sendMail(mailOptionsCliente);
      console.log('Correo enviado al cliente:', infoCliente.response);
    } catch (err) {
      console.error('Error enviando correo al cliente:', err);
    }
    res.json({ ok: true, message: 'Reserva guardada y correos enviados (ver log para detalles)' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al procesar la reserva', error });
  }
});

// Ruta para anular una reserva (solo uso interno)
app.delete('/anular-reserva', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ ok: false, message: 'Falta el id de la reserva' });
  }
  try {
    const [result] = await db.query(
      "DELETE FROM reservas WHERE id = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.json({ ok: true, message: 'Reserva anulada correctamente' });
    } else {
      res.status(404).json({ ok: false, message: 'Reserva no encontrada' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al anular la reserva', error });
  }
});

function toMinutes(horaStr) {
  let [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});