import React from 'react';

interface TicketData {
  folio: string;
  qrCodeBase64: string; // Se espera el formato "data:image/png;base64,..."
}

const App: React.FC<{ data: TicketData }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
      
      {/* Tarjeta Principal con Glassmorphism */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        
        {/* Decoración superior */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          <h2 className="text-white text-2xl font-bold tracking-widest uppercase">E-Ticket Confirmado</h2>
        </div>

        {/* Cuerpo del Ticket */}
        <div className="p-8 flex flex-col items-center">
          
          {/* Sección del Folio */}
          <div className="text-center mb-8">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-tighter">Número de Folio</p>
            <h1 className="text-white text-5xl font-black font-mono mt-1">
              #{data.folio || "000000"}
            </h1>
          </div>

          {/* Contenedor del QR con efecto de luz */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-white p-4 rounded-2xl shadow-inner">
              {data.qrCodeBase64 ? (
                <img 
                  src={data.qrCodeBase64} 
                  alt="QR Code" 
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-200 animate-pulse rounded flex items-center justify-center text-slate-400">
                  Esperando QR...
                </div>
              )}
            </div>
          </div>

          <p className="text-slate-400 text-xs mt-8 text-center px-4">
            Escanea este código en la entrada. Este ticket es personal e intransferible.
          </p>
        </div>

        {/* Detalle estético: Línea de corte (Dashed line) */}
        <div className="relative flex items-center px-4 py-2">
           <div className="absolute left-[-12px] w-6 h-6 bg-slate-900 rounded-full"></div>
           <div className="w-full border-t-2 border-dashed border-white/20"></div>
           <div className="absolute right-[-12px] w-6 h-6 bg-slate-900 rounded-full"></div>
        </div>

        <div className="p-6 text-center bg-white/5">
           <span className="text-white/60 text-sm italic font-light">
             Generado automáticamente por el Sistema de Tickets
           </span>
        </div>
      </div>
    </div>
  );
};

export default App;