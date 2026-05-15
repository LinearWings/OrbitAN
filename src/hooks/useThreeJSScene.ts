"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
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
    scene: null, camera: null, renderer: null,
    particles: [], beams: [], rings: [], clouds: [], clock: null, animId: 0,
  });
  const handlersRef = useRef<{ resize?: () => void; mouse?: (e: MouseEvent) => void; scroll?: () => void }>({});
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const hoverRef = useRef(false);
  const scrollRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = 1.4;
    stateRef.current.renderer = renderer;

    const scene = new THREE.Scene();
    stateRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.set(0, 0.5, 11);
    camera.lookAt(0, 0.2, 0);
    stateRef.current.camera = camera;

    // —— DRAMATIC LIGHTING ——

    // Ambient — very subtle base
    scene.add(new THREE.AmbientLight(0x0a0a1a, 0.4));

    // Key light — blue-white from upper right
    const key = new THREE.PointLight(0x88bbff, 80, 20, 1.5);
    key.position.set(5, 4, 6);
    scene.add(key);

    // Fill light — warm amber from left
    const fill = new THREE.PointLight(0xffaa44, 30, 15, 1.5);
    fill.position.set(-4, -1, 4);
    scene.add(fill);

    // Rim light — blue from behind
    const rim = new THREE.PointLight(0x3366cc, 40, 18, 1.5);
    rim.position.set(0, 0, -3);
    scene.add(rim);

    // Clock spot — focused on clock face
    const spot = new THREE.SpotLight(0xaaccff, 60, 14, Math.PI / 6, 0.3, 1);
    spot.position.set(0, 0, 8);
    spot.target.position.set(0, 0.3, 0);
    scene.add(spot);
    scene.add(spot.target);

    // —— DARK SPHERE BACKGROUND ——
    const bgGeom = new THREE.SphereGeometry(25, 32, 32);
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vPos; void main() {
        float d = length(vPos) / 25.0;
        gl_FragColor = vec4(vec3(0.015, 0.02, 0.04) * (1.0 - d * 0.3), 1.0);
      }`,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const bgSphere = new THREE.Mesh(bgGeom, bgMat);
    scene.add(bgSphere);

    // —— BUILD SCENE ELEMENTS ——

    stateRef.current.clouds = createNebulaClouds(scene);
    stateRef.current.particles = createParticleField(scene);

    // Beam A: dramatic blue diagonal sweep
    const beamA = createBeam(
      scene,
      new THREE.Vector3(7, 5, -5),
      new THREE.Vector3(-5, -2, 6),
      new THREE.Color("#3B82F6"),
      0.5,
    );

    // Beam B: amber horizontal sweep
    const beamB = createBeam(
      scene,
      new THREE.Vector3(-8, 0.5, -3),
      new THREE.Vector3(6, -0.3, 4),
      new THREE.Color("#F59E0B"),
      0.35,
    );

    // Beam C: subtle violet diagonal
    const beamC = createBeam(
      scene,
      new THREE.Vector3(3, 6, -6),
      new THREE.Vector3(-3, -3, 5),
      new THREE.Color("#6366F1"),
      0.3,
    );

    stateRef.current.beams = [beamA, beamB, beamC];
    stateRef.current.rings = createOrbitRings(scene);
    stateRef.current.clock = createClockFace(scene);

    // Staggered fade-in
    if (onReady) setTimeout(onReady, 600);

    // —— EVENT HANDLERS ——
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
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
      const { scene, camera, renderer, particles, beams, rings, clouds, clock } = stateRef.current;
      if (!scene || !camera || !renderer) return;
      if (startTime === null) startTime = ts;
      const t = (ts - startTime) / 1000;

      // Smooth mouse
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.06;

      const sp = scrollRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      // Camera orbit
      const targetX = mx * 0.8;
      const targetY = my * 0.5 + 0.5;
      const targetZ = 11 - sp * 5;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.position.z += (targetZ - camera.position.z) * 0.04;
      camera.lookAt(0, 0.2, 0);

      updateParticles(particles, t, mx, my, sp);
      updateBeams(beams, t, sp);
      updateOrbitRings(rings, t, hoverRef.current, sp);
      updateNebulaClouds(clouds, t, sp);
      if (clock) updateClockFace(clock);

      renderer.render(scene, camera);
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
    stateRef.current.renderer?.dispose();
    stateRef.current.scene?.clear();
    const h = handlersRef.current;
    if (h.resize) window.removeEventListener("resize", h.resize);
    if (h.mouse) window.removeEventListener("mousemove", h.mouse);
    if (h.scroll) window.removeEventListener("scroll", h.scroll);
  }, []);

  return { init, startLoop, dispose };
}
