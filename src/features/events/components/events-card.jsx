// EventCard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  CalendarPlus,
  X,
  Globe,
  Apple,
  Calendar as CalendarIcon,
} from "lucide-react";
import { formatEventDate } from "@/lib/format-event-date";
import { useTranslation } from "@/lib/i18n";
import { useMotionPreset } from "@/lib/motion";

const Modal = ({ isOpen, onClose, children }) => {
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className={cn("fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]")}
          />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-sm",
            )}
          >
            <div
              className={cn(
                "bg-white rounded-2xl p-6 shadow-2xl border border-sky-100",
              )}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CalendarButton = ({ icon: Icon, label, onClick, className = "" }) => (
  <motion.button
    onClick={onClick}
    className={cn(
      "flex items-center space-x-3 w-full p-4 rounded-xl border border-sky-100 hover:bg-sky-50/80 transition-colors",
      className,
    )}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon className={cn("w-5 h-5 text-sky-500")} />
    <span className={cn("text-sky-700 font-medium")}>{label}</span>
  </motion.button>
);

const SingleEventCard = ({ eventData }) => {
  const { t } = useTranslation();
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const fadeUp = useMotionPreset("fadeUp");

  const timeZone = eventData.timeZone || "America/Argentina/Buenos_Aires";
  const eventDesc = eventData.description || "Casamiento Eva Josefina Cruz & Andres Ignacio Rios";

  const googleCalendarLink = () => {
    const startDate = new Date(`${eventData.date}T${eventData.startTime}:00`);
    const endDate = new Date(`${eventData.date}T${eventData.endTime}:00`);

    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(eventDesc)}&location=${encodeURIComponent(eventData.location + ", " + eventData.address)}&ctz=${timeZone}`;
  };

  const generateICSContent = () => {
    const startDate = new Date(`${eventData.date}T${eventData.startTime}:00`);
    const endDate = new Date(`${eventData.date}T${eventData.endTime}:00`);

    const formatICSDate = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${typeof window !== "undefined" ? window.location.href : ""}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${eventData.title}
DESCRIPTION:${eventDesc}
LOCATION:${eventData.location}, ${eventData.address}
END:VEVENT
END:VCALENDAR`;
  };

  const downloadICSFile = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${eventData.title.toLowerCase().replace(/ /g, "-")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn("relative")}>
      <motion.div
        className={cn(
          "bg-white rounded-2xl p-6 shadow-sm border border-sky-100 space-y-4",
        )}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className={cn("flex justify-between items-center")}>
          <h3 className={cn("text-xl font-semibold text-sky-800")}>
            {eventData.title.split(" - ")[0]}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "text-sky-500 hover:text-sky-600 transition-colors p-1.5 rounded-lg hover:bg-sky-50",
            )}
            onClick={() => setShowCalendarModal(true)}
            aria-label={t("events.addToCalendar")}
          >
            <CalendarPlus className={cn("w-5 h-5")} />
          </motion.button>
        </div>
        <div className={cn("space-y-3 text-sky-700")}>
          <div className={cn("flex items-center space-x-3")}>
            <Calendar className={cn("w-5 h-5 text-sky-500 shrink-0")} />
            <span>{formatEventDate(eventData.date, "full")}</span>
          </div>
          <div className={cn("flex items-center space-x-3")}>
            <Clock className={cn("w-5 h-5 text-sky-500 shrink-0")} />
            <span>
              {eventData.startTime?.substring(0, 5) || eventData.startTime} -{" "}
              {eventData.endTime?.substring(0, 5) || eventData.endTime} hs
            </span>
          </div>
          <div className={cn("flex items-center space-x-3")}>
            <MapPin className={cn("w-5 h-5 text-sky-500 shrink-0")} />
            <span>{eventData.location}</span>
          </div>
        </div>
      </motion.div>
      <Modal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      >
        <div className={cn("space-y-6")}>
          <div className={cn("flex items-center justify-between")}>
            <h3 className={cn("text-xl font-semibold text-sky-800")}>
              {t("events.addToCalendar")}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCalendarModal(false)}
              className={cn("text-sky-400 hover:text-sky-600")}
            >
              <X className={cn("w-5 h-5")} />
            </motion.button>
          </div>

          <div className={cn("space-y-3")}>
            <CalendarButton
              icon={(props) => (
                <Globe {...props} className={cn("w-5 h-5 text-sky-500")} />
              )}
              label={t("events.googleCalendar")}
              onClick={() => window.open(googleCalendarLink(), "_blank")}
            />

            <CalendarButton
              icon={(props) => (
                <Apple {...props} className={cn("w-5 h-5 text-sky-700")} />
              )}
              label={t("events.appleCalendar")}
              onClick={downloadICSFile}
            />

            <CalendarButton
              icon={(props) => (
                <CalendarIcon
                  {...props}
                  className={cn("w-5 h-5 text-sky-600")}
                />
              )}
              label={t("events.outlookCalendar")}
              onClick={downloadICSFile}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Main EventCards component that handles multiple events
const EventCards = ({ events }) => {
  return (
    <div className={cn("space-y-4")}>
      {events.map((event, index) => (
        <SingleEventCard key={index} eventData={event} />
      ))}
    </div>
  );
};

export default EventCards;
