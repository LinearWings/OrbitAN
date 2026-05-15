import * as THREE from "three";

const BEAM_VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const BEAM_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec2 vUv;
  uniform vec3 uBeamAxis;
  uniform vec3 uSourcePos;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uFalloff;
  uniform float uLength;

  // Simple 3D noise
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

  void main() {
    // Distance from source along normalized axis
    float distFromSource = length(vWorldPos - uSourcePos) / uLength;
    // Distance from beam axis (perpendicular)
    vec3 toPoint = vWorldPos - uSourcePos;
    float projLen = dot(toPoint, uBeamAxis);
    vec3 closestOnAxis = uSourcePos + uBeamAxis * projLen;
    float distFromAxis = length(vWorldPos - closestOnAxis);

    // Attenuation along length
    float lengthFalloff = 1.0 - smoothstep(0.0, 1.0, abs(projLen) / uLength);
    // Attenuation from axis (gaussian falloff for volumetric look)
    float axisFalloff = exp(-distFromAxis * distFromAxis / uFalloff);

    // Noise for dust texture
    float noise = noise3D(vWorldPos * 4.0 + uTime * 0.1) * 0.3 +
                  noise3D(vWorldPos * 8.0 - uTime * 0.15) * 0.15;

    float intensity = lengthFalloff * axisFalloff * (0.7 + noise);

    // Softer edges
    intensity *= smoothstep(1.0, 0.0, abs(projLen) / uLength);

    if (intensity < 0.01) discard;

    gl_FragColor = vec4(uColor, intensity * 0.25);
  }
`;

export interface Beam {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  baseRotation: THREE.Euler;
  swayAmplitude: number;
  swaySpeed: number;
  swayAxis: "x" | "y" | "z";
}

export function createBeam(
  scene: THREE.Scene,
  sourcePos: THREE.Vector3,
  direction: THREE.Vector3,
  color: THREE.Color,
  length: number,
  coneRadiusStart: number,
  coneRadiusEnd: number,
  falloff: number,
): Beam {
  const axis = direction.clone().normalize();
  const midPoint = sourcePos.clone().add(axis.clone().multiplyScalar(length / 2));

  const geometry = new THREE.CylinderGeometry(coneRadiusStart, coneRadiusEnd, length, 32, 8, true);

  const material = new THREE.ShaderMaterial({
    vertexShader: BEAM_VERTEX_SHADER,
    fragmentShader: BEAM_FRAGMENT_SHADER,
    uniforms: {
      uBeamAxis: { value: axis },
      uSourcePos: { value: sourcePos },
      uTime: { value: 0 },
      uColor: { value: color },
      uFalloff: { value: falloff },
      uLength: { value: length },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(midPoint);

  // Orient cylinder along beam direction
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
  mesh.setRotationFromQuaternion(quaternion);

  scene.add(mesh);

  return {
    mesh,
    material,
    baseRotation: mesh.rotation.clone(),
    swayAmplitude: 0,
    swaySpeed: 0,
    swayAxis: "y",
  };
}

export function updateBeams(beams: Beam[], time: number, scrollProgress: number) {
  for (const beam of beams) {
    beam.material.uniforms.uTime.value = time;
    const sway = Math.sin(time * beam.swaySpeed) * beam.swayAmplitude;
    const rot = beam.baseRotation.clone();
    if (beam.swayAxis === "x") rot.x += sway;
    if (beam.swayAxis === "y") rot.y += sway;
    if (beam.swayAxis === "z") rot.z += sway;
    beam.mesh.rotation.copy(rot);
    beam.material.uniforms.uColor.value = new THREE.Color().copy(
      beam.material.uniforms.uColor.value,
    );
    const opacity = Math.max(0, (1 - scrollProgress) * 0.25);
    (beam.material as THREE.ShaderMaterial).uniforms.uColor.value = new THREE.Color().copy(
      beam.material.uniforms.uColor.value,
    );
  }
}

export function disposeBeams(beams: Beam[]) {
  for (const beam of beams) {
    beam.mesh.geometry.dispose();
    beam.material.dispose();
    beam.mesh.removeFromParent();
  }
}
