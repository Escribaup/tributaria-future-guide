import React from 'react';
import { getWhatsAppUrl } from '@/config/contact';

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
    const url = getWhatsAppUrl(prefillText);
    // Let the browser handle the link naturally
    // The href is already set, so this just ensures it opens in a new tab
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
