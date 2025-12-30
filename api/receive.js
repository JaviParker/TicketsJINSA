// api/receive.js
import Pusher from 'pusher';

// Inicializamos Pusher con las variables de entorno de Vercel
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

      // Validación de datos
      if (!folio || !qrCodeBase64) {
        return res.status(400).json({ error: "Folio y qrCodeBase64 son requeridos" });
      }

      // Disparar el evento a Pusher
      await pusher.trigger("tickets-channel", "new-ticket", {
        folio,
        qrCodeBase64
      });

      return res.status(200).json({ success: true, message: "Ticket enviado" });
    } catch (error) {
      console.error("Error en el handler:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}