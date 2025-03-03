const express = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('96843423519-noddsk11rgb13m0jk9cvnf9telgli22c.apps.googleusercontent.com');
const app = express();

app.use(bodyParser.json());

// Ruta para el inicio de sesión o registro con Google
app.post('/auth/google', async (req, res) => {
    const { id_token } = req.body; // Asegurar que el cliente envía el id_token

    if (!id_token) {
        return res.status(400).json({ success: false, message: 'Falta el id_token' });
    }

    try {
        // Verificar el token de Google
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: '96843423519-noddsk11rgb13m0jk9cvnf9telgli22c.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();
        const { name, email, sub } = payload; // sub es el ID único de Google

        console.log("Usuario autenticado:", payload);

        // Aquí verificar en la base de datos si el usuario existe
        const user = await findUserByEmail(email); // Simulación

        if (user) {
            return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
        } else {
            await createUser({ name, email, googleId: sub }); // Simulación de creación de usuario
            return res.status(200).json({ success: true, message: 'Registro exitoso' });
        }
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(400).json({ success: false, message: 'Token inválido' });
    }
});

// Funciones simuladas de base de datos
async function findUserByEmail(email) {
    return null; // Aquí iría la lógica real de consulta a la base de datos
}

async function createUser(userData) {
    console.log('Creando usuario...', userData); // Aquí se guardaría en la base de datos
}

app.listen(5500, () => {
    console.log('Servidor escuchando en el puerto 5500');
});
