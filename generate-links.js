/**
 * Script para generar enlaces de invitación personalizados
 *
 * Uso:
 *   node generate-links.js
 *
 * Genera enlaces únicos para cada invitado con su nombre pre-cargado
 * y la cantidad de personas habilitadas (query param `invitados`).
 */

// Simple base64 encode function (igual que en safeBase64)
function base64Encode(str) {
  return Buffer.from(str, "utf-8").toString("base64");
}

function generateInvitationLink(
  uid,
  guestName,
  guests = 1,
  baseUrl = "http://localhost:5173",
) {
  const encodedName = encodeURIComponent(base64Encode(guestName));
  return `${baseUrl}/${uid}?guest=${encodedName}&invitados=${guests}`;
}

// ===== CONFIGURACIÓN =====
const INVITATION_UID = "eva-y-andres-2026";
const BASE_URL = "https://fabiodrizzt.github.io/invitacion-eva-y-andres";

// Lista de invitados: nombre y cantidad de personas (si se omite, 1)
const guestList = [
  { name: "Familia Rodríguez", guests: 4 },
  { name: "Juan Carlos Pérez y Familia", guests: 3 },
  { name: "Martina Gómez", guests: 1 },
  { name: "Tía Marta y Tío Jorge", guests: 2 },
  { name: "Lucas Fernández", guests: 2 },
  { name: "Agustina Rossi" },
];

// ===== GENERACIÓN DE ENLACES =====
const line = "=".repeat(70);
console.log(`\n${line}`);
console.log("     ENLACES PERSONALIZADOS PARA EL CASAMIENTO DE EVA Y ANDRÉS");
console.log(`${line}\n`);

console.log(`Invitación UID: ${INVITATION_UID}`);
console.log(`URL Base: ${BASE_URL}\n`);
console.log("-".repeat(70) + "\n");

guestList.forEach(({ name, guests = 1 }, index) => {
  const link = generateInvitationLink(INVITATION_UID, name, guests, BASE_URL);
  console.log(`${index + 1}. ${name} (${guests} ${guests === 1 ? "persona" : "personas"})`);
  console.log(`   ${link}\n`);
});

console.log("-".repeat(70));
console.log(`\nTotal de invitados: ${guestList.length}`);
console.log("\nCómo usar:");
console.log("1. Compartí cada enlace personalizado con el invitado correspondiente.");
console.log("2. Al abrir el enlace, su nombre aparecerá automáticamente.");
console.log("3. Al confirmar, se indica la cantidad de personas (query param `invitados`, por defecto 1).\n");
