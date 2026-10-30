// Datos de contacto (mismos que la landing /cotizar de la app).
// AR móvil en WhatsApp lleva el 9 después del 54.
export const CONTACTO = {
  whatsapp: '5491128065517',
  whatsappMsg: 'Hola, quiero información de Aquaenvio.',
  email: 'francavelli2@gmail.com',
  emailSubject: 'Consulta sobre Aquaenvio',
};

// Perfiles oficiales de la marca. Van al `sameAs` de los datos estructurados y
// al footer: Google necesita el ida y vuelta (sitio ↔ perfil) para entender que
// "Aquaenvio" el perfil y "Aquaenvio" el dominio son la misma entidad.
export const REDES = {
  instagram: 'https://www.instagram.com/aquaenvio/',
  facebook: 'https://www.facebook.com/61594567089105/',
};

export const whatsappUrl = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(CONTACTO.whatsappMsg)}`;
export const mailtoUrl = `mailto:${CONTACTO.email}?subject=${encodeURIComponent(CONTACTO.emailSubject)}`;

// Piso de la suscripción en ARS: lo usan la calculadora y el cartel de precio del video.
export const PRECIO_MINIMO_ARS = 15999;
