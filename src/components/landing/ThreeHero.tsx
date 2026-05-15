"use client";

import { useEffect, useRef, useState } from "react";
import { useThreeJSScene } from "@/hooks/useThreeJSScene";

export default function ThreeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { initScene, startAnimationLoop, dispose } = useThreeJSScene(canvasRef);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    // WebGL feature detection
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    initScene();
    startAnimationLoop();
    setSceneReady(true);

    return () => {
      dispose();
    };
  }, [initScene, startAnimationLoop, dispose]);

  if (!webGLSupported) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: sceneReady ? 1 : 0,
        transition: "opacity 1.5s ease-in",
      }}
      aria-hidden="true"
    />
  );
}
