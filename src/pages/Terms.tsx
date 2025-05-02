
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageHeader 
        title="Termos de Uso" 
        description="Informações sobre o uso de nossos serviços e website"
        breadcrumbs={[
          { text: 'Termos de Uso' }
        ]}
      />
      <main className="flex-grow py-12 bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o site da IDVL Contabilidade, você aceita e concorda com estes Termos de Uso. Se você não concordar com algum dos termos aqui expostos, recomendamos que não utilize nossos serviços.
            </p>

            <h2>2. Uso do Site</h2>
            <p>
              O conteúdo disponibilizado em nosso site tem caráter informativo e educacional. As informações relacionadas à reforma tributária e serviços contábeis são constantemente atualizadas, porém não substituem a consultoria personalizada.
            </p>

            <h2>3. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo publicado em nosso site - incluindo textos, imagens, logos, gráficos, vídeos e design - é de propriedade exclusiva da IDVL Contabilidade ou de terceiros que nos licenciaram seu uso. É proibida a reprodução total ou parcial sem autorização prévia e expressa.
            </p>

            <h2>4. Limitação de Responsabilidade</h2>
            <p>
              A IDVL Contabilidade se esforça para manter as informações precisas e atualizadas, mas não se responsabiliza por eventuais erros, omissões ou desatualizações no conteúdo. Decisões tomadas com base nas informações disponibilizadas são de responsabilidade exclusiva do usuário.
            </p>

            <h2>5. Links para Sites de Terceiros</h2>
            <p>
              Nosso site pode conter links para sites externos. A IDVL não se responsabiliza pelo conteúdo ou práticas de privacidade desses sites.
            </p>

            <h2>6. Newsletter e Comunicações</h2>
            <p>
              Ao se inscrever em nossa newsletter, você concorda em receber comunicações relacionadas à reforma tributária e serviços da IDVL. É possível cancelar a inscrição a qualquer momento através do link disponível nos e-mails enviados.
            </p>

            <h2>7. Alterações aos Termos</h2>
            <p>
              A IDVL se reserva o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas através do site.
            </p>

            <h2>8. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis brasileiras. Quaisquer disputas relacionadas a estes termos serão submetidas ao foro da comarca de Curitiba, com exclusão de qualquer outro.
            </p>

            <h2>9. Contato</h2>
            <p>
              Para questões relacionadas a estes Termos de Uso, entre em contato conosco através do e-mail comercial@idvl.com.br ou pelo telefone (41) 3095-1111.
            </p>

            <p className="text-sm text-gray-500 mt-8">
              Última atualização: 2 de maio de 2025
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
