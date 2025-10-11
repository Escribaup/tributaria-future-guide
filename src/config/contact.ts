export const WHATSAPP_NUMBER = '5541996946641';
export const EMAIL = 'comercial@idvl.com.br';
export const PHONE = '+55 41 99694-6641';

export function getWhatsAppUrl(customMessage?: string): string {
  // Sanitize the number (remove non-digits)
  const sanitizedNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  
  // Get current page path for context
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  
  // Default message with page context
  const defaultMessage = `Olá! Vim pelo site${currentPath ? ` (página: ${currentPath})` : ''} e gostaria de falar com um especialista sobre a Reforma Tributária.`;
  
  const message = customMessage || defaultMessage;
  const encodedMessage = encodeURIComponent(message);
  
  // Detect iOS devices
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Use appropriate URL format
  if (isIOS) {
    return `https://api.whatsapp.com/send?phone=${sanitizedNumber}&text=${encodedMessage}`;
  }
  
  return `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;
}
