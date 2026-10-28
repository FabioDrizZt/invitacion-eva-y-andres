// src/components/bottom-bar/BottomBar.jsx
import React, { useEffect, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import {
  Home,
  CalendarHeart,
  MapPin,
  Gift,
  MessageCircleHeart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { DURATION, useReducedMotionFlag } from "@/lib/motion";
import { useTranslation } from "@/lib/i18n";

const baseMenuItems = [
  { icon: Home, labelKey: "nav.home", href: "#home", id: "home" },
  { icon: CalendarHeart, labelKey: "nav.event", href: "#event", id: "event" },
  { icon: MapPin, labelKey: "nav.location", href: "#location", id: "location" },
  {
    icon: Gift,
    labelKey: "nav.gifts",
    href: "#gifts",
    id: "gifts",
    requiresBanks: true,
  },
  { icon: MessageCircleHeart, labelKey: "nav.wishes", href: "#wishes", id: "wishes" },
];

/**
 * BottomBar is a React functional component that renders a fixed bottom navigation bar
 * with automatic section detection based on scroll position.
 */
const BottomBar = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [active, setActive] = React.useState("home");
  const reduceMotion = useReducedMotionFlag();

  // Filter menu items based on config - hide gifts when no banks configured
  const menuItems = useMemo(() => {
    const hasBanks = config?.banks && config.banks.length > 0;
    return baseMenuItems.filter((item) => {
      if (item.requiresBanks && !hasBanks) {
        return false;
      }
      return true;
    });
  }, [config?.banks]);

  // Function to handle smooth scrolling when clicking menu items
  const handleMenuClick = useCallback((e, href, id) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      setActive(id);
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  // Set up Intersection Observer for automatic section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const validSection = menuItems.find((item) => item.id === sectionId);
          if (validSection) {
            setActive(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    menuItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [menuItems]);

  return (
    <div
      className={cn(
        "fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4",
      )}
    >
      <motion.div
        className={cn("w-auto")}
        initial={reduceMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: DURATION.base }
            : { duration: DURATION.base, type: "spring", stiffness: 100 }
        }
      >
        <div
          className={cn(
            "backdrop-blur-md bg-white/90 border border-sky-100 rounded-2xl shadow-[0_8px_30px_rgb(2,132,199,0.12)] px-3 py-2",
          )}
        >
          <nav className={cn("flex items-center gap-1")}>
            {menuItems.map((item) => (
              <motion.a
                key={item.labelKey}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-2.5 rounded-xl transition-all duration-300 ease-in-out",
                  "hover:bg-sky-50/80 cursor-pointer min-w-[60px]",
                  active === item.id
                    ? "text-sky-600 bg-sky-50"
                    : "text-sky-700",
                )}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleMenuClick(e, item.href, item.id)}
              >
                <motion.div
                  animate={{
                    scale: active === item.id ? 1.1 : 1,
                  }}
                  transition={{ duration: DURATION.fast }}
                >
                  <item.icon
                    className={cn(
                      "h-[18px] w-[18px] sm:h-5 sm:w-5 mb-0.5 sm:mb-1 transition-all duration-300",
                      active === item.id
                        ? "stroke-sky-600 stroke-[2.5px]"
                        : "stroke-sky-500 stroke-2",
                    )}
                  />
                </motion.div>
                <motion.span
                  className={cn(
                    "text-[10px] sm:text-xs font-medium transition-all duration-300 line-clamp-1",
                    active === item.id
                      ? "text-sky-600 font-semibold"
                      : "text-sky-700",
                  )}
                  animate={{
                    scale: active === item.id ? 1.05 : 1,
                  }}
                  transition={{ duration: DURATION.fast }}
                >
                  {t(item.labelKey)}
                </motion.span>
              </motion.a>
            ))}
          </nav>
        </div>
      </motion.div>
    </div>
  );
};

export default BottomBar;
