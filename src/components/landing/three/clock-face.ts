import * as THREE from "three";

export interface Clock3D {
  group: THREE.Group;
  hands: { hour: THREE.Mesh; minute: THREE.Mesh; second: THREE.Mesh };
}

export function createClockFace(scene: THREE.Scene): Clock3D {
  const group = new THREE.Group();

  // —— Dial face — dark metallic concave disc ——
  const dialGeom = new THREE.CylinderGeometry(2.8, 2.8, 0.05, 80);
  const dialMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#080C14"),
    metalness: 0.9,
    roughness: 0.2,
  });
  const dial = new THREE.Mesh(dialGeom, dialMat);
  dial.rotation.x = Math.PI / 2;
  dial.position.z = 0.2;
  group.add(dial);

  // —— Tick marks ——
  const tickGroup = new THREE.Group();
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;
    const isMajor = i % 5 === 0;
    const isQuarter = i % 15 === 0;
    const len = isQuarter ? 0.35 : isMajor ? 0.22 : 0.08;
    const tw = isMajor ? 0.02 : 0.008;
    const r = 2.55;
    const geom = new THREE.BoxGeometry(tw, tw, len);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#3B82F6"),
      emissive: isMajor ? new THREE.Color("#3B82F6") : new THREE.Color("#1E40AF"),
      emissiveIntensity: isMajor ? 1.5 : 0.5,
      metalness: 0.1,
      roughness: 0.4,
    });
    const tick = new THREE.Mesh(geom, mat);
    tick.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.25);
    tick.rotation.z = angle;
    tickGroup.add(tick);
  }
  group.add(tickGroup);

  // —— Numerals (sprites) ——
  const numeralData: [string, number][] = [
    ["12", 0], ["3", Math.PI / 2], ["6", Math.PI], ["9", -Math.PI / 2],
  ];
  numeralData.forEach(([text, angle]) => {
    const c = document.createElement("canvas");
    c.width = 128; c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.font = "700 68px 'Clash Display', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 64, 64);

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, depthWrite: false, blending: THREE.NormalBlending, opacity: 0.75,
    }));
    const r = 2.1;
    sprite.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.32);
    sprite.scale.set(0.65, 0.65, 1);
    group.add(sprite);
  });

  // —— Hands ——
  const handGroup = new THREE.Group();

  const hourGeom = new THREE.BoxGeometry(0.07, 1.0, 0.04);
  hourGeom.translate(0, 0.5, 0);
  const hour = new THREE.Mesh(hourGeom, new THREE.MeshStandardMaterial({
    color: "#FFFFFF", emissive: "#93BBFD", emissiveIntensity: 0.8, metalness: 0.5, roughness: 0.25,
  }));

  const minGeom = new THREE.BoxGeometry(0.045, 1.6, 0.035);
  minGeom.translate(0, 0.8, 0);
  const minute = new THREE.Mesh(minGeom, new THREE.MeshStandardMaterial({
    color: "#FFFFFF", emissive: "#3B82F6", emissiveIntensity: 1.2, metalness: 0.5, roughness: 0.2,
  }));

  const secGeom = new THREE.BoxGeometry(0.014, 2.0, 0.02);
  secGeom.translate(0, 1.0, 0);
  const second = new THREE.Mesh(secGeom, new THREE.MeshStandardMaterial({
    color: "#FFFFFF", emissive: "#F59E0B", emissiveIntensity: 2.0, metalness: 0.5, roughness: 0.15,
  }));

  handGroup.add(hour); handGroup.add(minute); handGroup.add(second);

  // Center cap
  const capGeom = new THREE.CylinderGeometry(0.07, 0.09, 0.06, 24);
  capGeom.rotateX(Math.PI / 2);
  const cap = new THREE.Mesh(capGeom, new THREE.MeshStandardMaterial({
    color: "#FFFFFF", emissive: "#FFFFFF", emissiveIntensity: 1.0, metalness: 0.8, roughness: 0.1,
  }));
  handGroup.add(cap);

  handGroup.position.z = 0.28;
  group.add(handGroup);

  // —— Glass cover ——
  const glassGeom = new THREE.CylinderGeometry(3.0, 3.0, 0.03, 80);
  glassGeom.rotateX(Math.PI / 2);
  const glass = new THREE.Mesh(glassGeom, new THREE.MeshPhysicalMaterial({
    roughness: 0.02, metalness: 0, clearcoat: 0.5, ior: 1.5,
    transparent: true, opacity: 0.08, depthWrite: false,
  }));
  glass.position.z = 0.35;
  group.add(glass);

  // Position the clock group
  group.position.set(0, 0.3, 0);
  scene.add(group);

  return { group, hands: { hour, minute, second } };
}

export function updateClockFace(clock: Clock3D) {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds() + now.getMilliseconds() / 1000;

  clock.hands.hour.rotation.z = -((h + m / 60) / 12) * Math.PI * 2;
  clock.hands.minute.rotation.z = -((m + s / 60) / 60) * Math.PI * 2;
  clock.hands.second.rotation.z = -(s / 60) * Math.PI * 2;
}

export function disposeClockFace(clock: Clock3D) {
  clock.group.traverse((c) => {
    if (c instanceof THREE.Mesh) {
      c.geometry?.dispose();
      if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
      else c.material?.dispose();
    }
  });
  clock.group.removeFromParent();
}
