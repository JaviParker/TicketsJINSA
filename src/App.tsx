import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface TicketData {
  folio: string;
  qrCodeBase64: string;
}

function App() {
  const [ticket, setTicket] = useState<TicketData | null>(null);

  useEffect(() => {
    // Configura tus llaves de Pusher aquí
    const pusher = new Pusher('TU_APP_KEY', {
      cluster: 'TU_CLUSTER',
    });

    const channel = pusher.subscribe('tickets-channel');
    
    channel.bind('new-ticket', (data: TicketData) => {
      console.log('Ticket recibido:', data);
      setTicket(data);
    });

    return () => {
      pusher.unsubscribe('tickets-channel');
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
      {!ticket ? (
        /* Estado de espera cuando no hay datos */
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-400 font-mono">ESPERANDO TICKET EN TIEMPO REAL...</p>
        </div>
      ) : (
        /* Tarjeta de Ticket llamativa */
        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold tracking-widest uppercase">E-Ticket Confirmado</h2>
          </div>

          <div className="p-8 flex flex-col items-center">
            <div className="text-center mb-8">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-tighter">Número de Folio</p>
              <h1 className="text-white text-5xl font-black font-mono mt-1">#{ticket.folio}</h1>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white p-4 rounded-2xl">
                <img src={ticket.qrCodeBase64} alt="QR" className="w-48 h-48 object-contain" />
              </div>
            </div>

            <p className="text-slate-400 text-xs mt-8 text-center px-4">
              Presenta este código en el acceso principal.
            </p>
          </div>

          <div className="relative flex items-center px-4 py-2">
            <div className="absolute left-[-12px] w-6 h-6 bg-slate-900 rounded-full"></div>
            <div className="w-full border-t-2 border-dashed border-white/20"></div>
            <div className="absolute right-[-12px] w-6 h-6 bg-slate-900 rounded-full"></div>
          </div>

          <div className="p-6 text-center bg-white/5">
            <span className="text-white/60 text-sm italic font-light">Actualizado automáticamente</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;