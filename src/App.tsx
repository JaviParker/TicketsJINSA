import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface TicketData {
  folio: string;
  qrCodeBase64: string;
}

function App() {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Simulación de imágenes para el slider de la derecha
  const slides = [
    "https://images.unsplash.com/photo-1581244276891-6bc3a2f3b1c5?auto=format&fit=crop&q=80&w=800", // Herramientas
    "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?auto=format&fit=crop&q=80&w=800", // Construcción
    "https://images.unsplash.com/photo-1530124560677-bdaea92ca51e?auto=format&fit=crop&q=80&w=800"  // Almacén
  ];

  useEffect(() => {
    // 1. Configuración de Pusher (Funcionalidad intacta)
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || "12326b1d11f72d7bccef", {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || "us2",
      forceTLS: true
    }); 

    const channel = pusher.subscribe('tickets-channel');
    channel.bind('new-ticket', (data: TicketData) => {
      setTicket(data);
    });

    // 2. Lógica del Slider automático
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Cambia cada 5 segundos

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
      clearInterval(slideInterval);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans">
      
      {/* LADO IZQUIERDO: Información del Ticket */}
      <div className="flex w-1/2 flex-col p-12 relative border-r-4 border-gray-100">
        
        {/* Header: Logo y Nombre */}
        <div className="flex items-center gap-6 mb-16">
          <div className="w-20 h-20 bg-[#1a1a1a] rounded-xl flex items-center justify-center shadow-lg">
            {/* Logo de la empresa (Cuadrado Negro) */}
            <span className="text-orange-500 font-black text-3xl">J</span>
          </div>
          <div>
            <h1 className="text-[#ff7a00] text-4xl font-black uppercase tracking-tight leading-none">
              Ferretería La Económica
            </h1>
            <p className="text-[#ff7a00] text-xl font-medium tracking-[0.2em] mt-2">Tickets</p>
          </div>
        </div>

        {/* Cuerpo: Folio y QR */}
        <div className="flex-1 flex flex-col justify-center">
          {!ticket ? (
            <div className="text-center py-20 border-4 border-dashed border-gray-100 rounded-[3rem] animate-pulse">
              <p className="text-gray-300 text-2xl font-bold uppercase">Esperando nueva orden...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              {/* Folio Display */}
              <div className="flex items-baseline gap-4 mb-12">
                <span className="text-4xl font-black text-[#1a1a1a] uppercase">Folio</span>
                <span className="text-7xl font-black text-[#ff7a00] font-mono leading-none">
                  {ticket.folio}
                </span>
              </div>

              {/* QR Container (Cuadrado Naranja) */}
              <div className="relative inline-block p-8 bg-orange-100 rounded-[3rem] shadow-inner">
                <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full"></div>
                <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl border-8 border-orange-500">
                  <img 
                    src={ticket.qrCodeBase64} 
                    alt="QR Ticket" 
                    className="w-72 h-72 md:w-80 md:h-80 object-contain"
                  />
                </div>
              </div>

              {/* Leyenda Inferior */}
              <p className="mt-12 text-[#1a1a1a] text-xl font-black uppercase tracking-tighter">
                Escanea el código QR para obtener tu ticket
              </p>
            </div>
          )}
        </div>

        {/* Marca de agua / Versión */}
        <div className="absolute bottom-8 left-12">
           <span className="text-gray-300 font-mono text-sm uppercase">Powered by JINSA v2.5</span>
        </div>
      </div>

      {/* LADO DERECHO: Slider Multimedia (Área Gris) */}
      <div className="w-1/2 bg-gray-200 relative overflow-hidden">
        {slides.map((url, index) => (
          <div
            key={url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <img 
              src={url} 
              alt="Publicidad" 
              className="w-full h-full object-cover scale-110"
            />
            {/* Overlay Informativo opcional */}
            <div className="absolute bottom-16 left-16 z-20 text-white">
              <h3 className="text-5xl font-black uppercase leading-tight">
                Herramientas <br /> <span className="text-orange-500">Profesionales</span>
              </h3>
              <p className="mt-4 text-xl font-medium text-white/80">Disponibles en el pasillo central</p>
            </div>
          </div>
        ))}

        {/* Indicadores del Slider */}
        <div className="absolute bottom-10 right-10 flex gap-2 z-30">
          {slides.map((_, i) => (
            <div 
              key={i}
              className={`h-3 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-12 bg-orange-500" : "w-3 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;