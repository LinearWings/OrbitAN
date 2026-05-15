import * as THREE from "three";

const NEBULA_VS = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vLocalPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vLocalPos = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const NEBULA_FS = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vLocalPos;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uScale;

  float hash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }

  float fbm(vec3 p) {
    float v=0.0, a=0.5;
    for(int i=0;i<5;i++){v+=a*noise(p);p*=2.1;a*=0.45;}
    return v;
  }

  void main() {
    float dist = length(vLocalPos) * uScale;
    float edgeFade = 1.0 - smoothstep(0.3, 1.0, dist);

    float n = fbm(vWorldPos * 0.7 + uTime * 0.015) * 0.7
            + fbm(vWorldPos * 1.4 - uTime * 0.02) * 0.3;

    float density = n * edgeFade;
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0,0,1))), 3.5);
    density += fresnel * 0.2;

    if (density < 0.03) discard;

    vec3 c = mix(uColor, vec3(1.0), density * 0.25);
    gl_FragColor = vec4(c, density * uOpacity);
  }
`;

export interface NebulaCloud {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  basePos: THREE.Vector3;
  drift: { speed: number; amp: number; phase: number };
}

const CONFIGS = [
  { r: 2.2, color: [0.15, 0.30, 0.96], opacity: 0.12, pos: [2, 1.5, -4], drift: [0.012, 0.35] },
  { r: 2.8, color: [0.30, 0.18, 0.90], opacity: 0.09, pos: [-2.5, -0.8, -5], drift: [0.010, 0.45] },
  { r: 1.8, color: [0.12, 0.35, 0.85], opacity: 0.10, pos: [-0.5, -2.5, -4.5], drift: [0.014, 0.3] },
  { r: 3.5, color: [0.08, 0.40, 0.95], opacity: 0.05, pos: [0, 3, -7], drift: [0.008, 0.25] },
];

export function createNebulaClouds(scene: THREE.Scene): NebulaCloud[] {
  return CONFIGS.map((cfg) => {
    const g = new THREE.SphereGeometry(cfg.r, 48, 48);
    const m = new THREE.ShaderMaterial({
      vertexShader: NEBULA_VS,
      fragmentShader: NEBULA_FS,
      uniforms: {
        uColor: { value: new THREE.Color(cfg.color[0], cfg.color[1], cfg.color[2]) },
        uTime: { value: 0 },
        uOpacity: { value: cfg.opacity },
        uScale: { value: 1 / cfg.r },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    scene.add(mesh);
    return {
      mesh,
      material: m,
      basePos: new THREE.Vector3(cfg.pos[0], cfg.pos[1], cfg.pos[2]),
      drift: { speed: cfg.drift[0], amp: cfg.drift[1], phase: Math.random() * Math.PI * 2 },
    };
  });
}

export function updateNebulaClouds(clouds: NebulaCloud[], time: number, _scrollProgress: number) {
  for (const c of clouds) {
    c.material.uniforms.uTime.value = time;
    c.mesh.position.x = c.basePos.x + Math.sin(time * c.drift.speed + c.drift.phase) * c.drift.amp;
    c.mesh.position.y = c.basePos.y + Math.cos(time * c.drift.speed * 0.7 + c.drift.phase) * c.drift.amp * 0.6;
  }
}

export function disposeNebulaClouds(clouds: NebulaCloud[]) {
  for (const c of clouds) {
    c.mesh.geometry.dispose();
    c.material.dispose();
    c.mesh.removeFromParent();
  }
}
