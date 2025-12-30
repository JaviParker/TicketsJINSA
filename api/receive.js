// api/receive.js
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "TU_APP_ID",
  key: "TU_APP_KEY",
  secret: "TU_SECRET",
  cluster: "TU_CLUSTER",
  useTLS: true
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { folio, qrCodeBase64 } = req.body;

    // ESTO ENVÍA EL TICKET AL FRONTEND AL INSTANTE
    await pusher.trigger("tickets-channel", "new-ticket", {
      folio,
      qrCodeBase64
    });

    return res.status(200).json({ status: "Enviado a Pusher" });
  }
}