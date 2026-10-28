import { motion, AnimatePresence } from "motion/react";
import Confetti from "@/components/ui/confetti";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getGuestName } from "@/lib/invitation-storage";
import { useMotionPreset, staggerContainer } from "@/lib/motion";
import { useTranslation } from "@/lib/i18n";

// Número de WhatsApp de los novios (sin espacios ni guiones)
const WHATSAPP_NUMBER = "5493885180725";

export default function Wishes() {
  const { t } = useTranslation();
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  const [showConfetti, setShowConfetti] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [isNameFromInvitation, setIsNameFromInvitation] = useState(false);
  const [attendance, setAttendance] = useState(""); // "ATTENDING" | "NOT_ATTENDING"
  const [message, setMessage] = useState("");
  const [confirmGuests, setConfirmGuests] = useState(false); // checkbox obligatorio
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Cantidad de invitados desde query param ?invitados=X, default 1
  const [guestCount, setGuestCount] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = parseInt(params.get("invitados") || params.get("guests") || "1", 10);
    setGuestCount(isNaN(raw) || raw < 1 ? 1 : raw);
  }, []);

  // Nombre del invitado desde localStorage (si viene de link personalizado)
  useEffect(() => {
    const storedName = getGuestName();
    if (storedName) {
      setGuestName(storedName);
      setIsNameFromInvitation(true);
    }
  }, []);

  const isAttending = attendance === "ATTENDING";
  const isNotAttending = attendance === "NOT_ATTENDING";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guestName.trim()) {
      setErrorMessage(t("wishes.errorName"));
      return;
    }
    if (!attendance) {
      setErrorMessage(t("wishes.errorAttendance"));
      return;
    }
    if (isAttending && !confirmGuests) {
      setErrorMessage(t("wishes.errorCheckbox"));
      return;
    }

    setErrorMessage("");

    // Armar mensaje de WhatsApp
    let waText = "";
    if (isAttending) {
      waText =
        `¡Hola! Soy ${guestName.trim()} y confirmo mi asistencia a la boda de Eva y Andrés. ` +
        `Voy a asistir con ${guestCount} ${guestCount === 1 ? "persona" : "personas"}.`;
    } else {
      waText =
        `¡Hola! Soy ${guestName.trim()}. Lamentablemente no voy a poder asistir a la boda de Eva y Andrés.`;
    }

    if (message.trim()) {
      waText += ` ${message.trim()}`;
    }

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    // Mostrar confetti y estado de éxito antes de abrir WhatsApp
    setShowConfetti(true);
    setHasSubmitted(true);
    setTimeout(() => setShowConfetti(false), 4000);

    // Abrir WhatsApp en nueva pestaña
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section id="wishes" className={cn("min-h-screen relative overflow-hidden")}>
        <Confetti show={showConfetti} />
        <div className={cn("container mx-auto px-4 py-20 relative z-10")}>
          {/* Section Header */}
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="visible"
            className={cn("text-center space-y-4 mb-16")}
          >
            <motion.span
              variants={fadeUp}
              className={cn("inline-block text-sky-500 font-medium tracking-wide")}
            >
              {t("wishes.subTitle")}
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className={cn("text-4xl md:text-5xl font-serif text-sky-800")}
            >
              {t("wishes.title")}
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              variants={scaleIn}
              className={cn("flex items-center justify-center gap-4 pt-4")}
            >
              <div className={cn("h-[1px] w-12 bg-sky-200")} />
              <MessageCircle className={cn("w-5 h-5 text-sky-400")} />
              <div className={cn("h-[1px] w-12 bg-sky-200")} />
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={cn("max-w-2xl mx-auto mt-4")}
          >
            {hasSubmitted ? (
              /* Estado de éxito */
              <div
                className={cn(
                  "backdrop-blur-sm bg-white/85 p-8 rounded-2xl border border-sky-100 shadow-lg text-center"
                )}
              >
                <div className={cn("flex flex-col items-center space-y-4")}>
                  <CheckCircle className={cn("w-16 h-16 text-emerald-500")} />
                  <h3 className={cn("text-2xl font-serif text-sky-800")}>
                    {t("wishes.thankYou")}
                  </h3>
                  <p className={cn("text-sky-700")}>{t("wishes.successMessage")}</p>
                  <p className={cn("text-sm text-sky-500 italic")}>
                    {t("wishes.whatsappNote")}
                  </p>
                  <button
                    onClick={() => setHasSubmitted(false)}
                    className={cn(
                      "mt-4 px-6 py-2 rounded-xl border border-sky-300 text-sky-600 hover:bg-sky-50 transition-colors text-sm"
                    )}
                  >
                    {t("wishes.sendAnother")}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={cn("relative")}>
                <div
                  className={cn(
                    "backdrop-blur-sm bg-white/85 p-6 rounded-2xl border border-sky-100 shadow-lg space-y-5"
                  )}
                >
                  {/* Error Message */}
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          "p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start space-x-3"
                        )}
                      >
                        <AlertCircle
                          className={cn("w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5")}
                        />
                        <p className={cn("text-sm text-sky-800 font-medium flex-1")}>
                          {errorMessage}
                        </p>
                        <button
                          type="button"
                          onClick={() => setErrorMessage("")}
                          className={cn("text-sky-400 hover:text-sky-600 transition-colors")}
                        >
                          <XCircle className={cn("w-4 h-4")} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Nombre */}
                  <div className={cn("space-y-2")}>
                    <div
                      className={cn(
                        "flex items-center space-x-2 text-sky-600 text-sm font-medium"
                      )}
                    >
                      <User className={cn("w-4 h-4 text-sky-500")} />
                      <label htmlFor="guest-name">{t("wishes.nameLabel")}</label>
                    </div>
                    <input
                      type="text"
                      id="guest-name"
                      name="guestName"
                      autoComplete="name"
                      placeholder={t("wishes.namePlaceholder")}
                      value={guestName}
                      onChange={(e) => {
                        setGuestName(e.target.value);
                        setIsNameFromInvitation(false);
                      }}
                      disabled={isNameFromInvitation}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border transition-all duration-200 text-sky-800 placeholder-sky-400",
                        isNameFromInvitation
                          ? "bg-sky-50/50 border-sky-200 cursor-not-allowed opacity-80"
                          : "bg-white/70 border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
                      )}
                      required
                    />
                  </div>

                  {/* Asistencia — solo dos opciones: Sí / No */}
                  <div className={cn("space-y-2")}>
                    <div
                      className={cn(
                        "flex items-center space-x-2 text-sky-600 text-sm font-medium"
                      )}
                    >
                      <Calendar className={cn("w-4 h-4 text-sky-500")} />
                      <span>{t("wishes.attendanceLabel")}</span>
                    </div>
                    <div className={cn("grid grid-cols-2 gap-3")}>
                      {/* Botón Sí */}
                      <button
                        type="button"
                        onClick={() => {
                          setAttendance("ATTENDING");
                          setConfirmGuests(false);
                        }}
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 text-sm",
                          isAttending
                            ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                            : "border-sky-200 bg-white/70 text-sky-600 hover:border-sky-300 hover:bg-sky-50"
                        )}
                      >
                        <CheckCircle
                          className={cn(
                            "w-4 h-4",
                            isAttending ? "text-emerald-500" : "text-sky-400"
                          )}
                        />
                        {t("wishes.attending")}
                      </button>

                      {/* Botón No */}
                      <button
                        type="button"
                        onClick={() => {
                          setAttendance("NOT_ATTENDING");
                          setConfirmGuests(false);
                        }}
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 text-sm",
                          isNotAttending
                            ? "border-sky-400 bg-sky-50 text-sky-700 shadow-sm"
                            : "border-sky-200 bg-white/70 text-sky-600 hover:border-sky-300 hover:bg-sky-50"
                        )}
                      >
                        <XCircle
                          className={cn(
                            "w-4 h-4",
                            isNotAttending ? "text-sky-500" : "text-sky-400"
                          )}
                        />
                        {t("wishes.notAttending")}
                      </button>
                    </div>
                  </div>

                  {/* Checkbox de confirmación de invitados — solo visible si confirma asistencia */}
                  <AnimatePresence>
                    {isAttending && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className={cn("overflow-hidden")}
                      >
                        <label
                          htmlFor="confirm-guests"
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                            confirmGuests
                              ? "border-emerald-300 bg-emerald-50"
                              : "border-sky-200 bg-white/70 hover:border-sky-300"
                          )}
                        >
                          <input
                            id="confirm-guests"
                            type="checkbox"
                            checked={confirmGuests}
                            onChange={(e) => setConfirmGuests(e.target.checked)}
                            className={cn(
                              "mt-0.5 w-5 h-5 rounded accent-emerald-500 cursor-pointer flex-shrink-0"
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm font-medium leading-snug",
                              confirmGuests ? "text-emerald-700" : "text-sky-700"
                            )}
                          >
                            <span className="flex items-center gap-1.5 mb-0.5">
                              <Users className="w-4 h-4 inline-block" />
                              {t("wishes.confirmGuestsLabel")}{" "}
                              <strong>{guestCount}</strong>{" "}
                              {guestCount === 1
                                ? t("wishes.confirmGuestsSingular")
                                : t("wishes.confirmGuestsPlural")}
                            </span>
                            <span className={cn("text-xs font-normal text-sky-500 block mt-0.5")}>
                              {t("wishes.limitedSeatsNote")}
                            </span>
                          </span>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mensaje opcional */}
                  <div className={cn("space-y-2")}>
                    <div
                      className={cn(
                        "flex items-center space-x-2 text-sky-600 text-sm font-medium"
                      )}
                    >
                      <MessageCircle className={cn("w-4 h-4 text-sky-500")} />
                      <label htmlFor="wish-message">{t("wishes.wishLabel")}</label>
                    </div>
                    <textarea
                      id="wish-message"
                      name="message"
                      placeholder={t("wishes.wishPlaceholder")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={cn(
                        "w-full h-28 p-4 rounded-xl bg-white/70 border border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50 resize-none transition-all duration-200 text-sky-800 placeholder-sky-400"
                      )}
                    />
                  </div>

                  {/* Botón enviar vía WhatsApp */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium shadow-md shadow-sky-500/20 transition-all duration-200 bg-sky-500 hover:bg-sky-600"
                    )}
                  >
                    {/* Ícono de WhatsApp inline SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t("wishes.sendWhatsapp")}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
