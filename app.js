/* ==========================================================================
   ÁUREA - Invitaciones Digitales Interactivas
   WhatsApp de Contacto: 2634848795 (+5492634848795)
   Instagram Oficial: @aurea.invita (https://www.instagram.com/aurea.invita/)
   ========================================================================== */

const WSP_NUMBER = "5492634848795";

// Notificaciones flotantes (Toast)
const toastAlert = document.getElementById("toastAlert");
const toastText = document.getElementById("toastText");
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
