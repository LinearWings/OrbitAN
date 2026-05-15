import * as THREE from "three";

export interface OrbitRing {
  mesh: THREE.Mesh;
  speed: number;
  baseRotation: THREE.Euler;
  baseOpacity: number;
}

const RING_CONFIGS = [
  { radius: 2.2, tube: 0.015, tiltX: 82, tiltY: 5, tiltZ: 3, speed: 0.15, opacity: 0.35 },
  { radius: 2.6, tube: 0.012, tiltX: 78, tiltY: -3, tiltZ: -5, speed: -0.12, opacity: 0.28 },
  { radius: 3.0, tube: 0.010, tiltX: 85, tiltY: 8, tiltZ: 2, speed: 0.10, opacity: 0.22 },
  { radius: 3.4, tube: 0.010, tiltX: 75, tiltY: -6, tiltZ: -4, speed: -0.08, opacity: 0.18 },
  { radius: 3.8, tube: 0.008, tiltX: 80, tiltY: 4, tiltZ: 6, speed: 0.06, opacity: 0.14 },
  { radius: 4.2, tube: 0.008, tiltX: 88, tiltY: -2, tiltZ: -3, speed: -0.05, opacity: 0.10 },
];

export function createOrbitRings(scene: THREE.Scene): OrbitRing[] {
  return RING_CONFIGS.map((config) => {
    const geometry = new THREE.TorusGeometry(config.radius, config.tube, 16, 128);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.23, 0.39, 0.96),
      emissive: new THREE.Color(0.1, 0.15, 0.4),
      metalness: 0.3,
      roughness: 0.5,
      transparent: true,
      opacity: config.opacity,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const tiltX = THREE.MathUtils.degToRad(config.tiltX);
    const tiltY = THREE.MathUtils.degToRad(config.tiltY);
    const tiltZ = THREE.MathUtils.degToRad(config.tiltZ);
    mesh.rotation.set(tiltX, tiltY, tiltZ);

    scene.add(mesh);

    return {
      mesh,
      speed: config.speed,
      baseRotation: mesh.rotation.clone(),
      baseOpacity: config.opacity,
    };
  });
}

export function updateOrbitRings(
  rings: OrbitRing[],
  time: number,
  clockHovered: boolean,
  scrollProgress: number,
) {
  const speedMult = clockHovered ? 1.3 : 1.0;
  for (const ring of rings) {
    ring.mesh.rotation.z += ring.speed * 0.016 * speedMult;
    const opacity =
      ring.baseOpacity * Math.max(0, 1 - scrollProgress * 1.5);
    (ring.mesh.material as THREE.MeshStandardMaterial).opacity = opacity;
  }
}

export function disposeOrbitRings(rings: OrbitRing[]) {
  for (const ring of rings) {
    ring.mesh.geometry.dispose();
    (ring.mesh.material as THREE.Material).dispose();
    ring.mesh.removeFromParent();
  }
}
