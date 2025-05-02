
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="section-padding bg-gradient-to-r from-idvl-blue-dark to-idvl-blue-light text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prepare-se para o futuro tributário do Brasil
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Acesse nosso guia completo e tenha uma visão clara sobre como a reforma tributária afetará seu negócio.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/guia-completo"
              className="bg-white text-idvl-blue-dark hover:bg-opacity-90 transition-all px-8 py-4 rounded-md font-semibold text-lg"
            >
              Acessar o Guia Completo
            </Link>
            <Link
              to="/contato"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 transition-all px-8 py-4 rounded-md font-semibold text-lg"
            >
              Fale com um Especialista
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
