export const WHATSAPP_NUMBER = '5541996946641';
export const EMAIL = 'comercial@idvl.com.br';
export const PHONE = '+55 41 99694-6641';

function sanitizeNumber(number: string): string {
  return number.replace(/\D/g, '');
}

function buildMessage(customMessage?: string): string {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const defaultMessage = `Olá! Vim pelo site${currentPath ? ` (página: ${currentPath})` : ''} e gostaria de falar com um especialista sobre a Reforma Tributária.`;
  return encodeURIComponent(customMessage || defaultMessage);
}

export function getWhatsAppUrl(customMessage?: string): string {
  const sanitizedNumber = sanitizeNumber(WHATSAPP_NUMBER);
  const encodedMessage = buildMessage(customMessage);
  return `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;
}

export function getWhatsAppDeepLink(customMessage?: string): string {
  const sanitizedNumber = sanitizeNumber(WHATSAPP_NUMBER);
  const encodedMessage = buildMessage(customMessage);
  return `whatsapp://send?phone=${sanitizedNumber}&text=${encodedMessage}`;
}
