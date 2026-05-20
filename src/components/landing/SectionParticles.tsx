"use client";

interface Props {
  count?: number;
  color?: string;
}

export function SectionParticles({ count = 12, color = "rgba(255,255,255,.3)" }: Props) {
  return (
    <div className="l-section-particles" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${8 + (i * 17) % 84}%`,
            bottom: `${(i * 23) % 30}%`,
            "--duration": `${6 + (i % 5) * 2.5}s`,
            "--delay": `${(i * 0.7) % 6}s`,
            "--drift": `${(i % 2 === 0 ? 1 : -1) * (15 + (i % 4) * 10)}px`,
            "--particle-color": color,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
