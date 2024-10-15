// api/chatbot.js

import express from 'express';
import _ from 'lodash';
import dotenv from 'dotenv';
import * as chat from '@botpress/chat';
dotenv.config(); 

const router = express.Router();

const webhookId = process.env.WEBHOOK_ID;

if (!webhookId) {
  throw new Error('WEBHOOK_ID es necesario');
}

const apiUrl = `https://chat.botpress.cloud/${webhookId}`;

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'La pregunta es requerida.' });
    }

    // Conectar al cliente de Botpress
    const client = await chat.Client.connect({ apiUrl });

    // Crear conversación
    const { conversation } = await client.createConversation({});

    // Enviar la pregunta al chatbot
    await client.createMessage({
      conversationId: conversation.id,
      payload: {
        type: 'text',
        text: question,
      },
    });

    // Esperar para obtener la respuesta (polling opcional si necesitas más tiempo)
    await new Promise((resolve) => setTimeout(resolve, 3000));  // Aumenta el tiempo si es necesario

    // Obtener mensajes de la conversación
    const { messages } = await client.listConversationMessages({
      id: conversation.id,
    });

    const sortedMessages = _.sortBy(messages, (m) => new Date(m.createdAt).getTime());
    const botResponse = sortedMessages[1]?.payload?.text || 'El bot no respondió.';

    // Enviar la respuesta al cliente
    return res.json({ question, response: botResponse });
  } catch (error) {
    console.error('Error en la conversación:', error.message);

    // Responder con error claro
    return res.status(500).json({ error: 'Error al procesar la conversación con el chatbot.', details: error.message });
  }
});

export default router;
