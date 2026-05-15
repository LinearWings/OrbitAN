import * as THREE from "three";

let particleTexture: THREE.Texture | null = null;

function getParticleTexture(): THREE.Texture {
  if (particleTexture) return particleTexture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.08, "rgba(255,255,255,0.95)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.6)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.15)");
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
  riseSpeed: number;
  color: THREE.Color;
}

const COLORS = {
  blue: new THREE.Color("#3B82F6"),
  amber: new THREE.Color("#F59E0B"),
  white: new THREE.Color("#FFFFFF"),
};

export function createParticleField(scene: THREE.Scene): Particle[] {
  const texture = getParticleTexture();
  const particles: Particle[] = [];
  const count = 200;

  for (let i = 0; i < count; i++) {
    const group = i < 120 ? "firefly" : i < 180 ? "star" : "dust";
    const material = new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      transparent: true,
      opacity: group === "star" ? 0.5 : 0.7,
    });

    const sprite = new THREE.Sprite(material);
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius =
      group === "firefly"
        ? 4 + Math.random() * 6
        : group === "star"
          ? 15 + Math.random() * 10
          : 3 + Math.random() * 4;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const basePosition = new THREE.Vector3(x, y, z);

    const colorRand = Math.random();
    const color =
      group === "star"
        ? colorRand < 0.3
          ? COLORS.amber
          : colorRand < 0.6
            ? COLORS.blue
            : COLORS.white
        : colorRand < 0.7
          ? COLORS.blue
          : colorRand < 0.9
            ? COLORS.amber
            : COLORS.white;

    material.color = color;

    const size =
      group === "firefly"
        ? 0.04 + Math.random() * 0.1
        : group === "star"
          ? 0.02 + Math.random() * 0.04
          : 0.06 + Math.random() * 0.12;
    sprite.scale.set(size, size, 1);
    sprite.position.copy(basePosition);

    scene.add(sprite);

    particles.push({
      sprite,
      basePosition,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.7,
      amplitude: 0.1 + Math.random() * 0.4,
      riseSpeed: 0.02 + Math.random() * 0.06,
      color,
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
  const parallaxX = mouseX * 0.5;
  const parallaxY = mouseY * 0.3;

  for (const p of particles) {
    const oscillation = Math.sin(time * p.speed + p.phase) * p.amplitude;

    p.sprite.position.x =
      p.basePosition.x + oscillation * 0.3 + parallaxX * (1 - p.basePosition.z / 15);
    p.sprite.position.y =
      p.basePosition.y +
      Math.sin(time * 0.3 + p.phase) * p.amplitude * 0.5 +
      (time * p.riseSpeed * 0.05) +
      parallaxY * (1 - p.basePosition.z / 15);
    p.sprite.position.z = p.basePosition.z + oscillation * 0.2;

    // Opacity flicker
    const flicker =
      0.6 +
      0.4 * Math.sin(time * p.speed * 1.5 + p.phase) * Math.sin(time * p.speed * 0.7 + p.phase);
    const scrollFade = 1 - scrollProgress;
    (p.sprite.material as THREE.SpriteMaterial).opacity = Math.max(
      0,
      flicker * scrollFade * 0.7,
    );
  }
}

export function disposeParticles(particles: Particle[]) {
  for (const p of particles) {
    p.sprite.material.dispose();
    p.sprite.removeFromParent();
  }
}
