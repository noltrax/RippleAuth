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
import { Mail, Phone, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import axios from "axios";
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

export default function LoginForm({ onTrigger }: Props) {
  const { theme } = useTheme();

  const [value, setValue] = useState("");
  const [inputKind, setInputKind] = useState<InputKind>("unknown");
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [identifierToken, setIdentifierToken] = useState<string | null>(null);

  const [buttonText, setButtonText] = useState("login");
  const [displayText, setDisplayText] = useState("login");
  const buttonTextRef = useRef<HTMLSpanElement>(null);
  const [number, setNumber] = useState<number>(1);

  useEffect(() => {
    const { chars: oldChars } = splitText(buttonTextRef.current!, {
      chars: { wrap: "auto" },
    });

    console.log(oldChars);

    animate(oldChars, {
      translateY: ["0%", "100%"],
      opacity: [1, 0],
      duration: 500,
      easing: "easeInOutQuad",
      delay: stagger(100),
      onComplete: () => {
        buttonTextRef.current!.innerHTML = buttonText;

        const { chars: newChars } = splitText(buttonTextRef.current!, {
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

    if (detectedKind === "phone") {
      val = sanitizePhone(val);
    }

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
      setShowOTP(true);
    } catch (error) {
      setValidationState("error");
      setButtonText("Server Failed!");
    }
  };

  const handleVerifyOTP = async () => {
    if (!identifierToken || otp.length !== 4) return;

    try {
      await api.post("/api/auth/verify", {
        identifier_token: identifierToken,
        otp,
      });

      setValidationState("idle");
      onTrigger(inputKind, theme);

      // 🔥 redirect or set auth state here
    } catch (error) {
      setValidationState("error");
    }
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
    <div className="absolute inset-0 flex items-center justify-center w-fit h-fit self-center justify-self-center z-10">
      <Card
        className="w-[320px] p-6"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(2.8px)",
          WebkitBackdropFilter: "blur(2.8px)",
        }}
      >
        <CardHeader className="mb-4">
          <CardTitle className="text-white text-xl text-center">
            Cool Login
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          {!showOTP ? (
            <>
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
            </>
          ) : (
            <>
              <InputOTP
                maxLength={4}
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
                  <InputOTPSlot index={6} />
                </InputOTPGroup>
              </InputOTP>
            </>
          )}
          <Button
            className="bg-white text-black hover:bg-white/90"
            id="login"
            onClick={showOTP ? handleVerifyOTP : handleSubmit}
          >
            <span ref={buttonTextRef}>
              {showOTP ? "Verify OTP!" : displayText}
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
