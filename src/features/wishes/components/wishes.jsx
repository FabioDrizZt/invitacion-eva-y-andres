import { motion, AnimatePresence } from "motion/react";
import Confetti from "@/components/ui/confetti";
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  ChevronDown,
  User,
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatEventDate } from "@/lib/format-event-date";
import { useInvitation } from "@/features/invitation";
import { fetchWishes, createWish, checkWishSubmitted } from "@/services/api";
import { getGuestName } from "@/lib/invitation-storage";
import { useMotionPreset, staggerContainer, stagger } from "@/lib/motion";
import { useTranslation } from "@/lib/i18n";

export default function Wishes() {
  const { uid } = useInvitation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");
  const [showConfetti, setShowConfetti] = useState(false);
  const [newWish, setNewWish] = useState("");
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isNameFromInvitation, setIsNameFromInvitation] = useState(false);
  const [hasSubmittedWish, setHasSubmittedWish] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWish, setSelectedWish] = useState(null);

  // Get guest name from localStorage
  useEffect(() => {
    const storedGuestName = getGuestName();
    if (storedGuestName) {
      setGuestName(storedGuestName);
      setIsNameFromInvitation(true);
    }
  }, []);

  // Check if guest has already submitted a wish
  useEffect(() => {
    const checkSubmissionStatus = async () => {
      if (uid && guestName && isNameFromInvitation) {
        try {
          const response = await checkWishSubmitted(uid, guestName);
          if (response.success && response.hasSubmitted) {
            setHasSubmittedWish(true);
          }
        } catch (error) {
          console.error("Error checking wish status:", error);
        }
      }
    };

    checkSubmissionStatus();
  }, [uid, guestName, isNameFromInvitation]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const options = [
    { value: "ATTENDING", label: t("wishes.attending") },
    { value: "NOT_ATTENDING", label: t("wishes.notAttending") },
    { value: "MAYBE", label: t("wishes.maybe") },
  ];

  // Fetch wishes using React Query
  const {
    data: wishes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishes", uid],
    queryFn: async () => {
      const response = await fetchWishes(uid);
      if (response.success) {
        return response.data;
      }
      throw new Error(t("wishes.failedLoad"));
    },
    enabled: !!uid,
    staleTime: 30 * 1000,
  });

  // Mutation for creating wishes
  const createWishMutation = useMutation({
    mutationFn: (wishData) => createWish(uid, wishData),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.setQueryData(["wishes", uid], (old = []) => [
          response.data,
          ...old,
        ]);
        setNewWish("");
        setAttendance("");
        setHasSubmittedWish(true);
        setErrorMessage("");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    },
    onError: (err) => {
      console.error("Error submitting wish:", err);
      if (
        err.code === "DUPLICATE_WISH" ||
        err.message?.includes("already submitted")
      ) {
        setHasSubmittedWish(true);
        setErrorMessage("");
      } else {
        setErrorMessage(t("wishes.failedSubmit"));
        setTimeout(() => setErrorMessage(""), 5000);
      }
    },
  });

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!newWish.trim() || !guestName.trim()) return;

    if (!uid) {
      setErrorMessage(t("wishes.invitationNotFound"));
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    setErrorMessage("");

    createWishMutation.mutate({
      name: guestName.trim(),
      message: newWish.trim(),
      attendance: attendance || "MAYBE",
    });
  };

  const getAttendanceIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "attending":
        return <CheckCircle className={cn("w-4 h-4 text-emerald-500")} />;
      case "not_attending":
      case "not-attending":
        return <XCircle className={cn("w-4 h-4 text-sky-400")} />;
      case "maybe":
        return <HelpCircle className={cn("w-4 h-4 text-amber-500")} />;
      default:
        return null;
    }
  };

  return (
    <>
      <section
        id="wishes"
        className={cn("min-h-screen relative overflow-hidden")}
      >
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

          {/* Wishes List */}
          <div className={cn("max-w-2xl mx-auto space-y-6")}>
            {isLoading && (
              <div className={cn("flex items-center justify-center py-12")}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 44 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className={cn("h-px bg-sky-500")}
                />
              </div>
            )}

            {error && !isLoading && (
              <div className={cn("text-center py-8")}>
                <p className={cn("text-sky-600")}>{error}</p>
              </div>
            )}

            {!isLoading && !error && (!wishes || wishes.length === 0) && (
              <div className={cn("text-center py-12")}>
                <MessageCircle
                  className={cn("w-12 h-12 text-sky-300 mx-auto mb-4")}
                />
                <p className={cn("text-sky-600")}>
                  {t("wishes.emptyState")}
                </p>
              </div>
            )}

            {!isLoading && wishes && wishes.length > 0 && (
              <AnimatePresence>
                <Marquee
                  pauseOnHover={true}
                  repeat={2}
                  className={cn("[--duration:60s] [--gap:1rem] py-2")}
                >
                  {wishes.map((wish, index) => (
                    <motion.div
                      key={wish.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={stagger(index, 0.1)}
                      className={cn(
                        "group relative w-[300px] h-[160px] flex-shrink-0 cursor-pointer",
                      )}
                      onClick={() => setSelectedWish(wish)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Background gradient */}
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br from-sky-100/60 to-blue-100/60 rounded-2xl transform transition-transform group-hover:scale-[1.02] duration-300",
                        )}
                      />

                      {/* Card content */}
                      <div
                        className={cn(
                          "relative h-full backdrop-blur-sm bg-white/90 p-4 rounded-2xl border border-sky-100 shadow-md flex flex-col",
                        )}
                      >
                        {/* Header */}
                        <div className={cn("flex items-center space-x-3 mb-3")}>
                          {/* Avatar */}
                          <div className={cn("flex-shrink-0")}>
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm",
                              )}
                            >
                              {wish.name[0]?.toUpperCase()}
                            </div>
                          </div>

                          {/* Name, Time, and Attendance */}
                          <div className={cn("flex-1 min-w-0")}>
                            <div className={cn("flex items-center space-x-2")}>
                              <h4
                                className={cn(
                                  "font-semibold text-sky-800 text-sm truncate max-w-[140px]",
                                )}
                              >
                                {wish.name}
                              </h4>
                              {getAttendanceIcon(wish.attendance)}
                            </div>
                            <div
                              className={cn(
                                "flex items-center space-x-1 text-sky-500 text-xs mt-0.5",
                              )}
                            >
                              <Clock className={cn("w-3 h-3 flex-shrink-0 text-sky-400")} />
                              <time className={cn("truncate")}>
                                {formatEventDate(
                                  wish.created_at,
                                  "short",
                                  true,
                                )}
                              </time>
                            </div>
                          </div>

                          {/* New badge */}
                          {Date.now() - new Date(wish.created_at).getTime() <
                            3600000 && (
                            <span
                              className={cn(
                                "flex-shrink-0 px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-medium",
                              )}
                            >
                              Nuevo
                            </span>
                          )}
                        </div>

                        {/* Message */}
                        <div className={cn("flex-1 overflow-hidden")}>
                          <p
                            className={cn(
                              "text-sky-700 text-sm leading-relaxed line-clamp-3",
                            )}
                          >
                            {wish.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </Marquee>
              </AnimatePresence>
            )}
          </div>

          {/* Wish Detail Modal */}
          <AnimatePresence>
            {selectedWish && (
              <>
                {/* Backdrop */}
                <motion.div
                  variants={fade}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => setSelectedWish(null)}
                  className={cn(
                    "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4",
                  )}
                >
                  {/* Modal Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-sky-100",
                    )}
                  >
                    {/* Modal Header */}
                    <div
                      className={cn(
                        "sticky top-0 bg-gradient-to-br from-sky-50 to-blue-50 p-6 border-b border-sky-100",
                      )}
                    >
                      <div className={cn("flex items-center justify-between")}>
                        <div className={cn("flex items-center space-x-4")}>
                          {/* Avatar */}
                          <div
                            className={cn(
                              "w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-2xl font-semibold shadow-lg",
                            )}
                          >
                            {selectedWish.name[0]?.toUpperCase()}
                          </div>

                          {/* Name and Time */}
                          <div>
                            <h3
                              className={cn(
                                "text-2xl font-serif text-sky-800 font-semibold",
                              )}
                            >
                              {selectedWish.name}
                            </h3>
                            <div
                              className={cn(
                                "flex items-center space-x-2 text-sky-600 text-sm mt-1",
                              )}
                            >
                              <Clock className={cn("w-4 h-4 text-sky-400")} />
                              <time>
                                {formatEventDate(
                                  selectedWish.created_at,
                                  "short",
                                  true,
                                )}
                              </time>
                            </div>
                          </div>
                        </div>

                        {/* Close Button */}
                        <button
                          onClick={() => setSelectedWish(null)}
                          className={cn(
                            "p-2 rounded-full hover:bg-white/50 transition-colors",
                          )}
                          aria-label={t("wishes.close")}
                        >
                          <XCircle
                            className={cn(
                              "w-6 h-6 text-sky-400 hover:text-sky-600",
                            )}
                          />
                        </button>
                      </div>

                      {/* Attendance Badge */}
                      {selectedWish.attendance && (
                        <div className={cn("mt-4 flex items-center space-x-2")}>
                          {getAttendanceIcon(selectedWish.attendance)}
                          <span
                            className={cn("text-sm font-medium text-sky-700")}
                          >
                            {selectedWish.attendance === "ATTENDING" &&
                              t("wishes.attending")}
                            {selectedWish.attendance === "NOT_ATTENDING" &&
                              t("wishes.notAttending")}
                            {selectedWish.attendance === "MAYBE" &&
                              t("wishes.maybe")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Modal Body - Full Message */}
                    <div className={cn("p-6")}>
                      <div className={cn("prose prose-sky max-w-none")}>
                        <p
                          className={cn(
                            "text-sky-800 text-base leading-relaxed whitespace-pre-wrap",
                          )}
                        >
                          {selectedWish.message}
                        </p>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div
                      className={cn(
                        "sticky bottom-0 bg-sky-50/60 p-4 border-t border-sky-100 flex justify-end",
                      )}
                    >
                      <button
                        onClick={() => setSelectedWish(null)}
                        className={cn(
                          "px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm",
                        )}
                      >
                        {t("wishes.close")}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Wishes Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={cn("max-w-2xl mx-auto mt-12")}
          >
            {hasSubmittedWish ? (
              <div
                className={cn(
                  "backdrop-blur-sm bg-white/85 p-8 rounded-2xl border border-sky-100 shadow-lg text-center",
                )}
              >
                <div className={cn("flex flex-col items-center space-y-4")}>
                  <CheckCircle className={cn("w-16 h-16 text-emerald-500")} />
                  <h3 className={cn("text-2xl font-serif text-sky-800")}>
                    {t("wishes.thankYou")}
                  </h3>
                  <p className={cn("text-sky-700")}>
                    {t("wishes.successMessage")}
                  </p>
                  <p className={cn("text-sm text-sky-500 italic")}>
                    {t("wishes.oneMessageLimit")}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitWish} className={cn("relative")}>
                <div
                  className={cn(
                    "backdrop-blur-sm bg-white/85 p-6 rounded-2xl border border-sky-100 shadow-lg",
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
                          "mb-4 p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start space-x-3",
                        )}
                      >
                        <AlertCircle
                          className={cn(
                            "w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5",
                          )}
                        />
                        <div className={cn("flex-1")}>
                          <p
                            className={cn("text-sm text-sky-800 font-medium")}
                          >
                            {errorMessage}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setErrorMessage("")}
                          className={cn(
                            "text-sky-400 hover:text-sky-600 transition-colors",
                          )}
                        >
                          <XCircle className={cn("w-4 h-4")} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={cn("space-y-4")}>
                    {/* Name Input */}
                    <div className={cn("space-y-2")}>
                      <div
                        className={cn(
                          "flex items-center space-x-2 text-sky-600 text-sm mb-1 font-medium",
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
                            : "bg-white/70 border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50",
                        )}
                        required
                      />
                    </div>

                    {/* Attendance Dropdown */}
                    <motion.div
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className={cn("space-y-2 relative")}
                      ref={dropdownRef}
                    >
                      <div
                        className={cn(
                          "flex items-center space-x-2 text-sky-600 text-sm mb-1 font-medium",
                        )}
                      >
                        <Calendar className={cn("w-4 h-4 text-sky-500")} />
                        <label htmlFor="attendance-select">
                          {t("wishes.attendanceLabel")}
                        </label>
                      </div>

                      {/* Hidden select for accessibility */}
                      <select
                        id="attendance-select"
                        name="attendance"
                        value={attendance}
                        onChange={(e) => setAttendance(e.target.value)}
                        className={cn("sr-only")}
                        aria-hidden="true"
                      >
                        <option value="">{t("wishes.attendancePlaceholder")}</option>
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      {/* Custom Select Button */}
                      <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={t("wishes.attendanceLabel")}
                        aria-expanded={isOpen}
                        aria-controls="attendance-dropdown"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl bg-white/70 border border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50 transition-all duration-200 text-left flex items-center justify-between",
                        )}
                      >
                        <span
                          className={
                            attendance ? "text-sky-800 font-medium" : "text-sky-400"
                          }
                        >
                          {attendance
                            ? options.find((opt) => opt.value === attendance)
                                ?.label
                            : t("wishes.attendancePlaceholder")}
                        </span>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-sky-500 transition-transform duration-200",
                            isOpen ? "transform rotate-180" : "",
                          )}
                        />
                      </button>

                      {/* Dropdown Options */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            id="attendance-dropdown"
                            role="listbox"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={cn(
                              "absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-sky-100 overflow-hidden",
                            )}
                          >
                            {options.map((option) => (
                              <motion.button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setAttendance(option.value);
                                  setIsOpen(false);
                                }}
                                whileHover={{
                                  backgroundColor: "rgb(240, 249, 255)",
                                }}
                                className={cn(
                                  "w-full px-4 py-2.5 text-left transition-colors",
                                  attendance === option.value
                                    ? "bg-sky-50 text-sky-600 font-semibold"
                                    : "text-sky-800 hover:bg-sky-50",
                                )}
                              >
                                {option.label}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Wish Textarea */}
                    <div className={cn("space-y-2")}>
                      <div
                        className={cn(
                          "flex items-center space-x-2 text-sky-600 text-sm mb-1 font-medium",
                        )}
                      >
                        <MessageCircle className={cn("w-4 h-4 text-sky-500")} />
                        <label htmlFor="wish-message">{t("wishes.wishLabel")}</label>
                      </div>
                      <textarea
                        id="wish-message"
                        name="message"
                        placeholder={t("wishes.wishPlaceholder")}
                        value={newWish}
                        onChange={(e) => setNewWish(e.target.value)}
                        className={cn(
                          "w-full h-32 p-4 rounded-xl bg-white/70 border border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50 resize-none transition-all duration-200 text-sky-800 placeholder-sky-400",
                        )}
                        required
                      />
                    </div>
                  </div>

                  <div className={cn("flex items-center justify-between mt-6")}>
                    <motion.button
                      type="submit"
                      disabled={createWishMutation.isPending}
                      whileHover={{
                        scale: createWishMutation.isPending ? 1 : 1.02,
                      }}
                      whileTap={{
                        scale: createWishMutation.isPending ? 1 : 0.98,
                      }}
                      className={cn(
                        "w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-white font-medium shadow-md shadow-sky-500/20 transition-all duration-200",
                        createWishMutation.isPending
                          ? "bg-sky-300 cursor-not-allowed"
                          : "bg-sky-500 hover:bg-sky-600",
                      )}
                    >
                      {createWishMutation.isPending ? (
                        <Loader2 className={cn("w-4 h-4 animate-spin")} />
                      ) : (
                        <Send className={cn("w-4 h-4")} />
                      )}
                      <span>
                        {createWishMutation.isPending
                          ? t("wishes.sending")
                          : t("wishes.sendButton")}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
