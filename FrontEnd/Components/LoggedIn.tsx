// Components/LoggedIn.tsx
"use client";

import { useEffect } from "react";
import { BadgeJapaneseYenIcon } from "lucide-react";
import { motion } from "framer-motion";

type TriggerType = "phone" | "email" | "fail" | "error" | "unknown";
type Props = {
  onTrigger: (type: TriggerType, theme: "light" | "dark") => void;
};

export default function LoggedIn({ onTrigger }: Props) {
  useEffect(() => {
    // Trigger background animation when component mounts
    onTrigger?.("unknown", "dark");
    onTrigger?.("unknown", "light");
  }, [onTrigger]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center space-y-4"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="text-white text-6xl"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        🎉
      </motion.div>

      <motion.h1
        className="text-white text-3xl font-bold"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        Congrats, You’re Logged In!
      </motion.h1>

      <motion.p
        className="text-white/70 text-lg text-center max-w-xs"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
      >
        Welcome to your dashboard. Let’s make some magic happen!
      </motion.p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{
          duration: 0.8,
          delay: 0.8,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <BadgeJapaneseYenIcon className="text-yellow-400 w-12 h-12" />
      </motion.div>
    </motion.div>
  );
}
