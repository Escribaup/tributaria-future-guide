
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-idvl-blue-dark to-idvl-blue-light py-16 md:py-24 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center">
          <div className="lg:w-1/2 text-white my-8 lg:my-0 lg:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Desvende a Reforma Tributária e Prepare seu Futuro
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Navegue com confiança pelas mudanças tributárias com nossa orientação especializada e ferramentas exclusivas.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/guia-completo" className="bg-white text-idvl-blue-dark hover:bg-opacity-90 transition-all px-8 py-4 rounded-md font-semibold text-lg">
                Comece Aqui
              </Link>
              <Link to="/contato" className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 transition-all px-8 py-4 rounded-md font-semibold text-lg">
                Fale Conosco
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Reforma Tributária" 
              className="rounded-lg shadow-xl max-w-full h-auto animate-fade-in"
              style={{ maxHeight: '500px', animationDelay: '0.3s' }}
            />
          </div>
        </div>
      </div>

      {/* Abstract shapes background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-20 -left-20 bg-white rounded-full w-64 h-64"></div>
        <div className="absolute top-40 right-10 bg-white rounded-full w-32 h-32"></div>
        <div className="absolute bottom-10 left-1/4 bg-white rounded-full w-48 h-48"></div>
      </div>
    </section>
  );
};

export default Hero;
