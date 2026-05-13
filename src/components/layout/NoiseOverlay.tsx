export default function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        maskImage:
          "radial-gradient(ellipse at 50% 40%, black 22%, white 58%, white 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 40%, black 22%, white 58%, white 100%)",
      }}
    />
  );
}
