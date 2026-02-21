"use client";

import BackgroundGrid, { BackgroundGridRef } from "@/Components/BackgroundGrid";
import LoginForm from "@/Components/LoginForm";
import LoggedIn from "@/Components/LoggedIn";
import { useRef, useState } from "react";

export default function Page() {
  const backgroundRef = useRef<BackgroundGridRef>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="relative min-h-screen bg-black">
      <BackgroundGrid ref={backgroundRef} />

      {!isLoggedIn ? (
        <LoginForm
          onTrigger={(type) => backgroundRef.current?.trigger(type)}
          onLoginSuccess={() => setIsLoggedIn(true)} 
        />
      ) : (
        <LoggedIn onTrigger={(type) => backgroundRef.current?.trigger(type)} />
      )}
    </div>
  );
}
