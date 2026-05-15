import * as THREE from "three";

export interface OrbitRing {
  mesh: THREE.Mesh;
  speed: number;
  baseOpacity: number;
}

const RING_CONFIGS = [
  { radius: 2.0, tube: 0.018, tiltX: 82, tiltY: 5, tiltZ: 3, speed: 0.20, opacity: 0.35 },
  { radius: 2.5, tube: 0.014, tiltX: 78, tiltY: -4, tiltZ: -5, speed: -0.15, opacity: 0.25 },
  { radius: 3.0, tube: 0.012, tiltX: 85, tiltY: 9, tiltZ: 2, speed: 0.10, opacity: 0.18 },
  { radius: 3.5, tube: 0.010, tiltX: 80, tiltY: -3, tiltZ: -4, speed: -0.07, opacity: 0.12 },
];

export function createOrbitRings(scene: THREE.Scene): OrbitRing[] {
  return RING_CONFIGS.map((config) => {
    const geometry = new THREE.TorusGeometry(config.radius, config.tube, 24, 200);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2563EB"),
      emissive: new THREE.Color("#1D4ED8"),
      emissiveIntensity: 0.5,
      metalness: 0.15,
      roughness: 0.35,
      transparent: true,
      opacity: config.opacity,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(
      THREE.MathUtils.degToRad(config.tiltX),
      THREE.MathUtils.degToRad(config.tiltY),
      THREE.MathUtils.degToRad(config.tiltZ),
    );
    scene.add(mesh);

    return { mesh, speed: config.speed, baseOpacity: config.opacity };
  });
}

export function updateOrbitRings(
  rings: OrbitRing[],
  time: number,
  clockHovered: boolean,
  scrollProgress: number,
) {
  const sm = clockHovered ? 1.4 : 1.0;
  for (const ring of rings) {
    ring.mesh.rotation.z += ring.speed * 0.016 * sm;
    ring.mesh.rotation.x += ring.speed * 0.003 * sm;
    const op = ring.baseOpacity * Math.max(0, 1 - scrollProgress * 1.5);
    (ring.mesh.material as THREE.MeshStandardMaterial).opacity = op;
  }
}

export function disposeOrbitRings(rings: OrbitRing[]) {
  for (const r of rings) {
    r.mesh.geometry.dispose();
    (r.mesh.material as THREE.Material).dispose();
    r.mesh.removeFromParent();
  }
}
