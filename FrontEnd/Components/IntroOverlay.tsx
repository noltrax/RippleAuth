"use client";

interface Props {
  onStart: () => void;
}

export default function IntroOverlay({ onStart }: Props) {
  return (
    <div className="intro-overlay" onClick={onStart}>
      <h1 className="logo">Finance</h1>
      <p>Click to enter</p>
    </div>
  );
}
