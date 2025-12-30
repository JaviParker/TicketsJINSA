// pages/api/receive.js

export default function handler(req, res) {
  // 1. Configurar los encabezados CORS para permitir cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite peticiones desde cualquier PC/Red
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Manejar la petición pre-flight (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Manejar la petición POST
  if (req.method === 'POST') {
    const data = req.body;
    console.log("Datos recibidos:", data);

    // Aquí puedes guardar los datos en una base de datos o procesarlos
    return res.status(200).json({ message: "Datos recibidos con éxito", data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}