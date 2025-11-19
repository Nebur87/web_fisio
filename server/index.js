const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const PORT = 3001;

// Configuración de CORS más específica
const corsOptions = {
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://127.0.0.1:5501', 'http://localhost:5501', 'file://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Configurar charset UTF-8
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(bodyParser.json({ charset: 'utf-8' }));
app.use(express.static('C:/Users/Ruben/Desktop/web_fisio2'));

// Middleware global para configurar UTF-8 en todas las respuestas
app.use((req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Configuración JWT
const JWT_SECRET = 'eclosion_des_sens_admin_secret_2024_secure_key';
const JWT_EXPIRES_IN = '24h';

// Credenciales de administrador (en producción usar base de datos)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '$2b$10$8K1p7Z4YJQxJJ7JJ7J7J7O7J7J7J7J7J7J7J7J7J7J7J7J7J7J7J7J' // 'admin123'
};

// Hashear la contraseña para el primer uso
async function initAdminPassword() {
  if (ADMIN_CREDENTIALS.password === 'admin123') {
    ADMIN_CREDENTIALS.password = await bcrypt.hash('admin123', 10);
  }
}

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ ok: false, message: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ ok: false, message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

// Inicializar al arrancar el servidor
initAdminPassword();

// ================================
// RUTAS DE AUTENTICACIÓN
// ================================

// Login de administrador
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ ok: false, message: 'Usuario y contraseña son requeridos' });
    }
    
    // Verificar credenciales
    if (username !== ADMIN_CREDENTIALS.username) {
      return res.status(401).json({ ok: false, message: 'Credenciales incorrectas' });
    }
    
    const isValidPassword = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
    if (!isValidPassword) {
      return res.status(401).json({ ok: false, message: 'Credenciales incorrectas' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { username: username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      ok: true,
      message: 'Login exitoso',
      token: token,
      user: { username: username, role: 'admin' }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// Verificar token
app.post('/admin/verify', authenticateToken, (req, res) => {
  res.json({ ok: true, message: 'Token válido', user: req.user });
});

// Logout (invalidar token del lado cliente)
app.post('/admin/logout', authenticateToken, (req, res) => {
  res.json({ ok: true, message: 'Logout exitoso' });
});

// ================================
// RUTAS DE RESERVAS (PROTEGIDAS)
// ================================

// Ruta para obtener todas las reservas con paginación y filtros (PROTEGIDA)
app.get('/todas-reservas', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', fecha_desde = '', fecha_hasta = '', duracion = '' } = req.query;
    
    let query = 'SELECT id, nombre, email, fecha, DATE_FORMAT(hora, "%H:%i") as hora, duracion FROM reservas';
    let countQuery = 'SELECT COUNT(*) as total FROM reservas';
    const queryParams = [];
    const conditions = [];
    
    // Filtros
    if (search) {
      conditions.push('(nombre LIKE ? OR email LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (fecha_desde) {
      conditions.push('fecha >= ?');
      queryParams.push(fecha_desde);
    }
    
    if (fecha_hasta) {
      conditions.push('fecha <= ?');
      queryParams.push(fecha_hasta);
    }
    
    if (duracion) {
      conditions.push('duracion = ?');
      queryParams.push(duracion);
    }
    
    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }
    
    // Ordenamiento y paginación
    query += ' ORDER BY fecha DESC, hora DESC';
    
    if (limit !== 'all') {
      const offset = (page - 1) * parseInt(limit);
      query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    }
    
    const [rows] = await db.query(query, queryParams);
    const [countResult] = await db.query(countQuery, queryParams);
    
    res.json({ 
      ok: true, 
      reservas: rows,
      total: countResult[0].total,
      page: parseInt(page),
      limit: limit === 'all' ? rows.length : parseInt(limit)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al obtener reservas', error });
  }
});

// Ruta para obtener estadísticas de reservas (PROTEGIDA)
app.get('/estadisticas-reservas', authenticateToken, async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const inicioSemana = new Date();
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
    const fechaInicioSemana = inicioSemana.toISOString().split('T')[0];
    
    const inicioMes = new Date();
    inicioMes.setDate(1);
    const fechaInicioMes = inicioMes.toISOString().split('T')[0];
    
    // Total de reservas
    const [totalRows] = await db.query('SELECT COUNT(*) as total FROM reservas');
    
    // Reservas de hoy
    const [hoyRows] = await db.query('SELECT COUNT(*) as total FROM reservas WHERE fecha = ?', [hoy]);
    
    // Reservas de esta semana
    const [semanaRows] = await db.query('SELECT COUNT(*) as total FROM reservas WHERE fecha >= ?', [fechaInicioSemana]);
    
    // Reservas de este mes
    const [mesRows] = await db.query('SELECT COUNT(*) as total FROM reservas WHERE fecha >= ?', [fechaInicioMes]);
    
    // Próximas reservas (siguientes 7 días)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 7);
    const fechaLimiteStr = fechaLimite.toISOString().split('T')[0];
    
    const [proximasRows] = await db.query(
      'SELECT COUNT(*) as total FROM reservas WHERE fecha >= ? AND fecha <= ?', 
      [hoy, fechaLimiteStr]
    );
    
    // Distribución por duración
    const [duracionRows] = await db.query(
      'SELECT duracion, COUNT(*) as cantidad FROM reservas GROUP BY duracion ORDER BY duracion'
    );
    
    res.json({
      ok: true,
      estadisticas: {
        total: totalRows[0].total,
        hoy: hoyRows[0].total,
        semana: semanaRows[0].total,
        mes: mesRows[0].total,
        proximas: proximasRows[0].total,
        por_duracion: duracionRows
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al obtener estadísticas', error });
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
  const { nombre, email, telefono, fecha, hora, duracion, notas } = req.body;
  
  // Validaciones
  if (!nombre || !email || !fecha || !hora || !duracion) {
    return res.status(400).json({ ok: false, message: 'Campos obligatorios faltantes' });
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ ok: false, message: 'Formato de email inválido' });
  }
  
  // Validar fecha (no puede ser en el pasado)
  const fechaReserva = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaReserva < hoy) {
    return res.status(400).json({ ok: false, message: 'No se pueden hacer reservas en fechas pasadas' });
  }
  
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
    
    // Verificar horario de trabajo (9:00 AM a 6:00 PM)
    const horaInicio = toMinutes(hora);
    const horaFin = horaInicio + parseInt(duracion);
    if (horaInicio < 9 * 60 || horaFin > 18 * 60) {
      return res.status(400).json({ ok: false, message: 'Horario fuera de atención (9:00 AM - 6:00 PM)' });
    }
    
    // Guardar reserva
    const [result] = await db.query(
      'INSERT INTO reservas (nombre, email, telefono, fecha, hora, duracion, notas) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, email, telefono || null, fecha, hora, duracion, notas || null]
    );
    
    const reservaId = result.insertId;
    // Enviar email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ovb.rubenfernandez@gmail.com',
        pass: 'qkgroywxoolhqwvf'
      }
    });
    // Email a la empresa
    let mailOptionsEmpresa = {
      from: email,
      to: 'ovb.rubenfernandez@gmail.com',
      subject: `Nueva reserva #${reservaId} - ${fecha}`,
      html: `
        <h3>Nueva Reserva Recibida</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>ID Reserva:</strong> #${reservaId}</p>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ''}
          <p><strong>Fecha:</strong> ${new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}</p>
          <p><strong>Hora:</strong> ${hora}</p>
          <p><strong>Duración:</strong> ${duracion} minutos</p>
          ${notas ? `<p><strong>Notas:</strong> ${notas}</p>` : ''}
        </div>
        <p><em>Enviado desde: Eclosion Des Sens</em></p>
      `
    };
    
    // Email al cliente
    let mailOptionsCliente = {
      from: 'ovb.rubenfernandez@gmail.com',
      to: email,
      subject: `Confirmación de Reserva #${reservaId} - Eclosion Des Sens`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2A6F97 0%, #1a4f6b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>¡Reserva Confirmada!</h1>
            <p>Gracias por elegir Eclosion Des Sens</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu cita ha sido registrada correctamente. Aquí tienes los detalles:</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>Número de Reserva:</strong> #${reservaId}</p>
              <p><strong>Fecha:</strong> ${new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}</p>
              <p><strong>Hora:</strong> ${hora}</p>
              <p><strong>Duración:</strong> ${duracion} minutos</p>
            </div>
            
            <div style="background: #e7f3ff; padding: 15px; border-left: 4px solid #2A6F97; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #2A6F97;">Información Importante:</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Por favor, llega 5 minutos antes de tu cita</li>
                <li>Trae ropa cómoda y una toalla</li>
                <li>Si necesitas cancelar, hazlo con 24h de antelación</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p><strong>📍 Dirección:</strong><br>
              Espace Famaïa<br>
              Av. des Pâquiers 22<br>
              2072 St-Blaise</p>
              
              <p><strong>📞 Contacto:</strong> 076 575 45 59</p>
            </div>
            
            <p>¡Esperamos verte pronto!</p>
            <p>Equipo de Eclosion Des Sens</p>
          </div>
        </div>
      `
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
    res.json({ 
      ok: true, 
      message: 'Reserva guardada y correos enviados correctamente',
      reservaId: reservaId,
      detalles: {
        fecha: new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES'),
        hora: hora,
        duracion: duracion
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al procesar la reserva', error });
  }
});

// Ruta para anular una reserva (cambiar estado a cancelada) (PROTEGIDA)
app.delete('/anular-reserva', authenticateToken, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ ok: false, message: 'Falta el id de la reserva' });
  }
  try {
    // Obtener datos de la reserva antes de cancelar
    const [reservaData] = await db.query(
      'SELECT nombre, email, fecha, hora FROM reservas WHERE id = ?',
      [id]
    );
    
    if (reservaData.length === 0) {
      return res.status(404).json({ ok: false, message: 'Reserva no encontrada' });
    }
    
    // Actualizar estado en lugar de eliminar
    const [result] = await db.query(
      "UPDATE reservas SET estado = 'cancelada', fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );
    
    if (result.affectedRows > 0) {
      // Enviar email de cancelación al cliente
      const reserva = reservaData[0];
      let mailOptionsCancelacion = {
        from: 'ovb.rubenfernandez@gmail.com',
        to: reserva.email,
        subject: `Reserva Cancelada #${id} - Eclosion Des Sens`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1>Reserva Cancelada</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 10px 10px;">
              <p>Hola <strong>${reserva.nombre}</strong>,</p>
              <p>Te confirmamos que tu reserva ha sido cancelada:</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Reserva:</strong> #${id}</p>
                <p><strong>Fecha:</strong> ${new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-ES')}</p>
                <p><strong>Hora:</strong> ${reserva.hora}</p>
              </div>
              
              <p>Si necesitas hacer una nueva reserva, puedes hacerlo a través de nuestra web.</p>
              <p>Gracias por tu comprensión.</p>
              <p>Equipo de Eclosion Des Sens</p>
            </div>
          </div>
        `
      };
      
      try {
        let transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: 'ovb.rubenfernandez@gmail.com',
            pass: 'qkgroywxoolhqwvf'
          }
        });
        await transporter.sendMail(mailOptionsCancelacion);
      } catch (emailError) {
        console.error('Error enviando email de cancelación:', emailError);
      }
      
      res.json({ ok: true, message: 'Reserva cancelada correctamente' });
    } else {
      res.status(404).json({ ok: false, message: 'No se pudo cancelar la reserva' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al cancelar la reserva', error });
  }
});

// Ruta para cambiar el estado de una reserva (PROTEGIDA)
app.put('/cambiar-estado-reserva', authenticateToken, async (req, res) => {
  const { id, estado } = req.body;
  
  if (!id || !estado) {
    return res.status(400).json({ ok: false, message: 'ID y estado son requeridos' });
  }
  
  const estadosValidos = ['confirmada', 'cancelada', 'completada'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ ok: false, message: 'Estado inválido' });
  }
  
  try {
    const [result] = await db.query(
      'UPDATE reservas SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?',
      [estado, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ ok: true, message: `Estado actualizado a '${estado}' correctamente` });
    } else {
      res.status(404).json({ ok: false, message: 'Reserva no encontrada' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al actualizar el estado', error });
  }
});

// ================================
// RUTAS DE RESEÑAS
// ================================

// Obtener reseñas aprobadas (públicas)
app.get('/resenas', async (req, res) => {
  try {
    // Configurar headers UTF-8
    res.set('Content-Type', 'application/json; charset=utf-8');
    
    const { limit = 'all', offset = 0 } = req.query;
    
    let query = 'SELECT id, nombre, rating, comentario, fecha_creacion FROM resenas WHERE aprobado = TRUE ORDER BY fecha_creacion DESC';
    
    if (limit !== 'all') {
      query += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    }
    
    const [rows] = await db.query(query);
    
    // Obtener estadísticas
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        AVG(rating) as promedio,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as cinco_estrellas,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as cuatro_estrellas,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as tres_estrellas,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as dos_estrellas,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as una_estrella
      FROM resenas WHERE aprobado = TRUE
    `);
    
    res.json({ 
      ok: true, 
      resenas: rows,
      estadisticas: stats[0]
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al obtener reseñas', error });
  }
});

// Crear nueva reseña (público)
app.post('/resenas', async (req, res) => {
  try {
    // Configurar headers UTF-8
    res.set('Content-Type', 'application/json; charset=utf-8');
    
    const { nombre, email, rating, comentario } = req.body;
    
    // Validaciones
    if (!nombre || !email || !rating || !comentario) {
      return res.status(400).json({ ok: false, message: 'Todos los campos son obligatorios' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, message: 'La calificación debe ser entre 1 y 5' });
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ ok: false, message: 'Email inválido' });
    }
    
    // Insertar reseña (pendiente de aprobación)
    const [result] = await db.query(
      'INSERT INTO resenas (nombre, email, rating, comentario) VALUES (?, ?, ?, ?)',
      [nombre, email, rating, comentario]
    );
    
    res.json({ 
      ok: true, 
      message: 'Reseña enviada correctamente. Será revisada antes de publicarse.',
      id: result.insertId
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al guardar reseña', error });
  }
});

// Obtener todas las reseñas (admin) - PROTEGIDA
app.get('/admin/resenas', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, estado = 'all' } = req.query;
    
    let whereClause = '';
    if (estado === 'aprobadas') {
      whereClause = 'WHERE aprobado = TRUE';
    } else if (estado === 'pendientes') {
      whereClause = 'WHERE aprobado = FALSE';
    }
    
    const query = `SELECT * FROM resenas ${whereClause} ORDER BY fecha_creacion DESC LIMIT ${parseInt(limit)} OFFSET ${(page - 1) * parseInt(limit)}`;
    const countQuery = `SELECT COUNT(*) as total FROM resenas ${whereClause}`;
    
    const [rows] = await db.query(query);
    const [countResult] = await db.query(countQuery);
    
    res.json({ 
      ok: true, 
      resenas: rows,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al obtener reseñas', error });
  }
});

// Aprobar/rechazar reseña (admin) - PROTEGIDA
app.put('/admin/resenas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { aprobado, respuesta_admin } = req.body;
    
    let query = 'UPDATE resenas SET aprobado = ?';
    let params = [aprobado];
    
    if (respuesta_admin) {
      query += ', respuesta_admin = ?, fecha_respuesta = CURRENT_TIMESTAMP';
      params.push(respuesta_admin);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await db.query(query, params);
    
    if (result.affectedRows > 0) {
      res.json({ ok: true, message: 'Reseña actualizada correctamente' });
    } else {
      res.status(404).json({ ok: false, message: 'Reseña no encontrada' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al actualizar reseña', error });
  }
});

// Eliminar reseña (admin) - PROTEGIDA
app.delete('/admin/resenas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM resenas WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      res.json({ ok: true, message: 'Reseña eliminada correctamente' });
    } else {
      res.status(404).json({ ok: false, message: 'Reseña no encontrada' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al eliminar reseña', error });
  }
});

function toMinutes(horaStr) {
  let [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});