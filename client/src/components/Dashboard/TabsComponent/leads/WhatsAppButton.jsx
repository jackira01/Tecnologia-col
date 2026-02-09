'use client';

import { Button } from 'flowbite-react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = ({ clientName, whatsapp }) => {
  const handleWhatsAppClick = () => {
    // Extraer número del campo whatsapp (puede ser un número o un link)
    let phoneNumber = whatsapp;
    
    // Si es un link de WhatsApp, extraer el número
    if (whatsapp.includes('whatsapp.com') || whatsapp.includes('wa.me')) {
      const match = whatsapp.match(/\d+/);
      phoneNumber = match ? match[0] : whatsapp;
    }
    
    // Limpiar el número (quitar espacios, guiones, etc.)
    phoneNumber = phoneNumber.replace(/[\s\-()]/g, '');
    
    // Mensaje predefinido personalizado
    const message = encodeURIComponent(
      `Hola ${clientName}, tengo un equipo que acaba de llegar y coincide con lo que buscabas. ¿Te gustaría conocer los detalles?`
    );
    
    // Construir URL de WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      size="xs"
      color="success"
      onClick={handleWhatsAppClick}
      title={`Contactar a ${clientName} por WhatsApp`}
    >
      <FaWhatsapp className="h-4 w-4" />
    </Button>
  );
};

export default WhatsAppButton;
