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

  const slides = [
    "https://i.postimg.cc/7LpqMg1B/image-2025-12-30-094619668.png",
    "https://i.postimg.cc/P5Wbk4JD/Gemini-Generated-Image-vcqlllvcqlllvcql.png",
    "https://i.postimg.cc/yNqV0myr/Gemini-Generated-Image-yxodamyxodamyxod.png",
    "https://i.postimg.cc/SR09Y2t7/Gemini-Generated-Image-pbwvixpbwvixpbwv.png"
  ];

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || "12326b1d11f72d7bccef", {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || "us2",
      forceTLS: true
    }); 

    const channel = pusher.subscribe('tickets-channel');
    channel.bind('new-ticket', (data: TicketData) => {
      setTicket(data);
    });

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
      <div className="flex w-[40%] flex-col px-12 pt-[35px] border-r border-gray-100">
        
        {/* 1. Header: Logo, Título y Subtítulo */}
        <div className="flex items-start gap-6 mb-12">
          <div className="w-24 h-24 bg-black rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <img 
              src="https://jinsa.com.mx/cdn/shop/files/LOGOGDE.png?v=1760053686" 
              alt="Logo JINSA" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-black text-5xl font-black leading-tight uppercase tracking-tighter">
              Ferretería <br/> La Económica
            </h1>
            <h2 className="text-[#FF7A00] text-3xl font-bold tracking-[0.2em] mt-1 uppercase">
              Tickets
            </h2>
          </div>
        </div>

        {/* Contenido Dinámico */}
        <div className="flex-1 flex flex-col">
          {!ticket ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="p-16 border-8 border-dashed border-gray-100 rounded-[3rem] text-center animate-pulse">
                <p className="text-gray-300 text-4xl font-black uppercase italic">Sincronizando...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col animate-in fade-in zoom-in duration-700">
              
              {/* 2. Sección FOLIO (Masivo y Horizontal) */}
              <div className="flex items-center gap-6 mb-10">
                <span className="text-black text-7xl font-black uppercase">
                  FOLIO
                </span>
                <span className="text-[#FF7A00] text-8xl font-black font-mono leading-none uppercase">
                  {ticket.folio}
                </span>
              </div>

              {/* 3. Div del QR (Tamaño Maximizado y Centrado) */}
              <div className="flex justify-center w-full mb-14 px-6">
                <div className="p-10 bg-white border-[20px] border-gray-50 rounded-[5rem] shadow-2xl flex items-center justify-center w-full max-w-[900px]">
                  <img 
                    src={ticket.qrCodeBase64} 
                    alt="Código QR de Validación" 
                    className="w-full h-auto aspect-square object-contain"
                  />
                </div>
              </div>

              {/* 4. Leyenda Inferior (Más Grande) */}
              <div className="text-center">
                <p className="text-black text-4xl font-black leading-none uppercase tracking-tighter">
                  Escanea el código QR <br/> 
                  <span className="text-2xl font-bold text-gray-400 mt-2 block">para obtener tu ticket</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          CONTENEDOR DERECHO (60% width) - Slider
      ========================================= */}
      <div className="w-[60%] bg-[#f3f3f3] relative overflow-hidden">
        {slides.map((url, index) => (
          <div
            key={url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img 
              src={url} 
              alt="Publicidad Ferretería" 
              className="w-full h-full object-cover"
            />
            {/* Overlay sutil para mejorar contraste si es necesario */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;