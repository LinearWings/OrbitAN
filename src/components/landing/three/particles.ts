import * as THREE from "three";

let particleTexture: THREE.Texture | null = null;

function getParticleTexture(): THREE.Texture {
  if (particleTexture) return particleTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  // Sharp bright core with soft falloff
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.02, "rgba(255,255,255,1)");
  gradient.addColorStop(0.1, "rgba(255,255,255,0.85)");
  gradient.addColorStop(0.3, "rgba(255,255,255,0.4)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.06)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  particleTexture = new THREE.CanvasTexture(canvas);
  particleTexture.needsUpdate = true;
  return particleTexture;
}

export interface Particle {
  sprite: THREE.Sprite;
  basePosition: THREE.Vector3;
  phase: number;
  speed: number;
  amplitude: number;
}

const COLORS = [
  new THREE.Color("#3B82F6"),
  new THREE.Color("#60A5FA"),
  new THREE.Color("#93BBFD"),
  new THREE.Color("#F59E0B"),
  new THREE.Color("#FBBF24"),
  new THREE.Color("#FFFFFF"),
  new THREE.Color("#A5B4FC"),
];

export function createParticleField(scene: THREE.Scene): Particle[] {
  const texture = getParticleTexture();
  const particles: Particle[] = [];
  const count = 250;

  for (let i = 0; i < count; i++) {
    const material = new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      transparent: true,
      opacity: 0.5, // Lower — bloom compensates for glow
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const sprite = new THREE.Sprite(material);

    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const baseRadius = 4 + Math.random() * 14;

    const basePosition = new THREE.Vector3(
      baseRadius * Math.sin(phi) * Math.cos(theta),
      baseRadius * Math.sin(phi) * Math.sin(theta),
      baseRadius * Math.cos(phi) * 0.5 - 2,
    );

    const s = 0.12 + Math.random() * 0.5;
    sprite.scale.set(s, s, 1);
    sprite.position.copy(basePosition);

    scene.add(sprite);
    particles.push({
      sprite,
      basePosition,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.2,
      amplitude: 0.15 + Math.random() * 0.7,
    });
  }

  return particles;
}

export function updateParticles(
  particles: Particle[],
  time: number,
  mouseX: number,
  mouseY: number,
  scrollProgress: number,
) {
  const parallaxX = mouseX * 2.0;
  const parallaxY = mouseY * 1.5;

  for (const p of particles) {
    const osc = Math.sin(time * p.speed + p.phase) * p.amplitude;
    const depthFactor = (p.basePosition.z + 8) / 12;

    p.sprite.position.x = p.basePosition.x + osc * 0.5 + parallaxX * depthFactor;
    p.sprite.position.y = p.basePosition.y + Math.cos(time * 0.5 + p.phase) * p.amplitude * 0.4 + parallaxY * depthFactor;
    p.sprite.position.z = p.basePosition.z + osc * 0.3;

    const flicker = 0.4 + 0.6 * Math.abs(Math.sin(time * p.speed * 0.5 + p.phase));
    const scrollFade = 1 - scrollProgress * 1.5;
    (p.sprite.material as THREE.SpriteMaterial).opacity = Math.max(0, flicker * scrollFade * 0.45);
  }
}

export function disposeParticles(particles: Particle[]) {
  for (const p of particles) {
    p.sprite.material.dispose();
    p.sprite.removeFromParent();
  }
}
