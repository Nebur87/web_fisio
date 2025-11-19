CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    duracion INT NOT NULL DEFAULT 30,
    notas TEXT,
    estado ENUM('confirmada', 'cancelada', 'completada') DEFAULT 'confirmada',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX idx_fecha ON reservas(fecha);
CREATE INDEX idx_estado ON reservas(estado);
CREATE INDEX idx_email ON reservas(email);
