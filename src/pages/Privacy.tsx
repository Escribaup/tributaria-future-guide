
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageHeader 
        title="Política de Privacidade" 
        description="Como tratamos suas informações pessoais"
        breadcrumbs={[
          { text: 'Política de Privacidade' }
        ]}
      />
      <main className="flex-grow py-12 bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2>1. Informações Coletadas</h2>
            <p>
              A IDVL Contabilidade coleta informações quando você se inscreve em nossa newsletter, preenche formulários de contato ou interage com nosso site. As informações podem incluir seu nome, e-mail, telefone e interesses profissionais relacionados à área tributária.
            </p>

            <h2>2. Uso das Informações</h2>
            <p>
              Utilizamos suas informações para:
            </p>
            <ul>
              <li>Fornecer conteúdo relevante sobre a reforma tributária e serviços contábeis;</li>
              <li>Responder a suas solicitações e dúvidas;</li>
              <li>Melhorar nossos serviços e experiência no site;</li>
              <li>Enviar newsletters e comunicações que possam ser de seu interesse.</li>
            </ul>

            <h2>3. Proteção de Dados</h2>
            <p>
              A IDVL implementa medidas de segurança adequadas para proteger suas informações contra acesso, alteração, divulgação ou destruição não autorizada, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>

            <h2>4. Compartilhamento de Informações</h2>
            <p>
              Não vendemos, comercializamos ou transferimos suas informações pessoais identificáveis para terceiros, exceto quando necessário para prestação dos serviços solicitados ou quando exigido por lei.
            </p>

            <h2>5. Cookies e Tecnologias Semelhantes</h2>
            <p>
              Nosso site utiliza cookies para melhorar a experiência do usuário e coletar dados sobre o tráfego do site. Você pode configurar seu navegador para recusar cookies, porém isso pode limitar algumas funcionalidades.
            </p>

            <h2>6. Seus Direitos</h2>
            <p>
              De acordo com a LGPD, você tem direito de:
            </p>
            <ul>
              <li>Acessar os dados pessoais que possuímos sobre você;</li>
              <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Revogar seu consentimento para o tratamento de dados pessoais.</li>
            </ul>

            <h2>7. Contato do Encarregado de Proteção de Dados</h2>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre nossa Política de Privacidade, entre em contato com nosso encarregado de proteção de dados através do e-mail: comercial@idvl.com.br.
            </p>

            <h2>8. Alterações à Política de Privacidade</h2>
            <p>
              A IDVL pode atualizar esta política periodicamente. Recomendamos que você revise esta página regularmente para estar ciente de quaisquer mudanças.
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

export default Privacy;
