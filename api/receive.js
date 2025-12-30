// api/receive.js
const Pusher = require("pusher"); // Usa require para asegurar compatibilidad en Vercel Node runtime

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.VITE_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.VITE_PUSHER_CLUSTER,
  useTLS: true
});

export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { folio, qrCodeBase64 } = req.body;

      // Validación simple
      if (!folio || !qrCodeBase64) {
        return res.status(400).json({ error: "Faltan campos obligatorios: folio o qrCodeBase64" });
      }

      // Disparar evento a Pusher (DEBE ser await)
      await pusher.trigger("tickets-channel", "new-ticket", {
        folio,
        qrCodeBase64
      });

      return res.status(200).json({ 
        status: "success", 
        message: "Evento enviado a Pusher correctamente" 
      });

    } catch (error) {
      console.error("Error en Pusher:", error);
      return res.status(500).json({ 
        error: "Error interno del servidor", 
        details: error.message 
      });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}