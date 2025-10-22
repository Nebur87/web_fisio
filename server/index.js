const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(__dirname + '/../'));

// Ruta para obtener todas las reservas (solo uso interno)
app.get('/todas-reservas', async (req, res) => {
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
      }
    });
    let mailOptions = {
      from: email,
      to: 'ovb.rubenfernandez@gmail.com',
      subject: 'Nueva reserva desde la web',
      text: `Nombre: ${nombre}\nEmail: ${email}\nFecha: ${fecha}\nHora: ${hora}\nDuración: ${duracion} minutos`
    };
    await transporter.sendMail(mailOptions);
    res.json({ ok: true, message: 'Reserva guardada y correo enviado correctamente' });
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