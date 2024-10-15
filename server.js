// server.js

import express from 'express';
import dotenv from 'dotenv';
import chatbotRoutes from './api/chatbot.js';  // Importa las rutas del chatbot

dotenv.config(); // Carga las variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Montar las rutas para el chatbot
app.use('/api', chatbotRoutes);

// Ruta básica para verificar que el servidor esté corriendo
app.get('/', (req, res) => {
  res.send('El servidor está funcionando.');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
