// Datos de contacto (mismos que la landing /cotizar de la app).
// AR móvil en WhatsApp lleva el 9 después del 54.
export const CONTACTO = {
  whatsapp: '5492355514603',
  whatsappMsg: 'Hola, quiero información de AquaEnvio.',
  email: 'francavelli2@gmail.com',
  emailSubject: 'Consulta sobre AquaEnvio',
};

export const whatsappUrl = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(CONTACTO.whatsappMsg)}`;
export const mailtoUrl = `mailto:${CONTACTO.email}?subject=${encodeURIComponent(CONTACTO.emailSubject)}`;
