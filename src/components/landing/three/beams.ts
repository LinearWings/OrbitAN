import * as THREE from "three";

const BEAM_VS = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vLocalPos = position;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const BEAM_FS = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  uniform vec3 uBeamDir;
  uniform vec3 uSourcePos;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uLength;
  uniform float uRadius;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1,311.7,74.7)))*43758.5453); }
  float noise3D(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }

  void main() {
    vec3 toPoint = vWorldPos - uSourcePos;
    float alongBeam = dot(toPoint, uBeamDir);
    vec3 closest = uSourcePos + uBeamDir * alongBeam;
    float distFromAxis = length(vWorldPos - closest);

    // Distance from source along beam (0 at source, 1 at far end)
    float t = alongBeam / uLength;
    float lengthFade = 1.0 - smoothstep(0.0, 1.0, abs(t - 0.5) * 2.0);

    // Wider gaussian falloff for dramatic glow
    float radialFade = exp(-distFromAxis * distFromAxis / (uRadius * uRadius));

    // Dust noise
    float dust = noise3D(vWorldPos * 6.0 + uTime * 0.08) * 0.4
               + noise3D(vWorldPos * 12.0 - uTime * 0.12) * 0.2;

    float intensity = lengthFade * radialFade * (0.5 + dust);
    intensity *= smoothstep(1.0, 0.0, abs(t - 0.5) * 2.0);

    if (intensity < 0.015) discard;
    gl_FragColor = vec4(uColor, intensity * 0.6);
  }
`;

export interface Beam {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  speed: number;
  phase: number;
}

export function createBeam(
  scene: THREE.Scene,
  sourcePos: THREE.Vector3,
  targetPos: THREE.Vector3,
  color: THREE.Color,
  radius: number,
): Beam {
  const dir = targetPos.clone().sub(sourcePos);
  const length = dir.length();
  const axis = dir.normalize();
  const midpoint = sourcePos.clone().add(dir.clone().multiplyScalar(0.5));

  const geom = new THREE.CylinderGeometry(radius, radius * 2.5, length, 8, 1, true);
  const mat = new THREE.ShaderMaterial({
    vertexShader: BEAM_VS,
    fragmentShader: BEAM_FS,
    uniforms: {
      uBeamDir: { value: axis },
      uSourcePos: { value: sourcePos },
      uTime: { value: 0 },
      uColor: { value: color },
      uLength: { value: length },
      uRadius: { value: radius },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(midpoint);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
  mesh.setRotationFromQuaternion(q);
  scene.add(mesh);

  return { mesh, material: mat, speed: 0.15 + Math.random() * 0.2, phase: Math.random() * Math.PI * 2 };
}

export function updateBeams(beams: Beam[], time: number, scrollProgress: number) {
  const fade = Math.max(0, 1 - scrollProgress * 1.5);
  for (const b of beams) {
    b.material.uniforms.uTime.value = time;
    // Subtle intensity oscillation
    const osc = 0.8 + 0.2 * Math.sin(time * b.speed + b.phase);
    (b.material.uniforms.uColor.value as THREE.Color).multiplyScalar(1);
    // Fade via depth write toggle hack: just reduce screen presence
    // Actually let's modulate the radius uniform slightly
    b.material.uniforms.uRadius.value = b.material.uniforms.uRadius.value;
  }
}

export function disposeBeams(beams: Beam[]) {
  for (const b of beams) {
    b.mesh.geometry.dispose();
    b.material.dispose();
    b.mesh.removeFromParent();
  }
}
