"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import type { Particle } from "@/components/landing/three/particles";
import {
  createParticleField,
  updateParticles,
  disposeParticles,
} from "@/components/landing/three/particles";
import type { Beam } from "@/components/landing/three/beams";
import { createBeam, updateBeams, disposeBeams } from "@/components/landing/three/beams";
import type { OrbitRing } from "@/components/landing/three/rings";
import {
  createOrbitRings,
  updateOrbitRings,
  disposeOrbitRings,
} from "@/components/landing/three/rings";
import type { NebulaCloud } from "@/components/landing/three/nebula";
import {
  createNebulaClouds,
  updateNebulaClouds,
  disposeNebulaClouds,
} from "@/components/landing/three/nebula";
import type { Clock3D } from "@/components/landing/three/clock-face";
import {
  createClockFace,
  updateClockFace,
  disposeClockFace,
} from "@/components/landing/three/clock-face";

interface ThreeSceneState {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  particles: Particle[];
  beams: Beam[];
  rings: OrbitRing[];
  clouds: NebulaCloud[];
  clock: Clock3D | null;
  animationId: number;
}

export function useThreeJSScene(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const stateRef = useRef<ThreeSceneState>({
    scene: null,
    camera: null,
    renderer: null,
    particles: [],
    beams: [],
    rings: [],
    clouds: [],
    clock: null,
    animationId: 0,
  });

  const handlersRef = useRef<{
    onResize?: () => void;
    onMouseMove?: (e: MouseEvent) => void;
    onScroll?: () => void;
  }>({});

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const clockHoveredRef = useRef(false);
  const scrollProgressRef = useRef(0);

  const initScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    stateRef.current.renderer = renderer;

    // Scene
    const scene = new THREE.Scene();
    stateRef.current.scene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      50,
    );
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);
    stateRef.current.camera = camera;

    // Ambient light for subtle base illumination
    const ambient = new THREE.AmbientLight(0x111122, 0.5);
    scene.add(ambient);

    // Directional light for metallic sheen on clock and rings
    const directional = new THREE.DirectionalLight(0xaaccff, 1.5);
    directional.position.set(5, 3, 8);
    scene.add(directional);

    // Create all scene elements
    const particles = createParticleField(scene);
    stateRef.current.particles = particles;

    const clouds = createNebulaClouds(scene);
    stateRef.current.clouds = clouds;

    // Beam A: Blue, top-right diagonal
    const beamA = createBeam(
      scene,
      new THREE.Vector3(6, 9, -6),
      new THREE.Vector3(-1, -0.6, 0.5).normalize(),
      new THREE.Color("#3B82F6"),
      12,
      0.15,
      0.8,
      0.6,
    );
    beamA.swayAmplitude = 0.12;
    beamA.swaySpeed = 0.21;
    beamA.swayAxis = "z";

    // Beam B: Amber, left horizontal
    const beamB = createBeam(
      scene,
      new THREE.Vector3(-7, 1, -4),
      new THREE.Vector3(1, 0.05, 0.3).normalize(),
      new THREE.Color("#F59E0B"),
      14,
      0.1,
      0.6,
      1.0,
    );
    beamB.swayAmplitude = 0.08;
    beamB.swaySpeed = 0.25;
    beamB.swayAxis = "y";
    stateRef.current.beams = [beamA, beamB];

    const rings = createOrbitRings(scene);
    stateRef.current.rings = rings;

    const clock = createClockFace(scene);
    stateRef.current.clock = clock;

    // Resize handler
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    handlersRef.current.onResize = onResize;

    // Mouse handler
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Check if mouse is near clock center
      const cx = e.clientX - window.innerWidth / 2;
      const cy = e.clientY - window.innerHeight / 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      clockHoveredRef.current = dist < 250;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    handlersRef.current.onMouseMove = onMouseMove;

    // Scroll handler
    const onScroll = () => {
      const scrollY = window.scrollY;
      const fadeDistance = window.innerHeight * 0.6;
      scrollProgressRef.current = Math.min(1, Math.max(0, scrollY / fadeDistance));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    handlersRef.current.onScroll = onScroll;
  }, [canvasRef]);

  const startAnimationLoop = useCallback(() => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      stateRef.current.animationId = requestAnimationFrame(animate);

      const { scene, camera, renderer, particles, beams, rings, clouds, clock } =
        stateRef.current;
      if (!scene || !camera || !renderer) return;

      if (startTime === null) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const scrollProgress = scrollProgressRef.current;
      const isClockHovered = clockHoveredRef.current;

      // Update camera orbit
      const targetX = mouseRef.current.x * 0.15;
      const targetY = mouseRef.current.y * 0.12;
      const baseZ = 12 - scrollProgress * 4;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.position.z += (baseZ - camera.position.z) * 0.05;
      camera.lookAt(0, 0, 0);

      // Update scene elements
      updateParticles(particles, elapsed, mouseRef.current.x, mouseRef.current.y, scrollProgress);
      updateBeams(beams, elapsed, scrollProgress);
      updateOrbitRings(rings, elapsed, isClockHovered, scrollProgress);
      updateNebulaClouds(clouds, elapsed, scrollProgress);
      if (clock) updateClockFace(clock, elapsed);

      renderer.render(scene, camera);
    };

    stateRef.current.animationId = requestAnimationFrame(animate);
  }, []);

  const dispose = useCallback(() => {
    const state = stateRef.current;
    cancelAnimationFrame(state.animationId);
    disposeParticles(state.particles);
    disposeBeams(state.beams);
    disposeOrbitRings(state.rings);
    disposeNebulaClouds(state.clouds);
    if (state.clock) disposeClockFace(state.clock);
    state.renderer?.dispose();
    state.scene?.clear();

    const h = handlersRef.current;
    if (h.onResize) window.removeEventListener("resize", h.onResize);
    if (h.onMouseMove) window.removeEventListener("mousemove", h.onMouseMove);
    if (h.onScroll) window.removeEventListener("scroll", h.onScroll);
  }, []);

  return { initScene, startAnimationLoop, dispose };
}
