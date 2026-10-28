import { useConfig } from "@/features/invitation/hooks/use-config";
import { useTranslation } from "@/lib/i18n";
import { motion } from "motion/react";
import { Copy, Gift, CheckCircle, Wallet, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useMotionPreset, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function Gifts() {
  const config = useConfig();
  const { t } = useTranslation();
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  // Set animation to run once on component mount
  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const copyToClipboard = (text, bank) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(bank);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  // Hide section if config or banks data is not set
  if (!config?.banks || config.banks.length === 0) {
    return null;
  }

  return (
    <>
      <section
        id="gifts"
        className={cn("min-h-screen relative overflow-hidden")}
      >
        <div className={cn("container mx-auto px-4 py-20 relative z-10")}>
          {/* Section Header */}
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            className={cn("text-center space-y-4 mb-16")}
          >
            <motion.span
              variants={fadeUp}
              className={cn("inline-block text-sky-500 font-medium tracking-wide")}
            >
              {t("gifts.subTitle")}
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className={cn("text-4xl md:text-5xl font-serif text-sky-800")}
            >
              {t("gifts.title")}
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              variants={scaleIn}
              className={cn("flex items-center justify-center gap-4 pt-4")}
            >
              <div className={cn("h-[1px] w-12 bg-sky-200")} />
              <Gift className={cn("w-5 h-5 text-sky-400")} />
              <div className={cn("h-[1px] w-12 bg-sky-200")} />
            </motion.div>

            {/* Message Container */}
            <motion.div
              variants={fade}
              className={cn("space-y-4 max-w-md mx-auto")}
            >
              <p className={cn("text-sky-700 leading-relaxed")}>
                {t("gifts.message")}
              </p>
              <div className={cn("space-y-1")}>
                <p className={cn("font-serif text-lg text-sky-800 italic")}>
                  «El amor es lo único que crece cuando se reparte»
                </p>
                <p className={cn("text-sky-600 text-sm")}>
                  ¡Gracias de corazón por acompañarnos en este hermoso comienzo!
                </p>
              </div>
            </motion.div>

            {/* Additional Decorative Element */}
            <motion.div
              variants={scaleIn}
              className={cn("flex items-center justify-center gap-3 pt-4")}
            >
              <div className={cn("h-px w-8 bg-sky-200")} />
              <div className={cn("w-1.5 h-1.5 rounded-full bg-sky-400")} />
              <div className={cn("h-px w-8 bg-sky-200")} />
            </motion.div>
          </motion.div>

          {/* Bank Accounts Grid */}
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            className={cn("max-w-2xl mx-auto grid gap-6")}
          >
            {config.banks.map((account) => (
              <motion.div
                key={account.accountNumber}
                variants={fadeUp}
                className={cn("relative group")}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-sky-100/60 to-blue-100/60 rounded-2xl transform transition-transform group-hover:scale-105 duration-300",
                  )}
                />
                <div
                  className={cn(
                    "relative backdrop-blur-sm bg-white/85 p-6 rounded-2xl border border-sky-100 shadow-lg",
                  )}
                >
                  <div className={cn("flex items-center justify-between")}>
                    <div className={cn("flex items-center space-x-4")}>
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg bg-sky-50 p-2 shadow-sm border border-sky-100",
                        )}
                      >
                        <Building2
                          className={cn("w-full h-full text-sky-500")}
                        />
                      </div>
                      <div>
                        <h3 className={cn("font-medium text-sky-800")}>
                          {account.bank}
                        </h3>
                        <p className={cn("text-sm text-sky-600")}>
                          {account.accountName}
                        </p>
                      </div>
                    </div>
                    <Wallet className={cn("w-5 h-5 text-sky-400")} />
                  </div>

                  <div className={cn("mt-4")}>
                    <div
                      className={cn(
                        "flex items-center justify-between bg-sky-50/70 border border-sky-100/70 px-4 py-3 rounded-lg",
                      )}
                    >
                      <p className={cn("font-mono text-sky-800 text-sm")}>
                        {account.accountNumber}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          copyToClipboard(account.accountNumber, account.bank)
                        }
                        className={cn(
                          "flex items-center space-x-1.5 text-sky-600 hover:text-sky-700 font-medium px-2 py-1 rounded-md hover:bg-sky-100/60 transition-colors",
                        )}
                      >
                        {copiedAccount === account.bank ? (
                          <CheckCircle className={cn("w-4 h-4 text-emerald-500")} />
                        ) : (
                          <Copy className={cn("w-4 h-4 text-sky-500")} />
                        )}
                        <span className={cn("text-xs sm:text-sm")}>
                          {copiedAccount === account.bank ? t("gifts.copied") : t("gifts.copy")}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
