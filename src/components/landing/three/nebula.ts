import * as THREE from "three";

const NEBULA_VERTEX = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vPos = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const NEBULA_FRAGMENT = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise3D(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Edge fade based on distance from center
    float dist = length(vPos) / 3.0;
    float edgeFade = 1.0 - smoothstep(0.3, 1.0, dist);

    // Noise-based cloud texture
    float noise = fbm(vWorldPos * 0.8 + uTime * 0.02);
    float detail = fbm(vWorldPos * 1.5 - uTime * 0.015) * 0.4;

    float density = noise * 0.6 + detail * 0.4;
    density *= edgeFade;

    // Fresnel-like edge glow
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
    density += fresnel * 0.15;

    if (density < 0.05) discard;

    vec3 color = mix(uColor, vec3(1.0), density * 0.3);
    float alpha = density * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`;

export interface NebulaCloud {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  basePosition: THREE.Vector3;
  driftPhase: number;
  driftSpeed: number;
  driftAmplitude: number;
}

const NEBULA_CONFIGS = [
  {
    radius: 1.8,
    color: new THREE.Color(0.23, 0.39, 0.96),
    opacity: 0.08,
    pos: new THREE.Vector3(1, 1.5, -3),
    drift: { speed: 0.015, amp: 0.3 },
  },
  {
    radius: 2.2,
    color: new THREE.Color(0.39, 0.25, 0.95),
    opacity: 0.06,
    pos: new THREE.Vector3(-2, -0.5, -4),
    drift: { speed: 0.012, amp: 0.4 },
  },
  {
    radius: 1.5,
    color: new THREE.Color(0.23, 0.39, 0.96),
    opacity: 0.07,
    pos: new THREE.Vector3(-0.5, -2, -3.5),
    drift: { speed: 0.018, amp: 0.25 },
  },
];

export function createNebulaClouds(scene: THREE.Scene): NebulaCloud[] {
  return NEBULA_CONFIGS.map((config) => {
    const geometry = new THREE.SphereGeometry(config.radius, 32, 32);
    const material = new THREE.ShaderMaterial({
      vertexShader: NEBULA_VERTEX,
      fragmentShader: NEBULA_FRAGMENT,
      uniforms: {
        uColor: { value: config.color },
        uTime: { value: 0 },
        uOpacity: { value: config.opacity },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(config.pos);
    scene.add(mesh);

    return {
      mesh,
      material,
      basePosition: config.pos.clone(),
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: config.drift.speed,
      driftAmplitude: config.drift.amp,
    };
  });
}

export function updateNebulaClouds(clouds: NebulaCloud[], time: number, scrollProgress: number) {
  for (const cloud of clouds) {
    cloud.material.uniforms.uTime.value = time;
    const driftX = Math.sin(time * cloud.driftSpeed + cloud.driftPhase) * cloud.driftAmplitude;
    const driftY =
      Math.cos(time * cloud.driftSpeed * 0.7 + cloud.driftPhase) * cloud.driftAmplitude * 0.7;
    cloud.mesh.position.x = cloud.basePosition.x + driftX;
    cloud.mesh.position.y = cloud.basePosition.y + driftY;
    cloud.material.uniforms.uOpacity.value = cloud.material.uniforms.uOpacity.value;
  }
}

export function disposeNebulaClouds(clouds: NebulaCloud[]) {
  for (const cloud of clouds) {
    cloud.mesh.geometry.dispose();
    cloud.material.dispose();
    cloud.mesh.removeFromParent();
  }
}
