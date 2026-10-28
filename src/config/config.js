const config = {
  data: {
    // Título principal de la invitación
    title: "Casamiento de Eva y Andrés",
    // Mensaje de bienvenida / descripción
    description:
      "¡Nos casamos! Queremos invitarte a celebrar con nosotros este día tan especial.",
    // Nombre del novio
    groomName: "Andres Ignacio Rios",
    // Nombre de la novia
    brideName: "Eva Josefina Cruz",
    // Padres del novio
    parentGroom: "Padres del Novio",
    // Padres de la novia
    parentBride: "Padres de la Novia",
    // Idioma por defecto
    language: "es",
    // Fecha de la boda (formato: YYYY-MM-DD)
    date: "2026-11-20",
    // Enlace de Google Maps para abrir la ubicación
    maps_url: "https://maps.app.goo.gl/4NcZuhTac6BDtg8J7",
    // Código embed de Google Maps para mostrar el mapa en la web
    maps_embed:
      "https://maps.google.com/maps?q=-24.2407436,-65.2516236&hl=es&z=16&output=embed",
    // Horario del evento
    time: "12:00 hs",
    // Nombre del lugar del civil
    location: "Registro Civil Alto Comedero (Of. 2945)",
    // Dirección completa
    address: "Av. Forestal esq. Olimpia Barrionuevo, Alto Comedero, San Salvador de Jujuy",
    // Imagen para compartir en redes
    ogImage: "",
    // Favicon
    favicon: "/favicon.svg",
    // Itinerario y cronograma de los eventos
    agenda: [
      {
        title: "Casamiento por Civil",
        date: "2026-11-20",
        startTime: "12:00",
        endTime: "13:30",
        location: "Registro Civil Alto Comedero (Of. 2945)",
        address: "Av. Forestal esq. Olimpia Barrionuevo, Alto Comedero, San Salvador de Jujuy",
      },
      {
        title: "Brindis y Festejo",
        date: "2026-11-20",
        startTime: "14:00",
        endTime: "21:00",
        location: "Brindis y Celebración Familiar",
        address: "San Salvador de Jujuy, Jujuy",
      },
    ],

    // Música de fondo
    audio: {
      src: "/audio/fulfilling-humming.mp3",
      title: "Música Romántica",
      autoplay: true,
      loop: true,
    },

    // Cuentas bancarias para regalos / transferencias
    banks: [
      {
        bank: "Banco Galicia",
        accountNumber: "Alias: EVA.ANDRES.BODA (CBU: 0070123456789012345678)",
        accountName: "EVA JOSEFINA CRUZ",
      },
      {
        bank: "Mercado Pago",
        accountNumber: "Alias: BODA.ANDRES.EVA (CVU: 0000003100012345678901)",
        accountName: "ANDRES IGNACIO RIOS",
      },
    ],
  },
};

export default config;
