const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Para permitir peticiones desde el frontend
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 's3cureR@ndom$ecretKey#2024!'; // Cambia esta clave por una más segura

// Middleware para permitir solicitudes desde el frontend
app.use(cors());
app.use(express.json());

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Contraseña2190.', // Usa tu contraseña
    database: 'cotizaciondb'
});

// CONEXION BASE DE DATOS
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to cotizacionDB');
});

// Ruta raíz para mostrar "SERVIDOR CORRIENDO"
app.get('/', (req, res) => {
    res.send('SERVIDOR CORRIENDO');
});

// Ruta para registrar un nuevo usuario sin encriptar la contraseña
app.post('/api/register', (req, res) => {
    const {
        nombre,
        apellido_paterno,
        apellido_materno,
        rfc,
        curp,
        correo,
        contrasena,
        edad,
        telefono,
        rol
    } = req.body;

    // Validar que todos los campos necesarios estén presentes
    if (!nombre || !apellido_paterno || !rfc || !curp || !correo || !contrasena || !edad || !telefono || !rol) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Insertar el nuevo usuario en la base de datos
    const query = `
        INSERT INTO usuarios (
            nombre,
            apellido_paterno,
            apellido_materno,
            rfc,
            curp,
            correo,
            contrasena,
            edad,
            telefono,
            fecha_alta,
            rol
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

    const values = [
        nombre,
        apellido_paterno,
        apellido_materno,
        rfc,
        curp,
        correo,
        contrasena, // Almacena la contraseña en texto plano (no recomendado en entornos de producción)
        edad,
        telefono,
        rol
    ];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
});
//LOGIN
app.post('/api/login', (req, res) => {
    const { rfc, contrasena } = req.body;
  
    // Verifica que el RFC y la contraseña estén presentes
    if (!rfc || !contrasena) {
      return res.status(400).json({ message: 'RFC y contraseña son obligatorios' });
    }
  
    // Busca al usuario por RFC
    const query = 'SELECT * FROM usuarios WHERE rfc = ?';
    connection.query(query, [rfc], (err, results) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
  
      // Si no encuentra al usuario
      if (results.length === 0 || results[0].contrasena !== contrasena) {
        return res.status(401).json({ message: 'RFC o contraseña incorrectos' });
      }
  
      const user = results[0];
  
      // Enviar los datos del usuario (rol, nombre, id) al frontend
      res.json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          nombre: user.nombre,
          rol: user.rol,  // Aquí le enviamos el rol directamente
        }
      });
    });
  });
  

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
