import { useEffect, useState } from 'react';
import Pusher from 'pusher-js'; // Para el cliente SIEMPRE usa pusher-js

interface TicketData {
  folio: string;
  qrCodeBase64: string;
}

function App() {
  const [ticket, setTicket] = useState<TicketData | null>(null);

  useEffect(() => {
    // 1. Usar variables de entorno de Vite para seguridad
    // Asegúrate de cargarlas en Vercel con el prefijo VITE_
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || "12326b1d11f72d7bccef", {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || "us2",
      forceTLS: true
    }); 

    // 2. Suscribirse al canal definido en tu backend
    const channel = pusher.subscribe('tickets-channel');
    
    // 3. Escuchar el evento 'new-ticket'
    channel.bind('new-ticket', (data: TicketData) => {
      console.log('Ticket recibido en tiempo real:', data);
      setTicket(data);
    });

    return () => {
      // Limpieza al desmontar el componente
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
      {!ticket ? (
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-400 font-mono uppercase tracking-widest">Esperando Ticket JINSA...</p>
        </div>
      ) : (
        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold tracking-widest uppercase">Confirmación de Acceso</h2>
          </div>

          <div className="p-8 flex flex-col items-center">
            <div className="text-center mb-8">
              <p className="text-blue-400 text-sm font-semibold uppercase">Folio de Registro</p>
              <h1 className="text-white text-5xl font-black font-mono mt-1">#{ticket.folio}</h1>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-lg">
                <img src={ticket.qrCodeBase64} alt="Código QR" className="w-48 h-48 object-contain" />
              </div>
            </div>

            <p className="text-slate-400 text-xs mt-8 text-center px-4 font-light">
              Muestra este código al llegar a la recepción para validar tu entrada.
            </p>
          </div>

          <div className="relative flex items-center px-4 py-2">
            <div className="absolute left-[-12px] w-6 h-6 bg-slate-900 rounded-full"></div>
            <div className="w-full border-t-2 border-dashed border-white/20"></div>
            <div className="absolute right-[-12px] w-6 h-6 bg-slate-900 rounded-full"></div>
          </div>

          <div className="p-6 text-center bg-white/5">
            <span className="text-blue-400/80 text-xs font-mono tracking-tighter uppercase">
              Actualización Automática vía Pusher
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;