/* ==========================================================================
   ÁUREA - Invitaciones Digitales Interactivas
   Controlador de Vista Previa Real (GitHub Pages) y Enlaces de Contacto
   WhatsApp de Contacto: 2634848795 (+5492634848795)
   ========================================================================== */

const WSP_NUMBER = "5492634848795";

// Datos de las 3 invitaciones reales publicadas en GitHub Pages
const INVITATIONS = {
  dieciocho: {
    title: "Alvaro (18 años)",
    url: "https://alverto9266-sys.github.io/AlvaroLara18/",
    bannerText: "Invitación real: Alvaro (18 años)"
  },
  quince: {
    title: "Isabella (15 años)",
    url: "https://alverto9266-sys.github.io/Isabella/",
    bannerText: "Invitación real: Isabella (15 años)"
  },
  boda: {
    title: "Tiziano & Kiara (Boda)",
    url: "https://alverto9266-sys.github.io/KiarayTizi/",
    bannerText: "Invitación real: Tiziano & Kiara (Boda)"
  }
};

let currentKey = "dieciocho";

// Referencias del DOM
const phoneIframe = document.getElementById("phoneIframe");
const phoneLoader = document.getElementById("phoneLoader");
const liveDemoText = document.getElementById("liveDemoText");
const liveDemoLink = document.getElementById("liveDemoLink");
const btnReloadIframe = document.getElementById("btnReloadIframe");
const styleTabs = document.querySelectorAll(".style-tab");
const toastAlert = document.getElementById("toastAlert");
const toastText = document.getElementById("toastText");

// ==========================================================================
// 1. Cambio dinámico de invitaciones reales en el celular
// ==========================================================================
function switchInvitation(key) {
  const inv = INVITATIONS[key];
  if (!inv) return;

  currentKey = key;

  // Actualizar estado activo en los botones de pestañas
  styleTabs.forEach(tab => {
    if (tab.dataset.style === key) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Mostrar loader mientras carga el iframe
  if (phoneLoader) {
    phoneLoader.classList.add("active");
  }

  // Actualizar textos y enlaces en vivo
  if (liveDemoText) {
    liveDemoText.textContent = inv.bannerText;
  }
  if (liveDemoLink) {
    liveDemoLink.href = inv.url;
  }

  // Cargar la página real en el iframe
  if (phoneIframe) {
    phoneIframe.src = inv.url;
  }

  // Tiempo de seguridad para ocultar el loader en conexiones rápidas / caché
  setTimeout(() => {
    if (phoneLoader) {
      phoneLoader.classList.remove("active");
    }
  }, 1600);
}

// Ocultar loader al completar la carga del iframe
if (phoneIframe) {
  phoneIframe.addEventListener("load", () => {
    if (phoneLoader) {
      phoneLoader.classList.remove("active");
    }
  });
}

// Asignar clics a las pestañas de estilos
styleTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const style = tab.dataset.style;
    if (style && style !== currentKey) {
      switchInvitation(style);
    }
  });
});

// Botón para reiniciar la vista previa del iframe
if (btnReloadIframe && phoneIframe) {
  btnReloadIframe.addEventListener("click", () => {
    if (phoneLoader) phoneLoader.classList.add("active");
    const targetUrl = INVITATIONS[currentKey]?.url || phoneIframe.src;
    phoneIframe.src = targetUrl;
    showToast("Reiniciando vista previa...");
    setTimeout(() => {
      if (phoneLoader) phoneLoader.classList.remove("active");
    }, 1200);
  });
}

// ==========================================================================
// 2. Notificaciones flotantes (Toast)
// ==========================================================================
let toastTimeout = null;

function showToast(message) {
  if (!toastAlert || !toastText) return;
  toastText.textContent = message;
  toastAlert.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastAlert.classList.remove("show");
  }, 2400);
}

// ==========================================================================
// 3. Inicialización
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Aseguramos que la primera invitación sea Alvaro (18 años)
  if (phoneIframe && INVITATIONS[currentKey]) {
    phoneIframe.src = INVITATIONS[currentKey].url;
  }
});
