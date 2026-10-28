import { Calendar, Clock, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { getGuestName } from "@/lib/invitation-storage";
import { useTranslation } from "@/lib/i18n";
import {
  useMotionPreset,
  staggerContainer,
  LOOP,
  EASE,
  useReducedMotionFlag,
} from "@/lib/motion";

export default function Hero() {
  const { t } = useTranslation();
  const config = useConfig();
  const [guestName, setGuestName] = useState("");
  const reduceMotion = useReducedMotionFlag();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  useEffect(() => {
    // Get guest name from localStorage
    const storedGuestName = getGuestName();
    if (storedGuestName) {
      setGuestName(storedGuestName);
    }
  }, []);

  const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = useCallback(() => {
      let targetTime;
      if (typeof targetDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
        const [year, month, day] = targetDate.split("-").map(Number);
        const startTime = config?.agenda?.[0]?.startTime || "18:00";
        const [hours, minutes] = startTime.split(":").map(Number);
        targetTime = new Date(year, month - 1, day, hours || 18, minutes || 0, 0).getTime();
      } else {
        targetTime = +new Date(targetDate);
      }

      const difference = targetTime - Date.now();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          [t("hero.days")]: Math.floor(difference / (1000 * 60 * 60 * 24)),
          [t("hero.hours")]: Math.floor((difference / (1000 * 60 * 60)) % 24),
          [t("hero.minutes")]: Math.floor((difference / 1000 / 60) % 60),
          [t("hero.seconds")]: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    return (
      <div className={cn("grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8")}>
        {Object.keys(timeLeft).map((interval) => (
          <motion.div
            key={interval}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className={cn(
              "flex flex-col items-center p-3 bg-white/85 backdrop-blur-sm rounded-xl border border-sky-100 shadow-sm",
            )}
          >
            <span className={cn("text-xl sm:text-2xl font-bold text-sky-600")}>
              {timeLeft[interval] !== undefined ? timeLeft[interval] : 0}
            </span>
            <span className={cn("text-xs text-sky-500 capitalize font-medium")}>
              {interval}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  const FloatingHearts = () => {
    const [hearts] = useState(() =>
      [...Array(8)].map((_, i) => ({
        size: Math.floor(Math.random() * 2) + 8,
        color:
          i % 3 === 0
            ? "text-sky-300"
            : i % 3 === 1
              ? "text-sky-400"
              : "text-sky-200",
        initialX:
          typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
        animateX:
          typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
      })),
    );

    return (
      <div
        className={cn("absolute inset-0 overflow-hidden pointer-events-none")}
      >
        {hearts.map((heart, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: heart.initialX,
              y: typeof window !== "undefined" ? window.innerHeight : 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              x: heart.animateX,
              y: -100,
            }}
            transition={{
              duration: LOOP.float,
              repeat: Infinity,
              delay: i * 0.8,
              ease: EASE.out,
            }}
            className={cn("absolute")}
          >
            <Heart
              className={heart.color}
              style={{
                width: `${heart.size * 4}px`,
                height: `${heart.size * 4}px`,
              }}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section
        id="home"
        className={cn(
          "min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center relative overflow-hidden",
        )}
      >
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className={cn("space-y-6 relative z-10 w-full max-w-md mx-auto")}
        >
          <motion.div variants={scaleIn} className={cn("inline-block mx-auto")}>
            <span
              className={cn(
                "px-4 py-1 text-sm bg-sky-50 text-sky-600 rounded-full border border-sky-200 font-medium shadow-sm",
              )}
            >
              {t("landing.saveTheDate")}
            </span>
          </motion.div>

          <div className={cn("space-y-4")}>
            <motion.p
              variants={fade}
              className={cn(
                "text-sky-600 font-light italic text-base sm:text-lg",
              )}
            >
              {t("hero.marriageTitle")}
            </motion.p>
            <motion.h2
              variants={scaleIn}
              className={cn(
                "text-3xl sm:text-5xl font-serif text-sky-800 leading-tight",
              )}
            >
              {config.brideName} & {config.groomName}
            </motion.h2>
          </div>

          <motion.div
            variants={fadeUp}
            className={cn("relative max-w-md mx-auto w-full")}
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b from-sky-50/70 to-white/70 backdrop-blur-md rounded-2xl",
              )}
            />

            <div
              className={cn(
                "relative px-4 sm:px-8 py-8 sm:py-10 rounded-2xl border border-sky-100 shadow-md",
              )}
            >
              <div
                className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px",
                )}
              >
                <div
                  className={cn(
                    "w-20 sm:w-32 h-[2px] bg-gradient-to-r from-transparent via-sky-300 to-transparent",
                  )}
                />
              </div>

              <div className={cn("space-y-6 text-center")}>
                <div className={cn("space-y-3")}>
                  <motion.div
                    variants={fade}
                    className={cn("flex items-center justify-center space-x-2")}
                  >
                    <Calendar className={cn("w-4 h-4 text-sky-500")} />
                    <span
                      className={cn(
                        "text-sky-700 font-medium text-sm sm:text-base",
                      )}
                    >
                      {formatEventDate(config.date, "full")}
                    </span>
                  </motion.div>

                  <motion.div
                    variants={fade}
                    className={cn("flex items-center justify-center space-x-2")}
                  >
                    <Clock className={cn("w-4 h-4 text-sky-500")} />
                    <span
                      className={cn(
                        "text-sky-700 font-medium text-sm sm:text-base",
                      )}
                    >
                      {config.time}
                    </span>
                  </motion.div>
                </div>

                <div className={cn("flex items-center justify-center gap-3")}>
                  <div className={cn("h-px w-8 sm:w-12 bg-sky-200")} />
                  <div className={cn("w-2 h-2 rounded-full bg-sky-400")} />
                  <div className={cn("h-px w-8 sm:w-12 bg-sky-200")} />
                </div>

                <motion.div variants={fade} className={cn("space-y-2")}>
                  <p className={cn("text-sky-600 font-serif italic text-sm")}>
                    {t("hero.guestGreeting")}
                  </p>
                  <p className={cn("text-sky-600 font-medium text-sm")}>
                    {t("hero.guestSalutation")}
                  </p>
                  <p className={cn("text-sky-800 font-semibold text-lg")}>
                    {guestName || t("hero.guestFallback")}
                  </p>
                </motion.div>
              </div>

              <div
                className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px",
                )}
              >
                <div
                  className={cn(
                    "w-20 sm:w-32 h-[2px] bg-gradient-to-r from-transparent via-sky-300 to-transparent",
                  )}
                />
              </div>
            </div>

            <div
              className={cn(
                "absolute -top-2 -right-2 w-16 sm:w-24 h-16 sm:h-24 bg-sky-100/30 rounded-full blur-xl",
              )}
            />
            <div
              className={cn(
                "absolute -bottom-2 -left-2 w-16 sm:w-24 h-16 sm:h-24 bg-sky-100/30 rounded-full blur-xl",
              )}
            />
          </motion.div>

          <CountdownTimer targetDate={config.date} />

          <div className={cn("pt-6 relative")}>
            {!reduceMotion && <FloatingHearts />}
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: LOOP.pulse,
                      repeat: Infinity,
                      ease: EASE.inOut,
                    }
              }
            >
              <Heart
                className={cn(
                  "w-10 sm:w-12 h-10 sm:h-12 text-sky-500 mx-auto",
                )}
                fill="currentColor"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
