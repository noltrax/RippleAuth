"use client";

import BackgroundGrid, { BackgroundGridRef } from "@/Components/BackgroundGrid";
import LoginForm from "@/Components/LoginForm";
import { BadgeJapaneseYenIcon } from "lucide-react";
import { useRef } from "react";

export default function Page() {
  const backgroundRef = useRef<BackgroundGridRef>(null);

  return (
    <div className="relative min-h-screen bg-black">
      <BackgroundGrid ref={backgroundRef} />
      <LoginForm
        onTrigger={(type) => backgroundRef.current?.trigger(type)}
      ></LoginForm>
    </div>
  );
}
