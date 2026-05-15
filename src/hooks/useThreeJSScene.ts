"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import type { Particle } from "@/components/landing/three/particles";
import { createParticleField, updateParticles, disposeParticles } from "@/components/landing/three/particles";
import type { Beam } from "@/components/landing/three/beams";
import { createBeam, updateBeams, disposeBeams } from "@/components/landing/three/beams";
import type { OrbitRing } from "@/components/landing/three/rings";
import { createOrbitRings, updateOrbitRings, disposeOrbitRings } from "@/components/landing/three/rings";
import type { NebulaCloud } from "@/components/landing/three/nebula";
import { createNebulaClouds, updateNebulaClouds, disposeNebulaClouds } from "@/components/landing/three/nebula";
import type { Clock3D } from "@/components/landing/three/clock-face";
import { createClockFace, updateClockFace, disposeClockFace } from "@/components/landing/three/clock-face";

interface SceneState {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  bloom: UnrealBloomPass | null;
  particles: Particle[];
  beams: Beam[];
  rings: OrbitRing[];
  clouds: NebulaCloud[];
  clock: Clock3D | null;
  animId: number;
}

export function useThreeJSScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onReady?: () => void,
) {
  const stateRef = useRef<SceneState>({
    scene: null, camera: null, renderer: null, composer: null, bloom: null,
    particles: [], beams: [], rings: [], clouds: [], clock: null, animId: 0,
  });
  const handlersRef = useRef<{ resize?: () => void; mouse?: (e: MouseEvent) => void; scroll?: () => void }>({});
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const hoverRef = useRef(false);
  const scrollRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // —— RENDERER ——
    const renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: true, powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = 1.0;
    stateRef.current.renderer = renderer;

    // —— SCENE ——
    const scene = new THREE.Scene();
    stateRef.current.scene = scene;

    // —— CAMERA ——
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.set(0, 0.3, 11);
    camera.lookAt(0, 0, 0);
    stateRef.current.camera = camera;

    // —— POST-PROCESSING ——
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8,  // strength — moderate, bloom is soft and atmospheric
      0.4,  // radius — broader soft glow
      0.3,  // threshold — bloom picks up even mid-brightness elements for cinematic feel
    );
    composer.addPass(bloomPass);
    stateRef.current.composer = composer;
    stateRef.current.bloom = bloomPass;

    // —— LIGHTING — subtle, bloom amplifies it ——
    scene.add(new THREE.AmbientLight(0x0a0a20, 0.5));

    const key = new THREE.PointLight(0x7799dd, 30, 18, 2);
    key.position.set(4, 3, 6);
    scene.add(key);

    const fill = new THREE.PointLight(0xdd9944, 15, 12, 2);
    fill.position.set(-4, -1, 4);
    scene.add(fill);

    const rim = new THREE.PointLight(0x3355aa, 20, 15, 2);
    rim.position.set(0, 0, -4);
    scene.add(rim);

    // Spot on clock face
    const spot = new THREE.SpotLight(0xbbccee, 40, 16, Math.PI / 5, 0.3, 1);
    spot.position.set(0, 0.5, 8);
    spot.target.position.set(0, 0, 0);
    scene.add(spot);
    scene.add(spot.target);

    // —— DARK BACKGROUND SPHERE ——
    const bgGeom = new THREE.SphereGeometry(25, 32, 32);
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vP; void main() { vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vP; void main() {
        float d = length(vP) / 25.0;
        gl_FragColor = vec4(vec3(0.01, 0.014, 0.03) * (1.0 - d * 0.4), 1.0);
      }`,
      side: THREE.BackSide, depthWrite: false,
    });
    scene.add(new THREE.Mesh(bgGeom, bgMat));

    // —— BUILD SCENE ——
    stateRef.current.clouds = createNebulaClouds(scene);
    stateRef.current.particles = createParticleField(scene);

    const beamA = createBeam(scene,
      new THREE.Vector3(8, 5, -5), new THREE.Vector3(-5, -2, 6),
      new THREE.Color("#4477cc"), 0.6);
    const beamB = createBeam(scene,
      new THREE.Vector3(-8, 0.5, -3), new THREE.Vector3(6, -0.2, 4),
      new THREE.Color("#dd8822"), 0.4);
    stateRef.current.beams = [beamA, beamB];

    stateRef.current.rings = createOrbitRings(scene);
    stateRef.current.clock = createClockFace(scene);

    if (onReady) setTimeout(onReady, 600);

    // —— HANDLERS ——
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      composer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    handlersRef.current.resize = onResize;

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.ty = -(e.clientY / window.innerHeight) * 2 + 1;
      const cx = e.clientX - window.innerWidth / 2;
      const cy = e.clientY - window.innerHeight / 2;
      hoverRef.current = Math.sqrt(cx * cx + cy * cy) < 280;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    handlersRef.current.mouse = onMouse;

    const onScroll = () => {
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.6)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    handlersRef.current.scroll = onScroll;
  }, [canvasRef, onReady]);

  const startLoop = useCallback(() => {
    let startTime: number | null = null;

    const tick = (ts: number) => {
      stateRef.current.animId = requestAnimationFrame(tick);
      const s = stateRef.current;
      if (!s.scene || !s.camera || !s.renderer || !s.composer) return;
      if (startTime === null) startTime = ts;
      const t = (ts - startTime) / 1000;

      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.06;

      const sp = scrollRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      s.camera.position.x += (mx * 0.8 - s.camera.position.x) * 0.04;
      s.camera.position.y += (my * 0.5 + 0.3 - s.camera.position.y) * 0.04;
      s.camera.position.z += ((11 - sp * 5) - s.camera.position.z) * 0.04;
      s.camera.lookAt(0, 0, 0);

      updateParticles(s.particles, t, mx, my, sp);
      updateBeams(s.beams, t, sp);
      updateOrbitRings(s.rings, t, hoverRef.current, sp);
      updateNebulaClouds(s.clouds, t, sp);
      if (s.clock) updateClockFace(s.clock);

      s.composer.render();
    };
    stateRef.current.animId = requestAnimationFrame(tick);
  }, []);

  const dispose = useCallback(() => {
    cancelAnimationFrame(stateRef.current.animId);
    disposeParticles(stateRef.current.particles);
    disposeBeams(stateRef.current.beams);
    disposeOrbitRings(stateRef.current.rings);
    disposeNebulaClouds(stateRef.current.clouds);
    if (stateRef.current.clock) disposeClockFace(stateRef.current.clock);
    stateRef.current.composer?.passes.forEach(p => p.dispose?.());
    stateRef.current.renderer?.dispose();
    stateRef.current.scene?.clear();
    const h = handlersRef.current;
    if (h.resize) window.removeEventListener("resize", h.resize);
    if (h.mouse) window.removeEventListener("mousemove", h.mouse);
    if (h.scroll) window.removeEventListener("scroll", h.scroll);
  }, []);

  return { init, startLoop, dispose };
}
