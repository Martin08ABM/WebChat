require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY || process.env.SECRET_KEY;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/usuarios', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error en MongoDB:', err));

// Definir esquema de usuario
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    googleId: String
});

const User = mongoose.model('User', UserSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Ruta de autenticación con Google
app.post('/auth/google', async (req, res) => {
    const { id_token } = req.body;

    if (!id_token) {
        return res.status(400).json({ success: false, message: 'Falta el id_token' });
    }

    try {
        // Verificar el token de Google
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { name, email, sub } = payload;

        console.log("✅ Usuario autenticado:", payload);

        // Buscar usuario en la base de datos
        let user = await User.findOne({ email });

        if (!user) {
            // Si el usuario no existe, se crea
            user = new User({ name, email, googleId: sub });
            await user.save();
            console.log('🆕 Usuario registrado:', user);
        }

        // Generar token JWT
        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });

        return res.status(200).json({ success: true, token, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('❌ Error al verificar el token:', error);
        return res.status(400).json({ success: false, message: 'Token inválido' });
    }
});

// Middleware para verificar el token en rutas protegidas
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ success: false, message: 'Acceso denegado' });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: 'Token inválido' });
    }
}

// Ruta protegida (Ejemplo)
app.get('/perfil', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    res.json({ success: true, user });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
