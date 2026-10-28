/**
 * Script para generar enlaces de invitación personalizados
 *
 * Uso:
 *   node generate-links.js
 *
 * Genera enlaces únicos para cada invitado con su nombre pre-cargado
 */

// Simple base64 encode function (igual que en safeBase64)
function base64Encode(str) {
  return Buffer.from(str, "utf-8").toString("base64");
}

function generateInvitationLink(
  uid,
  guestName,
  baseUrl = "http://localhost:5173",
) {
  const encodedName = base64Encode(guestName);
  return `${baseUrl}/${uid}?guest=${encodedName}`;
}

// ===== CONFIGURACIÓN =====
const INVITATION_UID = "eva-y-andres-2026";
const BASE_URL = "http://localhost:5173";

// Lista de invitados
const guestList = [
  "Familia Rodríguez",
  "Juan Carlos Pérez y Familia",
  "Martina Gómez",
  "Tía Marta y Tío Jorge",
  "Lucas Fernández",
  "Agustina Rossi",
];

// ===== GENERACIÓN DE ENLACES =====
console.log(
  "\n╔══════════════════════════════════════════════════════════════╗",
);
console.log("║     ENLACES PERSONALIZADOS PARA EL CASAMIENTO DE EVA Y ANDRÉS ║");
console.log(
  "╚══════════════════════════════════════════════════════════════╝\n",
);

console.log(`Invitación UID: ${INVITATION_UID}`);
console.log(`URL Base: ${BASE_URL}\n`);
console.log("─".repeat(70) + "\n");

guestList.forEach((guestName, index) => {
  const link = generateInvitationLink(INVITATION_UID, guestName, BASE_URL);
  console.log(`${index + 1}. ${guestName}`);
  console.log(`   ${link}\n`);
});

console.log("─".repeat(70));
console.log(`\nTotal de invitados: ${guestList.length}`);
console.log("\nCómo usar:");
console.log("1. Compartí cada enlace personalizado con el invitado correspondiente.");
console.log("2. Al abrir el enlace, su nombre aparecerá automáticamente.");
console.log("3. El invitado podrá confirmar su asistencia y dejar su mensaje.\n");
