// api/receive.js
export default function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const data = req.body;
    console.log("Datos recibidos:", data);
    return res.status(200).json({ status: 'success', received: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}