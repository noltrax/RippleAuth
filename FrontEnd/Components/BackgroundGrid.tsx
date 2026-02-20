"use client";

import {
  useState,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { animate, stagger, eases } from "animejs";
import { SunMoon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type ThemeMode = "light" | "dark";

type TriggerType =
  | "error"
  | "phone"
  | "fail"
  | "email"
  | "unknown"
  | "theme-toggle";

export type BackgroundGridRef = {
  trigger: (type?: TriggerType) => void;
};

const CELL_SIZE = 50;

const typeColors: Record<
  Exclude<TriggerType, "theme-toggle">,
  { light: string[]; dark: string[] }
> = {
  error: { light: ["#D8C025"], dark: ["#B8860B"] },
  phone: { light: ["#56AE53"], dark: ["#2E7D32"] },
  fail: { light: ["#CD0000"], dark: ["#8B0000"] },
  email: { light: ["#FF5029"], dark: ["#BF360C"] },
  unknown: { light: ["#bcbcbc"], dark: ["#424242"] },
};

const resolvePaletteColor = (type: TriggerType, theme: ThemeMode): string => {
  if (type === "theme-toggle") type = "unknown";
  const palette = typeColors[type]?.[theme] ?? typeColors.unknown[theme];
  return palette[Math.floor(Math.random() * palette.length)];
};

const BackgroundGrid = forwardRef<BackgroundGridRef>((_, ref) => {
  const { theme, toggleTheme } = useTheme();

  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);
  const [total, setTotal] = useState(0);

  const itemsRef = useRef<HTMLDivElement[]>([]);
  const queueRef = useRef<TriggerType[]>([]);
  const animatingRef = useRef(false);

  const currentTypeRef = useRef<TriggerType>("unknown");
  const currentColorRef = useRef<string>(resolvePaletteColor("unknown", theme));

  const sunRef = useRef<SVGSVGElement | null>(null);

  const calculateGridSize = useCallback(() => {
    const cols = Math.floor(window.innerWidth / CELL_SIZE);
    const rws = Math.floor(window.innerHeight / CELL_SIZE);

    setColumns(cols);
    setRows(rws);
    setTotal(cols * rws);

    itemsRef.current = Array.from({ length: cols * rws }).map(
      (_, i) => itemsRef.current[i] || ({} as HTMLDivElement),
    );
  }, []);

  useLayoutEffect(() => {
    calculateGridSize();
    window.addEventListener("resize", calculateGridSize);
    return () => window.removeEventListener("resize", calculateGridSize);
  }, [calculateGridSize]);

  const runNext = (fromIndex?: number, overrideTheme?: ThemeMode) => {
    const rippleTheme = overrideTheme ?? theme;

    if (queueRef.current.length === 0) {
      animatingRef.current = false;
      return;
    }

    animatingRef.current = true;

    const nextTrigger = queueRef.current.shift()!;

    if (nextTrigger === "theme-toggle") {
      toggleTheme();
    } else {
      currentTypeRef.current = nextTrigger;
    }

    const rippleColor = resolvePaletteColor(
      currentTypeRef.current,
      rippleTheme,
    );

    currentColorRef.current =
      queueRef.current.length > 0
        ? resolvePaletteColor(
            queueRef.current[queueRef.current.length - 1],
            rippleTheme,
          )
        : rippleColor;

    if (sunRef.current) {
      sunRef.current.style.stroke = resolvePaletteColor(
        currentTypeRef.current,
        rippleTheme === "light" ? "dark" : "light",
      );
    }

    const startIndex =
      typeof fromIndex === "number"
        ? fromIndex
        : Math.floor(Math.random() * total);

    animate(itemsRef.current, {
      backgroundColor: () => rippleColor,
      delay: stagger(50, { grid: [columns, rows], from: startIndex }),
      easing: "linear",
      duration: 300,
      onComplete: () => runNext(),
    });
  };

  const trigger = (type: TriggerType = "unknown") => {
    queueRef.current.push(type);
    if (!animatingRef.current) runNext();
  };

  useImperativeHandle(ref, () => ({ trigger }));

  return (
    <div className="background-grid">
      <SunMoon
        size={25}
        strokeWidth={2}
        style={{
          position: "fixed",
          top: 20,
          left: theme === "light" ? 20 : window.innerWidth - 50,
          zIndex: 100,
          cursor: "pointer",
          pointerEvents: "auto",
        }}
        ref={(el) => {
          sunRef.current = el;
        }}
        onClick={() => {
          if (!sunRef.current) return;

          const rect = sunRef.current.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;

          const colIndex = Math.floor(x / CELL_SIZE);
          const rowIndex = Math.floor(y / CELL_SIZE);
          const fromIndex = rowIndex * columns + colIndex;

          queueRef.current.push("theme-toggle");

          const targetLeft =
            rect.left < window.innerWidth / 2 ? window.innerWidth - 50 : 20;

          const newTheme = theme === "light" ? "dark" : "light";

          animate(sunRef.current, {
            left: targetLeft,
            stroke: resolvePaletteColor(
              currentTypeRef.current,
              newTheme === "light" ? "dark" : "light",
            ),
            easing: eases.outQuad,
            duration: 2000,
          });

          if (!animatingRef.current) runNext(fromIndex, newTheme);
        }}
      />

      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) itemsRef.current[i] = el;
            if (el && !el.style.backgroundColor)
              el.style.backgroundColor = currentColorRef.current;
          }}
          className="grid-item"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        />
      ))}
    </div>
  );
});

BackgroundGrid.displayName = "BackgroundGrid";

export default BackgroundGrid;
