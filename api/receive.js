// api/receive.js
const Pusher = require("pusher");

// Inicialización defensiva
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.VITE_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.VITE_PUSHER_CLUSTER || "",
  useTLS: true
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const { folio, qrCodeBase64 } = req.body;

      if (!folio || !qrCodeBase64) {
        return res.status(400).json({ error: "Datos incompletos" });
      }

      // IMPORTANTE: Verifica que las variables existan antes de disparar
      if (!process.env.PUSHER_APP_ID) {
        throw new Error("Variables de entorno de Pusher no configuradas en Vercel");
      }

      await pusher.trigger("tickets-channel", "new-ticket", { folio, qrCodeBase64 });

      return res.status(200).json({ message: "Ticket enviado con éxito" });
    } catch (error) {
      console.error("DETALLE DEL ERROR:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}