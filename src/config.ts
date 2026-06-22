// Datos de contacto (mismos que la landing /cotizar de la app).
// AR mÃ³vil en WhatsApp lleva el 9 despuÃ©s del 54.
export const CONTACTO = {
  whatsapp: '5492355514603',
  whatsappMsg: 'Hola, quiero informaciÃ³n de Aquaenvio.',
  email: 'francavelli2@gmail.com',
  emailSubject: 'Consulta sobre Aquaenvio',
};

export const whatsappUrl = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(CONTACTO.whatsappMsg)}`;
export const mailtoUrl = `mailto:${CONTACTO.email}?subject=${encodeURIComponent(CONTACTO.emailSubject)}`;
