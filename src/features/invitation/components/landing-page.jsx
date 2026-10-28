import { useTranslation } from "@/lib/i18n";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { motion } from "motion/react";
import { Calendar, Clock } from "lucide-react";
import {
  useMotionPreset,
  staggerContainer,
  LOOP,
  useReducedMotionFlag,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const LandingPage = ({ onOpenInvitation }) => {
  const config = useConfig();
  const reduceMotion = useReducedMotionFlag();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const { t } = useTranslation();

  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="visible"
      className={cn("min-h-screen relative overflow-hidden")}
    >
      {/* Fondo decorativo en tonos celestes */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-white via-sky-50/50 to-white",
        )}
      />
      <div
        className={cn(
          "absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-sky-100/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2",
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-sky-200/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2",
        )}
      />

      {/* Contenido principal */}
      <div
        className={cn(
          "relative z-10 min-h-screen flex flex-col items-center justify-center px-4",
        )}
      >
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className={cn("w-full max-w-md")}
        >
          {/* Tarjeta de invitación */}
          <div
            className={cn(
              "backdrop-blur-sm bg-white/75 p-6 sm:p-8 md:p-10 rounded-2xl border border-sky-100 shadow-xl",
            )}
          >
            {/* Línea decorativa superior */}
            <div
              className={cn(
                "flex items-center justify-center gap-3 mb-6 sm:mb-8",
              )}
            >
              <div className={cn("h-px w-12 sm:w-16 bg-sky-200")} />
              <div className={cn("w-2 h-2 rounded-full bg-sky-400")} />
              <div className={cn("h-px w-12 sm:w-16 bg-sky-200")} />
            </div>

            {/* Fecha y Hora */}
            <motion.div
              variants={fadeUp}
              className={cn("flex flex-col gap-4 mb-6 sm:mb-8 items-center")}
            >
              <div
                className={cn(
                  "inline-flex flex-col items-center space-y-1 bg-sky-50/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-sky-100/80 shadow-sm",
                )}
              >
                <Calendar className={cn("w-5 h-5 text-sky-500")} />
                <p className={cn("text-sky-700 font-medium")}>
                  {formatEventDate(config.date, "full")}
                </p>
              </div>

              <div
                className={cn(
                  "inline-flex flex-col items-center space-y-1 bg-sky-50/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-sky-100/80 shadow-sm",
                )}
              >
                <Clock className={cn("w-5 h-5 text-sky-500")} />
                <p className={cn("text-sky-700 font-medium")}>{config.time}</p>
              </div>
            </motion.div>

            {/* Nombres de los Novios */}
            <motion.div
              variants={fadeUp}
              className={cn("text-center space-y-4")}
            >
              <div className={cn("space-y-2")}>
                <h1
                  className={cn(
                    "text-3xl sm:text-4xl md:text-5xl font-serif text-sky-800 leading-tight tracking-wide",
                  )}
                >
                  {config.brideName}
                  <span className={cn("text-sky-500 mx-2 sm:mx-3 font-normal")}>&</span>
                  {config.groomName}
                </h1>
                <div className={cn("h-px w-16 sm:w-24 mx-auto bg-sky-300")} />
              </div>
            </motion.div>

            {/* Botón Abrir Invitación */}
            <motion.div variants={fadeUp} className={cn("mt-6 sm:mt-8")}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenInvitation}
                className={cn(
                  "group relative w-full bg-sky-500 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-xl font-medium shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all duration-200",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 flex items-center justify-center gap-2 text-white font-semibold",
                  )}
                >
                  <span>{t("landing.openInvitation")}</span>
                  <motion.span
                    animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { repeat: Infinity, duration: LOOP.nudge }
                    }
                  >
                    →
                  </motion.span>
                </span>
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-sky-600 to-sky-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  )}
                />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
