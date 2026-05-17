"use client";

interface ArrowProps {
  dir?: "right-down" | "right-up" | "straight";
  color?: string;
  scale?: number;
  className?: string;
}

export function DecorativeArrow({
  dir = "right-down",
  color = "rgba(59,130,246,.12)",
  scale = 1,
  className = "",
}: ArrowProps) {
  const w = 96 * scale;
  const h = 40 * scale;

  return (
    <svg
      width={w} height={h} viewBox="0 0 96 36"
      fill="none" className={`l-darr ${className}`}
      aria-hidden="true"
    >
      {dir === "right-down" && (
        <>
          <path d="M 0 8 L 40 8 L 62 26 L 90 26" stroke={color} strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="90,26 84,23 84,29" fill={color} />
          <circle cx="40" cy="8" r="1.2" fill={color} />
        </>
      )}
      {dir === "right-up" && (
        <>
          <path d="M 0 26 L 40 26 L 62 8 L 90 8" stroke={color} strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="90,8 84,5 84,11" fill={color} />
          <circle cx="40" cy="26" r="1.2" fill={color} />
        </>
      )}
      {dir === "straight" && (
        <>
          <path d="M 0 18 L 90 18" stroke={color} strokeWidth="0.6" strokeLinecap="round" />
          <polygon points="90,18 84,15 84,21" fill={color} />
        </>
      )}
    </svg>
  );
}
