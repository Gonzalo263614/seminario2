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

// Ruta en Express para obtener los datos del usuario por id
app.get('/api/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    // Realiza la consulta a la base de datos para obtener los datos del usuario
    connection.query('SELECT * FROM usuarios WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Error al obtener los datos');
        }
        if (results.length > 0) {
            res.json(results[0]);  // Devuelve los datos del primer usuario encontrado
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    });
});

app.get('/api/bancos', (req, res) => {
    // Consulta para obtener los datos completos de los bancos
    const query = 'SELECT DISTINCT nombre, interes, enganche FROM bancos';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener datos de bancos:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json(results);
    });
});


app.get('/api/bancos/anios/:banco', (req, res) => {
    const banco = req.params.banco;

    // Consulta para obtener los años disponibles para el banco seleccionado
    const query = 'SELECT DISTINCT anios FROM bancos WHERE nombre = ?';

    // Ejecutar la consulta
    connection.query(query, [banco], (err, results) => {
        if (err) {
            console.error('Error al obtener los años de banco:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        // Enviar los resultados al frontend
        res.json(results.map(row => row.anios));  // Solo devuelve el array de años
    });
});

// Ruta para guardar los datos del préstamo
app.post('/api/prestamos', (req, res) => {
    console.log("Datos recibidos en el servidor:", req.body);  // Verifica qué datos está recibiendo el servidor

    const {
        id_usuario,
        nombre_banco,
        costo_casa,
        enganche,
        monto_prestamo,
        mensualidad,
        interes,
        plazo_anios,
        fecha_creacion
    } = req.body;

    // Validar que los datos necesarios están presentes
    if (!id_usuario || !nombre_banco || !costo_casa || !enganche || !monto_prestamo || !mensualidad || !interes || !plazo_anios || !fecha_creacion) {
        return res.status(400).json({ message: 'Faltan datos necesarios' });
    }

    // Validar que el valor de `plazo_anios` esté dentro de los valores permitidos
    if (!['10', '15', '20'].includes(plazo_anios)) {
        return res.status(400).json({ message: 'El plazo de años debe ser uno de los siguientes: 10, 15, 20' });
    }

    // Consulta SQL para insertar los datos en la tabla `prestamos`
    const query = `
        INSERT INTO prestamos 
        (id_usuario, nombre_banco, costo_casa_sueldo, enganche, monto_prestamo, mensualidad, interes, plazo_anios, fecha_creacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id_usuario,
        nombre_banco,
        costo_casa,
        enganche,
        monto_prestamo,
        mensualidad,
        interes,
        plazo_anios,
        fecha_creacion
    ];

    // Ejecutar la consulta SQL
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al guardar el préstamo:', err);
            return res.status(500).json({ message: 'Error al guardar el préstamo' });
        }

        // Respuesta exitosa
        console.log('Préstamo guardado con éxito:', result);
        res.status(201).json({ message: 'Préstamo guardado con éxito', data: result });
    });
});

// Ruta para obtener usuarios con rol 'usuario'
app.get('/api/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios WHERE rol = "usuario"';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        } else {
            res.json(results);
        }
    });
});
// Ruta para obtener la lista de bancos
// Ruta para cargar los bancos
app.get('/api/bancosMostrar', (req, res) => {
    const query = 'SELECT * FROM bancos';
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener los bancos:', err);
            return res.status(500).json({ message: 'Error al obtener los bancos' });
        }

        // Asignar los valores de años según el banco
        result.forEach(banco => {
            if (banco.nombre === 'BBVA') {
                banco.anios = [10, 15, 20];  // Solo estos años para BBVA
            } else if (banco.nombre === 'HSBC') {
                banco.anios = [10, 20];  // Solo estos años para HSBC
            } else if (banco.nombre === 'INFONAVIT') {
                banco.anios = [10, 15];  // Solo estos años para INFONAVIT
            } else {
                banco.anios = [10, 15];  // Valor predeterminado para otros bancos
            }
        });

        res.json(result);
    });
});

// Ruta para actualizar un banco
app.put('/api/bancos/:id', (req, res) => {
    const { id } = req.params;
    const { interes, enganche, nombre } = req.body;  // No incluimos "anios" en el body

    // Primero actualizamos el banco con el ID dado
    const query = `UPDATE bancos SET interes = ?, enganche = ? WHERE id = ?`;
    connection.query(query, [interes, enganche, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el banco:', err);
            return res.status(500).json({ message: 'Error al actualizar el banco' });
        }

        // Luego, actualizamos todos los bancos con el mismo nombre
        const updateAllQuery = `UPDATE bancos SET interes = ?, enganche = ? WHERE nombre = ?`;
        connection.query(updateAllQuery, [interes, enganche, nombre], (err, result) => {
            if (err) {
                console.error('Error al actualizar bancos con el mismo nombre:', err);
                return res.status(500).json({ message: 'Error al actualizar los bancos con el mismo nombre' });
            }
            res.status(200).json({ message: 'Banco actualizado con éxito' });
        });
    });
});

// Ruta para obtener todas las cotizaciones de préstamos
app.get('/api/prestamos', (req, res) => {
    const query = `SELECT * FROM prestamos`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los bancos:', err);
            return res.status(500).json({ message: 'Error al obtener los bancos' });
        }
        // Enviar los resultados al frontend
        res.status(200).json(results);
    });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
