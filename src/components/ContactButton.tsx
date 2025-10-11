import React from 'react';
import { getWhatsAppUrl, getWhatsAppDeepLink, EMAIL, PHONE } from '@/config/contact';
import { toast } from '@/hooks/use-toast';

interface ContactButtonProps {
  children: React.ReactNode;
  className?: string;
  prefillText?: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({ 
  children, 
  className = '', 
  prefillText 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
      const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

      if (!isMobile) {
        // Desktop: let the anchor handle it normally
        return;
      }

      // Mobile: try deep link first
      e.preventDefault();
      let pageHidden = false;
      
      const onVisibility = () => {
        pageHidden = true;
        document.removeEventListener('visibilitychange', onVisibility);
      };
      
      document.addEventListener('visibilitychange', onVisibility);

      // Try to open WhatsApp app
      window.location.href = getWhatsAppDeepLink(prefillText);

      // If page didn't hide (app didn't open), fallback to wa.me
      setTimeout(() => {
        document.removeEventListener('visibilitychange', onVisibility);
        if (!pageHidden) {
          const win = window.open(getWhatsAppUrl(prefillText), '_blank', 'noopener,noreferrer');
          if (!win) {
            // Failed to open new tab: show alternatives
            toast({
              title: 'Não foi possível abrir o WhatsApp',
              description: (
                <div>
                  <p className="mb-2">Tente um dos canais abaixo:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><a href={`tel:${PHONE.replace(/\s/g, '')}`} className="underline">Ligar: {PHONE}</a></li>
                    <li><a href={`mailto:${EMAIL}`} className="underline">E-mail: {EMAIL}</a></li>
                  </ul>
                </div>
              ),
            });
          }
        }
      }, 1200);
    } catch (error) {
      e.preventDefault();
      toast({
        title: 'Não foi possível abrir o WhatsApp',
        description: (
          <div>
            <p className="mb-2">Tente um dos canais abaixo:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><a href={`tel:${PHONE.replace(/\s/g, '')}`} className="underline">Ligar: {PHONE}</a></li>
              <li><a href={`mailto:${EMAIL}`} className="underline">E-mail: {EMAIL}</a></li>
            </ul>
          </div>
        ),
      });
    }
  };

  return (
    <a
      href={getWhatsAppUrl(prefillText)}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
};

export default ContactButton;
