import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import './index.css';

interface TicketData {
  folio: string;
  qrCodeBase64: string;
}

function App() {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Imágenes del slider
  const slides = [
    "https://i.postimg.cc/7LpqMg1B/image-2025-12-30-094619668.png",
    "https://i.postimg.cc/P5Wbk4JD/Gemini-Generated-Image-vcqlllvcqlllvcql.png",
    "https://i.postimg.cc/yNqV0myr/Gemini-Generated-Image-yxodamyxodamyxod.png",
    "https://i.postimg.cc/SR09Y2t7/Gemini-Generated-Image-pbwvixpbwvixpbwv.png"
  ];

  useEffect(() => {
    // Configuración de Pusher
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || "12326b1d11f72d7bccef", {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || "us2",
      forceTLS: true
    }); 

    const channel = pusher.subscribe('tickets-channel');
    channel.bind('new-ticket', (data: TicketData) => {
      setTicket(data);
    });

    // Intervalo del slider
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
      clearInterval(slideInterval);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans">
      
      {/* =========================================
          CONTENEDOR IZQUIERDO (40% width)
      ========================================= */}
      <div className="flex w-[40%] flex-col p-12 justify-center">
        
        {/* 1. Header: Logo, Título y Subtítulo */}
        <div className="flex items-start gap-5 mb-16">
          {/* Logo (Cuadrado Negro) */}
          <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            {/* <span className="text-[#FF7A00] font-black text-4xl">J</span> */}
            <img 
              src="https://jinsa.com.mx/cdn/shop/files/LOGOGDE.png?v=1760053686" 
              alt="Logo JINSA" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          {/* Textos del Header */}
          <div className="flex flex-col">
            <h1 className="text-black text-4xl font-black leading-tight uppercase">
              Ferretería La Económica
            </h1>
            <h2 className="text-black text-2xl font-medium tracking-wider mt-1 uppercase">
              Tickets
            </h2>
          </div>
        </div>

        {/* Contenido Dinámico (Folio y QR) */}
        <div>
          {!ticket ? (
            // Estado de espera
            <div className="p-10 border-4 border-dashed border-gray-200 rounded-2xl text-center animate-pulse">
              <p className="text-gray-400 text-2xl font-bold uppercase">Esperando ticket...</p>
            </div>
          ) : (
            // Ticket Recibido
            <div className="flex flex-col animate-in fade-in duration-500">
              
              {/* 2. Sección FOLIO (Horizontal) */}
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-black text-5xl font-black uppercase tracking-tight">
                  FOLIO
                </span>
                {/* Valor del folio en Naranja #FF7A00 */}
                <span className="text-[#FF7A00] text-6xl font-black font-mono leading-none uppercase">
                  {ticket.folio}
                </span>
              </div>

              {/* 3. Div del QR Interpretado */}
              <div className="mb-8 self-start p-2 bg-white border-4 border-gray-100 rounded-3xl shadow-sm">
                <img 
                  src={ticket.qrCodeBase64} 
                  alt="Código QR" 
                  // Tamaño ajustado para que se vea bien en el 40% de pantalla
                  className="w-full max-w-[350px] h-auto object-contain rounded-2xl"
                />
              </div>

              {/* 4. Leyenda Inferior */}
              <p className="text-black text-xl font-bold leading-tight max-w-md">
                Escanea el código QR para obtener tu ticket
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          CONTENEDOR DERECHO (60% width) - Slider
      ========================================= */}
      <div className="w-[60%] bg-gray-100 relative overflow-hidden">
        {slides.map((url, index) => (
          <div
            key={url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Imagen limpia sin overlays ni texto */}
            <img 
              src={url} 
              alt="Slider" 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;