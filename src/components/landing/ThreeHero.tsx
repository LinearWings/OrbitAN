"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useThreeJSScene } from "@/hooks/useThreeJSScene";

interface ThreeHeroProps {
  onWebGLActive?: (active: boolean) => void;
}

export default function ThreeHero({ onWebGLActive }: ThreeHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);

  const handleReady = useCallback(() => {
    setSceneReady(true);
    onWebGLActive?.(true);
  }, [onWebGLActive]);

  const { init, startLoop, dispose } = useThreeJSScene(canvasRef, handleReady);

  useEffect(() => {
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) {
        setWebGLSupported(false);
        onWebGLActive?.(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      onWebGLActive?.(false);
      return;
    }

    init();
    startLoop();

    return () => { dispose(); };
  }, [init, startLoop, dispose, onWebGLActive]);

  if (!webGLSupported) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none",
        zIndex: 5,
        opacity: sceneReady ? 1 : 0,
        transition: "opacity 1.5s ease-in",
      }}
      aria-hidden="true"
    />
  );
}
