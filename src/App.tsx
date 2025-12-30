import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface TicketData {
  folio: string;
  qrCodeBase64: string;
}

function App() {
  const [ticket, setTicket] = useState<TicketData | null>(null);

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || "12326b1d11f72d7bccef", {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || "us2",
      forceTLS: true
    }); 

    const channel = pusher.subscribe('tickets-channel');
    
    channel.bind('new-ticket', (data: TicketData) => {
      console.log('Ticket recibido:', data);
      setTicket(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 font-sans selection:bg-orange-500 selection:text-white">
      {/* Fondo Decorativo con Gradiente Naranja sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#ff7a0020_0%,_transparent_50%)] pointer-events-none"></div>

      {!ticket ? (
        /* ESTADO DE ESPERA: Estilo JINSA */
        <div className="text-center z-10">
          <div className="w-20 h-20 border-t-4 border-b-4 border-[#ff7a00] rounded-full animate-spin mx-auto mb-6 shadow-[0_0_15px_rgba(255,122,0,0.5)]"></div>
          <h2 className="text-white text-xl font-black tracking-widest uppercase">Ferretería La Económica</h2>
          <p className="text-gray-500 font-mono mt-2 animate-pulse">Sincronizando con almacén...</p>
        </div>
      ) : (
        /* TICKET FINAL: Colores Blanco, Negro y Naranja */
        <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-500 z-10">
          
          {/* Header con Nombre de Empresa */}
          <div className="bg-[#1a1a1a] p-6 flex flex-col items-center border-b-8 border-[#ff7a00]">
            <span className="text-[#ff7a00] font-black text-xs tracking-[0.3em] uppercase mb-1">Orden de Salida</span>
            <h2 className="text-white text-2xl font-black uppercase tracking-tight">
              Ferretería <span className="text-[#ff7a00]">La Económica</span>
            </h2>
          </div>

          <div className="p-10 flex flex-col items-center">
            {/* Sección del Folio: Muy Visible */}
            <div className="text-center mb-10 w-full bg-gray-50 py-4 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Folio de Rastreo</p>
              <h1 className="text-[#1a1a1a] text-7xl font-black font-mono leading-none">
                {ticket.folio}
              </h1>
            </div>

            {/* QR GIGANTE para escaneo a distancia */}
            <div className="relative p-4 bg-white border-[12px] border-[#1a1a1a] rounded-3xl shadow-2xl group transition-transform hover:scale-105 duration-300">
              <img 
                src={ticket.qrCodeBase64} 
                alt="Código QR de Validación" 
                className="w-64 h-64 md:w-80 md:h-80 object-contain" 
              />
              {/* Esquinas decorativas industriales */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-[#ff7a00]"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-[#ff7a00]"></div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-[#1a1a1a] font-bold text-lg leading-tight uppercase">
                ¡Listo para recolección!
              </p>
              <p className="text-gray-500 text-sm mt-2 max-w-[280px] font-medium">
                Presenta este código al personal de mostrador para recibir tu mercancía.
              </p>
            </div>
          </div>

          {/* Footer Estilo Industrial */}
          <div className="bg-gray-100 p-6 flex justify-between items-center px-10">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Estado</span>
              <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-ping"></span> ACTIVO
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Sistema</p>
              <p className="text-[#1a1a1a] font-black text-sm tracking-tighter">JINSA v2.5</p>
            </div>
          </div>

          {/* Efecto de Ticket recortado (Semicírculos laterales) */}
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#0f0f0f] rounded-full"></div>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#0f0f0f] rounded-full"></div>
        </div>
      )}
    </div>
  );
}

export default App;