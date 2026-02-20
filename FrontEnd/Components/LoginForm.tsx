"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/Components/ui/input-otp";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  Mail,
  Phone,
  AlertCircle,
  XCircle,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { animate, splitText, stagger } from "animejs";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type InputKind = "phone" | "email" | "unknown";
type ValidationState = "idle" | "error" | "fail";
type TriggerType = "phone" | "email" | "fail" | "error" | "unknown";

type Props = {
  onTrigger: (type: TriggerType, theme: "light" | "dark") => void;
  onLoginSuccess?: () => void; // new prop
};

const detectInputKind = (value: string): InputKind => {
  if (!value) return "unknown";
  if (/^\d/.test(value)) return "phone";
  return "email";
};

const sanitizePhone = (value: string) => value.replace(/\D/g, "");
const isValidEmail = (value: string) =>
  value.includes("@") && value.includes(".");
const isValidPhone = (value: string) => value.length >= 6;

export default function LoginForm({ onTrigger, onLoginSuccess }: Props) {
  const { theme } = useTheme();

  const [value, setValue] = useState("");
  const [inputKind, setInputKind] = useState<InputKind>("unknown");
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [identifierToken, setIdentifierToken] = useState<string | null>(null);

  const [buttonText, setButtonText] = useState("login");
  const buttonTextRef = useRef<HTMLSpanElement>(null);

  // 🔹 Anime.js animation for button text
  useEffect(() => {
    if (!buttonTextRef.current) return;

    const { chars: oldChars } = splitText(buttonTextRef.current, {
      chars: { wrap: "auto" },
    });

    animate(oldChars, {
      translateY: ["0%", "100%"],
      opacity: [1, 0],
      duration: 500,
      easing: "easeInOutQuad",
      delay: stagger(100),
      onComplete: () => {
        if (!buttonTextRef.current) return;
        buttonTextRef.current.innerHTML = buttonText;

        const { chars: newChars } = splitText(buttonTextRef.current, {
          chars: { wrap: "auto" },
        });

        animate(newChars, {
          translateY: ["100%", "0%"],
          opacity: [0, 1],
          duration: 500,
          easing: "easeOutQuad",
          delay: stagger(100),
        });
      },
    });
  }, [buttonText]);

  const triggerType: TriggerType = useMemo(() => {
    if (validationState === "fail") return "fail";
    if (validationState === "error") return "error";
    return inputKind;
  }, [inputKind, validationState]);

  useEffect(() => {
    onTrigger(triggerType, theme);
  }, [triggerType, onTrigger]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    const detectedKind = detectInputKind(val);

    if (detectedKind === "phone") val = sanitizePhone(val);

    setValue(val);
    setInputKind(detectedKind);
    setValidationState("idle");
  };

  const handleSubmit = async () => {
    if (!value) {
      setValidationState("fail");
      setButtonText("No Input!");
      return;
    }

    if (inputKind === "phone" && !isValidPhone(value)) {
      setValidationState("error");
      setButtonText("Invalid Phone Number!");
      return;
    }

    if (inputKind === "email" && !isValidEmail(value)) {
      setValidationState("error");
      setButtonText("Invalid Mail!");
      return;
    }

    try {
      const { data } = await api.post("/api/auth/identify", {
        method: inputKind,
        identifier: value,
      });

      setIdentifierToken(data.identifier_token);
      setValidationState("idle");

      // fade out input, fade in OTP
      setShowOTP(true);
      setButtonText("Verify OTP!");
    } catch (error) {
      setValidationState("error");
      setButtonText("Server Failed!");
    }
  };

  const handleVerifyOTP = async () => {
    if (!identifierToken || otp.length !== 6) return;

    try {
      await api.post("/api/auth/verify", {
        identifier_token: identifierToken,
        otp,
      });

      setValidationState("idle");
      onTrigger(inputKind, theme);

      // ✅ call the success callback
      onLoginSuccess?.();
    } catch (error) {
      setValidationState("error");
      setButtonText("Invalid OTP!");
    }
  };

  const handleBack = () => {
    setShowOTP(false);
    setOtp("");
    setButtonText("login");
  };

  const getIcon = (type: TriggerType) => {
    switch (type) {
      case "phone":
        return <Phone size={18} />;
      case "email":
        return <Mail size={18} />;
      case "fail":
        return <XCircle size={18} />;
      case "error":
        return <AlertCircle size={18} />;
      default:
        return <HelpCircle size={18} />;
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center w-fit h-fit self-center justify-self-center">
      <Card
        className="w-[320px] p-6 relative"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(2.8px)",
          WebkitBackdropFilter: "blur(2.8px)",
        }}
      >
        <CardHeader className="mb-4 relative">
          {showOTP && (
            <Button
              variant="ghost"
              className="absolute left-0 top-0"
              onClick={handleBack}
            >
              <ArrowLeft className="text-white" />
            </Button>
          )}
          <CardTitle className="text-white text-xl text-center">
            Cool Login
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          <AnimatePresence mode="wait">
            {!showOTP ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80">
                    {getIcon(triggerType)}
                  </div>
                  <Input
                    placeholder="Email or Phone"
                    value={value}
                    onChange={handleChange}
                    className="pl-10 text-white placeholder-white bg-transparent border border-white/30"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            className="bg-white text-black hover:bg-white/90"
            id="login"
            onClick={showOTP ? handleVerifyOTP : handleSubmit}
          >
            <span ref={buttonTextRef}>
              {showOTP ? "Verify OTP!" : buttonText}
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
